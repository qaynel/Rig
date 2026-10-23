'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const h = require('./helpers/path-b');

function setSoftBudget(target, files, bytes) {
  const catalogPath = path.join(target, '.rig/catalog.json');
  const catalog = h.readJson(catalogPath);
  catalog.soft_budget = { basis: 'previous-release', files, bytes };
  h.writeJson(catalogPath, catalog);
  const digest = h.sha256(fs.readFileSync(catalogPath));
  const manifestPath = path.join(target, '.rig/install-manifest.jsonl');
  const records = fs.readFileSync(manifestPath, 'utf8').trim().split('\n').map(JSON.parse);
  const seq = Math.max(...records.map(({ seq = 0 }) => seq)) + 1;
  fs.appendFileSync(manifestPath, `${JSON.stringify({
    seq,
    path: '.rig/catalog.json',
    ownership: 'create_owned',
    operation: 'create_owned',
    transaction_kind: 'install',
    state: 'applied',
    digest,
    desired_digest: digest,
  })}\n`);
}

function codes(response) {
  return new Set(response.hard_failures.map(({ code }) => code));
}

function recheck(target) {
  const state = h.readJson(path.join(target, '.rig/state.json'));
  return h.handle({ schema_version: 1, action: 'check', target, expected_revision: state.revision });
}

test('AT-PB-10 file and byte growth warn but never block a checked result', async () => {
  await h.withRepo((target) => {
    setSoftBudget(target, 1, 1);
    const { checked } = h.applyAndCheck(target);
    assert.equal(checked.phase, 'checked');
    assert.deepEqual(checked.hard_failures, []);
    assert.deepEqual(checked.warnings.map(({ code }) => code).sort(), ['payload-byte-growth', 'payload-file-growth']);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.checks.status, 'pass');
    assert.ok(state.checks.weight.files > 1);
    assert.ok(state.checks.weight.bytes > 1);

    const request = path.join(target, 'check-request.json');
    h.writeJson(request, { schema_version: 1, action: 'check', target, expected_revision: state.revision });
    const cli = spawnSync(path.join(target, '.rig/bin/rig'), ['onboarding', '--input', request], { encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr || cli.stdout);
    assert.deepEqual(JSON.parse(cli.stdout).hard_failures, []);
  }, { install: true });
});

const CORRUPTIONS = {
  'duplicate-destination'(target) {
    const statePath = path.join(target, '.rig/state.json');
    const state = h.readJson(statePath);
    state.applied.skills.push({ ...state.applied.skills[0], skill: 'qa-only' });
    h.writeJson(statePath, state);
  },
  'duplicate-skill-projection'(target) {
    const statePath = path.join(target, '.rig/state.json');
    const state = h.readJson(statePath);
    state.applied.skills.push({ ...state.applied.skills[0], path: '.agents/skills/rig-qa-copy/SKILL.md' });
    h.writeJson(statePath, state);
  },
  'duplicate-graft'(target) {
    const file = path.join(target, 'AGENTS.md');
    const body = fs.readFileSync(file, 'utf8');
    const section = body.match(/<!-- rig:graft capability="testing\.web-quality-assurance" version="1" begin -->[\s\S]*?<!-- rig:graft capability="testing\.web-quality-assurance" end -->\r?\n?/)[0];
    fs.appendFileSync(file, section);
  },
  'malformed-graft'(target) {
    const file = path.join(target, 'AGENTS.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(
      '<!-- rig:graft capability="testing.web-quality-assurance" end -->',
      '<!-- rig:graft capability="testing.other" end -->',
    ));
  },
  'dangling-reference'(target) {
    fs.rmSync(path.join(target, '.rig/routing.md'));
  },
  'skill-name-mismatch'(target) {
    const file = path.join(target, '.agents/skills/rig-qa/SKILL.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/^name: rig-qa$/m, 'name: wrong-name'));
  },
  'self-prefix-regression'(target) {
    const dir = path.join(target, '.agents/skills/rig-rig');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: rig-rig\n---\n# Wrong self prefix\n');
  },
  'state-incomplete'(target) {
    fs.rmSync(path.join(target, '.rig/onboarding-summary.md'));
  },
  'unapproved-write'(target) {
    const dir = path.join(target, '.agents/skills/rig-qa-only');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: rig-qa-only\n---\n# Unapproved projection\n');
  },
};

for (const [expectedCode, corrupt] of Object.entries(CORRUPTIONS)) {
  test(`AT-PB-10 ${expectedCode} is a hard failure`, async () => {
    await h.withRepo((target) => {
      h.applyAndCheck(target);
      corrupt(target);
      const result = recheck(target);
      assert.equal(result.phase, 'failed');
      assert.equal(result.next_action, 'repair-and-resume');
      assert.ok(codes(result).has(expectedCode), `${expectedCode} missing from ${JSON.stringify(result.hard_failures)}`);
      const request = path.join(target, 'check-request.json');
      const revision = h.readJson(path.join(target, '.rig/state.json')).revision;
      h.writeJson(request, { schema_version: 1, action: 'check', target, expected_revision: revision });
      const cli = spawnSync(path.join(target, '.rig/bin/rig'), ['onboarding', '--input', request], { encoding: 'utf8' });
      assert.notEqual(cli.status, 0, `${expectedCode} produced a successful CLI exit`);
    }, { install: true });
  });
}

test('AT-PB-10 legitimate runtime staging and distinct host projections are reported, not duplicates', async () => {
  await h.withRepo((target) => {
    const { checked } = h.applyAndCheck(target);
    assert.deepEqual(checked.hard_failures, []);
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/skills')), true);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-qa/SKILL.md')), true);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.applied.skills.filter(({ skill }) => skill === 'qa').length, 1);
  }, { install: true, hosts: ['codex', 'claude'] });
});
