#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'wiki');
const MARKER = path.join(DEST, 'gate1', 'acceptance.md');

if (fs.existsSync(MARKER)) process.exit(0);

function wikiUrl() {
  const remote = spawnSync('git', ['remote', 'get-url', 'origin'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (remote.status === 0 && remote.stdout.trim()) {
    return remote.stdout.trim().replace(/\.git$/, '') + '.wiki.git';
  }
  return 'https://github.com/qaynel/Rig-v0.1.wiki.git';
}

if (fs.existsSync(DEST)) {
  console.error('wiki/ exists but is incomplete; clone into a fresh directory');
  process.exit(1);
}

const url = wikiUrl();
const cloned = spawnSync('git', ['clone', '--depth', '1', url, DEST], {
  cwd: ROOT,
  stdio: 'inherit',
});
process.exit(cloned.status === 0 ? 0 : cloned.status || 1);
