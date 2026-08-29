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
const { uninstall } = require('../rig/lib/lifecycle');

const pointer = 'Before acting, read `.rig/catalog-routing.md` and route selected Rig catalogue services through it.';

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
    assert.match(after, /<!-- rig:catalog-routing:start -->[\s\S]*<!-- rig:catalog-routing:end -->/);
    assert.notEqual(after, before, 'pointer append should change the file');
  });
});

test('second apply does not duplicate the graft pointer', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    fs.appendFileSync(
      path.join(target, 'AGENTS.md'),
      `${pointer}\n`,
    );
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const body = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    const matches = body.match(/\.rig\/catalog-routing\.md/g) || [];
    assert.equal(matches.length, 1, 'legacy pointer must migrate without duplication');
    assert.match(body, /<!-- rig:catalog-routing:start -->[\s\S]*<!-- rig:catalog-routing:end -->/);
  });
});

test('legacy-pointer migration is journaled and uninstall removes only its named block', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const agents = path.join(target, 'AGENTS.md');
    const original = fs.readFileSync(agents, 'utf8');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    fs.writeFileSync(agents, `${original}${pointer}\n`);
    const beforeRecords = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8');
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const afterRecords = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8');
    assert.notEqual(afterRecords, beforeRecords, 'migration must append journal records');

    fs.appendFileSync(agents, '<!-- rig:user-note:start -->\nkeep me\n<!-- rig:user-note:end -->\n');
    assert.equal(uninstall(target).status, 'removed');
    const remaining = fs.readFileSync(agents, 'utf8');
    assert.doesNotMatch(remaining, /rig:catalog-routing/);
    assert.match(remaining, /rig:user-note:start[\s\S]*keep me[\s\S]*rig:user-note:end/);
    assert.ok(remaining.includes(original.trim()), 'uninstall must preserve original user bytes');
  });
});
