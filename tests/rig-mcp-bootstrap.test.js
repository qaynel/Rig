#!/usr/bin/env node
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('root pretest bootstraps rig-mcp dependencies when absent', () => {
  const { scripts } = require('../package.json');
  assert.match(
    scripts.pretest,
    /\[ -d rig-mcp\/node_modules \][^\n]*\|\|[^\n]*npm ci --prefix rig-mcp/,
  );
});

test('CI relies on the root pretest bootstrap instead of a duplicate install step', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/test.yml'), 'utf8');
  assert.doesNotMatch(workflow, /npm (?:ci|install)\b[^\n]*--prefix\s+rig-mcp/);
});
