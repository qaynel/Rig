'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const h = require('./helpers/path-b');

function launcher() {
  const file = path.join(h.root, 'install');
  assert.ok(fs.existsSync(file), 'canonical `install rig` launcher is missing');
  assert.ok(fs.statSync(file).mode & 0o111, 'canonical install launcher is not executable');
  return file;
}

function installFixture() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-path-b-install-'));
  const source = path.join(fixture, 'archive-root', 'Rig-v5.0.0');
  fs.mkdirSync(source, { recursive: true });
  for (const rel of ['rig', '.agents', '.claude', 'skills']) {
    fs.cpSync(path.join(h.root, rel), path.join(source, rel), { recursive: true });
  }
  const archive = path.join(fixture, 'rig-v5.0.0.tar.gz');
  const packed = spawnSync('tar', ['-czf', archive, '-C', path.dirname(source), path.basename(source)], { encoding: 'utf8' });
  assert.equal(packed.status, 0, packed.stderr);
  const bin = path.join(fixture, 'bin');
  fs.mkdirSync(bin);
  const curlLog = path.join(fixture, 'curl.log');
  fs.writeFileSync(path.join(bin, 'curl'), [
    '#!/bin/sh',
    'printf "%s\\n" "$*" >> "$RIG_TEST_CURL_LOG"',
    'while [ "$#" -gt 0 ]; do',
    '  if [ "$1" = "-o" ]; then cp "$RIG_TEST_ARCHIVE" "$2"; exit 0; fi',
    '  shift',
    'done',
    'exit 1',
    '',
  ].join('\n'), { mode: 0o755 });
  const env = {
    ...process.env,
    PATH: `${bin}${path.delimiter}${process.env.PATH}`,
    RIG_TEST_ARCHIVE: archive,
    RIG_TEST_CURL_LOG: curlLog,
  };
  return {
    fixture,
    curlLog,
    env,
    cleanup: () => fs.rmSync(fixture, { recursive: true, force: true }),
  };
}

function targetUnder(fixture, name, hosts = []) {
  const target = path.join(fixture, name);
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'AGENTS.md'), '# User instructions\nKeep me.\n');
  for (const host of hosts) fs.mkdirSync(path.join(target, host), { recursive: true });
  return target;
}

function runInstall(env, target, args = []) {
  return spawnSync('/bin/sh', [launcher(), 'rig', '--version', 'v5.0.0', '--target', target, ...args], {
    encoding: 'utf8',
    env,
  });
}

test('AT-PB-6 public grammar is install rig with repeatable host and no tiers', () => {
  const result = spawnSync('/bin/sh', [launcher(), '--help'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /install rig/);
  assert.match(result.stdout, /--host <host>/);
  assert.doesNotMatch(result.stdout, /--tier|Basic|Advanced install/i);
});

test('AT-PB-6 omitted host preserves bounded detection and does not auto-onboard', { timeout: 30000 }, () => {
  const f = installFixture();
  try {
    const target = targetUnder(f.fixture, 'detected', ['.claude']);
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'));
    const result = runInstall(f.env, target);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(fs.existsSync(path.join(target, '.claude/skills/rig-onboarding/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, '.agents')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/catalog.json')), true);
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig/lib/onboarding.js')), true);
    assert.equal(fs.existsSync(path.join(target, '.rig/state.json')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/onboarding-summary.md')), false);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), before);
    assert.match(result.stdout, /Rig is installed\. In your host agent, invoke rig-onboarding for this repository\./);
    assert.match(result.stdout, /Nothing is adapted until you approve its onboarding summary\./);
  } finally {
    f.cleanup();
  }
});

test('AT-PB-6 repeated hosts map once in first-seen order and replace detection', { timeout: 30000 }, () => {
  const f = installFixture();
  try {
    const target = targetUnder(f.fixture, 'explicit', ['.cursor']);
    const result = runInstall(f.env, target, ['--host', 'codex', '--host', 'claude', '--host', 'codex']);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.ok(fs.existsSync(path.join(target, '.agents/skills/rig-onboarding/SKILL.md')));
    assert.ok(fs.existsSync(path.join(target, '.claude/skills/rig-onboarding/SKILL.md')));
    assert.equal(fs.existsSync(path.join(target, '.cursor/rules/rig.mdc')), false, 'explicit hosts must replace detection');
    const codex = result.stdout.indexOf('host: codex');
    const claude = result.stdout.indexOf('host: claude');
    assert.ok(codex >= 0 && claude > codex, 'host order must preserve first occurrence');
    assert.equal((result.stdout.match(/host: codex/g) || []).length, 1);
    assert.equal(fs.existsSync(path.join(target, '.rig/state.json')), false);
  } finally {
    f.cleanup();
  }
});

test('AT-PB-6 unknown hosts fail before any Rig write', { timeout: 30000 }, () => {
  const f = installFixture();
  try {
    const target = targetUnder(f.fixture, 'unknown');
    const before = fs.readFileSync(path.join(target, 'AGENTS.md'));
    const result = runInstall(f.env, target, ['--host', 'invented-host']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /unknown host|invented-host/i);
    assert.equal(fs.existsSync(path.join(target, '.rig')), false);
    assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), before);
  } finally {
    f.cleanup();
  }
});
