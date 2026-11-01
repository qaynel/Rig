#!/usr/bin/env node
'use strict';
// The CI test gate. Same steps as `npm test`, minus what needs the wiki, which
// is not part of CI (owner decision 2026-10-31). Skipped tests are listed by
// name in ci/no-wiki-skips.txt so nothing is hidden. The catalogue file runs in
// its own five-way matrix job, so it is left out here.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const env = { ...process.env, RIG_CI_NO_WIKI: '1', PATH: `${path.join(root, '.venv/bin')}:${process.env.PATH}` };
const escape = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const skips = fs.readFileSync(path.join(__dirname, 'no-wiki-skips.txt'), 'utf8').split('\n').filter(Boolean)
  .map((name) => `--test-skip-pattern=${escape(name)}`);
const tests = fs.readdirSync(path.join(root, 'tests')).filter((f) => f.endsWith('.test.js') && f !== 'catalogue-all-services.test.js')
  .sort().map((f) => path.join('tests', f));

const steps = [
  ['npm', ['run', 'pretest']],
  ['npm', ['run', 'test:secrets']],
  ['node', ['scripts/check-rule-copies.js']],
  ['node', ['scripts/check-versions.js']],
  ['node', ['--test', ...skips, ...tests]],
  ['npm', ['test', '--prefix', 'pi-extension']],
  ['npm', ['test', '--prefix', 'rig-mcp']],
];
let failed = 0;
// Run every step even after a failure: one red step must not hide another.
for (const [cmd, args] of steps) {
  const label = `${cmd} ${args.filter((a) => !a.startsWith('tests/') && !a.startsWith('--test-skip-pattern')).slice(0, 3).join(' ')}`;
  console.log(`\n=== ${label}`);
  const result = spawnSync(cmd, args, { cwd: root, env, stdio: 'inherit' });
  if (result.status !== 0) { failed += 1; console.error(`=== FAILED: ${label}`); }
}
process.exit(failed ? 1 : 0);
