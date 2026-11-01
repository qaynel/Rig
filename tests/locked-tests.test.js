'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { checkLockedFiles } = require('../rig/catalog/baseline/check');

const git = (cwd, args) => spawnSync('git', args, { cwd, encoding: 'utf8' });

test('installed lock checker refuses staged oracle edits and preserves their bytes', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-locked-tests-'));
  fs.mkdirSync(path.join(repo, '.rig/oracle'), { recursive: true }); fs.mkdirSync(path.join(repo, 'tests/rebuild'), { recursive: true });
  const testFile = path.join(repo, 'tests/rebuild/oracle.test.js'); const original = 'assert.equal(1, 1);\n';
  fs.writeFileSync(testFile, original);
  fs.writeFileSync(path.join(repo, '.rig/oracle/manifest.json'), JSON.stringify({ files: { 'tests/rebuild/oracle.test.js': crypto.createHash('sha256').update(original).digest('hex') } }));
  assert.equal(git(repo, ['init', '-q']).status, 0);
  assert.equal(git(repo, ['add', '.']).status, 0);
  assert.equal(git(repo, ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-qm', 'lock']).status, 0);
  fs.writeFileSync(testFile, 'assert.equal(1, 2);\n');
  assert.equal(git(repo, ['add', 'tests/rebuild/oracle.test.js']).status, 0);
  const staged = git(repo, ['show', ':tests/rebuild/oracle.test.js']).stdout;
  assert.match(checkLockedFiles(repo).join('\n'), /tests\/rebuild\/oracle\.test\.js: locked test changed/);
  assert.equal(git(repo, ['show', ':tests/rebuild/oracle.test.js']).stdout, staged);
});

test('changing the lock manifest does not authorize changed test bytes', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-locked-manifest-'));
  fs.mkdirSync(path.join(repo, '.rig/oracle'), { recursive: true }); fs.mkdirSync(path.join(repo, 'tests'), { recursive: true });
  const testFile = path.join(repo, 'tests/oracle.test.js'); fs.writeFileSync(testFile, 'pass');
  const lock = path.join(repo, '.rig/oracle/manifest.json');
  fs.writeFileSync(lock, JSON.stringify({ files: { 'tests/oracle.test.js': crypto.createHash('sha256').update('pass').digest('hex') } }));
  assert.equal(git(repo, ['init', '-q']).status, 0);
  assert.equal(git(repo, ['add', '.']).status, 0);
  assert.equal(git(repo, ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig-test@example.invalid', 'commit', '-qm', 'lock']).status, 0);
  fs.writeFileSync(testFile, 'changed');
  fs.writeFileSync(lock, JSON.stringify({ files: { 'tests/oracle.test.js': crypto.createHash('sha256').update('changed').digest('hex') } }));
  assert.ok(checkLockedFiles(repo).some((error) => error.includes('.rig/oracle/manifest.json')));
});
