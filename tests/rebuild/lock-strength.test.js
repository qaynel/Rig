'use strict';

const test = require('node:test');
const { assert, fs, path, tempDir, write, run, product } = require('./_harness');

test('RB-LOCK-1 an installed repository refuses edits to a locked test and names the path', () => {
  const repo = tempDir('rig-locked-tests-');
  const result = run('node', ['.rig/bin/guard.js', '--write', 'tests/rebuild/oracle.test.js'], { cwd: repo });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr + result.stdout, /tests\/rebuild\/oracle\.test\.js/);
});

test('RB-LOCK-2 mutation score below 70 percent blocks locking', () => {
  const strength = product('rig/catalog/baseline/strength.js');
  const repo = tempDir('rig-strength-mutants-');
  write(repo, 'package.json', '{"devDependencies":{"@stryker-mutator/core":"9.0.0"}}');
  write(repo, 'stryker.conf.json', '{"mutate":["src/**/*.js"]}');
  write(repo, 'src/subject.js', 'module.exports = value => value > 0;');
  const result = strength.measure({ repo, changedFiles: ['src/subject.js'], language: 'javascript' });
  assert.equal(result.score, 0.6);
  assert.equal(result.ok, false);
});

test('RB-LOCK-3 missing mutation tooling is a named gap and fails closed', () => {
  const strength = product('rig/catalog/baseline/strength.js');
  const result = strength.measure({ repo: tempDir('rig-strength-gap-'), changedFiles: ['src/Main.java'], language: 'java' });
  assert.equal(result.ok, false);
  assert.equal(result.tool, null);
  assert.match(result.gap, /no mutation tool/i);
});

test('RB-LOCK-4 passwordless sudo is detected but never counts as user approval', () => {
  const { assessPlatform } = product('rig/catalog/baseline/user-signoff.js');
  const bin = tempDir('rig-sudo-stub-');
  write(bin, 'sudo', '#!/bin/sh\nexit 0\n');
  fs.chmodSync(path.join(bin, 'sudo'), 0o755);
  const result = assessPlatform({ env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
  const sudo = result.find((item) => item.kind === 'sudo');
  assert.equal(sudo.passwordless, true);
  assert.equal(sudo.counts_as_approval, false);
});

test('RB-LOCK-5 sudo probe is non-interactive when a password is required', () => {
  const { assessPlatform } = product('rig/catalog/baseline/user-signoff.js');
  const bin = tempDir('rig-sudo-required-');
  const marker = path.join(bin, 'stdin-read');
  write(bin, 'sudo', `#!/bin/sh\n[ -t 0 ] && touch '${marker}'\necho 'a password is required' >&2\nexit 1\n`);
  fs.chmodSync(path.join(bin, 'sudo'), 0o755);
  const result = assessPlatform({ env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
  const sudo = result.find((item) => item.kind === 'sudo');
  assert.equal(sudo.passwordless, false);
  assert.equal(fs.existsSync(marker), false);
});
