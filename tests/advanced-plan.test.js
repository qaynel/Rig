#!/usr/bin/env node
// Typed plan operations + collision inventory (impl-design §5.5, Slice 6).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  readJson,
} = require('./helpers/advanced');

const ALLOWED_OPS = new Set([
  'create_owned',
  'replace_owned',
  'ensure_line',
  'structured_merge',
  'hook',
]);

test('plan emits typed ops only (no arbitrary shell)', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const result = plan(target, { review: reviewPath });
    assert.equal(result.status, 0, result.stderr);
    const body = readJson(result.outPath);
    const ops = body.operations || body.ops || [];
    assert.ok(ops.length > 0, 'plan must emit operations');
    for (const op of ops) {
      assert.ok(ALLOWED_OPS.has(op.op || op.type), `disallowed op ${op.op || op.type}`);
      assert.ok(!(op.shell || op.command), 'plan must not include shell commands');
    }
    assert.ok(body.digest || body.plan_digest, 'plan must include content digest');
  });
});

test('plan inventories collisions and before hashes without writing target', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const before = require('fs').readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const result = plan(target, { review: reviewPath });
    assert.equal(result.status, 0, result.stderr);
    const body = readJson(result.outPath);
    assert.ok(
      body.collisions || body.preimages || body.before_hashes,
      'plan must inventory collisions/preimages',
    );
    assert.equal(
      require('fs').readFileSync(path.join(target, 'AGENTS.md'), 'utf8'),
      before,
      'plan must be read-only w.r.t. target',
    );
  });
});
