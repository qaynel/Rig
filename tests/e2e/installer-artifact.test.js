'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const root = path.resolve(__dirname, '../..');
function treeDigest(dir) {
  const files = {};
  function walk(current, prefix = '') {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const file = path.join(current, entry.name);
      const stat = fs.lstatSync(file);
      if (entry.isDirectory()) walk(file, rel);
      else files[rel] = { type: entry.isSymbolicLink() ? 'symlink' : 'file', mode: stat.mode & 0o777,
        digest: crypto.createHash('sha256').update(entry.isSymbolicLink() ? fs.readlinkSync(file) : fs.readFileSync(file)).digest('hex') };
    }
  }
  walk(dir);
  return crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))))).digest('hex');
}
test('public installer rejects a candidate with mismatched bytes before extraction', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-artifact-'));
  try {
    const artifact = path.join(dir, 'candidate.tar.gz');
    fs.writeFileSync(artifact, 'untrusted bytes');
    const result = spawnSync('sh', [path.join(root, 'install.sh'), '--candidate-artifact', artifact, '--candidate-sha', 'a'.repeat(40), '--candidate-digest', '0'.repeat(64), '--target', dir], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /candidate archive digest mismatch/);
    assert.equal(fs.existsSync(path.join(dir, '.rig')), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('public installer verifies downloaded exact-SHA candidate bytes before extraction', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-url-'));
  try {
    const archive = path.join(dir, 'candidate.tar.gz');
    const bin = path.join(dir, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(archive, 'unexpected remote bytes');
    fs.writeFileSync(path.join(bin, 'curl'), [
      '#!/bin/sh',
      'while [ "$#" -gt 0 ]; do',
      '  if [ "$1" = "-o" ]; then cp "$RIG_TEST_ARCHIVE" "$2"; exit 0; fi',
      '  shift',
      'done',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });
    const env = { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, RIG_TEST_ARCHIVE: archive };
    const result = spawnSync('sh', [
      path.join(root, 'install.sh'), '--candidate-url', `https://github.com/qaynel/Rig/archive/${'a'.repeat(40)}.tar.gz`,
      '--candidate-sha', 'a'.repeat(40), '--candidate-digest', '0'.repeat(64), '--candidate-tree-digest', '0'.repeat(64), '--target', dir,
    ], { encoding: 'utf8', env });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /candidate archive digest mismatch/);
    assert.equal(fs.existsSync(path.join(dir, '.rig')), false);

    const source = path.join(dir, 'valid-root');
    fs.mkdirSync(path.join(source, 'rig'), { recursive: true });
    fs.writeFileSync(path.join(source, 'rig/bootstrap.sh'), [
      '#!/bin/sh',
      'target=',
      'while [ "$#" -gt 0 ]; do if [ "$1" = "--target" ]; then target=$2; shift 2; else shift; fi; done',
      'mkdir -p "$target"',
      'printf invoked > "$target/bootstrap-invoked"',
      '',
    ].join('\n'), { mode: 0o755 });
    const matchingArchive = path.join(dir, 'matching.tar.gz');
    const packed = spawnSync('tar', ['-czf', matchingArchive, '-C', dir, 'valid-root'], { encoding: 'utf8' });
    assert.equal(packed.status, 0, packed.stderr);
    const expectedDigest = crypto.createHash('sha256').update(fs.readFileSync(matchingArchive)).digest('hex');
    const expectedTreeDigest = treeDigest(source);
    const matchingTarget = path.join(dir, 'matching-target');
    const matchingEnv = { ...env, RIG_TEST_ARCHIVE: matchingArchive };
    const wrongTree = spawnSync('sh', [
      path.join(root, 'install.sh'), '--candidate-url', `https://github.com/qaynel/Rig/archive/${'a'.repeat(40)}.tar.gz`,
      '--candidate-sha', 'a'.repeat(40), '--candidate-digest', expectedDigest, '--candidate-tree-digest', '0'.repeat(64), '--target', matchingTarget,
    ], { encoding: 'utf8', env: matchingEnv });
    assert.notEqual(wrongTree.status, 0);
    assert.match(wrongTree.stderr, /candidate extracted-tree digest mismatch/);
    assert.equal(fs.existsSync(path.join(matchingTarget, 'bootstrap-invoked')), false);
    const installed = spawnSync('sh', [
      path.join(root, 'install.sh'), '--candidate-url', `https://github.com/qaynel/Rig/archive/${'a'.repeat(40)}.tar.gz`,
      '--candidate-sha', 'a'.repeat(40), '--candidate-digest', expectedDigest, '--candidate-tree-digest', expectedTreeDigest, '--target', matchingTarget,
    ], { encoding: 'utf8', env: matchingEnv });
    assert.equal(installed.status, 0, installed.stderr || installed.stdout);
    assert.match(installed.stdout, new RegExp(`archive-sha256=${expectedDigest}`));
    assert.equal(fs.readFileSync(path.join(matchingTarget, 'bootstrap-invoked'), 'utf8'), 'invoked');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
