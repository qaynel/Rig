/**
 * Process-tree signalling for browse children that can fork (skill scripts,
 * Xvfb, headless Chromium).
 *
 * Rig local patch (RIG-135): Bun's Subprocess#kill() only signals the leader
 * pid and has no process-group form (oven-sh/bun#15791). Children are spawned
 * through node:child_process with `detached: true` (their own process group on
 * POSIX) and stopped here by group. Mirrors rig/lib/spawn-guarded.js.
 *
 * POSIX: signal the negative pid (the group). Windows has no process groups;
 * `taskkill /T /F` walks the parent-pid tree instead.
 */

import { spawn, spawnSync } from 'node:child_process';

export const TERM_GRACE_MS = 100;

/** Signal the whole tree once; no timers, safe from synchronous cleanup. */
export function signalProcessTree(pid: number | undefined, signal: NodeJS.Signals = 'SIGTERM'): void {
  if (!pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    return;
  }
  try {
    process.kill(-pid, signal);
  } catch (err: any) {
    if (err?.code !== 'ESRCH') throw err;
  }
}

/** SIGTERM the tree, then SIGKILL it after a short grace period. */
export function killProcessTree(pid: number | undefined): void {
  signalProcessTree(pid, 'SIGTERM');
  if (process.platform === 'win32') return; // taskkill /F is already forceful
  setTimeout(() => signalProcessTree(pid, 'SIGKILL'), TERM_GRACE_MS).unref();
}

/**
 * Watchdog body, run as `node -e`. The parent holds the write end of the
 * watchdog's stdin. If that pipe closes without a "done" line (parent crashed,
 * was killed, or lost the OS handle), the watchdog kills the child tree. The
 * OS closes the pipe on any parent death, so this holds without a native Job
 * Object binding; it works identically on POSIX and Windows.
 */
const WATCHDOG_SOURCE = `
const { spawnSync } = require('node:child_process');
const pid = Number(process.argv[1]);
let done = false;
process.stdin.on('data', (d) => { if (String(d).includes('done')) done = true; });
process.stdin.on('end', () => {
  if (!done) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else { try { process.kill(-pid, 'SIGKILL'); } catch {} }
  }
  process.exit(0);
});
`;

export interface GuardedChild {
  pid: number;
  /** Kill the whole tree now and retire the watchdog. Idempotent. */
  stop(): void;
}

/**
 * Spawn a child that may fork (headless Chromium) so that every descendant
 * dies on any exit path: stop() on success/timeout/cancel, and the watchdog if
 * this process dies first. Rig local patch (RIG-135.1): replaces the leader-only
 * Bun.spawn(...).kill() against the user's real browser profile.
 */
export function spawnTreeGuarded(command: string, args: string[]): GuardedChild {
  const child = spawn(command, args, {
    stdio: 'ignore',
    detached: process.platform !== 'win32',
    windowsHide: true,
  });
  child.on('error', () => {}); // surfaced to callers by the startup wait, never uncaught
  const pid = child.pid;
  if (!pid) throw new Error(`failed to start ${command}`);

  const watchdog = spawn(process.execPath, ['-e', WATCHDOG_SOURCE, String(pid)], {
    stdio: ['pipe', 'ignore', 'ignore'],
    windowsHide: true,
  });
  watchdog.on('error', () => {});
  watchdog.stdin?.on('error', () => {});
  watchdog.unref();

  let stopped = false;
  return {
    pid,
    stop() {
      if (stopped) return;
      stopped = true;
      signalProcessTree(pid, 'SIGKILL');
      try { watchdog.stdin?.end('done\n'); } catch {}
    },
  };
}
