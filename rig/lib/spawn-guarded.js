'use strict';

const { spawn, spawnSync } = require('node:child_process');

const TERM_GRACE_MS = 100;

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
function linuxPdeathCommand(command, args) {
  if (process.platform !== 'linux') return { command, args };
  return {
    command: 'python3',
    args: [
      '-c',
      'import ctypes,os,signal; ctypes.CDLL(None).prctl(1, signal.SIGTERM); os.execvpe(os.sys.argv[1], os.sys.argv[1:], os.environ)',
      command,
      ...args,
    ],
  };
}

function spawnGuarded(command, args = [], options = {}) {
  const cleanup = once(options.cleanup);
  const childSpec = linuxPdeathCommand(command, args);
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
  const childSpec = linuxPdeathCommand(command, args);
  try {
    const result = spawnSync(childSpec.command, childSpec.args, {
      ...options,
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
    return result;
  } finally {
    cleanup();
  }
}

module.exports = { spawnGuarded, spawnGuardedSync };
