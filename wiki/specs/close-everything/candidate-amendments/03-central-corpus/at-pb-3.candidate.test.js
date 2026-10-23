'use strict';

// UNSIGNED CANDIDATE for subplan 03. Never part of npm test or the frozen oracle.
// Run: node --test wiki/specs/close-everything/candidate-amendments/03-central-corpus/at-pb-3.candidate.test.js

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const h = require('../../../../../tests/helpers/path-b');

test('AT-PB-3 install pins shelf metadata but fetches optional skills during onboarding', async () => {
  await h.withRepo((target) => {
    assert.ok(fs.existsSync(path.join(target, '.rig/upstream/gstack-shelf.json')));
    const shelf = h.walk(path.join(target, '.rig/runtime/rig/catalog/skills'))
      .filter((file) => path.basename(file) === 'SKILL.md');
    assert.equal(shelf.length, 0, 'optional upstream skills are not vendored into the install');
    const discovered = fs.readdirSync(path.join(target, '.agents/skills'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(target, '.agents/skills', entry.name, 'SKILL.md')))
      .map(({ name }) => name)
      .sort();
    assert.deepEqual(discovered, [
      'rig-code-review', 'rig-debugging', 'rig-execution', 'rig-grilling',
      'rig-implementation', 'rig-onboarding', 'rig-product-design', 'rig-router', 'rig-tdd',
    ]);
  }, { install: true });
});
