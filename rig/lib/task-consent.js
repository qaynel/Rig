'use strict';
// One signature authority and one persistent consumption boundary for every
// repository lint task, whether invoked locally or by an installed runner.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath, gitPath } = require('./path-safety');
const { verifyTrustRootApproval } = require('./trust-root');
const permits = new WeakMap();
const executableHashes = new Map();
const digest = (value) => crypto.createHash('sha256').update(Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');

function activePolicy(target) {
  const active = require('./policy').loadActivePolicy(target);
  return { digest: active.digest, generation: active.generation };
}
function executableDefinition(command, cwd) {
  const candidates = command.includes(path.sep) ? [path.resolve(cwd, command)]
    : require('./sandbox').taskPath().split(path.delimiter).filter(Boolean).map(dir => path.resolve(cwd, dir, command));
  for (const file of candidates) {
    try {
      fs.accessSync(file, fs.constants.X_OK);
      const real = fs.realpathSync(file);
      const stat = fs.statSync(real);
      if (!stat.isFile()) continue;
      const identity = `${stat.dev}:${stat.ino}:${stat.ctimeMs}:${stat.mtimeMs}:${stat.size}:${stat.mode}`;
      let cached = executableHashes.get(real);
      if (cached?.identity !== identity) { cached = { identity, digest: digest(fs.readFileSync(real)) }; executableHashes.set(real, cached); }
      return ['executable', real, cached.digest, stat.mode & 0o7777];
    } catch {}
  }
  return ['executable', command, null];
}
function definitions(target, command) {
  target = fs.realpathSync(target);
  const cwd = !command.cwd || command.cwd === '.' ? fs.realpathSync(target) : containedPath(target, command.cwd);
  const files = new Set();
  if (command.source) files.add(command.source.split('#')[0]);
  for (const arg of command.argv || []) {
    if (typeof arg !== 'string' || arg.startsWith('-')) continue;
    const abs = path.resolve(cwd, arg);
    const relative = path.relative(target, abs);
    if (!relative.startsWith('..') && !path.isAbsolute(relative) && fs.existsSync(abs) && fs.statSync(abs).isFile()) files.add(relative);
  }
  // rig: bind the component's existing configuration files and their roster;
  // host-agent source declarations cover configuration outside that cwd.
  for (const name of fs.readdirSync(cwd)) {
    if (/(?:\.(?:jsonc?|toml|ya?ml|cfg|ini|config\.[cm]?js)|^Makefile$|^justfile$|^\.[\w-]+rc(?:\.[\w]+)?)$/i.test(name)) {
      const abs = containedPath(target, path.join(command.cwd || '.', name));
      if (fs.statSync(abs).isFile()) files.add(path.relative(target, abs));
    }
  }
  return [executableDefinition(command.argv[0], cwd), ...[...files].sort().map((file) => {
    const abs = containedPath(target, file);
    return [file, digest(fs.readFileSync(abs)), fs.statSync(abs).mode & 0o7777];
  })];
}
function planExecution(input) {
  const target = input.target ? fs.realpathSync(input.target) : input.target;
  const commands = (input.commands || []).map((cmd) => {
    if (!target || !Array.isArray(cmd.argv)) return { ...cmd };
    try { return { ...cmd, definition_snapshot: definitions(target, cmd) }; }
    catch { return { ...cmd, source_snapshot: null, source_boundary_violation: true }; }
  });
  const snapshot = { target, commands, selected: input.selected === true, policy: target ? activePolicy(target) : null };
  return { ...snapshot, plan_digest: digest(snapshot), authorized: false };
}
function planApprovalMessage(planDigest, approvalId) {
  return `rig-plan-approval\ndigest=${planDigest}\napproval_id=${approvalId}\n`;
}
function createPlanApprovalChallenge(plan) {
  if (!plan || !/^[a-f0-9]{64}$/.test(plan.plan_digest || '')) throw new Error('valid plan digest required');
  const approval_id = crypto.randomBytes(32).toString('hex');
  return { schema_version: 1, kind: 'plan-approval-challenge', plan_digest: plan.plan_digest, approval_id, message: planApprovalMessage(plan.plan_digest, approval_id) };
}
function authorizeExecution(plan, approval) {
  if (!plan?.target || !Array.isArray(plan.commands)) return { status: 'not_authorized', reason: 'a concrete signed execution plan is required' };
  const expected = digest({ target: plan.target, commands: plan.commands, selected: plan.selected === true, policy: plan.policy });
  if (expected !== plan.plan_digest) throw new Error('executePlan: plan digest mismatch');
  if (plan.selected && !plan.commands.length) return { status: 'coverage_gap', reason: 'approved plan contains no executable commands', executed_count: 0 };
  if (!approval || approval.schema_version !== 1 || approval.kind !== 'plan-approval' || approval.plan_digest !== plan.plan_digest || !/^[a-f0-9]{64}$/.test(approval.approval_id || '')) return { status: 'not_authorized', reason: 'matching signed execution approval required' };
  if (plan.commands.some(cmd => cmd.source_boundary_violation)) return { status: 'boundary_violation', reason: 'approved task input escapes the repository or is unavailable' };
  try { if (JSON.stringify(activePolicy(plan.target)) !== JSON.stringify(plan.policy)) return { status: 'command_drift', reason: 'active policy changed after task approval' }; }
  catch { return { status: 'command_drift', reason: 'active policy is unavailable or invalid' }; }
  const signed = approval.approval;
  if (signed?.method !== 'external-sshsig') throw new Error('executePlan: verified external SSHSIG approval required');
  verifyTrustRootApproval(plan.target, { identity: signed.identity, namespace: 'rig-plan-approval', message: planApprovalMessage(plan.plan_digest, approval.approval_id), signature: signed.signature });
  for (const cmd of plan.commands) {
    if (!Array.isArray(cmd.argv) || !cmd.argv.length || cmd.argv.some((part) => typeof part !== 'string' || part.includes('\0'))) return { status: 'coverage_gap', reason: 'malformed approved command' };
    for (const value of [cmd.timeout_ms ?? cmd.timeoutMs, cmd.memory_limit_mb ?? cmd.memoryLimitMb, cmd.max_output_bytes ?? cmd.maxOutputBytes]) {
      if (value != null && (!Number.isInteger(value) || value <= 0)) return { status: 'coverage_gap', reason: 'approved task resource limits must be positive integers' };
    }
    if ((cmd.network != null && ![true, false, 'none', 'required'].includes(cmd.network)) ||
        (cmd.cancelled != null && typeof cmd.cancelled !== 'boolean') ||
        (cmd.dependencies != null && (!Array.isArray(cmd.dependencies) || cmd.dependencies.some(item => typeof item !== 'string' || !item || item.includes('\0')))))
      return { status: 'coverage_gap', reason: 'malformed approved command capabilities or dependencies' };
    try {
      if (JSON.stringify(definitions(plan.target, cmd)) !== JSON.stringify(cmd.definition_snapshot)) return { status: 'command_drift', reason: 'approved task sources or configuration changed' };
    } catch { return { status: 'boundary_violation', reason: 'approved task input escapes the repository or is unavailable' }; }
  }
  const id = digest({ plan_digest: plan.plan_digest, approval_id: approval.approval_id });
  const gitDir = gitPath(plan.target, '');
  if (!gitDir) return { status: 'coverage_gap', reason: 'Git is required for durable clone-local single-use task consent; initialize this repository with git init before approving tasks', executed_count: 0 };
  const file = require('./enforcement').approvalStorage(plan.target, `task-${id}.consumed`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let fd;
  try {
    fd = fs.openSync(file, 'wx', 0o600);
    fs.writeFileSync(fd, `${JSON.stringify({ plan_digest: plan.plan_digest, approval_id: approval.approval_id })}\n`);
    fs.fsyncSync(fd);
  } catch (error) { if (error.code === 'EEXIST') return { status: 'not_authorized', reason: 'execution approval already consumed' }; throw error; }
  finally { if (fd !== undefined) fs.closeSync(fd); }
  require('./policy-transaction').syncDirectory(path.dirname(file));
  const permit = {};
  permits.set(permit, { target: fs.realpathSync(plan.target), commands: JSON.parse(JSON.stringify(plan.commands)), policy: plan.policy });
  return { status: 'authorized', permit };
}
function authorizeCommands(target, commands, options = {}) {
  let { plan, approval } = options;
  if (!plan && !approval) {
    try {
      plan = JSON.parse(fs.readFileSync(containedPath(target, '.rig/lint-format/execution-plan.json'), 'utf8'));
      approval = JSON.parse(fs.readFileSync(containedPath(target, '.rig/lint-format/execution-approval.json'), 'utf8'));
    } catch { return { status: 'not_authorized', reason: 'save the exact plan and Gate 1 signature to .rig/lint-format/execution-{plan,approval}.json before running repository tasks' }; }
  }
  // Compare actual dispatch with signed commands, including order and repeat.
  const planned = planExecution({ target, selected: true, commands });
  if (planned.plan_digest !== plan.plan_digest) return { status: 'command_drift', reason: 'actual dispatch differs from the signed plan' };
  return authorizeExecution(plan, approval);
}
function consumeTaskPermit(permit, target, argv, cwd, network, limits) {
  const grant = permit && permits.get(permit);
  if (!grant || grant.target !== fs.realpathSync(target)) return false;
  try { if (JSON.stringify(activePolicy(target)) !== JSON.stringify(grant.policy)) return false; } catch { return false; }
  const command = grant.commands[0];
  if (!command || JSON.stringify(command.argv) !== JSON.stringify(argv)) return false;
  const expectedCwd = !command.cwd || command.cwd === '.' ? grant.target : containedPath(target, command.cwd);
  if (fs.realpathSync(cwd) !== fs.realpathSync(expectedCwd) || (command.network === true || command.network === 'required') !== network) return false;
  try { if (JSON.stringify(definitions(target, command)) !== JSON.stringify(command.definition_snapshot)) return false; } catch { return false; }
  if (limits?.serviceId && command.service_id !== limits.serviceId) return false;
  if (limits && ((command.timeout_ms ?? command.timeoutMs ?? 600000) !== limits.timeoutMs ||
      (command.memory_limit_mb ?? command.memoryLimitMb ?? 2048) !== limits.memoryLimitMb)) return false;
  grant.commands.shift();
  return command;
}
module.exports = { planExecution, createPlanApprovalChallenge, authorizeExecution, authorizeCommands, consumeTaskPermit };
