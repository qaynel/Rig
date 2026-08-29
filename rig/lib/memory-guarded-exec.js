'use strict';

// Runs one command under a live RSS watchdog, reporting the outcome to a
// result file instead of stdout so the real command's own output stays
// clean. Exists as a standalone process because a memory ceiling requires
// polling RSS *while the command runs*, and spawnSync (what runGrade and
// runReadOnly use, both frozen-oracle call sites) blocks the caller's event
// loop until the child exits -- nothing in that process could ever observe
// an intermediate sample. Delegating the polling to this separate process
// lets the caller keep using plain, synchronous spawnSync on this wrapper.
//
// Invocation: node memory-guarded-exec.js <resultFile> <memoryLimitMb> <timeoutMs> <argv0> [argv...]
//
// The timeout is enforced here too, not left to the caller's own spawnSync
// timeout, so this process can kill its own child on expiry instead of
// leaving it orphaned when the caller's outer timeout (a generous safety net
// only -- see runCommand in lint-format.js) fires on this wrapper instead.

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { spawnGuarded } = require('./spawn-guarded');

const POLL_MS = 15;

// Sums RSS across the whole descendant tree, not just the direct child: a
// command that forks (a shell wrapper, a test runner spawning workers) can
// blow the ceiling entirely inside processes this function would otherwise
// never sample. `available: false` means `ps` itself could not be run (e.g.
// absent from PATH) -- the caller must treat that as a hard failure, not as
// "0 bytes used", or the ceiling silently enforces nothing on that host.
function rssBytesTree(rootPid) {
  const probe = spawnSync('ps', ['-eo', 'pid,ppid,rss'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) return { bytes: 0, available: false };
  const byPid = new Map();
  for (const line of (probe.stdout || '').trim().split('\n').slice(1)) {
    const [pid, ppid, rss] = line.trim().split(/\s+/).map(Number);
    if (Number.isFinite(pid)) byPid.set(pid, { ppid, rss: Number.isFinite(rss) ? rss : 0 });
  }
  if (byPid.size === 0 || !byPid.has(rootPid)) return { bytes: 0, available: false };
  let bytes = 0;
  const stack = [rootPid];
  const seen = new Set();
  while (stack.length) {
    const pid = stack.pop();
    if (seen.has(pid)) continue;
    seen.add(pid);
    const entry = byPid.get(pid);
    if (!entry) continue;
    bytes += entry.rss * 1024;
    for (const [candidate, info] of byPid) {
      if (info.ppid === pid) stack.push(candidate);
    }
  }
  return { bytes, available: true };
}

// True until the child's 'exit' event has set one of these, which happens
// synchronously before 'close' -- lets a poll that lands in the gap between
// the child exiting and the 'close' handler clearing memTimer skip itself
// instead of reading its own already-reaped pid out of `ps` as "unavailable"
// and killing/misreporting a command that actually finished on its own.
function isChildRunning(child) {
  return Boolean(child.pid) && child.exitCode === null && child.signalCode === null;
}

function run([resultFile, memoryLimitMbRaw, timeoutMsRaw, ...argv]) {
  const memoryLimitBytes = Number(memoryLimitMbRaw) > 0 ? Number(memoryLimitMbRaw) * 1024 * 1024 : null;
  const timeoutMs = Number(timeoutMsRaw) > 0 ? Number(timeoutMsRaw) : null;
  const report = (payload) => fs.writeFileSync(resultFile, JSON.stringify(payload));

  let child;
  try {
    child = spawnGuarded(argv[0], argv.slice(1), { shell: false, stdio: ['ignore', 'inherit', 'inherit'] });
  } catch {
    report({ killed_for: 'command_not_found', code: 1, signal: null });
    return;
  }

  let killedFor = null;
  const memTimer = memoryLimitBytes ? setInterval(() => {
    if (!isChildRunning(child)) return;
    const { bytes, available } = rssBytesTree(child.pid);
    if (!available) {
      killedFor = 'memory_ceiling_unavailable';
      child.cancel('SIGKILL');
      return;
    }
    if (bytes <= memoryLimitBytes) return;
    killedFor = 'memory_exceeded';
    child.cancel('SIGKILL');
  }, POLL_MS) : null;
  const timeoutTimer = timeoutMs ? setTimeout(() => {
    killedFor = killedFor || 'timeout';
    child.cancel('SIGKILL');
  }, timeoutMs) : null;

  const stopTimers = () => {
    if (memTimer) clearInterval(memTimer);
    if (timeoutTimer) clearTimeout(timeoutTimer);
  };

  child.on('error', (error) => {
    stopTimers();
    report({ killed_for: error.code === 'ENOENT' ? 'command_not_found' : killedFor, code: 1, signal: null });
  });

  child.on('close', (code, signal) => {
    stopTimers();
    report({ killed_for: killedFor, code, signal });
  });
}

if (require.main === module) {
  run(process.argv.slice(2));
}

module.exports = { run, rssBytesTree, isChildRunning, scriptPath: __filename };
