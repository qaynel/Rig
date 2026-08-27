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
const { spawn, spawnSync } = require('node:child_process');

const POLL_MS = 15;

function rssBytes(pid) {
  const probe = spawnSync('ps', ['-o', 'rss=', '-p', String(pid)], { encoding: 'utf8' });
  const kb = parseInt((probe.stdout || '').trim(), 10);
  return Number.isFinite(kb) ? kb * 1024 : 0;
}

function run([resultFile, memoryLimitMbRaw, timeoutMsRaw, ...argv]) {
  const memoryLimitBytes = Number(memoryLimitMbRaw) > 0 ? Number(memoryLimitMbRaw) * 1024 * 1024 : null;
  const timeoutMs = Number(timeoutMsRaw) > 0 ? Number(timeoutMsRaw) : null;
  const report = (payload) => fs.writeFileSync(resultFile, JSON.stringify(payload));

  let child;
  try {
    child = spawn(argv[0], argv.slice(1), { shell: false, stdio: ['ignore', 'inherit', 'inherit'] });
  } catch {
    report({ killed_for: 'command_not_found', code: 1, signal: null });
    return;
  }

  let killedFor = null;
  const memTimer = memoryLimitBytes ? setInterval(() => {
    if (!child.pid || rssBytes(child.pid) <= memoryLimitBytes) return;
    killedFor = 'memory_exceeded';
    child.kill('SIGKILL');
  }, POLL_MS) : null;
  const timeoutTimer = timeoutMs ? setTimeout(() => {
    killedFor = killedFor || 'timeout';
    child.kill('SIGKILL');
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

module.exports = { run };
