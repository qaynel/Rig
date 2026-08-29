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
const { spawnGuardedSync } = require('./spawn-guarded');
const { containedPath } = require('./path-safety');
const { scriptPath: memoryGuardScript } = require('./memory-guarded-exec');

const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_MEMORY_LIMIT_MB = 2 * 1024;
const NETWORK_SANDBOX_PROFILE = '(version 1)(allow default)(deny network*)';

// spawnSync-shaped results preserve the existing command-runner contract.
function runArgv(command, argv, cwd, { timeoutMs = DEFAULT_TIMEOUT_MS, memoryLimitMb = DEFAULT_MEMORY_LIMIT_MB } = {}) {
  const resultFile = path.join(os.tmpdir(), `rig-check-mem-guard-${process.pid}-${crypto.randomBytes(6).toString('hex')}.json`);
  const outer = spawnGuardedSync(process.execPath, [
    memoryGuardScript,
    resultFile,
    String(memoryLimitMb),
    String(timeoutMs),
    command,
    ...argv,
  ], {
    cwd,
    encoding: 'utf8',
    shell: false,
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
  }
  const kind = meta.killed_for || null;
  return {
    status: kind ? 1 : (meta.code == null ? 1 : meta.code),
    stdout: outer.stdout || '',
    stderr: outer.stderr || '',
    error: outer.error || null,
    ...(kind ? { kind, reason: `${kind}: command execution was stopped` } : {}),
  };
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

// Reuses lint-format's owner-approved platform isolation probe. A present
// binary is not enough: only a successful no-network child proves the host can
// enforce the promise this runner is about to make.
function networkIsolationPrefix() {
  if (process.platform === 'linux') {
    const prefix = ['unshare', '--user', '--map-root-user', '--net', '--'];
    const result = spawnGuardedSync(prefix[0], [...prefix.slice(1), process.execPath, '-e', ''], {
      stdio: 'ignore',
      timeout: 1000,
    });
    return result.status === 0 ? prefix : null;
  }
  if (process.platform === 'darwin') {
    const prefix = ['sandbox-exec', '-p', NETWORK_SANDBOX_PROFILE, '--'];
    const result = spawnGuardedSync(prefix[0], [...prefix.slice(1), process.execPath, '-e', ''], {
      stdio: 'ignore',
      timeout: 1000,
    });
    return result.status === 0 ? prefix : null;
  }
  return null;
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
  if (network === 'none') {
    const prefix = networkIsolationPrefix();
    if (!prefix) {
      return {
        status: 1,
        kind: 'network_isolation_unavailable',
        reason: 'network isolation is unavailable on this host',
        network_state: network,
      };
    }
    return { ...runArgv(prefix[0], [...prefix.slice(1), command, ...argv], cwd, limits), network_state: network };
  }
  if (network === 'undeclared') {
    const diagnostic = 'network capability undeclared; running under temporary compatibility mode';
    console.warn(diagnostic);
    return { ...runArgv(command, argv, cwd, limits), network_state: network, diagnostic };
  }
  return { ...runArgv(command, argv, cwd, limits), network_state: network };
}

// Runs one service's binding (either a bare argv, or a `checks` map of named
// sub-checks) against `target`, returning a normalized result:
//   { status: 0 }                                    on success
//   { status: 1, kind: 'coverage_gap', reason }       on a binding/config gap
//   { status, error?, stdout?, stderr?, checkId? }    on a command failure
function runBinding(serviceId, binding, scope, target) {
  const checks = binding.checks && Object.entries(binding.checks);
  if (!checks) {
    const argv = binding[scope] || binding.repo;
    if (!argv || !Array.isArray(argv) || !argv.length) {
      return { status: 1, kind: 'coverage_gap', reason: `No argv binding for scope ${scope}` };
    }
    const [command, ...rest] = argv;
    return runConfiguredArgv(serviceId, target, command, rest, target, binding);
  }

  for (const [checkId, check] of checks) {
    if (!check || typeof check !== 'object') {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed check binding` };
    }
    if (check.coverage_gap) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: ${check.coverage_gap}` };
    }
    for (const rel of check.required_paths || []) {
      let abs;
      try {
        abs = typeof rel === 'string' ? containedPath(target, rel) : null;
      } catch {
        abs = null;
      }
      if (!abs) {
        return { status: 1, kind: 'coverage_gap', reason: `${checkId}: invalid required path` };
      }
      if (!fs.existsSync(abs)) {
        return { status: 1, kind: 'coverage_gap', reason: `${checkId}: missing ${rel}` };
      }
    }
    if (check.fix && (!Array.isArray(check.fix) || !check.fix.length)) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed explicit fix binding` };
    }
    if (check.commands) {
      for (const commandBinding of check.commands) {
        if (!Array.isArray(commandBinding.argv) || !commandBinding.argv.length) {
          return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed component command` };
        }
        let cwd;
        try {
          cwd = !commandBinding.cwd || commandBinding.cwd === '.'
            ? fs.realpathSync(target)
            : containedPath(target, commandBinding.cwd);
        } catch {
          return { status: 1, kind: 'coverage_gap', reason: `${checkId}: component cwd escapes repository` };
        }
        const [command, ...rest] = commandBinding.argv;
        const result = runConfiguredArgv(serviceId, target, command, rest, cwd, binding, check, commandBinding);
        if (result.error || result.status !== 0) return { ...result, checkId };
      }
      continue;
    }
    const argv = check[scope] || check.repo;
    if (!argv) continue;
    if (!Array.isArray(argv) || !argv.length) {
      return { status: 1, kind: 'coverage_gap', reason: `${checkId}: malformed ${scope} binding` };
    }
    const [command, ...rest] = argv;
    const result = runConfiguredArgv(serviceId, target, command, rest, target, binding, check);
    if (result.error || result.status !== 0) return { ...result, checkId };
  }
  return { status: 0, stdout: '', stderr: '' };
}

module.exports = { runArgv, runBinding, evaluateCapabilities };
