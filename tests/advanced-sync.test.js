#!/usr/bin/env node
// Exact-copy sync floor (impl-design §7.3, AT-B1, Slice 7).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  writeJson,
  check,
} = require('./helpers/advanced');

test('byte-exact copy check fails when a registered duplicate drifts', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const canonical = path.join(target, '.rig', 'baseline', 'drift-rule.md');
    const copyRel = 'docs/drift-rule.copy.md';
    fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
    fs.copyFileSync(canonical, path.join(target, copyRel));
    writeJson(path.join(target, '.rig', 'sync-map.json'), {
      groups: [
        {
          id: 'drift-rule',
          canonical: '.rig/baseline/drift-rule.md',
          copies: [copyRel],
        },
      ],
    });

    const ok = spawnSync('node', [path.join(target, '.rig', 'bin', 'check-copies.js')], {
      cwd: target,
      encoding: 'utf8',
      shell: false,
    });
    assert.equal(ok.status, 0, `identical copies must pass: ${ok.stderr}`);

    fs.appendFileSync(path.join(target, copyRel), '\n# drift\n');
    const drifted = spawnSync('node', [path.join(target, '.rig', 'bin', 'check-copies.js')], {
      cwd: target,
      encoding: 'utf8',
      shell: false,
    });
    assert.notEqual(drifted.status, 0, 'drifted duplicate must fail');

    const ci = check(target, { scope: 'repo' });
    assert.notEqual(ci.status, 0, 'CI whole-repo check must also fail on drift');
  });
});
