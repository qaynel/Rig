'use strict';

require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { execFileSync, spawnSync } = require('node:child_process');
const h = require('./helpers/advanced-signed');
const { approved } = require('./helpers/task-approval');

const SERVICE_ID = 'development.code-quality.lint-format';
const root = path.resolve(__dirname, '..');

function fixture(target, { grade = 'minimal', network = 'none', formatCommand, lintCommand } = {}) {
  h.initGitRepo(target);
  h.seedExistingAgentsRouter(target);
  fs.writeFileSync(path.join(target, 'index.js'), 'module.exports = 1;\n');
  fs.mkdirSync(path.join(target, 'tools'), { recursive: true });
  fs.writeFileSync(path.join(target, 'tools', 'command.js'), "process.stdout.write('ok');\n");
  const format = formatCommand || {
    argv: [process.execPath, 'tools/command.js'],
    source: 'tools/command.js',
    network,
  };
  const selection = {
    schema_version: 1,
    scope: 'repo',
    excluded: [],
    components: [{
      id: '.', root: '.', include: ['index.js'], evidence_paths: ['index.js'],
      format_check: format,
      ...(lintCommand ? { lint: lintCommand } : {}),
    }],
  };
  h.writeJson(path.join(target, 'rig-lint-format.json'), selection);
  execFileSync('git', ['add', '.'], { cwd: target, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'fixture'], { cwd: target, stdio: 'pipe' });

  h.writeSelection(target, { [SERVICE_ID]: grade });
  const { reviewPath } = h.allowedReview(target);
  const planned = h.plan(target, { review: reviewPath });
  assert.equal(planned.status, 0, planned.stderr);
  const applied = h.apply(target, { review: reviewPath, plan: planned.outPath });
  assert.equal(applied.status, 0, applied.stderr);
  return h.readJson(path.join(target, '.rig', 'service-bindings.json'))[SERVICE_ID];
}

function saveTaskApproval(target, binding) {
  const inputs = require('../rig/lib/lint-grade').installedGradeInputs({ target, binding, scope: 'repo' });
  assert.equal(inputs.gap, undefined, inputs.gap?.reason);
  assert.ok(inputs.commands.length);
  const signed = approved(target, inputs.commands, binding.grade === 'maximal' ? 2 : 1);
  h.writeJson(path.join(target, '.rig/lint-format/execution-plan.json'), signed.plan);
  h.writeJson(path.join(target, '.rig/lint-format/execution-approval.json'), signed.approval);
  return inputs.commands;
}

function installedRun(target, env = {}) {
  const runnerPath = path.join(target, '.rig/lib/check-runner.js');
  const code = `const r=require(${JSON.stringify(runnerPath)});const b=JSON.parse(require('fs').readFileSync(${JSON.stringify(path.join(target, '.rig/service-bindings.json'))}));process.stdout.write(JSON.stringify(r.runBinding(${JSON.stringify(SERVICE_ID)},b[${JSON.stringify(SERVICE_ID)}],'repo',${JSON.stringify(target)})));`;
  const result = spawnSync(process.execPath, ['-e', code], {
    cwd: target, encoding: 'utf8', timeout: 20000,
    env: { ...process.env, ...env },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function withTarget(t) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-installed-boundary-'));
  t.after(() => fs.rmSync(target, { recursive: true, force: true }));
  return target;
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

test('apply-generated component bindings deny omitted and explicit network access', async (t) => {
  const target = withTarget(t);
  const server = net.createServer();
  t.after(() => server.close());
  const port = await listen(server);
  let connections = 0;
  server.on('connection', socket => { connections += 1; socket.on('error', () => {}); socket.end('ok'); });
  const probe = "const net=require('node:net');const s=net.connect(Number(process.argv[1]),'127.0.0.1');s.setTimeout(300);s.on('connect',()=>s.end());s.on('error',()=>{});s.on('timeout',()=>s.destroy());";
  const binding = fixture(target, {
    formatCommand: { argv: [process.execPath, '-e', probe, String(port)], source: 'index.js', network: 'none' },
  });
  const file = path.join(target, '.rig/service-bindings.json');

  // Exercise the public apply product's generated command with an explicit deny.
  saveTaskApproval(target, binding);
  const denied = installedRun(target);
  assert.equal(denied.status, 0, JSON.stringify(denied));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(connections, 0, 'explicit network:none must not reach the local listener');

  // Exercise omission on the same real generated binding after apply.
  delete binding.components[0].format_check.network;
  const bindings = h.readJson(file);
  bindings[SERVICE_ID] = binding;
  h.writeJson(file, bindings);
  saveTaskApproval(target, binding);
  const omitted = installedRun(target);
  assert.equal(omitted.status, 0, JSON.stringify(omitted));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(connections, 0, 'an omitted component network declaration must deny outbound access');
});

test('apply-generated component network grant needs an exact Gate 1 signed plan', async (t) => {
  const target = withTarget(t);
  const server = net.createServer();
  t.after(() => server.close());
  const port = await listen(server);
  let connections = 0;
  server.on('connection', socket => { connections += 1; socket.on('error', () => {}); socket.end('ok'); });
  const probe = "const net=require('node:net');const s=net.connect(Number(process.argv[1]),'127.0.0.1');s.setTimeout(1000);s.on('connect',()=>s.end());s.on('error',()=>{});s.on('timeout',()=>s.destroy());";
  const binding = fixture(target, {
    formatCommand: { argv: [process.execPath, '-e', probe, String(port)], source: 'index.js', network: 'required' },
  });
  assert.equal(binding.components[0].format_check.network, 'required');
  h.writeJson(path.join(target, '.rig/execution-policy.json'), {
    schema_version: 1,
    grants: { [SERVICE_ID]: { network: 'required' } },
  });
  execFileSync('git', ['-c', 'core.hooksPath=/dev/null', 'add', '.rig/execution-policy.json'], { cwd: target, stdio: 'pipe' });
  execFileSync('git', ['-c', 'core.hooksPath=/dev/null', 'commit', '-m', 'grant task network limits'], { cwd: target, stdio: 'pipe' });

  const inputs = require('../rig/lib/lint-grade').installedGradeInputs({ target, binding, scope: 'repo' });
  assert.equal(inputs.gap, undefined, inputs.gap?.reason);
  const unsigned = installedRun(target);
  assert.equal(unsigned.kind, 'not_authorized', JSON.stringify(unsigned));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(connections, 0, 'network grant metadata without a signed execution plan cannot launch');

  saveTaskApproval(target, binding);
  const granted = installedRun(target);
  assert.equal(granted.status, 0, JSON.stringify(granted));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(connections, 1, 'the exact signed component command should connect to the real listener');
  assert.equal(installedRun(target).kind, 'not_authorized', 'the installed plan is single-use');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(connections, 1);
});

test('installed CI stops after a timed-out mutating check and retains before/after evidence', (t) => {
  const target = withTarget(t);
  const mutate = "const fs=require('node:fs');fs.writeFileSync('index.js','changed\\n');setInterval(()=>{},1000);";
  const second = "require('node:fs').writeFileSync('second-ran','yes');";
  const binding = fixture(target, {
    grade: 'maximal',
    formatCommand: { argv: [process.execPath, '-e', mutate], source: 'tools/command.js', network: 'none', timeout_ms: 500 },
    lintCommand: { argv: [process.execPath, '-e', second], source: 'tools/command.js', network: 'none' },
  });
  saveTaskApproval(target, binding);
  const result = installedRun(target, { CI: 'true' });
  assert.equal(result.status, 1, JSON.stringify(result));
  assert.equal(result.kind, 'timeout', 'mutation detection must preserve the abnormal timeout status');
  assert.ok(result.changed_paths.includes('index.js'));
  assert.ok(result.changes.find(change => change.path === 'index.js' && change.before && change.after));
  assert.equal(fs.readFileSync(path.join(target, 'index.js'), 'utf8'), 'changed\n');
  assert.equal(fs.existsSync(path.join(target, 'second-ran')), false, 'CI must stop before the next planned command');
});
