'use strict';

// Shared seam for the RIG-135 descendant-cleanup tests. The vendored browse
// sources are TypeScript that import Bun APIs, so each scenario runs in a
// small `bun` runner and reports JSON on its last stdout line.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..', '..');
const browseSrc = path.join(
  root, 'rig', 'catalog', 'skills', 'browser-and-research', 'browser-automation', 'browse', 'src',
);
const fixtures = path.join(__dirname, '..', 'fixtures', 'browse-descendants');

// A named gap, not a silent pass: the dedicated CI workflow sets this so a
// missing tool fails there instead of skipping.
const required = process.env.RIG_REQUIRE_PROCESS_CLEANUP === '1';

function bunMissing() {
  const probe = spawnSync('bun', ['--version'], { encoding: 'utf8' });
  if (probe.status === 0) return false;
  return 'bun is not installed (setup: https://bun.sh/docs/installation); the browse sources run under Bun';
}

function skipReason(extra) {
  if (required) return false;
  return bunMissing() || extra || false;
}

function tmpDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function runBun(runner, args = [], env = {}) {
  const result = spawnSync('bun', ['run', path.join(fixtures, runner), ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout: 120000,
  });
  const lines = (result.stdout || '').trim().split('\n');
  let report;
  try {
    report = JSON.parse(lines[lines.length - 1]);
  } catch {
    throw new Error(`runner ${runner} produced no JSON report\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  }
  return report;
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

async function waitDead(pid, ms = 3000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (!isAlive(pid)) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return !isAlive(pid);
}

function reap(pid) {
  try { process.kill(pid, 'SIGKILL'); } catch { /* already gone */ }
}

module.exports = { root, browseSrc, fixtures, skipReason, tmpDir, runBun, isAlive, waitDead, reap };
