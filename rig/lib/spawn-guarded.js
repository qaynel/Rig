'use strict';

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const TERM_GRACE_MS = 100;
const LINUX_EXEC_ENOENT_MARKER = 'RIG_SPAWN_GUARDED_EXEC_ENOENT';
const NETWORK_SANDBOX_PROFILE = '(version 1)(allow default)(deny network*)';

// One child boundary for every guarded task, whether it is interactive or CI.
// Keep the allowlist here beside the shared spawn seam so the two runners
// cannot silently grow divergent environment or network defaults.
const TASK_ENV_ALLOWLIST = [
  'PATH', 'HOME', 'USERPROFILE', 'TMPDIR', 'TMP', 'TEMP',
  'LANG', 'LC_ALL', 'LC_CTYPE', 'TZ', 'TERM',
  'SystemRoot', 'SYSTEMROOT', 'SYSTEMDRIVE', 'WINDIR',
  'COMSPEC', 'PATHEXT', 'USERNAME', 'USER', 'LOGNAME',
];

function isolatedTaskEnv() {
  const env = {};
  for (const key of TASK_ENV_ALLOWLIST) {
    if (process.env[key] != null) env[key] = process.env[key];
  }
  return env;
}

// Resolve the wrapper before task commands can narrow PATH. Prefer the host
// Python over a project virtualenv: the latter may rely on environment values
// intentionally removed from guarded tasks.
let resolvedPython3;
function resolvePython3() {
  if (resolvedPython3 !== undefined) return resolvedPython3;
  resolvedPython3 = null;
  const dirs = ['/usr/bin', '/usr/local/bin', ...(process.env.PATH || '').split(path.delimiter)]
    .filter((dir) => !dir.includes(`${path.sep}.venv${path.sep}`));
  for (const dir of dirs) {
    if (!dir) continue;
    const candidate = path.join(dir, 'python3');
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      resolvedPython3 = candidate;
      break;
    } catch {
      // Keep looking for a host interpreter.
    }
  }
  return resolvedPython3;
}

function groupSignal(pid, signal) {
  if (!pid) return;
  try {
    process.kill(-pid, signal);
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

function killGroup(pid, signal = 'SIGTERM') {
  groupSignal(pid, signal);
  if (signal === 'SIGKILL') return;
  setTimeout(() => groupSignal(pid, 'SIGKILL'), TERM_GRACE_MS).unref();
}

function once(fn) {
  let called = false;
  return () => {
    if (called) return;
    called = true;
    fn?.();
  };
}

// rig: Linux's stdlib has no prctl binding; this tiny wrapper is the native
// syscall bridge. Upgrade to a compiled binding only if Python is unavailable
// on a supported Linux runtime.
function executableAvailable(command, { cwd = process.cwd(), env = process.env } = {}) {
  const candidates = command.includes(path.sep)
    ? [path.resolve(cwd, command)]
    : (env.PATH || '').split(path.delimiter).filter(Boolean).map((dir) => path.join(dir, command));
  return candidates.some((candidate) => {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });
}

// Reuses one host capability probe for both interactive and installed runners.
// A present binary is not enough: only a successful no-network child proves
// this host can enforce the promise the caller is about to make.
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

function linuxPdeathCommand(command, args, forceLinuxWrapper = false, options = {}) {
  if (process.platform !== 'linux' && !forceLinuxWrapper) return { command, args };
  // A missing executable must reach spawn() directly so callers retain its
  // native ENOENT result. The wrapper remains for present commands and also
  // catches a rare remove-between-check-and-exec race below.
  if (!executableAvailable(command, options)) return { command, args };
  return {
    command: resolvePython3() || 'python3',
    args: [
      '-c',
      `import ctypes,os,signal,sys; ctypes.CDLL(None).prctl(1, signal.SIGTERM);\ntry: os.execvpe(os.sys.argv[1], os.sys.argv[1:], os.environ)\nexcept OSError as e:\n  if e.errno == 2: os.write(2, b'${LINUX_EXEC_ENOENT_MARKER}\\n'); os._exit(127)\n  raise`,
      command,
      ...args,
    ],
  };
}

function spawnGuarded(command, args = [], options = {}) {
  const cleanup = once(options.cleanup);
  const childSpec = linuxPdeathCommand(command, args, false, options);
  const child = spawn(childSpec.command, childSpec.args, {
    ...options,
    detached: true,
    cleanup: undefined,
  });
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    if (timer) clearTimeout(timer);
    cleanup();
  };
  child.once('close', finish);
  child.once('error', finish);

  let timer;
  if (options.timeout != null) {
    timer = setTimeout(() => killGroup(child.pid), options.timeout);
    timer.unref();
  }

  const cancel = (signal = 'SIGTERM') => new Promise((resolve) => {
    if (settled) return resolve();
    const done = () => {
      child.removeListener('close', done);
      child.removeListener('error', done);
      if (timer) clearTimeout(timer);
      finish();
      resolve();
    };
    child.once('close', done);
    child.once('error', done);
    killGroup(child.pid, signal);
  });

  child.cancel = cancel;
  return child;
}

function spawnGuardedSync(command, args = [], options = {}) {
  const cleanup = once(options.cleanup);
  const childSpec = linuxPdeathCommand(command, args, options.forceLinuxWrapper === true, options);
  const spawnOptions = { ...options };
  delete spawnOptions.forceLinuxWrapper;
  try {
    const result = spawnSync(childSpec.command, childSpec.args, {
      ...spawnOptions,
      detached: true,
      cleanup: undefined,
    });
    if (result.status === null || result.error?.code === 'ETIMEDOUT') {
      killGroup(result.pid, 'SIGTERM');
      // spawnSync has already returned, so make the escalation synchronous
      // enough for callers to safely inspect the result after this function.
      const deadline = Date.now() + TERM_GRACE_MS;
      while (Date.now() < deadline) {}
      groupSignal(result.pid, 'SIGKILL');
    }
    if ((result.stderr || '').includes(LINUX_EXEC_ENOENT_MARKER)) {
      result.stderr = result.stderr.replace(`${LINUX_EXEC_ENOENT_MARKER}\n`, '');
      result.error = { ...(result.error || {}), code: 'ENOENT' };
    }
    return result;
  } finally {
    cleanup();
  }
}

module.exports = {
  spawnGuarded,
  spawnGuardedSync,
  executableAvailable,
  linuxPdeathCommand,
  isolatedTaskEnv,
  networkIsolationPrefix,
};
