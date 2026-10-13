#!/usr/bin/env node
'use strict';

// Subplan 03 Contract: one authoring authority. The superseded source tree is
// gone, nothing still points at it, the only repeated bytes are this
// repository's own reproducible host projections, user-facing text no longer
// speaks of tiers, and `--tier 1` stays accepted for one release while any other
// value is rejected.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const SKIP_DIRS = new Set(['node_modules', '.git', '.venv', '.context']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

const rel = (abs) => path.relative(root, abs).split(path.sep).join('/');
const pinned = new Set(fs.readFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), 'utf8')
  .trim().split('\n').map((line) => line.slice(66)));

test('the superseded rig/tier-1 source tree no longer exists', () => {
  assert.equal(fs.existsSync(path.join(root, 'rig/tier-1')), false);
});

test('no live file points at a retired source path (history, pinned oracle files and the pinned catalogue are exempt)', () => {
  const retired = [/rig\/tier-1/, /check-rule-copies\.js\b.*\bAGENTS\.md/];
  const exempt = (file) => file.startsWith('wiki/') || file.startsWith('docs/superpowers/') || pinned.has(file)
    || file === 'rig/catalog.json' || file === 'tests/corpus-contract.test.js' || file.startsWith('tests/fixtures/')
    || file.startsWith('rig/catalog/') || file.startsWith('.git');
  const hits = [];
  for (const abs of walk(root)) {
    const file = rel(abs);
    if (exempt(file) || fs.statSync(abs).size > 2 * 1024 * 1024) continue;
    const text = fs.readFileSync(abs, 'utf8');
    for (const pattern of retired) if (pattern.test(text)) hits.push(`${file} matches ${pattern}`);
  }
  assert.deepEqual(hits, []);
});

test('the only byte-identical twins of a corpus file are this repository\'s reproducible host projections', () => {
  const { generatedFiles } = require('../scripts/project-repo');
  const generated = new Set([...generatedFiles().keys()]);
  const carveOuts = (file) => file.startsWith('wiki/') || file.startsWith('docs/superpowers/') || file.startsWith('tests/fixtures/');
  const corpus = walk(path.join(root, 'rig/corpus')).map((abs) => ({ file: rel(abs), digest: sha(fs.readFileSync(abs)), size: fs.statSync(abs).size }))
    .filter((entry) => entry.size >= 64);
  const byDigest = new Map();
  for (const abs of walk(root)) {
    const file = rel(abs);
    if (file.startsWith('rig/corpus/') || carveOuts(file)) continue;
    const size = fs.statSync(abs).size;
    if (size < 64) continue;
    const digest = sha(fs.readFileSync(abs));
    (byDigest.get(digest) || byDigest.set(digest, []).get(digest)).push(file);
  }
  const twins = [];
  for (const entry of corpus) {
    for (const other of byDigest.get(entry.digest) || []) {
      if (!generated.has(other)) twins.push(`${entry.file} == ${other}`);
    }
  }
  assert.deepEqual(twins, []);
});

test('the shipped rule-copy gate now proves reproducibility and uniqueness, not hand-kept copies', () => {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/check-rule-copies.js')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /projection is reproducible/i);
  const source = fs.readFileSync(path.join(root, 'scripts/check-rule-copies.js'), 'utf8');
  assert.doesNotMatch(source, /rig\/tier-1|stripFrontmatter/);
});

test('a drifted generated twin fails the gate and names the file', () => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-contract-'));
  try {
    for (const dir of ['rig', 'scripts', 'skills', '.claude', '.agents', '.cursor', '.windsurf', '.clinerules', '.kiro', '.github', 'wiki/gate1']) {
      if (fs.existsSync(path.join(root, dir))) fs.cpSync(path.join(root, dir), path.join(copy, dir), { recursive: true });
    }
    for (const file of ['AGENTS.md', 'package.json']) fs.copyFileSync(path.join(root, file), path.join(copy, file));
    fs.appendFileSync(path.join(copy, '.cursor/rules/rig.mdc'), 'drift\n');
    const result = spawnSync(process.execPath, [path.join(copy, 'scripts/check-rule-copies.js')], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /\.cursor\/rules\/rig\.mdc/);
  } finally { fs.rmSync(copy, { recursive: true, force: true }); }
});

test('a duplicated corpus file is reported by the gate', () => {
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-contract-'));
  try {
    for (const dir of ['rig', 'scripts', 'skills', '.claude', '.agents', '.cursor', '.windsurf', '.clinerules', '.kiro', '.github']) {
      if (fs.existsSync(path.join(root, dir))) fs.cpSync(path.join(root, dir), path.join(copy, dir), { recursive: true });
    }
    for (const file of ['AGENTS.md', 'package.json']) fs.copyFileSync(path.join(root, file), path.join(copy, file));
    fs.mkdirSync(path.join(copy, 'rig/lib/shadow'));
    fs.copyFileSync(path.join(copy, 'rig/corpus/routing.md'), path.join(copy, 'rig/lib/shadow/routing.md'));
    const result = spawnSync(process.execPath, [path.join(copy, 'scripts/check-rule-copies.js')], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /rig\/corpus\/routing\.md/);
    assert.match(result.stderr, /rig\/lib\/shadow\/routing\.md/);
  } finally { fs.rmSync(copy, { recursive: true, force: true }); }
});

// ----------------------------------------------------------------- tiers

test('user-facing install text no longer speaks of tiers', () => {
  const files = ['README.md', 'README.es.md', 'README.ko.md', 'rig/bootstrap.sh', 'rig/corpus/routing.md', 'rig/corpus/onboarding/README.md',
    'rig/corpus/onboarding/unpack.md', 'rig/corpus/rules/rig.md', 'rig/corpus/rules/communication.md', 'rig/corpus/rules/repo-instructions.md'];
  const allowed = /--tier 1|\$TIER|deprecated|--tier\)|TIER=|"\$TIER"|--tier\b/;
  const offenders = [];
  for (const file of files) {
    fs.readFileSync(path.join(root, file), 'utf8').split('\n').forEach((line, index) => {
      if (/\btier\b/i.test(line) && !allowed.test(line)) offenders.push(`${file}:${index + 1}: ${line.trim().slice(0, 80)}`);
    });
  }
  assert.deepEqual(offenders, []);
});

function bootstrap(args, env = {}) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-tier-flag-'));
  try {
    const result = spawnSync('sh', [path.join(root, 'rig/bootstrap.sh'), '--target', target, ...args], { encoding: 'utf8', env: { ...process.env, ...env }, input: '' });
    return { ...result, installed: fs.existsSync(path.join(target, '.rig/routing.md')) };
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

test('--tier 1 stays accepted with a deprecation notice; every other value is rejected before any write', () => {
  const ok = bootstrap(['--tier', '1']);
  assert.equal(ok.status, 0, ok.stderr);
  assert.equal(ok.installed, true);
  assert.match(ok.stderr, /--tier is deprecated/i);
  assert.doesNotMatch(`${ok.stdout}${ok.stderr}`, /Tier 1 into|Select Rig tier/);
  for (const value of ['2', 'basic', '', '1; echo pwned']) {
    const bad = bootstrap(['--tier', value]);
    assert.notEqual(bad.status, 0, JSON.stringify(value));
    assert.match(bad.stderr, /--tier accepts only 1/);
    assert.equal(bad.installed, false);
  }
  const none = bootstrap([]);
  assert.equal(none.status, 0, none.stderr);
  assert.doesNotMatch(none.stderr, /deprecated/, 'no flag, no notice');
});
