#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'wiki');
// The Gate 1 oracle is tracked, so acceptance.md can exist in a checkout that
// still has none of the rest of the wiki. A full local wiki has the primer.
const COMPLETE = path.join(DEST, 'agent-primer.md');

if (fs.existsSync(COMPLETE)) process.exit(0);

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

function cloneInto(dest) {
  const cloned = spawnSync('git', ['clone', '--depth', '1', wikiUrl(), dest], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  return cloned.status === 0 ? 0 : (cloned.status === null ? 1 : cloned.status);
}

// Copy a wiki snapshot over a partial tree (the tracked Gate 1 oracle) without
// nesting a second .git inside this checkout, and without replacing files that
// are already present.
function copyMissing(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyMissing(src, dst);
    else if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
  }
}

const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-'));
let cloneStatus = 0;
try {
  cloneStatus = cloneInto(staging);
  if (cloneStatus === 0) copyMissing(staging, DEST);
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
if (cloneStatus !== 0) process.exit(cloneStatus);

if (!fs.existsSync(COMPLETE)) {
  console.error('wiki clone did not include agent-primer.md');
  process.exit(1);
}
