#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { runPayload } = require('../rig/lib/payload');
const { uninstall } = require('../rig/lib/lifecycle');

const root = path.join(__dirname, '..');
const materializer = path.join(root, 'rig', 'materialize.js');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-install-uninstall-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');

test('public uninstall reverses a default bootstrap install', () => withTarget((target) => {
  const agents = path.join(target, 'AGENTS.md');
  fs.writeFileSync(agents, '# User instructions\n');
  const before = fs.readFileSync(agents, 'utf8');
  runPayload(target, ['codex']);
  const result = spawnSync(process.execPath, [materializer, '--target', target, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(agents, 'utf8'), before);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'routing.md')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
}));

test('a retained user-edited file keeps the journal for retry', () => withTarget((target) => {
  runPayload(target, []);
  const owned = path.join(target, '.rig', 'routing.md');
  fs.appendFileSync(owned, 'user edit\n');
  const first = uninstall(target);
  assert.equal(first.status, 'best_effort');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), true);
  fs.rmSync(owned);
  const second = uninstall(target);
  assert.equal(second.status, 'removed');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
}));

test('purge removes the manifest only after a clean removal', () => withTarget((target) => {
  runPayload(target, []);
  fs.mkdirSync(path.join(target, 'reports', 'rig'), { recursive: true });
  const result = uninstall(target, { purge: true });
  assert.equal(result.status, 'removed');
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.json')), false);
}));

test('a corrupted middle journal record fails closed before removal', () => withTarget((target) => {
  const first = path.join(target, 'first.txt');
  const second = path.join(target, 'second.txt');
  fs.writeFileSync(first, 'first\n');
  fs.writeFileSync(second, 'second\n');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify({ seq: 1, path: 'first.txt', state: 'applied', transaction_kind: 'install', digest: digest('first\n') }),
    '{ malformed',
    JSON.stringify({ seq: 2, path: 'second.txt', state: 'applied', transaction_kind: 'install', digest: digest('second\n') }),
    '',
  ].join('\n'));
  assert.throws(() => uninstall(target), /manifest|record|JSON/i);
  assert.equal(fs.readFileSync(first, 'utf8'), 'first\n');
  assert.equal(fs.readFileSync(second, 'utf8'), 'second\n');
}));
