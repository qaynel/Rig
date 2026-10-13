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

import { spawnSync } from 'node:child_process';

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
