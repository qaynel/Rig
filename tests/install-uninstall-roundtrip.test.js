#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { runPayload } = require('../rig/lib/payload');
const { uninstall } = require('../rig/lib/lifecycle');
const { writePlanApproval } = require('./helpers/advanced');

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

test('uninstall removes preimages empty instruction files and empty Rig directories', () => withTarget((target) => {
  const preimage = path.join(target, '.rig', 'preimages', 'saved');
  const agents = path.join(target, 'AGENTS.md');
  const skill = path.join(target, '.claude', 'skills', 'rig-example', 'SKILL.md');
  fs.mkdirSync(path.dirname(preimage), { recursive: true });
  fs.mkdirSync(path.dirname(skill), { recursive: true });
  fs.writeFileSync(preimage, 'original user bytes\n');
  fs.writeFileSync(agents, 'Before acting, read `.rig/routing.md`.\n');
  fs.writeFileSync(skill, 'skill\n');
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), [
    JSON.stringify({ seq: 1, path: '.rig/preimages/saved', state: 'applied', transaction_kind: 'install', digest: digest('original user bytes\n') }),
    JSON.stringify({ seq: 2, path: 'AGENTS.md', state: 'applied', transaction_kind: 'install', managed_line: 'Before acting, read `.rig/routing.md`.' }),
    JSON.stringify({ seq: 3, path: '.claude/skills/rig-example/SKILL.md', state: 'applied', transaction_kind: 'install', digest: digest('skill\n') }),
    '',
  ].join('\n'));
  const result = uninstall(target);
  assert.equal(result.status, 'removed');
  assert.equal(fs.existsSync(preimage), false);
  assert.equal(fs.existsSync(agents), false);
  assert.equal(fs.existsSync(path.join(target, '.claude', 'skills')), false);
}));

test('missing OpenClaw tooling does not stop unrelated local removal', () => withTarget((target) => {
  const local = path.join(target, 'local-rig-file');
  fs.writeFileSync(local, 'remove me\n');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'install-manifest.jsonl'), `${JSON.stringify({
    seq: 1,
    path: 'local-rig-file',
    state: 'applied',
    transaction_kind: 'install',
    digest: digest('remove me\n'),
  })}\n`);
  fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), JSON.stringify({
    entries: [{ kind: 'openclaw-mcp', path: '~/.openclaw/config.json', install_id: 'fixture', runtime: '.rig/runtime' }],
  }) + '\n');
  const result = uninstall(target);
  assert.equal(result.status, 'best_effort');
  assert.equal(fs.existsSync(local), false);
  assert.ok(result.best_effort.some((entry) => entry.includes('openclaw')));
}));

test('linked-worktree uninstall restores the original pre-commit hook', () => withTarget((root) => {
  const main = path.join(root, 'main');
  const worktree = path.join(root, 'linked');
  fs.mkdirSync(main);
  execFileSync('git', ['init'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.email', 'rig-test@example.com'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.name', 'Rig Test'], { cwd: main, stdio: 'pipe' });
  fs.writeFileSync(path.join(main, 'package.json'), JSON.stringify({
    name: 'linked-worktree-fixture', private: true, scripts: { 'format:check': 'git diff --check' },
  }) + '\n');
  fs.writeFileSync(path.join(main, 'index.js'), 'module.exports = 1;\n');
  execFileSync('git', ['add', '.'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: main, stdio: 'pipe' });
  execFileSync('git', ['worktree', 'add', '-b', 'linked-fixture', worktree], { cwd: main, stdio: 'pipe' });

  const hooks = execFileSync('git', ['rev-parse', '--git-path', 'hooks'], { cwd: worktree, encoding: 'utf8' }).trim();
  const hook = path.resolve(worktree, hooks, 'pre-commit');
  const original = '#!/bin/sh\necho user-hook\n';
  fs.mkdirSync(path.dirname(hook), { recursive: true });
  fs.writeFileSync(hook, original, { mode: 0o755 });

  const review = path.join(worktree, 'review.json');
  const selection = path.join(worktree, 'rig.json');
  const plan = path.join(worktree, 'plan.json');
  fs.writeFileSync(review, JSON.stringify({
    schema_version: 1, host: 'codex', harness_digest: 'linked-worktree-fixture', verdict: 'ALLOW',
    findings: [], restrictions: [], unverifiable: [],
  }) + '\n');
  fs.writeFileSync(selection, JSON.stringify({
    schema_version: 1, services: { 'development.code-quality.lint-format': 'minimal' },
  }) + '\n');
  let result = spawnSync(process.execPath, [materializer, 'plan', '--target', worktree, '--manifest', selection, '--review', review, '--out', plan], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const approval = writePlanApproval(worktree, plan);
  result = spawnSync(process.execPath, [materializer, 'apply', '--target', worktree, '--manifest', selection, '--review', review, '--plan', plan, '--approval', approval], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(fs.readFileSync(hook, 'utf8'), /Rig secret guard shim/);
  assert.match(fs.readFileSync(path.join(worktree, '.rig', 'install-manifest.jsonl'), 'utf8'), /\.git\/hooks\/pre-commit/);

  result = spawnSync(process.execPath, [materializer, '--target', worktree, '--uninstall'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.readFileSync(hook, 'utf8'), original);
  assert.equal(fs.existsSync(path.join(path.dirname(hook), 'pre-commit.rig-chained')), false);
}));
