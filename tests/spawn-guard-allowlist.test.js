#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const checker = path.join(root, 'scripts', 'check-spawn-guard.js');
const inventory = path.join(root, 'rig', 'spawn-guard-allowlist.json');

test('the committed spawn-guard inventory accounts for every direct-kill/ungrouped-timeout call site (RIG-135)', () => {
  assert.ok(fs.existsSync(inventory), 'commit the spawn-guard debt inventory');
  assert.ok(fs.existsSync(checker), 'add the spawn-guard ratchet');
  const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /spawn-guard debt:\s*\d+\s*site/i);
});

test('the spawn-guard ratchet rejects a new direct-kill call site', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guard-direct-kill-'));
  try {
    fs.writeFileSync(
      path.join(fixture, 'new-site.js'),
      "const { spawn } = require('node:child_process');\nconst child = spawn('sleep', ['5']);\nfunction stop() { child.kill('SIGTERM'); }\nmodule.exports = { stop };\n",
    );
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({ schema_version: 1, sites: [] }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /new-site\.js/);
    assert.match(result.stdout + result.stderr, /not in the allowlist/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('the spawn-guard ratchet rejects an ungrouped spawnSync timeout on a runtime that forks', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guard-timeout-'));
  try {
    fs.writeFileSync(
      path.join(fixture, 'new-runtime-call.ts'),
      "import { spawnSync } from 'node:child_process';\nexport function run() {\n  return spawnSync('bun', ['run', 'ingest.ts'], { timeout: 30000 });\n}\n",
    );
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({ schema_version: 1, sites: [] }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /new-runtime-call\.ts/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('the spawn-guard ratchet accepts the review-receipt.js-shaped pattern: detached spawn + negative-pid group kill', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guard-compliant-'));
  try {
    fs.writeFileSync(
      path.join(fixture, 'compliant.js'),
      "const { spawnSync } = require('node:child_process');\n"
      + "const run = spawnSync('reviewer', [], { timeout: 1800000, detached: true });\n"
      + "if (run.status !== 0) { process.kill(-run.pid, 'SIGKILL'); }\n",
    );
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({ schema_version: 1, sites: [] }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /spawn-guard debt:\s*0/i);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('an allowlist entry cannot hide a call site the checker no longer finds', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guard-stale-'));
  try {
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({
      schema_version: 1,
      sites: [{ file: 'missing-site.js', kinds: ['direct-kill'], class: 'debt' }],
    }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /stale allowlist entry/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('the ratchet never grows past the committed debt count even if new sites are individually allowlisted', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guard-ratchet-'));
  try {
    fs.writeFileSync(
      path.join(fixture, 'site-a.js'),
      "module.exports = () => { const c = require('node:child_process').spawn('x'); c.kill('SIGTERM'); };\n",
    );
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({
      schema_version: 1,
      sites: [{ file: 'site-a.js', kinds: ['direct-kill'], class: 'pending-triage' }],
    }));
    const before = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.equal(before.status, 0, before.stderr || before.stdout);

    fs.writeFileSync(
      path.join(fixture, 'site-b.js'),
      "module.exports = () => { const c = require('node:child_process').spawn('y'); c.kill('SIGTERM'); };\n",
    );
    const after = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.notEqual(after.status, 0, 'a second unguarded site must not slip in for free once one is already allowlisted');
    assert.match(after.stdout + after.stderr, /site-b\.js/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
