'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const h = require('./helpers/advanced');
const { runChecks } = require('../rig/lib/checks');
const { parseSignalResult, SIGNAL_SUPERVISOR_SOURCE } = require('../rig/lib/memory-guarded-exec');

test('signal envelope accepts known OS signals and rejects unknown or mismatched data', () => {
  const marker = '\0RIG_TASK_RESULT_V1:';
  const result = (signal, code = 143) => `${marker}${JSON.stringify({
    protocol: 1, code, signal, outputLimitExceeded: false, stdout: '', stderr: '',
  })}\0`;
  assert.equal(parseSignalResult(result('SIGTERM')).signal, 'SIGTERM');
  assert.equal(parseSignalResult(result('SIGMADEUP')), null);
  assert.equal(parseSignalResult(result('SIGTERM', 999)), null);
});

test('task supervisor distinguishes SIGTERM from exit 143 at the child wait boundary', () => {
  const run = script => spawnSync(process.execPath, [
    '-e', SIGNAL_SUPERVISOR_SOURCE, '--', '1024', process.execPath, '-e', script,
  ], { encoding: 'utf8' });
  const signalled = run('process.kill(process.pid, "SIGTERM")');
  const exited = run('process.exit(143)');
  const signalResult = parseSignalResult(signalled.stdout);
  const exitResult = parseSignalResult(exited.stdout);
  assert.equal(signalled.status, 143);
  assert.equal(signalResult.signal, 'SIGTERM');
  assert.equal(exitResult.code, 143);
  assert.equal(exitResult.signal, null);
});

test('output-limit capture tears down a descendant that keeps task pipes open', () => h.withRepo(target => {
  const { runCommand } = require('./helpers/approved-lint');
  const started = Date.now();
  const result = runCommand([process.execPath, '-e', [
    "require('node:child_process').spawn(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], { stdio: 'inherit' });",
    "process.stdout.write('too much output');",
  ].join(' ')], { cwd: target, memoryLimitMb: null, maxOutputBytes: 1, timeoutMs: 10000 });
  assert.equal(result.status, 'partial_output');
  assert.ok(Date.now() - started < 2000, 'output overflow waited for a descendant holding the pipes');
}));

test('sandbox keeps its private /dev usable to nested tools that open /dev/null for ignored stdin', () => h.withRepo(target => {
  const { runCommand } = require('./helpers/approved-lint');
  const result = runCommand([process.execPath, '-e', [
    "const fs = require('node:fs');",
    "const { spawnSync } = require('node:child_process');",
    "const fd = fs.openSync('/dev/null', 'r+'); fs.closeSync(fd);",
    "const child = spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' });",
    "process.exit(child.status === 0 ? 0 : 1);",
  ].join(' ')], { cwd: target, memoryLimitMb: null });
  assert.equal(result.status, 'completed');
  assert.equal(result.exit_code, 0);
}));

test('memory-guarded lint commands retain signal metadata and keep exit 143 ordinary', () => h.withRepo(target => {
  const { runCommand } = require('./helpers/approved-lint');
  const { classifyEnding } = require('../rig/lib/lint-format');
  const signalled = runCommand([process.execPath, '-e', 'process.kill(process.pid, "SIGTERM")'], { cwd: target, memoryLimitMb: 256 });
  const exited = runCommand([process.execPath, '-e', 'process.exit(143)'], { cwd: target, memoryLimitMb: 256 });
  assert.equal(classifyEnding(signalled).status, 'signalled');
  assert.equal(signalled.signal, 'SIGTERM');
  assert.equal(classifyEnding(exited).status, 'completed');
  assert.equal(exited.exit_code, 143);
  assert.equal(exited.signal, undefined);
}));

test('OS sandbox preserves task signals and distinguishes a matching numeric exit code in public reports', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  const signalService = 'fixture.self-signal';
  const exitService = 'fixture.exit-143';
  fs.writeFileSync(path.join(target, '.rig/service-bindings.json'), JSON.stringify({
    [signalService]: { repo: [process.execPath, '-e', 'process.kill(process.pid, "SIGTERM")'], network: 'none' },
    [exitService]: { repo: [process.execPath, '-e', 'process.exit(143)'], network: 'none' },
  }));

  const signalled = runChecks(target, { service: signalService, scope: 'repo' });
  assert.equal(signalled.status, 1);
  assert.equal(signalled.kind, 'signalled');
  assert.match(signalled.stderr, /SIGTERM/);
  const signalReport = fs.readdirSync(path.join(target, 'reports/rig'))
    .map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file))))
    .find(report => report.service_id === signalService);
  assert.equal(signalReport.status, 'signalled');
  assert.match(signalReport.reason, /SIGTERM/);

  const exited = runChecks(target, { service: exitService, scope: 'repo' });
  assert.equal(exited.status, 1);
  assert.equal(exited.kind, 'failed');
  assert.doesNotMatch(exited.stderr, /SIGTERM/);
  assert.match(exited.stderr, /non-zero exit/);
  const exitReport = fs.readdirSync(path.join(target, 'reports/rig'))
    .map(file => JSON.parse(fs.readFileSync(path.join(target, 'reports/rig', file))))
    .find(report => report.service_id === exitService);
  assert.equal(exitReport.status, 'failed');
  assert.match(exitReport.reason, /non-zero exit/);
}));
