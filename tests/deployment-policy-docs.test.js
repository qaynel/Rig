'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('release documentation distinguishes automated gates from owner checks', () => {
  const topic = read('wiki/topics/distribution-and-release.md');
  const policy = read('rig/corpus/standards/change-management.md');
  const checker = read('scripts/check-deployment-gate.js');
  assert.match(topic, /checker automates the signed-oracle, clean-tree, full-test/);
  assert.match(topic, /documentation\s+accuracy and QA branch-protection requirements are separate\s+owner checks/i);
  assert.match(policy, /This step is a human check/);
  assert.match(policy, /required status checks[\s\S]*must be \*required\*/i);
  assert.doesNotMatch(checker, /branch.?protection|docs\/architecture\.md/,
    'the script implementation does not claim to validate those manual controls');
});

test('install documentation separates default, migration-only MCP setup, and OpenClaw registration', () => {
  const doc = read('docs/install.md');
  assert.match(doc, /default install does not install the optional MCP runtime or use npm/i);
  assert.match(doc, /v5\s+upgrade[\s\S]*host emits MCP configuration[\s\S]*SETUP_MCP=1[\s\S]*ignored on fresh installs/i);
  assert.match(doc, /--openclaw-mcp[\s\S]*register the server in OpenClaw/i);
});
