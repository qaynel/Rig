// Canonical command-binding runner (RIG-144, GA-38).
//
// This is the single implementation of `runArgv`/`runBinding` for running a
// service's declared check commands against a target repository. Both the
// interactive `rig check` command (`rig/lib/checks.js`) and the installed
// CI/git-floor runner (`rig/catalog/baseline/check.js`, materialized
// byte-for-byte to `.rig/bin/check.js` by `apply.js`) require this module
// rather than each carrying their own copy of the containment and
// argv-execution logic.
//
// Why this file exists: `rig/lib/checks.js` and `rig/catalog/baseline/check.js`
// used to hand-duplicate this logic. A realpath-containment fix landed in one
// copy and missed the other (see
// wiki/reasoning/2026-08-29-rig120-symlink-escape-and-checks-realpath-containment.md).
// A drift test catches that class of gap after the fact; this file removes it
// structurally by making divergence impossible rather than merely detected.
'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');
const { spawnGuardedSync, executableAvailable, isolatedTaskEnv } = require('./spawn-guarded');
const { containedPath } = require('./path-safety');
const { scriptPath: memoryGuardScript } = require('./memory-guarded-exec');
const { redact } = require('./redaction');
const { taskCommandSpec } = require('./sandbox');

const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_MEMORY_LIMIT_MB = 2 * 1024;

// spawnSync-shaped results preserve the existing command-runner contract.
function runArgv(command, argv, cwd, {
  timeoutMs = DEFAULT_TIMEOUT_MS,
  memoryLimitMb = DEFAULT_MEMORY_LIMIT_MB,
  env = isolatedTaskEnv(),
  captureSignal = false,
  captureOutputLimit = 1024 * 1024,
  cleanup,
} = {}) {
  const resultFile = path.join(os.tmpdir(), `rig-check-mem-guard-${process.pid}-${crypto.randomBytes(6).toString('hex')}.json`);
  const outer = spawnGuardedSync(process.execPath, [
    memoryGuardScript,
    resultFile,
    String(memoryLimitMb),
    String(timeoutMs),
    ...(captureSignal ? ['--capture-signal', String(captureOutputLimit)] : []),
    command,
    ...argv,
  ], {
    cwd,
    encoding: 'utf8',
    shell: false,
    env,
    // The watchdog kills the command and its descendants at the requested
    // deadline; this is only a guard against a stuck watchdog process.
    timeout: timeoutMs + 5000,
  });
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  } catch {
    meta = { killed_for: outer.error?.code === 'ETIMEDOUT' ? 'timeout' : 'memory_ceiling_unavailable', code: 1 };
  } finally {
    fs.rmSync(resultFile, { force: true });
    cleanup?.();
  }
  const kind = meta.killed_for || (meta.signal ? 'signalled' : outer.error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' ? 'partial_output' : null);
  const normalizeTaskOutput = (value) => String(value || '').split(env.TMPDIR || '\0').join('[TASK_TMP]');
  return {
    status: kind ? 1 : (meta.code == null ? 1 : meta.code),
    stdout: normalizeTaskOutput(outer.stdout),
    stderr: normalizeTaskOutput(outer.stderr),
    ...(meta.signal ? { signal: meta.signal } : {}),
    error: outer.error || null,
    ...(kind ? { kind, reason: `${kind}: command execution was stopped${meta.signal ? ` by ${meta.signal}` : ''}` } : {}),
  };
}

function snapshotTarget(target) {
  const rows = [];
  const walk = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!rel && ['.git', '.rig'].includes(entry.name)) continue;
      const child = path.join(rel, entry.name);
      const abs = path.join(dir, entry.name);
      const stat = fs.lstatSync(abs);
      const mode = stat.mode & 0o7777;
      if (stat.isSymbolicLink()) rows.push([child, `link:${mode}:${fs.readlinkSync(abs)}`]);
      else if (stat.isDirectory()) {
        rows.push([child, `directory:${mode}`]);
        walk(abs, child);
      } else if (stat.isFile()) rows.push([child, `file:${mode}:${crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex')}`]);
    }
  };
  walk(target);
  return rows.sort(([left], [right]) => left.localeCompare(right));
}

function changedSnapshotPaths(before, after) {
  const oldFiles = new Map(before);
  const newFiles = new Map(after);
  return [...new Set([...oldFiles.keys(), ...newFiles.keys()])]
    .filter((file) => oldFiles.get(file) !== newFiles.get(file)).sort();
}

function positiveInteger(value, fallback) {
  if (value == null) return fallback;
  return Number.isInteger(value) && value > 0 ? value : null;
}

function executionLimits(...sources) {
  let timeoutMs = DEFAULT_TIMEOUT_MS;
  let memoryLimitMb = DEFAULT_MEMORY_LIMIT_MB;
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    timeoutMs = positiveInteger(source.timeout_ms ?? source.timeoutMs, timeoutMs);
    memoryLimitMb = positiveInteger(source.memory_limit_mb ?? source.memoryLimitMb, memoryLimitMb);
    if (!timeoutMs || !memoryLimitMb) return null;
  }
  return { timeoutMs, memoryLimitMb };
}

function networkState(...sources) {
  let state = 'undeclared';
  for (const source of sources) {
    if (!source || typeof source !== 'object' || source.network == null) continue;
    if (!['none', 'required'].includes(source.network)) return null;
    state = source.network;
  }
  return state;
}

function capabilityFailure(kind, reason) {
  return { status: 1, kind, reason };
}

function readExecutionPolicy(target) {
  let policyPath;
  try {
    policyPath = containedPath(target, '.rig/execution-policy.json');
  } catch {
    return { failure: capabilityFailure('capability_policy_invalid', 'execution policy escapes repository') };
  }
  if (!fs.existsSync(policyPath)) {
    return { failure: capabilityFailure('capability_not_authorized', 'elevated capability has no execution policy grant') };
  }
  let policy;
  try {
    policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  } catch {
    return { failure: capabilityFailure('capability_policy_invalid', 'execution policy is not valid JSON') };
  }
  if (!policy || typeof policy !== 'object' || Array.isArray(policy) ||
      Object.keys(policy).some((key) => !['schema_version', 'grants'].includes(key)) ||
      policy.schema_version !== 1 || !policy.grants || typeof policy.grants !== 'object' || Array.isArray(policy.grants)) {
    return { failure: capabilityFailure('capability_policy_invalid', 'execution policy has an invalid schema') };
  }
  return { policy };
}

function policyIsCommitted(target) {
  const tracked = spawnGuardedSync('git', ['ls-files', '--error-unmatch', '.rig/execution-policy.json'], {
    cwd: target,
    encoding: 'utf8',
    shell: false,
    timeout: 3000,
  });
  if (tracked.error || tracked.status !== 0) return false;
  const dirty = spawnGuardedSync('git', ['status', '--porcelain', '--', '.rig/execution-policy.json'], {
    cwd: target,
    encoding: 'utf8',
    shell: false,
    timeout: 3000,
  });
  return !dirty.error && dirty.status === 0 && !(dirty.stdout || '').trim();
}

function validGrant(grant) {
  if (!grant || typeof grant !== 'object' || Array.isArray(grant) ||
      Object.keys(grant).some((key) => !['network', 'timeout_ms', 'memory_limit_mb'].includes(key))) return false;
  return (grant.network == null || grant.network === 'required') &&
    (grant.timeout_ms == null || (Number.isInteger(grant.timeout_ms) && grant.timeout_ms > 0)) &&
    (grant.memory_limit_mb == null || (Number.isInteger(grant.memory_limit_mb) && grant.memory_limit_mb > 0));
}

// The shared evaluator deliberately takes a normalized request rather than
// knowing about today's CI caller. A later interactive one-use grant can add
// an authority source here without duplicating capability rules in another
// runner.
function evaluateCapabilities(serviceId, target, request) {
  const elevated = request.network === 'required' ||
    request.timeoutMs > DEFAULT_TIMEOUT_MS || request.memoryLimitMb > DEFAULT_MEMORY_LIMIT_MB;
  if (!elevated) return { request };
  const loaded = readExecutionPolicy(target);
  if (loaded.failure) return loaded;
  if (Object.entries(loaded.policy.grants).some(([service, grant]) => !service || !validGrant(grant))) {
    return { failure: capabilityFailure('capability_policy_invalid', 'execution policy contains an invalid grant') };
  }
  if (!policyIsCommitted(target)) {
    return { failure: capabilityFailure('capability_policy_not_committed', 'execution policy must be committed before it can grant elevated capability') };
  }
  const grant = loaded.policy.grants[serviceId];
  if (!validGrant(grant) ||
      (request.network === 'required' && grant.network !== 'required') ||
      (request.timeoutMs > DEFAULT_TIMEOUT_MS && request.timeoutMs > grant.timeout_ms) ||
      (request.memoryLimitMb > DEFAULT_MEMORY_LIMIT_MB && request.memoryLimitMb > grant.memory_limit_mb)) {
    return { failure: capabilityFailure('capability_not_authorized', `execution policy does not grant the requested capability for ${serviceId}`) };
  }
  return { request };
}

// RIG-147: the runner only returns the undeclared-network diagnostic on the
// result; the CLI/CI caller renders it once. A GitHub Actions annotation in CI,
// a plain stderr line elsewhere.
function renderDiagnostic(serviceId, diagnostic, env = process.env) {
  if (env.GITHUB_ACTIONS === 'true') {
    const escape = (text) => text.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
    return `::warning title=Rig check::${escape(`${serviceId}: ${diagnostic}`)}\n`;
  }
  return `rig check: ${serviceId}: ${diagnostic}\n`;
}

function runConfiguredArgv(serviceId, target, command, argv, cwd, ...sources) {
  const limits = executionLimits(...sources);
  if (!limits) {
    return { status: 1, kind: 'capability_invalid', reason: 'timeout_ms and memory_limit_mb must be positive integers' };
  }
  const network = networkState(...sources);
  if (!network) {
    return { status: 1, kind: 'capability_invalid', reason: 'network must be none or required when declared' };
  }
  const capability = evaluateCapabilities(serviceId, target, { ...limits, network });
  if (capability.failure) return capability.failure;
  const signedTaskRequired = serviceId === 'development.code-quality.lint-format' || network === 'required' ||
    limits.timeoutMs > DEFAULT_TIMEOUT_MS || limits.memoryLimitMb > DEFAULT_MEMORY_LIMIT_MB;
  if (signedTaskRequired) {
    const consent = require('./task-consent');
    let permit = sources.find(source => source?.execution_permit)?.execution_permit;
    if (!permit && serviceId !== 'development.code-quality.lint-format') {
      const plannedCommand = { service_id: serviceId, argv: [command, ...argv], cwd: path.relative(fs.realpathSync(target), fs.realpathSync(cwd)) || '.', network,
        timeout_ms: limits.timeoutMs, memory_limit_mb: limits.memoryLimitMb };
      const authSource = sources.find(source => source?.execution_plan || source?.execution_approval);
      const auth = consent.authorizeCommands(target, [plannedCommand], authSource
        ? { plan: authSource.execution_plan, approval: authSource.execution_approval } : {});
      if (auth.status !== 'authorized') return { status: 1, kind: auth.status, reason: auth.reason };
      permit = auth.permit;
    }
    if (!consent.consumeTaskPermit(permit, target, [command, ...argv], cwd, network === 'required', { ...limits, ...(serviceId !== 'development.code-quality.lint-format' ? { serviceId } : {}) }))
      return { status: 1, kind: 'not_authorized', reason: 'a current signed single-use execution plan is required' };
  }
  // Detect an absent command before a platform sandbox wraps spawn: wrappers
  // such as macOS sandbox-exec can replace the native ENOENT with their own
  // exit status, hiding the actionable missing-tool result.
  if (!executableAvailable(command, { cwd, env: isolatedTaskEnv() })) {
    return classifyRunnerFailure({ status: -2, error: { code: 'ENOENT' } }, command, command);
  }
  const targetPath = fs.realpathSync(target);
  const cwdPath = fs.realpathSync(cwd);
  const relCwd = path.relative(targetPath, cwdPath);
  if (relCwd === '..' || relCwd.startsWith(`..${path.sep}`) || path.isAbsolute(relCwd)) {
    return { status: 1, kind: 'boundary_violation', reason: 'command working directory escapes repository', network_state: network };
  }
  const task = taskCommandSpec({
    target: targetPath,
    cwd: cwdPath,
    argv: [command, ...argv],
    env: isolatedTaskEnv(),
    network: network === 'required',
    captureSignal: true,
  });
  if (task.unavailable) {
    return {
      status: 1,
      kind: 'filesystem_isolation_unavailable',
      reason: task.reason,
      network_state: network,
      setup_guidance: 'Install or enable the supported OS filesystem and network sandbox before running repository tasks.',
    };
  }
  const result = {
    ...runArgv(task.command, task.args, cwdPath, { ...limits, env: task.env, captureSignal: task.captureSignal, captureOutputLimit: task.captureOutputLimit, cleanup: task.cleanup }),
    network_state: network,
  };
  if (network === 'undeclared') result.diagnostic = 'network capability undeclared; network is denied by default';
  return result;
}

function classifyRunnerFailure(result, checkId, command) {
  // rig: status -2 is the current spawnGuardedSync ENOENT result when the memory wrapper cannot report metadata; prefer a portable error code if that wrapper exposes one later.
  if (result.kind === 'command_not_found' || result.error?.code === 'ENOENT' || result.status === -2) {
    return {
      ...result,
      status: 1,
      kind: 'missing_tool',
      reason: `${checkId}: required tool "${command}" is unavailable`,
      setup_guidance: `Install ${command} or configure an approved repository-owned adapter that provides this check.`,
    };
  }
  if (result.kind) {
    return {
      ...result,
      setup_guidance: result.setup_guidance || `Review ${checkId}'s execution capability and configure the required host support or repository-owned adapter.`,
    };
  }
  if (result.error || result.status !== 0) {
    return {
      ...result,
      kind: 'runner_error',
      reason: `${checkId}: command "${command}" exited with status ${result.status}${result.error?.message ? ` (${result.error.message})` : ''}`,
      setup_guidance: `Inspect ${checkId}'s command and output; correct or replace the repository-owned binding, then rerun it.`,
    };
  }
  return result;
}

// AD-15: a binding that always succeeds proves nothing, so it is a coverage gap
// rather than a pass. Names the stub when argv is one, else returns null.
const STUB_COMMANDS = new Set(['true', ':', 'echo', 'printf', 'exit', 'noop']);
const STUB_SEGMENT = /^\s*(?:true|:|exit(?:\s+0)?|(?:echo|printf)\b[^;&|]*|process\.exit\(\s*0?\s*\)|(?:sys\.)?exit\(\s*0?\s*\)|pass|console\.log\([^)]*\)|\(\)\s*=>\s*\{\s*\})?\s*$/;
const WRAPPER_COMMANDS = new Set(['env', 'nice', 'nohup', 'command', 'time', 'sudo']);
const SHELL_COMMANDS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh']);
const EVAL_FLAGS = { node: ['-e', '--eval', '-p', '--print'], nodejs: ['-e', '--eval', '-p', '--print'], bun: ['-e', '--eval'], deno: ['eval'], python: ['-c'], python3: ['-c'], ruby: ['-e'], perl: ['-e'] };

function isStubScript(script) {
  return String(script).split(/;|&&|\|\|/).every((segment) => STUB_SEGMENT.test(segment));
}

function genericSuccessBinding(argv) {
  if (!Array.isArray(argv) || argv.some((part) => typeof part !== 'string')) return 'malformed argv';
  const [first, ...rest] = argv;
  const name = path.basename(String(first || '')).replace(/\.(?:exe|cmd|bat)$/i, '').toLowerCase();
  if (!name.trim()) return 'empty command';
  if (STUB_COMMANDS.has(name)) return `generic-success command "${name}"`;
  if (WRAPPER_COMMANDS.has(name)) {
    // shortcut: only the value-taking flags of nice/sudo/env are skipped, so an exotic wrapper flag can hide a stub; widen if a real wrapper does.
    const inner = rest.filter((part, i) => !part.startsWith('-') && !part.includes('=') && !/^-[nugCS]$/.test(rest[i - 1] || ''));
    return inner.length ? genericSuccessBinding(inner) : `generic-success command "${name}" with nothing to run`;
  }
  const flags = SHELL_COMMANDS.has(name) ? ['-c'] : EVAL_FLAGS[name] || EVAL_FLAGS[name.replace(/[\d.]+$/, '')];
  if (!flags) return null;
  const at = rest.findIndex((part) => flags.includes(part) || (SHELL_COMMANDS.has(name) && /^-[a-z]*c$/.test(part)));
  if (at === -1) return null;
  return isStubScript(rest[at + 1] || '') ? `generic-success ${name} script` : null;
}

// Runs one service's binding (either a bare argv, or a `checks` map of named
// sub-checks) against `target`, returning a normalized result:
//   { status: 0 }                                    on success
//   { status: 1, kind: 'coverage_gap', reason }       on a binding/config gap
//   { status, error?, stdout?, stderr?, checkId? }    on a command failure
function runBinding(serviceId, binding, scope, target) {
  if (serviceId === 'development.code-quality.lint-format' && binding.engine === 'component-lint-format-v1') {
    const grades = require('./lint-grade');
    const ci = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    const inputs = grades.installedGradeInputs({ target, binding, scope: ci ? 'repo' : binding.scope || 'diff' });
    if (inputs.gap) return { status: 1, kind: 'coverage_gap', reason: inputs.gap.reason, setup_guidance: inputs.gap.setup_guidance, completed_grades: [] };
    const commands = inputs.grade === 'maximal' ? [...inputs.commands, ...inputs.commands] : inputs.commands;
    const auth = require('./task-consent').authorizeCommands(target, commands);
    if (auth.status !== 'authorized') return { status: 1, kind: auth.status, reason: auth.reason, executed_count: 0 };
    const grade = grades.runInstalledGrade({ target, binding, scope, inputs, execute: (command) => {
      const cwd = !command.cwd || command.cwd === '.' ? fs.realpathSync(target) : containedPath(target, command.cwd);
      const [program, ...args] = command.argv;
      const observed = runConfiguredArgv(serviceId, target, program, args, cwd, binding, command, { execution_permit: auth.permit });
      return { exit_code: Number.isInteger(observed.status) ? observed.status : 1,
        status: observed.kind || (observed.error ? 'command_not_found' : 'completed'),
        output_digest: crypto.createHash('sha256').update(`${observed.stdout || ''}\n${observed.stderr || ''}`).digest('hex') };
    } });
    const executedChecks = Object.keys(binding.checks || {}).slice(0, Math.max(grade.commands?.length ? 1 : 0, (grade.completed_grades || []).length));
    const shared = { executed_count: grade.executed_count || grade.commands?.length || 0, executed_checks: executedChecks, grade: grade.grade, completed_grades: grade.completed_grades, evidence: grade.evidence, commands: grade.commands, setup_guidance: grade.setup_guidance, ...(grade.findings ? { findings: grade.findings } : {}) };
    if (grade.verdict === 'pass') return { status: 0, ...shared };
    return { status: 1, kind: grade.status, reason: grade.reason || 'lint-format grade did not pass', checkId: 'lint-format-grade', ...shared,
      ...(grade.changed_paths ? { changed_paths: grade.changed_paths, changes: grade.changes } : {}) };
  }
  let executedCount = 0;
  const executedChecks = [];
  const diagnostics = new Set();
  const recordDiagnostics = (result) => {
    for (const diagnostic of result.diagnostics || (result.diagnostic ? [result.diagnostic] : [])) {
      diagnostics.add(diagnostic);
    }
  };
  const withDiagnostics = (result) => ({
    ...result,
    ...(Object.hasOwn(result, 'stdout') ? { stdout: redact(result.stdout || '') } : {}),
    ...(Object.hasOwn(result, 'stderr') ? { stderr: redact(result.stderr || '') } : {}),
    ...(typeof result.reason === 'string' ? { reason: redact(result.reason) } : {}),
    diagnostics: [...diagnostics].map(redact),
    ...(diagnostics.size ? { diagnostic: diagnostics.values().next().value } : {}),
  });
  const failedCheck = (checkId, result) => withDiagnostics({
    ...result,
    checkId,
    executed_count: executedCount,
    executed_checks: [...executedChecks],
  });
  const checks = binding.checks && Object.entries(binding.checks);
  if (checks && checks.length === 0) {
    return { status: 1, kind: 'coverage_gap', reason: 'No executable checks are configured', executed_count: 0, executed_checks: [] };
  }
  if (!checks) {
    const argv = binding[scope] || binding.repo;
    if (!argv || !Array.isArray(argv) || !argv.length) {
      return { status: 1, kind: 'coverage_gap', reason: `No argv binding for scope ${scope}` };
    }
    const bareStub = genericSuccessBinding(argv);
    if (bareStub) return { status: 1, kind: 'coverage_gap', reason: `${bareStub} is not a check: coverage gap` };
    const [command, ...rest] = argv;
    const before = binding.read_only ? snapshotTarget(target) : null;
    const result = runConfiguredArgv(serviceId, target, command, rest, target, binding);
    recordDiagnostics(result);
    if (before) {
      const after = snapshotTarget(target);
      const changed = changedSnapshotPaths(before, after);
      if (changed.length) return withDiagnostics({ ...result, status: 1, kind: result.kind || 'mutated', reason: result.reason || 'read-only service command changed repository files', changed_paths: changed,
        changes: changed.map(file => ({ path: file, before: new Map(before).get(file) || null, after: new Map(after).get(file) || null })) });
    }
    return withDiagnostics(result);
  }

  for (const [checkId, check] of checks) {
    if (!check || typeof check !== 'object' || Array.isArray(check)) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed check binding` });
    if (check.required_paths && !Array.isArray(check.required_paths)) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: invalid required paths` });
    for (const rel of check.required_paths || []) {
      let abs;
      try { abs = typeof rel === 'string' ? containedPath(target, rel) : null; } catch {}
      if (!abs) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: invalid required path` });
      if (!fs.existsSync(abs)) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: missing ${rel}` });
    }
    if (check.native_service || check.coverage_gap) continue;
    if (Object.hasOwn(check, 'commands')) {
      if (!Array.isArray(check.commands) || !check.commands.length || check.commands.some((cmd) => !cmd || genericSuccessBinding(cmd.argv))) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: empty, malformed or no-op command` });
    } else if (genericSuccessBinding(check[scope] || check.repo)) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: missing, malformed or no-op argv` });
  }
  for (const [checkId, check] of checks) {
    if (!check || typeof check !== 'object') {
      return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed check binding` });
    }
    if (check.native_service) {
      const result = require('./service-catalogue').runNativeService(check.native_service, target);
      executedCount += result.executed_count || 0;
      if (result.executed_count) executedChecks.push(checkId);
      if (result.status !== 0) return withDiagnostics({ ...result, checkId, executed_count: executedCount, executed_checks: executedChecks });
      continue;
    }
    if (check.coverage_gap) {
      return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: ${check.coverage_gap}` });
    }
    for (const rel of check.required_paths || []) {
      let abs;
      try {
        abs = typeof rel === 'string' ? containedPath(target, rel) : null;
      } catch {
        abs = null;
      }
      if (!abs) {
        return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: invalid required path` });
      }
      if (!fs.existsSync(abs)) {
        return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: missing ${rel}` });
      }
    }
    if (check.fix && (!Array.isArray(check.fix) || !check.fix.length)) {
      return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed explicit fix binding` });
    }
    if (check.commands) {
      if (!Array.isArray(check.commands) || check.commands.length === 0) {
        return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: no executable commands configured` });
      }
      for (const commandBinding of check.commands) {
        if (!commandBinding || !Array.isArray(commandBinding.argv) || !commandBinding.argv.length) {
          return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed component command` });
        }
        const componentStub = genericSuccessBinding(commandBinding.argv);
        if (componentStub) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: ${componentStub} is not a check` });
        let cwd;
        try {
          cwd = !commandBinding.cwd || commandBinding.cwd === '.'
            ? fs.realpathSync(target)
            : containedPath(target, commandBinding.cwd);
        } catch {
          return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: component cwd escapes repository` });
        }
        const [command, ...rest] = commandBinding.argv;
        const before = snapshotTarget(target);
        const result = runConfiguredArgv(serviceId, target, command, rest, cwd, binding, check, commandBinding);
        recordDiagnostics(result);
        if (result.network_state && !result.kind) { executedCount += 1; executedChecks.push(checkId); }
        const changed = changedSnapshotPaths(before, snapshotTarget(target));
        if (changed.length) return withDiagnostics({ status: 1, kind: result.kind || 'mutated', reason: result.reason || 'component check command changed repository files', changed_paths: changed, changes: changed.map((file) => ({ path: file, before: new Map(before).get(file) || null, after: new Map(snapshotTarget(target)).get(file) || null })), checkId, executed_count: executedCount, executed_checks: executedChecks });
        const classified = classifyRunnerFailure(result, checkId, command);
        if (classified.error || classified.status !== 0) return withDiagnostics({ ...classified, checkId, executed_count: executedCount, executed_checks: executedChecks });
      }
      continue;
    }
    const argv = check[scope] || check.repo;
    if (!argv) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: no argv binding for scope ${scope}` });
    if (!Array.isArray(argv) || !argv.length) {
      return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed ${scope} binding` });
    }
    const checkStub = genericSuccessBinding(argv);
    if (checkStub) return failedCheck(checkId, { status: 1, kind: 'coverage_gap', reason: `${checkId}: ${checkStub} is not a check` });
    const [command, ...rest] = argv;
    const readOnly = check.read_only || binding.read_only ? require('./lint-format') : null;
    const before = readOnly?.snapshotDir(target);
    const result = runConfiguredArgv(serviceId, target, command, rest, target, binding, check);
    recordDiagnostics(result);
    if (result.network_state && !result.kind) { executedCount += 1; executedChecks.push(checkId); }
    if (readOnly) {
      const changed = readOnly.diffSnapshots(before, readOnly.snapshotDir(target));
      if (changed.length) return withDiagnostics({ status: 1, kind: result.kind || 'mutated', reason: result.reason || 'read-only service command changed repository files', changed_paths: changed, changes: changed.map((file) => ({ path: file, before: new Map(before).get(file) || null, after: new Map(snapshotTarget(target)).get(file) || null })), checkId, executed_count: executedCount, executed_checks: executedChecks });
    }
    const classified = classifyRunnerFailure(result, checkId, command);
    if (classified.error || classified.status !== 0) return withDiagnostics({ ...classified, checkId, executed_count: executedCount, executed_checks: executedChecks });
  }
  if (executedCount === 0) {
    return withDiagnostics({ status: 1, kind: 'coverage_gap', reason: 'No executable checks were launched', executed_count: 0, executed_checks: [] });
  }
  return withDiagnostics({ status: 0, stdout: '', stderr: '', executed_count: executedCount, executed_checks: executedChecks });
}

module.exports = { runArgv, runBinding, runConfiguredArgv, evaluateCapabilities, renderDiagnostic, genericSuccessBinding };
