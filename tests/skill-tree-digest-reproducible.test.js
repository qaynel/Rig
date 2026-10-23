'use strict';

// Non-frozen guard for the 2026-09-02 deploy-review finding: `skillTreeDigest`
// folded nine `stat` mode bits into a value it calls reproducible, but git
// tracks only the exec bit, so a checkout under `umask 002` moved every
// catalogue row's `tree_digest` and turned `npm test` red on a fresh clone.
// The catalogue `--check` gate cannot see it — it regenerates and compares
// inside one process, where the umask cancels. This holds the bytes constant
// and varies permissions instead.
// wiki/reasoning/2026-09-02-catalogue-tree-digest-reproducibility.md

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { buildSkillCatalog } = require('../rig/lib/skill-catalog');

const ROOT = path.join(__dirname, '..');
const SHELF = path.join(ROOT, 'rig/catalog/skills');

function fixtureShelf() {
  const shelfRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mode-shelf-'));
  for (const name of ['families.json', 'migrations.json']) {
    fs.copyFileSync(path.join(SHELF, name), path.join(shelfRoot, name));
  }
  const skillDir = path.join(shelfRoot, 'testing', 'functional', 'qa');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), `---
name: qa
description: Fixture skill for the mode-bit reproducibility check.
family: testing
tool: host-agent
capability: testing.functional
guarantees:
  - Runs the fixture check.
overlap_tags:
  - test
---

# Fixture
`);
  fs.writeFileSync(path.join(skillDir, 'notes.md'), '# notes\n');
  return { shelfRoot, skillDir };
}

const digestOf = (shelfRoot) =>
  buildSkillCatalog({ shelfRoot }).skills.find((s) => s.id === 'qa').tree_digest;

test('tree_digest ignores the umask-driven group/other bits', () => {
  const { shelfRoot, skillDir } = fixtureShelf();
  try {
    const files = ['SKILL.md', 'notes.md'].map((f) => path.join(skillDir, f));
    for (const f of files) fs.chmodSync(f, 0o644); // git-recorded mode
    const recorded = digestOf(shelfRoot);
    for (const f of files) fs.chmodSync(f, 0o664); // what `umask 002` writes
    assert.equal(digestOf(shelfRoot), recorded,
      'a group-write bit from the checkout umask must not move tree_digest');
    for (const f of files) fs.chmodSync(f, 0o666);
    assert.equal(digestOf(shelfRoot), recorded);
  } finally {
    fs.rmSync(shelfRoot, { recursive: true, force: true });
  }
});

test('tree_digest still tracks the executable bit git does version', () => {
  const { shelfRoot, skillDir } = fixtureShelf();
  try {
    const notes = path.join(skillDir, 'notes.md');
    fs.chmodSync(notes, 0o644);
    const nonExec = digestOf(shelfRoot);
    fs.chmodSync(notes, 0o755);
    assert.notEqual(digestOf(shelfRoot), nonExec,
      'the exec bit is tracked content and must change the digest');
  } finally {
    fs.rmSync(shelfRoot, { recursive: true, force: true });
  }
});
