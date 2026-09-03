#!/usr/bin/env node
// Generate rig/catalog/skills/catalog.json from the skill frontmatter,
// families.json, and migrations.json. `--check` regenerates in memory and
// fails on drift; that is the CI gate. There is no second handwritten index.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { buildSkillCatalog } = require('../rig/lib/skill-catalog');
const { version } = require('../package.json');

const OUT = path.join(__dirname, '..', 'rig', 'catalog', 'skills', 'catalog.json');
const RELEASE_TAG = `v${version}`;

function render(catalog) {
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

function main(argv) {
  const check = argv.includes('--check');
  const desired = render(buildSkillCatalog({ releaseTag: RELEASE_TAG }));
  if (!check) {
    fs.writeFileSync(OUT, desired);
    console.log(`Skill catalogue written: ${JSON.parse(desired).skills.length} skills.`);
    return 0;
  }
  const actual = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : null;
  if (actual !== desired) {
    console.error('rig/catalog/skills/catalog.json is stale — run: node scripts/build-skill-catalog.js');
    return 1;
  }
  console.log(`Skill catalogue matches source: ${JSON.parse(desired).skills.length} skills.`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { main, render, OUT };
