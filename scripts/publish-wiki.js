#!/usr/bin/env node
'use strict';

// Push the local agent wiki to the GitHub Wiki tab.
//
// wiki/ is gitignored (except the Gate 1 oracle), so a pull request never
// carries it and a GitHub Action running on this repository cannot see the
// pages. Run this on a machine that has the wiki and permission to push to
// <origin>.wiki.git. CI restores that snapshot with scripts/ensure-wiki.js.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'wiki');
const SKIP = new Set(['.git', '.obsidian', '.DS_Store']);

function git(args, cwd, extra = {}) {
  return spawnSync('git', args, { cwd, encoding: 'utf8', ...extra });
}

function must(args, cwd) {
  const result = git(args, cwd, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status === null ? 1 : result.status);
}

function copy(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copy(src, dst);
    else if (entry.isFile()) fs.copyFileSync(src, dst);
  }
}

if (!fs.existsSync(path.join(SRC, 'agent-primer.md'))) {
  console.error('wiki/agent-primer.md is missing; nothing to publish');
  process.exit(1);
}

const remote = git(['remote', 'get-url', 'origin'], ROOT);
const origin = remote.status === 0 && remote.stdout.trim()
  ? remote.stdout.trim()
  : 'https://github.com/qaynel/Rig-v0.1.git';
const wikiRemote = origin.replace(/\.git$/, '') + '.wiki.git';

const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-publish-'));
let failed = 0;
try {
  const cloned = git(['clone', '--depth', '1', wikiRemote, staging], ROOT, { stdio: 'inherit' });
  if (cloned.status !== 0) {
    console.error('Could not clone ' + wikiRemote + '. Enable the GitHub Wiki on the repository, then retry.');
    failed = cloned.status === null ? 1 : cloned.status;
  } else {
    for (const entry of fs.readdirSync(staging)) {
      if (entry === '.git') continue;
      fs.rmSync(path.join(staging, entry), { recursive: true, force: true });
    }
    copy(SRC, staging);
    must(['add', '-A'], staging);
    const dirty = git(['status', '--porcelain'], staging);
    if (!dirty.stdout.trim()) {
      console.log('GitHub Wiki already matches the local wiki');
    } else {
      must(['commit', '-m', 'Publish local wiki snapshot'], staging);
      must(['push', 'origin', 'HEAD'], staging);
      console.log('Published local wiki to ' + wikiRemote);
    }
  }
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
process.exit(failed);
