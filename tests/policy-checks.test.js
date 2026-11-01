'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const policy = require('../rig/catalog/baseline/policy-checks');
const entrypointPath = path.resolve('scripts/check-claudemd-pointers.js');

test('current CLAUDE north-star block is grandfathered while new decisions need wiki links', () => {
  const current = fs.readFileSync('CLAUDE.md', 'utf8');
  assert.equal(policy.claudeMdPointersOnly(current).ok, true);
  assert.equal(policy.claudeMdPointersOnly(`${current}\n\nA new decision paragraph must be linked.`).ok, false);
  const result = policy.claudeMdPointersOnly('# Notes\n\nWe decided to add a new requirement.');
  assert.equal(result.ok, false);
  assert.equal(result.offending[0].line, 3);
});

test('policy checks require a reasoning trace for spec changes and plain user questions', () => {
  assert.equal(policy.decisionHasTrace(['wiki/specs/rebuild/design.md']).ok, false);
  assert.equal(policy.decisionHasTrace(['wiki/specs/rebuild/design.md', 'wiki/reasoning/2026-10-31-note.md']).ok, true);
  assert.equal(policy.plainQuestion('Per D5 and §8, can you confirm the AT-PB-3 reading?').ok, false);
  assert.equal(policy.plainQuestion('Should setup stop downloading packs? I recommend yes.').ok, true);
});

test('entrypoint checks current CLAUDE and requires an actual contemporaneous local trace for spec diffs', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-policy-entry-'));
  fs.mkdirSync(path.join(root, 'rig/corpus/rules'), { recursive: true });
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), fs.readFileSync('CLAUDE.md', 'utf8'));
  fs.writeFileSync(path.join(root, 'rig/corpus/rules/rule.md'), 'before\n');
  const gitBin = path.join(root, 'bin'); fs.mkdirSync(gitBin);
  fs.writeFileSync(path.join(gitBin, 'git'), '#!/bin/sh\ncase "$*" in *--name-only*) echo rig/corpus/rules/rule.md;; *) echo "diff --git a/rig/corpus/rules/rule.md b/rig/corpus/rules/rule.md";; esac\n', { mode: 0o755 });
  const oldPath = process.env.PATH; process.env.PATH = `${gitBin}:${oldPath}`;
  t.after(() => { process.env.PATH = oldPath; });
  fs.writeFileSync(path.join(root, 'rig/corpus/rules/rule.md'), 'after\n');
  const check = () => spawnSync(process.execPath, [entrypointPath], { cwd: root, encoding: 'utf8', env: process.env });
  assert.match(check().stderr, /add a dated wiki\/reasoning trace/);
  fs.mkdirSync(path.join(root, 'wiki/reasoning'), { recursive: true });
  fs.writeFileSync(path.join(root, 'wiki/reasoning/2026-10-31-rule-change.md'), 'Trace for this local change.\n');
  const future = new Date(Date.now() + 10_000);
  fs.utimesSync(path.join(root, 'wiki/reasoning/2026-10-31-rule-change.md'), future, future);
  assert.equal(check().status, 0);
  fs.appendFileSync(path.join(root, 'CLAUDE.md'), '\n\nA newly appended decision must be linked.\n');
  assert.match(check().stderr, /CLAUDE\.md:/);
});

test('the exact signed CLAUDE paragraph allowlist cannot grow silently', () => {
  const source = fs.readFileSync(path.join(__dirname, '../rig/catalog/baseline/policy-checks.js'), 'utf8');
  const block = source.match(/const CLAUDE_BLOCK_HASHES = new Set\(\[([\s\S]*?)\]\);/)[1];
  const hashes = [...block.matchAll(/'([a-f0-9]{64})'/g)].map((match) => match[1]).sort();
  assert.equal(hashes.length, 27);
  assert.equal(crypto.createHash('sha256').update(hashes.join('\n')).digest('hex'), 'a4b3d27159d737ab381dbe09eb619b0bfc4abb169e8e370cca5348d64f060a49');
  const expanded = `${block},'${'a'.repeat(64)}'`;
  assert.notEqual(crypto.createHash('sha256').update([...expanded.matchAll(/'([a-f0-9]{64})'/g)].map((m) => m[1]).sort().join('\n')).digest('hex'), 'a4b3d27159d737ab381dbe09eb619b0bfc4abb169e8e370cca5348d64f060a49');
});

test('repository policy CLI validates current CLAUDE and authoring diff during the normal test run', () => {
  const result = spawnSync(process.execPath, [entrypointPath], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /CLAUDE\.md pointers and decision traces: ok/);
});
