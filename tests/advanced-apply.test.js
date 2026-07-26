#!/usr/bin/env node
// Transactional apply: lock, CAS, rollback, idempotence (impl-design §5.6, Slice 6).
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
  readJson,
} = require('./helpers/advanced');

test('apply is compare-and-swap on preimages and writes receipt last', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const result = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')));
  });
});

test('apply refuses stale preimages (CAS)', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    fs.writeFileSync(path.join(target, 'AGENTS.md'), '# changed after plan\n');
    const result = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.notEqual(result.status, 0, 'stale preimage must fail closed');
    assert.equal(
      fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')),
      false,
      'failed apply must not write a new receipt',
    );
  });
});

test('apply is idempotent when re-run with identical inputs', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const receipt1 = fs.readFileSync(
      path.join(target, '.rig', 'catalog-receipt.json'),
      'utf8',
    );
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const receipt2 = fs.readFileSync(
      path.join(target, '.rig', 'catalog-receipt.json'),
      'utf8',
    );
    assert.equal(receipt1, receipt2);
  });
});

test('exclusive lock is acquired; stale lock is not auto-broken', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const lockPath = path.join(target, '.rig', 'catalog-install.lock');
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    fs.writeFileSync(lockPath, JSON.stringify({ pid: 1, started_at: '1970-01-01T00:00:00Z' }));
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const result = apply(target, { review: reviewPath, plan: planned.outPath });
    assert.notEqual(result.status, 0, 'must not auto-break install lock');
    assert.match(result.stderr + result.stdout, /lock/i);
  });
});
