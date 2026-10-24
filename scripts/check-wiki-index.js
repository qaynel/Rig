#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { render } = require('./build-wiki-index');

const root = path.join(__dirname, '..');
let failed = false;
for (const [relative, expected] of Object.entries(render(root))) {
  const actual = fs.existsSync(path.join(root, relative))
    ? fs.readFileSync(path.join(root, relative), 'utf8')
    : '';
  if (actual !== expected) {
    console.error(`${relative} is stale; run node scripts/build-wiki-index.js`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('Wiki summary and reasoning-trace index match immutable trace frontmatter.');
