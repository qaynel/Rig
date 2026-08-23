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
const { runChecks } = require('../rig/lib/checks');

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

test('runChecks reports sync-group drift as a failure instead of crashing', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    fs.writeFileSync(path.join(target, 'a.md'), 'one\n');
    fs.writeFileSync(path.join(target, 'b.md'), 'two\n');
    writeJson(path.join(target, '.rig', 'sync-map.json'), { groups: [['a.md', 'b.md']] });

    const result = runChecks(target);
    assert.equal(result.status, 1, 'drift must be reported, not thrown');
    assert.match(result.stderr, /drift detected/);

    const reportsDir = path.join(target, 'reports', 'rig');
    assert.ok(fs.existsSync(reportsDir), 'a failure report must be written, like every other check failure');
    const [reportFile] = fs.readdirSync(reportsDir);
    const report = JSON.parse(fs.readFileSync(path.join(reportsDir, reportFile), 'utf8'));
    assert.equal(report.service_id, 'baseline.exact-copy');
    assert.equal(report.status, 'failed');
  });
});

test('copy check refuses a sync-map entry that is a symlink out of the repository', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const outside = path.join(path.dirname(target), 'outside-secret.md');
    fs.writeFileSync(outside, 'secret\n');
    fs.writeFileSync(path.join(target, 'inside.md'), 'secret\n');
    fs.symlinkSync(outside, path.join(target, 'linked.md'));
    writeJson(path.join(target, '.rig', 'sync-map.json'), { groups: [['inside.md', 'linked.md']] });

    const result = runChecks(target);
    assert.equal(result.status, 1, 'an escaping symlink must fail the check, not be followed');
    assert.match(result.stderr, /outside symlink|escapes|escaping/i);
  });
});

test('byte-exact copy check reports missing copies and keeps checking groups', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
    fs.writeFileSync(path.join(target, 'docs', 'canonical.md'), 'same\n');
    fs.writeFileSync(path.join(target, 'docs', 'copy.md'), 'different\n');
    writeJson(path.join(target, '.rig', 'sync-map.json'), {
      groups: [
        {
          id: 'missing',
          canonical: '.rig/baseline/drift-rule.md',
          copies: ['docs/missing.md'],
        },
        {
          id: 'drift',
          canonical: 'docs/canonical.md',
          copies: ['docs/copy.md'],
        },
      ],
    });

    const result = spawnSync('node', [path.join(target, '.rig', 'bin', 'check-copies.js')], {
      cwd: target,
      encoding: 'utf8',
      shell: false,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing copy: docs\/missing\.md/);
    assert.match(result.stderr, /byte drift: docs\/copy\.md != docs\/canonical\.md/);
    assert.doesNotMatch(result.stderr, /ENOENT/);
  });
});
