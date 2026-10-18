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
  assert.match(doc, /Python 3[\s\S]*required only to migrate an existing v5 installation/i);
  assert.match(doc, /default install does not install the optional MCP runtime or use npm/i);
  assert.match(doc, /v5\s+upgrade[\s\S]*host emits MCP configuration[\s\S]*SETUP_MCP=1[\s\S]*ignored on fresh installs/i);
  assert.match(doc, /--openclaw-mcp[\s\S]*register the server in OpenClaw/i);
});

test('current design and clean-install docs match the pinned-fetch release model', () => {
  const design = read('wiki/gate2/technical-spec.md');
  const e2e = read('wiki/specs/close-everything/06-clean-install-e2e.md');
  const row = (id) => design.split('\n').find((line) => line.startsWith(`| ${id} |`)) || '';
  assert.match(design, /Current release amendment[\s\S]*zero optional third-party skill trees[\s\S]*nine mandatory native entry skills[\s\S]*approved onboarding selection fetches/i);
  assert.match(row('AT-DIST-1'), /zero optional third-party trees[\s\S]*nine mandatory native entry skills/i);
  assert.match(row('AT-PB-3'), /stage zero optional trees[\s\S]*nine mandatory native entry skills/i);
  assert.doesNotMatch(design, /all 55 vendored skills are materialized|require eight core\/onboarding projections|every materialized installation\s+carry all 55 skill directories/i);
  assert.match(e2e, /By default, `--sha <commit>`[\s\S]*download the GitHub source archive[\s\S]*compare the\s+extracted tree with the checked-out source tree/i);
  assert.match(e2e, /explicit `--artifact <path>`[\s\S]*local archive/i);
  assert.match(e2e, /`--tag <published-tag>`[\s\S]*separate public-download smoke test/i);
  assert.doesNotMatch(e2e, /By default, `--sha`[^\n]*packs? a\s+clean exact commit with Git archive/i);
});
