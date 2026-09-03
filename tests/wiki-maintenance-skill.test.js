'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const skill = fs.readFileSync(
  path.join(__dirname, '..', '.claude', 'skills', 'wiki-maintenance', 'SKILL.md'),
  'utf8',
);

test('skill has name and description frontmatter', () => {
  assert.match(skill, /^---\nname: wiki-maintenance\ndescription: .+\n---\n/);
});

test('skill documents every step 0 through 7', () => {
  for (let step = 0; step <= 7; step += 1) {
    assert.match(skill, new RegExp(`## Step ${step} —`), `missing Step ${step}`);
  }
});

test('skill references the backing script and the generator', () => {
  assert.match(skill, /scripts\/wiki-maintenance\.js status/);
  assert.match(skill, /scripts\/wiki-maintenance\.js lint/);
  assert.match(skill, /scripts\/build-wiki-index\.js/);
});

test('skill has ground rules and a scheduling section', () => {
  assert.match(skill, /## Ground rules/);
  assert.match(skill, /## Scheduling/);
});
