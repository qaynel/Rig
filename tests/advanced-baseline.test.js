#!/usr/bin/env node
// Mandatory baseline on empty selection (impl-design §7, AT-BASE-2, Slice 7).
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
} = require('./helpers/advanced');

test('empty service selection installs complete mandatory baseline', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const required = [
      '.rig/baseline/drift-rule.md',
      '.rig/baseline/sanitation-review.json',
      '.rig/context-index.json',
      '.rig/sync-map.json',
      '.rig/bin/check.js',
      '.rig/bin/check-copies.js',
      '.rig/bin/secret-guard.sh',
      '.rig/catalog-receipt.json',
      '.rig/catalog-routing.md',
    ];
    for (const rel of required) {
      assert.ok(fs.existsSync(path.join(target, rel)), `missing baseline path ${rel}`);
    }
  });
});
