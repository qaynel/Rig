'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/path-b');
const { loadCatalog, effectiveChecks } = require('../rig/lib/catalog');
const { resolve } = require('../rig/lib/resolve');
const { definition, detectService } = require('../rig/lib/service-catalogue');
const catalog = loadCatalog();
const LINT = 'development.code-quality.lint-format';

// Node's --test-shard assigns whole files. This suite is one file, so a
// shard flag would let four of five jobs exit 0 without running a test.
// CATALOGUE_SHARD=1/5 slices the service list; unset runs every service.
function inShard(index, spec = process.env.CATALOGUE_SHARD) {
  if (!spec) return true;
  const match = /^([1-9]\d*)\/([1-9]\d*)$/.exec(spec);
  if (!match) throw new Error(`CATALOGUE_SHARD must look like 1/5, got ${JSON.stringify(spec)}`);
  const part = Number(match[1]);
  const parts = Number(match[2]);
  if (part > parts) throw new Error(`CATALOGUE_SHARD ${spec} is out of range`);
  return index % parts === part - 1;
}

test('catalogue shards partition the service list', () => {
  const n = catalog.services.length;
  for (const count of [1, 4, 5, 7]) {
    const seen = Array(n).fill(0);
    for (let part = 1; part <= count; part += 1) {
      for (let i = 0; i < n; i += 1) if (inShard(i, `${part}/${count}`)) seen[i] += 1;
    }
    assert.deepEqual(seen, Array(n).fill(1));
  }
  // An explicit empty spec means "every service". Passing undefined would
  // reuse the process default and fail inside a shard job.
  assert.equal(inShard(0, ''), true);
  assert.throws(() => inShard(0, '0/5'), /1\/5/);
  assert.throws(() => inShard(0, '6/5'), /out of range/);
});

function lintFixture(target, variant) {
  fs.writeFileSync(path.join(target, 'lint-rules.json'), '{"forbidden":"BAD"}\n');
  fs.writeFileSync(path.join(target, 'source.txt'), variant === 'good' ? 'clean source\n' : 'BAD source\n');
  fs.writeFileSync(path.join(target, 'lint-checker.js'), 'const fs=require("node:fs"); const rules=JSON.parse(fs.readFileSync("lint-rules.json","utf8")); for(const file of process.argv.slice(2)) if(fs.readFileSync(file,"utf8").includes(rules.forbidden)) { console.error("forbidden source content"); process.exitCode=1; }\n');
  const command = { argv: [process.execPath, 'lint-checker.js', '{files}'], source: 'lint-rules.json', network: 'none' };
  h.writeJson(path.join(target, 'rig-lint-format.json'), { schema_version: 1, scope: 'repo', excluded: [], components: [{ root: '.', include: ['source.txt'], evidence_paths: ['lint-rules.json'], format_check: command, lint: command }] });
  const git = require('node:child_process').spawnSync('git', ['add', '.'], { cwd: target, encoding: 'utf8' });
  assert.equal(git.status, 0, git.stderr);
  const committed = require('node:child_process').spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'source fixture'], { cwd: target, encoding: 'utf8' });
  assert.equal(committed.status, 0, committed.stderr);
}

function applyLintAndCheck(target, selection) {
  const { prepared, proposed } = h.prepareAndPropose(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: selection } });
  const approval = require('./helpers/path-b-approval').signApproval(target, proposed.proposal_digest);
  const applied = h.handle({ schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval });
  assert.equal(applied.phase, 'applied', JSON.stringify(applied));
  const binding = h.readJson(path.join(target, '.rig/service-bindings.json'))[LINT];
  const grades = require('../rig/lib/lint-grade');
  const inputs = grades.installedGradeInputs({ target, binding });
  assert.equal(inputs.gap, undefined, JSON.stringify(inputs.gap));
  assert.ok(inputs.commands.length > 0);
  const bad = fs.readFileSync(path.join(target, 'source.txt'), 'utf8').includes('BAD');
  if (binding.grade !== 'minimal') h.writeJson(path.join(target, '.rig/lint-format/context-review.json'), {
    ...grades.createGradeReviewRequest(inputs), verdict: bad ? 'fail' : 'pass', summary: 'Reviewed the selected source against the rule prohibiting BAD.',
    findings: bad ? [{ file: 'source.txt', rule: 'lint-rules.json', meaning: 'The selected source contains the forbidden BAD content.' }] : [],
  });
  const signed = require('./helpers/task-approval').approved(target, inputs.commands, inputs.grade === 'maximal' ? 2 : 1);
  h.writeJson(path.join(target, '.rig/lint-format/execution-plan.json'), signed.plan);
  h.writeJson(path.join(target, '.rig/lint-format/execution-approval.json'), signed.approval);
  const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
  return { prepared, proposed, applied, checked };
}

catalog.services.forEach((service, index) => {
  if (!inShard(index)) return;
  test(`installed ${service.id} discriminates configuration across every grade`, async () => {
    for (const grade of ['minimal', 'mid', 'maximal']) for (const variant of ['good', 'bad']) {
      await h.withRepo(target => {
        const selection = { [service.id]: grade };
        for (const dep of resolve(catalog, selection)) {
          const fixture = path.join(h.root, 'tests/fixtures/services', dep.id, dep.id === service.id ? variant : 'good');
          fs.cpSync(fixture, target, { recursive: true });
        }
        if (service.id === LINT) lintFixture(target, variant);
        const found = detectService(target, service);
        assert.equal(found.present, true);
        assert.ok(found.evidence_paths.length > 0);
        const result = service.id === LINT ? applyLintAndCheck(target, selection) : h.applyAndCheck(target, { proposal: {
          selected_skills: [], capabilities: [], grafts: [], selected_services: selection,
        }});
        assert.equal(result.checked.phase, variant === 'good' ? 'checked' : 'failed', `${service.id} ${grade} ${variant}`);
        const state = h.readJson(path.join(target, '.rig/state.json'));
        const binding = state.proposal.service_bindings[service.id];
        assert.equal(state.proposal.selected_services[service.id], grade);
        assert.equal(binding.grade, grade);
        assert.deepEqual(Object.keys(binding.checks), effectiveChecks(service, grade));
        assert.ok(state.checks.service_checks.executed_count > 0);
        const own = state.checks.service_checks.results.find(row => row.service_id === service.id);
        assert.ok(own.executed_checks.length > 0);
        if (variant === 'good') assert.deepEqual(own.executed_checks, effectiveChecks(service, grade));
        if (service.id === LINT) {
          assert.equal(binding.engine, 'component-lint-format-v1');
          if (variant === 'good') {
            assert.deepEqual(own.completed_grades, { minimal: ['Policy'], mid: ['Policy', 'Context'], maximal: ['Policy', 'Context', 'Evidence'] }[grade]);
            if (grade === 'maximal') {
              const receipt = h.readJson(path.join(target, own.evidence.receipt_path));
              assert.equal(receipt.kind, 'lint-format-evidence');
              assert.equal(receipt.commands.length, 2);
              assert.equal(receipt.input_digest, own.evidence.input_digest);
            }
          } else assert.equal(own.commands.length, 1, 'the failing formatter stops before the linter or replay');
        }
        for (const dep of resolve(catalog, selection).filter(row => row.reason === 'dependency')) {
          const resolvedBinding = state.proposal.service_bindings[dep.id];
          assert.equal(resolvedBinding.grade, null);
          assert.deepEqual(resolvedBinding.slices, dep.slices);
          const depDefinition = definition(catalog.services.find(row => row.id === dep.id)).value;
          assert.deepEqual(Object.keys(resolvedBinding.checks), dep.slices.map(slice => depDefinition.slices[slice].check_id));
        }
      }, { install: true });
    }
  });
});
