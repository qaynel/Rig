#!/usr/bin/env node
'use strict';

// Subplan 03 acceptance 1 (reproducible) and the purity half of the trust
// boundary: project(corpus, host, selection) reproduces what the v5 installer
// wrote, for every host the v5 manifest served, except for differences that
// are listed explicitly with a reason in
// tests/fixtures/v5-parity-intended-differences.json.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const golden = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/v5-install-golden.json'), 'utf8'));
const intended = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/v5-parity-intended-differences.json'), 'utf8'));

const sha16 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
const HOSTS = ['claude', 'codex', 'antigravity', 'cursor', 'windsurf', 'cline', 'kiro', 'gemini', 'copilot', 'codewhale'];
const ALL = HOSTS;

function selectionFor(name) {
  const [delivery, key] = name.split('/');
  const hosts = key === 'none' ? [] : key === 'all' ? ALL : [key];
  return { delivery, hosts };
}

// What the entries become on an empty target, using the same append semantics
// the writer applies for ensure_line and the managed gitignore block.
function materialize(entries) {
  const files = new Map();
  const append = (rel, text) => files.set(rel, { bytes: Buffer.from(`${files.get(rel)?.bytes || ''}${text}`), mode: 0o644 });
  for (const entry of entries) {
    if (entry.op === 'ensure_line') append(entry.path, `${entry.line}\n`);
    else if (entry.op === 'ensure_gitignore_block') append(entry.path, `# rig:gitignore:start\n${entry.lines.join('\n')}\n# rig:gitignore:end\n`);
    else files.set(entry.path, { bytes: entry.bytes, mode: entry.mode ?? 0o644 });
  }
  return files;
}

function inventory(files) {
  const flat = {};
  const trees = {};
  for (const rel of [...files.keys()].sort()) {
    if (golden.excluded_prefixes.some((prefix) => rel === prefix || rel.startsWith(prefix))) continue;
    const { bytes, mode } = files.get(rel);
    const value = `${sha16(bytes)}:${mode.toString(8)}`;
    const tree = golden.tree_prefixes.find((prefix) => rel.startsWith(prefix));
    if (tree) (trees[tree] ||= []).push(`${rel}\0${value}`);
    else flat[rel] = value;
  }
  const treeDigests = Object.fromEntries(Object.entries(trees).map(([prefix, list]) => [prefix, {
    count: list.length,
    digest: crypto.createHash('sha256').update(list.join('\n')).digest('hex').slice(0, 16),
  }]));
  return { flat, trees: treeDigests };
}

function goldenInventory(name) {
  const config = golden.configs[name];
  const flat = {};
  for (const index of config.files) {
    const [rel, sha, mode] = golden.table[index];
    flat[rel] = `${sha}:${mode}`;
  }
  return { flat, trees: config.trees };
}

function load() {
  const { loadCorpus } = require('../rig/lib/corpus');
  const { projectAll } = require('../rig/lib/project');
  return { loadCorpus, projectAll };
}

test('the corpus has a projector for every host the v5 manifest served', () => {
  const { PROJECTOR_HOSTS } = require('../rig/lib/project');
  assert.deepEqual([...PROJECTOR_HOSTS].sort(), [...HOSTS].sort());
  for (const host of HOSTS) {
    assert.ok(fs.existsSync(path.join(root, 'rig/corpus/projections', `${host}.js`)), `${host} projector file`);
  }
});

for (const name of Object.keys(golden.configs)) {
  test(`project() reproduces the v5 installed bytes for ${name}`, () => {
    const { loadCorpus, projectAll } = load();
    const selection = selectionFor(name);
    const actual = inventory(materialize(projectAll(loadCorpus(selection), selection)));
    const expected = goldenInventory(name);

    const diffs = new Set();
    for (const rel of new Set([...Object.keys(actual.flat), ...Object.keys(expected.flat)])) {
      if (actual.flat[rel] !== expected.flat[rel]) diffs.add(rel);
    }
    for (const prefix of new Set([...Object.keys(actual.trees), ...Object.keys(expected.trees)])) {
      if (JSON.stringify(actual.trees[prefix]) !== JSON.stringify(expected.trees[prefix])) diffs.add(prefix);
    }
    const allowed = new Set(intended.differences
      .filter((entry) => entry.configs === '*' || entry.configs.includes(name))
      .map((entry) => entry.path));
    const unexplained = [...diffs].filter((rel) => !allowed.has(rel)).sort();
    assert.deepEqual(unexplained, [], `${name}: projection differs from v5 outside the intended-differences list`);
  });
}

test('every intended difference names a reason and actually occurs', () => {
  const { loadCorpus, projectAll } = load();
  const occurred = new Set();
  for (const name of Object.keys(golden.configs)) {
    const selection = selectionFor(name);
    const actual = inventory(materialize(projectAll(loadCorpus(selection), selection)));
    const expected = goldenInventory(name);
    for (const rel of new Set([...Object.keys(actual.flat), ...Object.keys(expected.flat)])) {
      if (actual.flat[rel] !== expected.flat[rel]) occurred.add(`${name}\0${rel}`);
    }
    for (const prefix of new Set([...Object.keys(actual.trees), ...Object.keys(expected.trees)])) {
      if (JSON.stringify(actual.trees[prefix]) !== JSON.stringify(expected.trees[prefix])) occurred.add(`${name}\0${prefix}`);
    }
  }
  for (const entry of intended.differences) {
    assert.ok(entry.reason && entry.reason.length > 20, `${entry.path}: a written reason is required`);
    const hit = [...occurred].some((key) => {
      const [name, rel] = key.split('\0');
      return rel === entry.path && (entry.configs === '*' || entry.configs.includes(name));
    });
    assert.ok(hit, `${entry.path}: listed as an intended difference but projection matches v5 (remove the stale exemption)`);
  }
});

test('shipped projectors are pure: no I/O or network modules are even loadable by them', () => {
  const dir = path.join(root, 'rig/corpus/projections');
  const forbidden = /require\((['"])(?:node:)?(?:fs|child_process|net|http|https|http2|dns|dgram|tls|worker_threads|vm|os)\1\)|\bprocess\.(?:env|spawn|exit)|\bfetch\(|\bglobalThis\.fetch|\bDate\.now|\bMath\.random/;
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.js'))) {
    assert.doesNotMatch(fs.readFileSync(path.join(dir, file), 'utf8'), forbidden, `${file} must stay pure`);
  }
});

test('project() never touches the file system once the corpus snapshot is loaded', () => {
  const { loadCorpus, projectAll } = load();
  const selection = { delivery: 'default', hosts: ALL };
  const corpus = loadCorpus(selection);
  projectAll(corpus, selection); // warm the lazily required projector modules
  const traps = ['readFileSync', 'writeFileSync', 'existsSync', 'statSync', 'lstatSync', 'readdirSync', 'mkdirSync', 'openSync'];
  const originals = traps.map((name) => [name, fs[name]]);
  for (const name of traps) fs[name] = () => { throw new Error(`project() used fs.${name}`); };
  try {
    const first = projectAll(corpus, selection);
    const second = projectAll(corpus, selection);
    assert.deepEqual(first.map((entry) => entry.path), second.map((entry) => entry.path));
  } finally {
    for (const [name, original] of originals) fs[name] = original;
  }
});

test('hosts without a projector project nothing of their own and never throw', () => {
  const { loadCorpus, project } = Object.assign(load(), { project: require('../rig/lib/project').project });
  const corpus = loadCorpus({ delivery: 'default', hosts: ['opencode'] });
  assert.deepEqual(project(corpus, 'opencode', { delivery: 'default', hosts: ['opencode'] }), []);
});

test('this repository\'s generated twins reproduce from the corpus (project-repo --check)', () => {
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/project-repo.js'), '--check'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});
