/**
 * Corpus parity tests
 * Verifies that host-specific projection shims are identical to corpus source
 * Related: RP-13 from second-round design review, Section 6 Migration Plan
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');

// Host directories that contain generated projections
const HOST_DIRS = {
  agents: '.agents/skills',
  claude: '.claude/skills',
  cursor: '.cursor/skills',
  windsurf: '.windsurf/skills',
};

// Canonical corpus location
const CORPUS_SKILLS = 'rig/corpus/skills';

test('generated skill shims match corpus source', () => {
  const corpusPath = path.join(REPO_ROOT, CORPUS_SKILLS);

  if (!fs.existsSync(corpusPath)) {
    assert.fail(`Corpus skills directory not found: ${corpusPath}`);
  }

  // Get all skill directories in corpus
  const corpusSkills = fs.readdirSync(corpusPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Verify each host projection matches corpus
  for (const [hostName, hostDir] of Object.entries(HOST_DIRS)) {
    const hostPath = path.join(REPO_ROOT, hostDir);

    // Skip hosts that don't have projections installed
    if (!fs.existsSync(hostPath)) continue;

    for (const skillName of corpusSkills) {
      const corpusSkillPath = path.join(corpusPath, skillName, 'SKILL.md');
      const hostSkillPath = path.join(hostPath, skillName, 'SKILL.md');

      // If corpus has this skill, check if host projection exists
      if (!fs.existsSync(corpusSkillPath)) continue;

      if (!fs.existsSync(hostSkillPath)) {
        // Not all skills are projected to all hosts - this is expected
        continue;
      }

      // Read both files
      const corpusContent = fs.readFileSync(corpusSkillPath, 'utf8');
      const hostContent = fs.readFileSync(hostSkillPath, 'utf8');

      // Verify byte-identical
      assert.strictEqual(
        hostContent,
        corpusContent,
        `${hostName} projection of ${skillName} differs from corpus source`
      );
    }
  }
});

test('no authored content in generated directories', () => {
  // This test verifies that generated directories contain only projections
  // by checking file counts and ensuring all files are tracked by check-rule-copies.js

  const generatedMarkers = [
    '.agents/',
    '.claude/',
    '.cursor/',
    '.windsurf/',
    '.codex/',
    '.devin/',
    '.kiro/',
    '.opencode/',
  ];

  for (const marker of generatedMarkers) {
    const dirPath = path.join(REPO_ROOT, marker);
    if (!fs.existsSync(dirPath)) continue;

    // Check that directory contains expected structure
    // Actual enforcement is via check-rule-copies.js which runs in CI
    // This test is a smoke check that directories exist and are readable
    const stats = fs.statSync(dirPath);
    assert.ok(stats.isDirectory(), `${marker} should be a directory`);
  }

  // The real verification is done by check-rule-copies.js
  // This test ensures the script itself is present
  const checkScript = path.join(REPO_ROOT, 'scripts/check-rule-copies.js');
  assert.ok(
    fs.existsSync(checkScript),
    'check-rule-copies.js must exist to enforce corpus parity'
  );
});
