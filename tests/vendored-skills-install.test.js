'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { runPayload } = require('../rig/lib/payload');

function withTempTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-shelf-delivery-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

const CORE = [
  'rig-code-review', 'rig-debugging', 'rig-execution', 'rig-grilling',
  'rig-implementation', 'rig-onboarding', 'rig-product-design', 'rig-router', 'rig-tdd',
];

function discovered(target) {
  return fs.readdirSync(path.join(target, '.agents/skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(target, '.agents/skills', entry.name, 'SKILL.md')))
    .map(({ name }) => name)
    .sort();
}

test('default install projects mandatory skills only and carries no runtime code', () => {
  withTempTarget((target) => {
    runPayload(target, ['codex']);
    assert.deepEqual(discovered(target), CORE);
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-browse')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime')), false);
  });
});

test('active install stages the bundled optional shelf without fetch metadata', () => {
  withTempTarget((target) => {
    runPayload(target, ['codex'], { activeDelivery: true });
    assert.deepEqual(discovered(target), CORE);
    assert.equal(fs.existsSync(path.join(target, '.rig/upstream/gstack-shelf.json')), false);
    const stagedSkills = fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/skills'))
      ? fs.readdirSync(path.join(target, '.rig/runtime/rig/catalog/skills'), { recursive: true })
        .filter((file) => path.basename(file) === 'SKILL.md')
      : [];
    assert.ok(stagedSkills.length > 0, 'the release includes optional skills before any onboarding step');
    assert.ok(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/plumbing/bin/rig-diff-scope')));
    assert.equal(fs.existsSync(path.join(target, '.agents/skills/rig-browse')), false);
  });
});
