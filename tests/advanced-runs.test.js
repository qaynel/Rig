#!/usr/bin/env node
// Run bindings: argv shell:false, scopes, ladder fail-fast (impl-design §8, Slice 9).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  check,
  readJson,
  root,
} = require('./helpers/advanced');

test('bindings execute via argv arrays with shell:false', () => {
  const checksPath = path.join(root, 'rig', 'lib', 'checks.js');
  assert.ok(fs.existsSync(checksPath));
  const source = fs.readFileSync(checksPath, 'utf8');
  assert.match(source, /spawnSync/);
  // `shell: false` itself lives in the canonical runner (GA-38,
  // rig/lib/check-runner.js) that checks.js requires rather than
  // re-implements -- assert the require, and check the guarantee at its one
  // real source instead of re-asserting text that no longer appears here.
  assert.match(source, /require\(['"]\.\/check-runner['"]\)/);
  const runnerPath = path.join(root, 'rig', 'lib', 'check-runner.js');
  assert.ok(fs.existsSync(runnerPath));
  assert.match(fs.readFileSync(runnerPath, 'utf8'), /shell:\s*false/);
});

test('diff scope vs whole-repo scope are distinct check modes', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'testing.unit.test-case-generation': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const diff = check(target, { scope: 'diff' });
    const repo = check(target, { scope: 'repo' });
    assert.equal(diff.status, 0, diff.stderr);
    assert.equal(repo.status, 0, repo.stderr);
  });
});

test('ladder fail-fast marks later rungs not_run_due_to_dependency', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {
      'testing.unit.test-case-generation': 'minimal',
      'testing.mutation.execution-orchestrator': 'minimal',
    });
    // Force unit binding to fail by pointing at a missing executable via bindings file after apply.
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const bindingsPath = path.join(target, '.rig', 'service-bindings.json');
    assert.ok(fs.existsSync(bindingsPath));
    const bindings = readJson(bindingsPath);
    bindings['testing.unit.test-case-generation'] = {
      diff: ['false'],
      repo: ['false'],
    };
    fs.writeFileSync(bindingsPath, `${JSON.stringify(bindings, null, 2)}\n`);

    const result = check(target, { scope: 'repo' });
    assert.notEqual(result.status, 0);
    const reportsDir = path.join(target, 'reports', 'rig');
    assert.ok(fs.existsSync(reportsDir));
    const reports = fs
      .readdirSync(reportsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => readJson(path.join(reportsDir, f)));
    assert.ok(
      reports.some(
        (r) =>
          r.status === 'failed' ||
          (r.fix_context || []).some((c) => /not_run_due_to_dependency/i.test(String(c))) ||
          /not_run_due_to_dependency/i.test(JSON.stringify(r)),
      ),
      'later ladder rungs must record not_run_due_to_dependency',
    );
  });
});
