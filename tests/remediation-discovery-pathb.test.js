'use strict';
require('./helpers/hermetic-git-env');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const h = require('./helpers/path-b');
const SERVICE = 'development.code-quality.lint-format';
function put(target, rel, bytes) { fs.mkdirSync(path.dirname(path.join(target, rel)), { recursive: true }); fs.writeFileSync(path.join(target, rel), bytes); }
function git(target, ...args) { const r = spawnSync('git', ['-C', target, ...args], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout; }
function fixture(target, grade = 'minimal') {
  put(target, 'packages/alien/project.odd', 'alien task declarations: polish and inspect\n');
  put(target, 'packages/alien/checker.js', "const fs=require('node:fs'); for (const file of process.argv.slice(2)) { console.log(file); const text=fs.readFileSync(file,'utf8'); if(text.includes('BAD')) process.exitCode=1; if(text.includes('NONDETERMINISTIC')) console.log(require('node:crypto').randomUUID()); }\n");
  put(target, 'packages/alien/changed file.odd', 'good\n');
  put(target, 'packages/alien/clean.odd', 'BAD\n');
  put(target, 'packages/alien/ignored.odd', 'BAD\n');
  put(target, 'packages/alien/.gitignore', 'ignored.odd\n');
  put(target, 'excluded/unknown.xyz', 'BAD\n');
  const command = { argv: [process.execPath, 'checker.js', '{files}'], source: 'packages/alien/project.odd', network: 'none' };
  h.writeJson(path.join(target, 'rig-lint-format.json'), { schema_version: 1, scope: 'diff', components: [{ id: 'alien', root: 'packages/alien', ecosystem: 'owner-defined', evidence_paths: ['packages/alien/project.odd'], include: ['*.odd'], format_check: command, lint: command }], excluded: [{ root: 'excluded', reason: 'User excluded this component' }] });
  git(target, 'add', '.'); git(target, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture');
  put(target, 'packages/alien/changed file.odd', 'good changed\n');
  return { selected_services: { [SERVICE]: grade }, selected_skills: [], capabilities: [], grafts: [] };
}

function authorize(target, binding, options = {}) {
  const { installedGradeInputs } = require('../rig/lib/lint-grade');
  const inputs = installedGradeInputs({ target, binding, ...options });
  assert.equal(inputs.gap, undefined, JSON.stringify(inputs.gap));
  const { approved } = require('./helpers/task-approval');
  const signed = approved(target, inputs.commands, inputs.grade === 'maximal' ? 2 : 1);
  fs.rmSync(path.join(target, '.rig-test'), { recursive: true, force: true });
  h.writeJson(path.join(target, '.rig/lint-format/execution-plan.json'), signed.plan);
  h.writeJson(path.join(target, '.rig/lint-format/execution-approval.json'), signed.approval);
  return inputs;
}

test('agent inventory exposes arbitrary nested evidence and selection binds exact changed files and cwd', async () => {
  await h.withRepo(target => {
    fixture(target);
    const { inventoryRepository, bindAgentSelection } = require('../rig/lib/lint-discovery');
    const inventory = inventoryRepository(target);
    assert.ok(inventory.files.some(file => file.path === 'excluded/unknown.xyz'));
    assert.ok(inventory.directories.includes('packages/alien'));
    const binding = bindAgentSelection(target, 'minimal', h.readJson(path.join(target, 'rig-lint-format.json')));
    const inputs = require('../rig/lib/lint-grade').installedGradeInputs({ target, binding });
    assert.equal(inputs.commands.length, 1);
    assert.deepEqual(inputs.commands[0].argv, [process.execPath, 'checker.js', 'changed file.odd']);
    assert.equal(inputs.commands[0].cwd, 'packages/alien');
    assert.deepEqual(inputs.changed, ['packages/alien/changed file.odd']);
    assert.ok(binding.unprotected.includes('excluded'));
    assert.ok(binding.uncovered_files.includes('excluded/unknown.xyz'));
    assert.equal(binding.coverage.whole_repository, false);
  });
});

test('Path B approved lint service runs real Policy and keeps lower grade when Context is missing', async () => {
  await h.withRepo(target => {
    const overrides = fixture(target, 'mid');
    const { proposed } = h.prepareAndPropose(target, { proposal: overrides });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const binding = state.proposal.service_bindings[SERVICE];
    assert.equal(binding.engine, 'component-lint-format-v1');
    const { signApproval } = require('./helpers/path-b-approval');
    const approval = signApproval(target, proposed.proposal_digest);
    const applied = h.handle({ schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval });
    assert.equal(applied.phase, 'applied');
    const installed = h.readJson(path.join(target, '.rig/service-bindings.json'))[SERVICE];
    const runner = require('../rig/lib/check-runner');
    const denied = runner.runBinding(SERVICE, installed, 'repo', target);
    assert.equal(denied.kind, 'not_authorized');
    authorize(target, installed);
    const missing = runner.runBinding(SERVICE, installed, 'repo', target);
    assert.equal(missing.status, 1);
    assert.deepEqual(missing.completed_grades, ['Policy'], JSON.stringify(missing));
    assert.match(missing.reason, /Context/);
    put(target, 'packages/alien/changed file.odd', 'BAD\n');
    authorize(target, installed);
    const bad = runner.runBinding(SERVICE, installed, 'repo', target);
    assert.equal(bad.status, 1);
    assert.match(bad.reason, /Policy command failed/);
  }, { install: true });
});

test('installed Path B Context and Evidence remain cumulative and receipts bind real replay', async () => {
  await h.withRepo(target => {
    const overrides = fixture(target, 'maximal');
    const { proposed } = h.prepareAndPropose(target, { proposal: overrides });
    const { signApproval } = require('./helpers/path-b-approval');
    const approval = signApproval(target, proposed.proposal_digest);
    h.handle({ schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval });
    const binding = h.readJson(path.join(target, '.rig/service-bindings.json'))[SERVICE];
    const runner = require(path.join(target, '.rig/runtime/rig/lib/check-runner'));
    const grades = require('../rig/lib/lint-grade');
    const review = verdict => {
      const inputs = grades.installedGradeInputs({ target, binding });
      const request = grades.createGradeReviewRequest(inputs);
      const context = { ...request, verdict, summary: 'The component rule requires source files to exclude BAD; reviewed the selected source against that meaning.', findings: verdict === 'pass' ? [] : [{ file: inputs.changed[0], rule: 'packages/alien/project.odd', meaning: 'The selected source violates the declared policy.' }] };
      h.writeJson(path.join(target, '.rig/lint-format/context-review.json'), context);
      return context;
    };
    review('fail'); authorize(target, binding);
    const semantic = runner.runBinding(SERVICE, binding, 'repo', target);
    assert.equal(semantic.status, 1);
    assert.deepEqual(semantic.completed_grades, ['Policy', 'Context'], JSON.stringify(semantic));
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/lint-format-evidence.json')), false);
    put(target, 'packages/alien/changed file.odd', 'NONDETERMINISTIC\n');
    review('pass'); authorize(target, binding);
    const mismatch = runner.runBinding(SERVICE, binding, 'repo', target);
    assert.equal(mismatch.status, 1);
    assert.deepEqual(mismatch.completed_grades, ['Policy', 'Context'], JSON.stringify(mismatch));
    assert.match(mismatch.reason, /replay/);
    put(target, 'packages/alien/changed file.odd', 'good corrected\n');
    const context = review('pass'); authorize(target, binding);
    const valid = runner.runBinding(SERVICE, binding, 'repo', target);
    assert.equal(valid.status, 0, JSON.stringify(valid));
    assert.deepEqual(valid.completed_grades, ['Policy', 'Context', 'Evidence']);
    const receipt = h.readJson(path.join(target, valid.evidence.receipt_path));
    assert.equal(receipt.input_digest, valid.evidence.input_digest);
    assert.equal(receipt.context_digest, h.sha256(JSON.stringify(context)));
    assert.equal(receipt.output_digest, valid.evidence.output_digest);
    assert.equal(h.sha256(fs.readFileSync(path.join(target, valid.evidence.receipt_path))), valid.evidence.receipt_digest);
    assert.equal(receipt.commands.length, 2);
    assert.deepEqual(receipt.commands[0].argv.slice(-1), ['changed file.odd']);
  }, { install: true });
});

test('agent task ambiguity and unsupported diff bindings stay visible rather than widening scope', async () => {
  await h.withRepo(target => {
    fixture(target);
    const { bindAgentSelection } = require('../rig/lib/lint-discovery');
    const selection = h.readJson(path.join(target, 'rig-lint-format.json'));
    const role = selection.components[0].format_check;
    selection.components[0].format_check = { status: 'needs_user_choice', options: [role, { ...role, argv: ['other-check'] }] };
    assert.throws(() => bindAgentSelection(target, 'minimal', selection), /user choice/);
    selection.components[0].format_check = { ...role, argv: [process.execPath, 'checker.js', '.'] };
    const binding = bindAgentSelection(target, 'minimal', selection);
    const inputs = require('../rig/lib/lint-grade').installedGradeInputs({ target, binding });
    assert.equal(inputs.gap.status, 'coverage_gap');
    assert.match(inputs.gap.reason, /changed-file scope/);
  });
});

test('installed Path B Policy cannot pass a missing executable or bad source, and preserves exact selection after reinstall', async () => {
  await h.withRepo(target => {
    const overrides = fixture(target);
    const { proposed } = h.prepareAndPropose(target, { proposal: overrides });
    const { signApproval } = require('./helpers/path-b-approval');
    const approval = signApproval(target, proposed.proposal_digest);
    h.handle({ schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval });
    const binding = h.readJson(path.join(target, '.rig/service-bindings.json'))[SERVICE];
    let runner = require(path.join(target, '.rig/runtime/rig/lib/check-runner'));
    authorize(target, binding);
    assert.equal(runner.runBinding(SERVICE, binding, 'repo', target).status, 0);
    put(target, 'packages/alien/changed file.odd', 'BAD\n');
    authorize(target, binding);
    assert.equal(runner.runBinding(SERVICE, binding, 'repo', target).status, 1);
    put(target, 'packages/alien/changed file.odd', 'good again\n');
    h.installRuntime(target);
    assert.deepEqual(h.readJson(path.join(target, '.rig/service-bindings.json'))[SERVICE], binding);
    const previousCI = process.env.CI;
    try {
      process.env.CI = 'true';
      authorize(target, binding, { scope: 'repo', policyOnly: true });
      const ci = runner.runBinding(SERVICE, binding, 'repo', target);
      assert.equal(ci.status, 1);
      assert.deepEqual(ci.commands[0].argv.slice(2), ['changed file.odd', 'clean.odd', 'project.odd']);
      put(target, 'packages/alien/clean.odd', 'good whole scope\n');
      authorize(target, binding, { scope: 'repo', policyOnly: true });
      assert.equal(runner.runBinding(SERVICE, binding, 'repo', target).status, 0);
    } finally { if (previousCI === undefined) delete process.env.CI; else process.env.CI = previousCI; }
    const missing = JSON.parse(JSON.stringify(binding));
    missing.components[0].format_check.argv[0] = 'rig-nonexistent-formatter-tool';
    authorize(target, missing);
    const result = runner.runBinding(SERVICE, missing, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'missing_tool');
    assert.equal(result.commands[0].result.status, 'missing_tool');
  }, { install: true });
});
