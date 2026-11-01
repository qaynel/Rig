'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { runPayload } = require('../rig/lib/payload');
const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');

test('active install carries optional source and shared helpers in the download', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-bundled-shelf-'));
  try {
    runPayload(target, ['codex'], { activeDelivery: true });
    assert.ok(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/skills/testing/web-quality-assurance/qa/SKILL.md')));
    assert.ok(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/plumbing/bin/rig-diff-scope')));
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('approved installed guidance executes its bundled helper and detects mode drift', async () => {
  await h.withRepo((target) => {
    const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
    const state = h.readJson(path.join(target, '.rig/state.json'));
    const proposed = h.handle({
      schema_version: 1, action: 'propose', target, expected_revision: prepared.revision,
      proposal: h.proposal(target, state, { capabilities: [], selected_skills: ['review'], grafts: [], owned_files: [], critical_decisions: [] }),
      summary_markdown: h.summary(),
    });
    const applied = h.handle({ schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval: signApproval(target, proposed.proposal_digest) });
    assert.equal(applied.phase, 'applied');
    const guidance = path.join(target, '.agents/skills/rig-review/SKILL.md');
    const match = fs.readFileSync(guidance, 'utf8').match(/source <\((\.rig\/plumbing\/bin\/rig-diff-scope) <base> 2>\/dev\/null\) \|\| true/);
    assert.ok(match, 'installed guidance invokes the shipped helper');
    const helper = path.join(target, match[1]);
    assert.equal(fs.existsSync(helper), true);
    const git = require('node:child_process').spawnSync;
    for (const args of [['branch', '-M', 'main'], ['add', 'README.md'], ['-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-m', 'base']]) {
      assert.equal(git('git', args, { cwd: target, encoding: 'utf8' }).status, 0);
    }
    assert.equal(git('git', ['switch', '-c', 'work'], { cwd: target, encoding: 'utf8' }).status, 0);
    fs.appendFileSync(path.join(target, 'README.md'), '\nchanged after base\n');
    assert.equal(git('git', ['-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-am', 'change'], { cwd: target, encoding: 'utf8' }).status, 0);
    const run = git('bash', ['-c', `${match[1]} main`], { cwd: target, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /^SCOPE_FRONTEND=false/m);
    fs.chmodSync(helper, 0o644);
    const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
    assert.ok(checked.hard_failures.some((failure) => failure.path === '.rig/plumbing/bin/rig-diff-scope' && /changed mode/.test(failure.detail)));
  }, { install: true });
});
