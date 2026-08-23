#!/usr/bin/env node
// No-clobber instruction graft (impl-design §6, AT-SHAPE-1, Slice 6).
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

test('graft appends pointer to existing AGENTS.md; never replaces', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.onboarding-docs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const after = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    assert.ok(after.includes(before.trim()), 'original AGENTS.md content must survive');
    assert.ok(
      after.includes('.rig/catalog-routing.md') ||
        fs.existsSync(path.join(target, '.rig', 'catalog-routing.md')),
      'must graft catalog-routing pointer',
    );
    assert.notEqual(after, before, 'pointer append should change the file');
  });
});

test('second apply does not duplicate the graft pointer', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const body = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    const matches = body.match(/\.rig\/catalog-routing\.md/g) || [];
    assert.ok(matches.length <= 1, 'pointer must be appended at most once');
  });
});
