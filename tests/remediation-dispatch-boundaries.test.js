'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawn } = require('node:child_process');
const h = require('./helpers/advanced');
const lint = require('../rig/lib/lint-format');
const consent = require('../rig/lib/task-consent');
const { runBinding } = require('../rig/lib/check-runner');
const { approved } = require('./helpers/task-approval');

test('bare read-only binding reports mutation inside a source directory named build', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, 'build'));
  fs.writeFileSync(path.join(target, 'build/source'), 'before');
  const result = runBinding('fixture', { read_only: true, repo: [process.execPath, '-e', "require('fs').writeFileSync('build/source','after')"] }, 'repo', target);
  assert.equal(result.kind, 'mutated');
  assert.ok(result.changes.find(row => row.path === 'build/source' && row.before && row.after));
}));

test('abnormal read-only termination keeps its status and changed-file evidence', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, 'dist'));
  fs.writeFileSync(path.join(target, 'dist/source'), 'before');
  const commands = [{ argv: [process.execPath, '-e', "require('fs').writeFileSync('dist/source','after');setInterval(()=>{},1000)"], cwd: '.', timeout_ms: 400 }];
  const result = lint.runReadOnly(target, commands, approved(target, commands));
  assert.equal(result.status, 'timeout');
  assert.ok(result.changed_paths.includes('dist/source'));
  assert.ok(result.changes.find(row => row.path === 'dist/source' && row.before && row.after));
}));

test('replacing the resolved external executable invalidates the signed plan', () => h.withRepo(target => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-executable-'));
  try {
    const executable = path.join(dir, 'checker');
    fs.writeFileSync(executable, '#!/bin/sh\nexit 0\n', { mode: 0o700 });
    const commands = [{ argv: [executable], cwd: '.' }];
    const auth = approved(target, commands);
    fs.writeFileSync(executable, '#!/bin/sh\necho replaced\n');
    assert.equal(lint.executePlan(auth.plan, auth.approval).status, 'command_drift');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}));

test('task permit derives cancellation and resource limits from the signed command', () => h.withRepo(target => {
  const commands = [{ argv: [process.execPath, '-e', "require('fs').writeFileSync('launched','bad')"], cwd: '.', cancelled: true, timeout_ms: 30, memory_limit_mb: 128, max_output_bytes: 64 }];
  const auth = approved(target, commands);
  const permit = consent.authorizeCommands(target, commands, auth).permit;
  const result = lint.runCommand(commands[0].argv, { target, cwd: target, permit, cancelled: false, timeoutMs: 10000, memoryLimitMb: 4096, maxOutputBytes: 999999 });
  assert.equal(result.status, 'cancelled');
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
}));

test('committed execution policy alone cannot grant generic network access', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/execution-policy.json'), JSON.stringify({ schema_version: 1, grants: { fixture: { network: 'required' } } }));
  execFileSync('git', ['add', '.rig/execution-policy.json'], { cwd: target });
  execFileSync('git', ['commit', '-qm', 'execution policy'], { cwd: target });
  const result = runBinding('fixture', { network: 'required', repo: [process.execPath, '-e', "require('fs').writeFileSync('launched','bad')"] }, 'repo', target);
  assert.equal(result.kind, 'not_authorized');
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
}));

test('generic network dispatch requires both its committed limits and an exact signed one-use plan', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/execution-policy.json'), JSON.stringify({ schema_version: 1, grants: { fixture: { network: 'required' } } }));
  execFileSync('git', ['add', '.rig/execution-policy.json'], { cwd: target });
  execFileSync('git', ['commit', '-qm', 'execution policy'], { cwd: target });
  const argv = [process.execPath, '-e', "require('fs').writeFileSync('network-dispatched','once')"];
  const commands = [{ service_id: 'fixture', argv, cwd: '.', network: 'required', timeout_ms: 600000, memory_limit_mb: 2048 }];
  const auth = approved(target, commands);
  const binding = { repo: argv, network: 'required', execution_plan: auth.plan, execution_approval: auth.approval };
  const invalid = runBinding('fixture', { ...binding, timeout_ms: -1 }, 'repo', target);
  assert.equal(invalid.kind, 'capability_invalid');
  const first = runBinding('fixture', binding, 'repo', target);
  assert.equal(first.status, 0, first.reason);
  assert.equal(fs.readFileSync(path.join(target, 'network-dispatched'), 'utf8'), 'once');
  assert.equal(runBinding('fixture', binding, 'repo', target).kind, 'not_authorized');
}));

test('real concurrent dispatch has one winner and survives process restart and .rig deletion', async t => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-dispatch-race-'));
  t.after(() => fs.rmSync(target, { recursive: true, force: true }));
  h.initGitRepo(target);
  const commands = [{ argv: [process.execPath, '-e', "require('fs').appendFileSync('dispatches','once\\n')"], cwd: '.', role: 'autofix' }];
  const auth = approved(target, commands);
  const trust = fs.readFileSync(path.join(target, '.rig/trust/gate1.allowed-signers'));
  const modulePath = path.resolve(__dirname, '../rig/lib/lint-format');
  const child = () => new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, ['-e', `const lint=require(${JSON.stringify(modulePath)});const auth=${JSON.stringify(auth)};console.log(JSON.stringify(lint.executePlan(auth.plan,auth.approval)));`], { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '', errors = '';
    proc.stdout.on('data', data => { output += data; });
    proc.stderr.on('data', data => { errors += data; });
    proc.on('error', reject);
    proc.on('close', code => code ? reject(new Error(errors)) : resolve(JSON.parse(output)));
  });
  const results = await Promise.all([child(), child()]);
  assert.deepEqual(results.map(result => result.status).sort(), ['executed', 'not_authorized']);
  assert.equal(fs.readFileSync(path.join(target, 'dispatches'), 'utf8'), 'once\n');
  fs.rmSync(path.join(target, '.rig'), { recursive: true, force: true });
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/trust/gate1.allowed-signers'), trust);
  assert.equal((await child()).status, 'not_authorized');
  assert.equal(fs.readFileSync(path.join(target, 'dispatches'), 'utf8'), 'once\n');
});

test('caller overrides cannot widen signed timeout, dependencies, or output bound', () => h.withRepo(target => {
  const cases = [
    { argv: [process.execPath, '-e', 'setInterval(()=>{},1000)'], timeout_ms: 120, expected: 'timeout' },
    { argv: [process.execPath, '-e', "process.stdout.write('x'.repeat(100000))"], max_output_bytes: 64, expected: 'partial_output' },
    { argv: [process.execPath, '-e', "process.stdout.write('observed')"], dependencies: ['rig-nonexistent-signed-dependency'], expected: 'missing_dependency' },
  ];
  for (const { expected, ...entry } of cases) {
    const command = { ...entry, cwd: '.' };
    const auth = approved(target, [command]);
    const permit = consent.authorizeCommands(target, [command], auth).permit;
    const result = lint.runCommand(command.argv, { target, cwd: target, permit, timeoutMs: 10000, dependencies: [], maxOutputBytes: 1000000 });
    assert.equal(result.status, expected);
  }
}));

test('signed policy generation changes invalidate execution before dispatch', () => h.withRepo(target => {
  const policy = require('../rig/lib/policy');
  const { sign } = require('./helpers/task-approval');
  const commands = [{ argv: [process.execPath, '-e', "require('fs').writeFileSync('launched','bad')"], cwd: '.' }];
  const auth = approved(target, commands);
  const candidate = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../rig/catalog/baseline/network-policy.json')));
  const proposal = policy.proposePolicy(target, candidate, { explicit_request: true });
  const signed = sign(target, { plan_digest: proposal.digest }, 'rig-policy-activation', policy.activationMessage(proposal));
  policy.activatePolicy(target, proposal, { approval: { schema_version: 1, kind: 'policy-approval', proposal_digest: proposal.digest, approval: signed.approval } });
  assert.equal(lint.executePlan(auth.plan, auth.approval).status, 'command_drift');
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
}));

test('memory termination retains source mutations and before/after evidence', () => h.withRepo(target => {
  fs.mkdirSync(path.join(target, 'vendor'));
  fs.writeFileSync(path.join(target, 'vendor/source'), 'before');
  const commands = [{ argv: [process.execPath, '-e', "require('fs').writeFileSync('vendor/source','after');global.data=Buffer.alloc(512*1024*1024,7);setInterval(()=>{},1000)"], cwd: '.', timeout_ms: 5000, memory_limit_mb: 128 }];
  const result = lint.runReadOnly(target, commands, approved(target, commands));
  assert.equal(result.status, 'memory_exceeded');
  assert.ok(result.changed_paths.includes('vendor/source'));
  assert.ok(result.changes.find(row => row.path === 'vendor/source' && row.before && row.after));
}));

test('signed tasks refuse repositories without durable clone-local Git consent storage', () => h.withRepo(target => {
  const commands = [{ argv: [process.execPath, '-e', "require('fs').writeFileSync('launched','bad')"], cwd: '.' }];
  const auth = approved(target, commands);
  const result = lint.executePlan(auth.plan, auth.approval);
  assert.equal(result.status, 'coverage_gap');
  assert.match(result.reason, /Git.*durable|durable.*Git/);
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
}, { initGit: false }));

test('native Git resolution preserves consent storage when a task fixture narrows PATH', () => h.withRepo(target => {
  const { gitPath } = require('../rig/lib/path-safety');
  const previous = process.env.PATH;
  try {
    process.env.PATH = '';
    assert.ok(gitPath(target, 'rig/approvals'));
  } finally { process.env.PATH = previous; }
}));
