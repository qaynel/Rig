'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { runReadOnly: production_runReadOnly } = require('../rig/lib/lint-format');
const { runReadOnly } = require('./helpers/approved-lint');
const { runConfiguredArgv } = require('../rig/lib/check-runner');
const { commandFor } = require('../rig/lib/sandbox');

test('Linux task mount plan starts empty and exposes only runtime paths plus task outputs', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-bwrap-plan-'));
  try {
    const spec = commandFor('bwrap', {
      outDir: target,
      outDirs: [target],
      readDirs: [path.dirname(process.execPath)],
      home: os.homedir(),
      cwd: target,
      argv: [process.execPath, '-e', ''],
    });
    const rootBind = spec.args.findIndex((value, index) => value === '--ro-bind'
      && spec.args[index + 1] === '/' && spec.args[index + 2] === '/');
    assert.equal(rootBind, -1, 'the host root is never mounted into an untrusted task');
    assert.ok(spec.args.includes('--unshare-user'));
    assert.ok(spec.args.includes('--unshare-net'));
    assert.equal(spec.args.includes('--unshare-all'), false, 'hosted runners may not expose optional namespaces');
    assert.ok(spec.args.includes('--tmpfs') && spec.args[spec.args.indexOf('--tmpfs') + 1] === '/');
    assert.ok(spec.args.some((value, index) => value === '--bind'
      && spec.args[index + 1] === target && spec.args[index + 2] === target));
    assert.ok(!spec.args.some((value, index) => value === '--ro-bind'
      && spec.args[index + 1] === os.homedir() && spec.args[index + 2] === os.homedir()));
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('lint tasks cannot read home credentials or write outside the repository, including from children', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-task-sandbox-repo-'));
  require('node:child_process').execFileSync('git', ['init', '-q'], { cwd: target });
  const home = fs.mkdtempSync(path.join(os.homedir(), '.rig-task-sandbox-home-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-task-sandbox-outside-'));
  const secret = path.join(home, 'credential-sentinel');
  const outsideSecret = path.join(outside, 'read-sentinel');
  const outsideWrite = path.join(outside, 'write-sentinel');
  fs.writeFileSync(secret, 'harmless sentinel');
  fs.writeFileSync(outsideSecret, 'harmless outside sentinel');
  fs.symlinkSync(home, path.join(target, 'home-link'));
  process.env.RIG_TASK_SANDBOX_SENTINEL = 'must-not-reach-child';
  try {
    const attempts = [
      [process.execPath, '-e', `try { require('fs').readFileSync(${JSON.stringify(secret)}); process.exit(9); } catch {}`],
      [process.execPath, '-e', `try { require('fs').readFileSync(${JSON.stringify(outsideSecret)}); process.exit(9); } catch {}`],
      [process.execPath, '-e', `try { require('fs').writeFileSync(${JSON.stringify(outsideWrite)}, 'x'); process.exit(9); } catch {}`],
      [process.execPath, '-e', `try { require('fs').readFileSync(${JSON.stringify(path.join(target, 'home-link', 'credential-sentinel'))}); process.exit(9); } catch {}`],
      [process.execPath, '-e', `require('node:child_process').execFileSync(${JSON.stringify(process.execPath)}, ['-e', ${JSON.stringify(`try { require('fs').readFileSync(${JSON.stringify(secret)}); process.exit(9); } catch {}`)}])`],
      [process.execPath, '-e', "if (process.env.RIG_TASK_SANDBOX_SENTINEL) process.exit(9)"],
    ];
    for (const argv of attempts) {
      const result = runReadOnly(target, [{ argv, cwd: '.' }]);
      assert.equal(result.status, 'clean', JSON.stringify(result));
    }
    const args = ['-e', `try { require('fs').readFileSync(${JSON.stringify(outsideSecret)}); process.exit(9); } catch {}`];
    const command = { argv: [process.execPath, ...args], cwd: '.', network: 'none', timeout_ms: 5000, memory_limit_mb: 256 };
    const auth = require('./helpers/task-approval').approved(target, [command]);
    const permitted = require('../rig/lib/task-consent').authorizeCommands(target, [command], auth);
    const installed = runConfiguredArgv(
      'development.code-quality.lint-format', target, process.execPath, args,
      target, { timeout_ms: 5000, memory_limit_mb: 256, network: 'none', execution_permit: permitted.permit },
    );
    assert.equal(installed.status, 0, JSON.stringify(installed));
    assert.equal(fs.existsSync(outsideWrite), false);
    const allowed = runReadOnly(target, [{ argv: [process.execPath, '-e', "process.stdout.write('inside')"], cwd: '.' }]);
    assert.equal(allowed.status, 'clean');
  } finally {
    delete process.env.RIG_TASK_SANDBOX_SENTINEL;
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('task reads deny unrelated shared directories and siblings of an external executable', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-shared-read-repo-'));
  require('node:child_process').execFileSync('git', ['init', '-q'], { cwd: target });
  const outside = fs.mkdtempSync(path.join('/var/tmp', 'rig-shared-read-outside-'));
  const sentinel = path.join(outside, 'sentinel');
  const tool = path.join(outside, 'tool');
  fs.writeFileSync(sentinel, 'harmless outside fixture');
  fs.writeFileSync(tool, `#!/bin/sh\nif cat '${sentinel}' >/dev/null 2>&1; then exit 9; fi\nexit 0\n`, { mode: 0o755 });
  try {
    for (const argv of [
      [process.execPath, '-e', `try { require('node:fs').readFileSync(${JSON.stringify(sentinel)}); process.exit(9); } catch {}`],
      [tool],
    ]) {
      const result = runReadOnly(target, [{ argv, cwd: '.' }]);
      assert.equal(result.status, 'clean', JSON.stringify(result));
    }
    const protectedResult = runReadOnly(target, [{ argv: [process.execPath, '-e', "for(const file of ['.rig/trust/gate1.allowed-signers']) { try { require('fs').writeFileSync(file,'replaced'); process.exit(9); } catch {} }"], cwd: '.' }]);
    assert.equal(protectedResult.status, 'clean', JSON.stringify(protectedResult));
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});
