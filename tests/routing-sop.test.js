#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const routing = fs.readFileSync(path.join(root, 'rig/tier-1/routing.md'), 'utf8');
const packageScripts = require(path.join(root, 'package.json')).scripts;

function section(name) {
  const heading = `## ${name}\n`;
  const start = routing.indexOf(heading);
  assert.notEqual(start, -1, `routing.md must contain a ## ${name} section`);
  const bodyStart = start + heading.length;
  const end = routing.indexOf('\n## ', bodyStart);
  return routing.slice(bodyStart, end === -1 ? routing.length : end);
}

test('the router defines the signed human-in-the-loop ten-step SOP', () => {
  const pipeline = section('Pipeline');
  const steps = pipeline.match(/^\d+\. .+$/gm) ?? [];
  const expected = [
    'Grill the intent',
    'Design the approach',
    'Sign the key',
    'Drive code test-first',
    'Implement to the smallest correct diff',
    'Coordinate independent work + verify evidence',
    'Independent review',
    'Run the full gate',
    'Name the branch',
    'Open the PR',
  ];

  assert.equal(steps.length, expected.length);
  expected.forEach((label, index) => assert.ok(
    steps[index].startsWith(`${index + 1}. ${label} — `),
    `step ${index + 1} must be ${label}`,
  ));
  assert.match(steps[0], /`rig-grilling`/);
  assert.match(steps[1], /`rig-product-design`/);
  assert.match(steps[2], /`node scripts\/approve-gate1\.js`/);
  assert.match(steps[2], /wiki\/topics\/gate1-signing\.md/);
  assert.match(steps[3], /`rig-tdd`/);
  assert.match(steps[4], /`rig-implementation`/);
  assert.match(steps[5], /`rig-execution`.*parallel work/);
  assert.match(steps[6], /`rig-code-review`/);
  assert.match(steps[7], /`npm test`.*green before push/);
  assert.match(steps[8], /<ticket-id>-<slug>.*RIG-150-routing-sop.*rename if needed/);
  assert.match(steps[9], /`gh pr create --base prod`.*CI green check.*PR/);

  const knownSkills = new Set([
    'rig-grilling',
    'rig-product-design',
    'rig-tdd',
    'rig-implementation',
    'rig-execution',
    'rig-debugging',
    'rig-code-review',
  ]);
  for (const name of routing.match(/rig-[a-z]+(?:-[a-z]+)*/g) ?? []) {
    assert.ok(knownSkills.has(name), `routing.md must not introduce unknown skill ${name}`);
  }

  const between = section('Between steps');
  assert.match(between, /^\(A\) I'll do it myself/m);
  assert.match(between, /^\(B\) Give me the handoff context/m);
  assert.match(between, /^\(C\) Proceed with this session/m);
  assert.match(between, /"go ahead" waives all remaining A\/B\/C prompts except step 3\s+\(sign the key\)/);
  assert.match(between, /"until step N" or "from step N"/);
  assert.match(between, /interrupt[^\n]*hand off/i);

  const taskWeight = section('Task weight');
  assert.match(taskWeight, /single-step task/);
  assert.match(taskWeight, /lightweight path/);
  assert.match(taskWeight, /skip[\s\S]*(?:full cadence|wiki-read-before-grepping)/);
  assert.match(packageScripts.test, /test:code/);
  assert.match(packageScripts['test:code'], /tests\/\*\.test\.js/);
});
