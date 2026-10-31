'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run, sha256, product } = require('./_harness');

test('RB-LOCK-1 an installed repository refuses edits to a locked test and names the path', () => {
  const repo = tempDir('rig-locked-tests-');
  run('git', ['init', '-q', repo]);
  const bootstrap = run('sh', [path.join(__dirname, '..', '..', 'rig/bootstrap.sh'), '--target', repo, '--hosts', 'codex'], { cwd: repo });
  assert.equal(bootstrap.status, 0, bootstrap.stderr || bootstrap.stdout);
  const testPath = 'tests/rebuild/oracle.test.js';
  const testFile = write(repo, testPath, "test('approved behavior', () => assert.equal(1, 1));\n");
  const approvedBytes = fs.readFileSync(testFile);
  write(repo, '.rig/oracle/manifest.json', JSON.stringify({ files: { [testPath]: sha256(approvedBytes) } }));
  const writeContextIndex = () => {
    const documents = [{ path: testPath, digest: sha256(fs.readFileSync(testFile)) }];
    write(repo, '.rig/context-index.json', JSON.stringify({ documents,
      review: { schema_version: 1, reviewer: { kind: 'host-agent', identity: 'lock-fixture-reviewer' }, status: 'pass', inputs: documents, relationships: [] },
    }));
  };
  writeContextIndex();
  run('git', ['add', testPath], { cwd: repo });
  run('git', ['add', '-f', '.rig/oracle/manifest.json', '.rig/context-index.json'], { cwd: repo });
  // A simulated agent edit changes the candidate. The installed protected-byte
  // boundary must reject the staged change and identify the exact locked path.
  const editedBytes = Buffer.from("test('approved behavior', () => assert.equal(1, 2));\n");
  fs.writeFileSync(testFile, editedBytes);
  writeContextIndex();
  run('git', ['add', testPath, '.rig/context-index.json'], { cwd: repo });
  const gate = run(process.execPath, [path.join(repo, '.rig/bin/check.js'), '--scope', 'diff', '--surface', 'git.pre_commit'], { cwd: repo });
  assert.notEqual(gate.status, 0, gate.stdout);
  assert.match(gate.stderr + gate.stdout, /oracle\.test\.js/);
  assert.deepEqual(fs.readFileSync(testFile), editedBytes);
  assert.notDeepEqual(fs.readFileSync(testFile), approvedBytes);
});

test('RB-LOCK-2 mutation score below 70 percent blocks locking', () => {
  const preflight = product('rig/catalog/baseline/preflight.js');
  const repo = tempDir('rig-strength-mutants-');
  write(repo, 'package.json', '{"devDependencies":{"@stryker-mutator/core":"9.0.0"}}');
  write(repo, 'stryker.conf.json', '{"mutate":["src/**/*.js"]}');
  write(repo, 'src/subject.js', 'module.exports = value => value > 0;');
  const stryker = write(repo, 'node_modules/.bin/stryker', '#!/bin/sh\nprintf \'{"killed":6,"total":10}\n\'\n');
  fs.chmodSync(stryker, 0o755);
  const result = preflight.enter(repo, 'oracle_signed', { strength: { changedFiles: ['src/subject.js'], language: 'javascript' } });
  assert.equal(result.allowed, false);
  assert.ok(result.strength, 'refusal must report the measured mutation-strength outcome');
  assert.equal(result.strength.score, 0.6);
  assert.equal(result.strength.ok, false);
  assert.match(JSON.stringify(result), /mutation|strength|0\.6/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig/run.json')), false, 'a refused lock must not advance the repository phase');
});

test('RB-LOCK-3 missing mutation tooling is a named gap and fails closed', () => {
  const preflight = product('rig/catalog/baseline/preflight.js');
  const repo = tempDir('rig-strength-gap-');
  const options = { strength: { changedFiles: ['src/Main.java'], language: 'java' } };
  const refused = preflight.enter(repo, 'oracle_signed', options);
  assert.equal(refused.allowed, false);
  assert.ok(refused.strength, 'refusal must report why mutation tooling is unavailable');
  assert.equal(refused.strength.ok, false);
  assert.equal(refused.strength.tool, null);
  assert.match(refused.strength.gap, /no mutation tool/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig/strength-gaps.json')), false);
  const accepted = preflight.enter(repo, 'oracle_signed', { ...options, acceptGap: true });
  const records = JSON.parse(fs.readFileSync(path.join(repo, '.rig/strength-gaps.json'), 'utf8'));
  assert.ok(records.some((row) => row.gap === refused.strength.gap && row.language === 'java'));
});

test('RB-LOCK-4 passwordless sudo is detected but never counts as user approval', () => {
  const { assessPlatform } = product('rig/catalog/baseline/user-signoff.js');
  const bin = tempDir('rig-sudo-stub-');
  write(bin, 'sudo', '#!/bin/sh\nexit 0\n');
  fs.chmodSync(path.join(bin, 'sudo'), 0o755);
  const previous = process.env.PATH;
  process.env.PATH = `${bin}:${previous}`;
  let result;
  try { result = assessPlatform(); } finally { process.env.PATH = previous; }
  const sudo = result.mechanisms.find((item) => item.id === 'sudo-or-password-prompt');
  assert.equal(sudo.passwordless, true);
  assert.equal(sudo.counts_as_approval, false);
});

test('RB-LOCK-5 sudo probe is non-interactive when a password is required', () => {
  const { assessPlatform } = product('rig/catalog/baseline/user-signoff.js');
  const bin = tempDir('rig-sudo-required-');
  const argsLog = path.join(bin, 'args.jsonl');
  const stdinLog = path.join(bin, 'stdin.jsonl');
  write(bin, 'sudo', `#!/usr/bin/env node\nconst fs=require('node:fs');\nfs.appendFileSync(${JSON.stringify(argsLog)},JSON.stringify(process.argv.slice(2))+'\\n');\nlet input='';process.stdin.on('data',chunk=>input+=chunk);\nsetTimeout(()=>{fs.appendFileSync(${JSON.stringify(stdinLog)},JSON.stringify({isTTY:!!process.stdin.isTTY,bytes:Buffer.byteLength(input)})+'\\n');process.stderr.write('a password is required\\n');process.exit(1)},100);\n`);
  fs.chmodSync(path.join(bin, 'sudo'), 0o755);
  const previous = process.env.PATH;
  process.env.PATH = `${bin}:${previous}`;
  let result;
  try { result = assessPlatform(); } finally { process.env.PATH = previous; }
  const sudo = result.mechanisms.find((item) => item.id === 'sudo-or-password-prompt');
  assert.ok(sudo, 'platform assessment must report the sudo mechanism');
  assert.equal(typeof sudo.passwordless, 'boolean', 'platform assessment must report the non-interactive probe result');
  assert.equal(sudo.passwordless, false);
  const invocations = fs.readFileSync(argsLog, 'utf8').trim().split(/\r?\n/).map((row) => JSON.parse(row));
  assert.ok(invocations.length > 0, 'platform check did not invoke the sudo probe');
  for (const args of invocations) assert.deepEqual(args, ['-n', 'true'], 'sudo must use the explicit non-interactive probe');
  const stdin = fs.readFileSync(stdinLog, 'utf8').trim().split(/\r?\n/).map((row) => JSON.parse(row));
  assert.equal(stdin.length, invocations.length);
  for (const state of stdin) {
    assert.equal(state.isTTY, false, 'sudo probe stdin must never be a terminal');
    assert.equal(state.bytes, 0, 'sudo probe must not send credentials or other stdin data');
  }
});
