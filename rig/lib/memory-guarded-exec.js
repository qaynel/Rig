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
// Invocation: node memory-guarded-exec.js <resultFile> <memoryLimitMb> <timeoutMs> [--capture-signal] <argv0> [argv...]
//
// The timeout is enforced here too, not left to the caller's own spawnSync
// timeout, so this process can kill its own child on expiry instead of
// leaving it orphaned when the caller's outer timeout (a generous safety net
// only -- see runCommand in lint-format.js) fires on this wrapper instead.

const fs = require('node:fs');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { spawnGuarded } = require('./spawn-guarded');

const POLL_MS = 15;

// Runs inside Linux's PID namespace so Node can observe the task's wait status
// before bubblewrap reduces a signal death and exit(128 + signal) to one code.
// The supervisor keeps task output separate and emits one trusted envelope
// after the child closes. The task never inherits the supervisor's stdout.
const SIGNAL_RESULT_MARKER = '\u0000RIG_TASK_RESULT_V1:';
const SIGNAL_SUPERVISOR_SOURCE = `
const fs = require('node:fs');
const os = require('node:os');
const { spawn } = require('node:child_process');
const [limitRaw, command, ...args] = (process.argv[1] === '-e' ? process.argv.slice(2) : process.argv.slice(1));
const marker = ${JSON.stringify(SIGNAL_RESULT_MARKER)};
const limit = Number(limitRaw) > 0 ? Number(limitRaw) : 1024 * 1024;
const outputs = { stdout: [], stderr: [] };
const sizes = { stdout: 0, stderr: 0 };
let outputLimitExceeded = false;
let child;
let finished = false;
const capture = (name, chunk) => {
  const room = Math.max(0, limit - sizes[name]);
  if (room) outputs[name].push(chunk.subarray(0, room));
  sizes[name] += Math.min(room, chunk.length);
  if (chunk.length > room && !outputLimitExceeded) {
    outputLimitExceeded = true;
    // rig: exiting the sandbox's init process tears down its entire PID namespace.
    finish(1, null);
    process.exit(1);
  }
};
const finish = (code, signal) => {
  if (finished) return;
  finished = true;
  const exitCode = code == null ? 128 + (os.constants.signals[signal] || 0) : code;
  const payload = JSON.stringify({
    protocol: 1, code: exitCode, signal: signal || null, outputLimitExceeded,
    stdout: Buffer.concat(outputs.stdout).toString('base64'),
    stderr: Buffer.concat(outputs.stderr).toString('base64'),
  });
  fs.writeSync(1, marker + payload + '\\u0000');
  process.exitCode = outputLimitExceeded ? 1 : exitCode;
};
try {
  child = spawn(command, args, { shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
} catch {
  finish(127, null);
}
if (child) {
  child.stdout.on('data', chunk => capture('stdout', chunk));
  child.stderr.on('data', chunk => capture('stderr', chunk));
  child.once('error', (error) => finish(error.code === 'ENOENT' ? 127 : 1, null));
  child.once('close', finish);
}
`;

function parseSignalResult(stdout) {
  const value = String(stdout || '');
  if (!value.startsWith(SIGNAL_RESULT_MARKER) || !value.endsWith('\0')) return null;
  try {
    const result = JSON.parse(value.slice(SIGNAL_RESULT_MARKER.length, -1));
    if (result.protocol !== 1 || !Number.isInteger(result.code) || result.code < 0 || result.code > 255
      || (result.signal !== null && !Object.hasOwn(os.constants.signals, result.signal))
      || typeof result.stdout !== 'string' || typeof result.stderr !== 'string'
      || typeof result.outputLimitExceeded !== 'boolean') return null;
    const stdoutBytes = Buffer.from(result.stdout, 'base64');
    const stderrBytes = Buffer.from(result.stderr, 'base64');
    if (stdoutBytes.toString('base64') !== result.stdout || stderrBytes.toString('base64') !== result.stderr) return null;
    return { ...result, stdout: stdoutBytes.toString(), stderr: stderrBytes.toString() };
  } catch {
    return null;
  }
}

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

function run([resultFile, memoryLimitMbRaw, timeoutMsRaw, ...args]) {
  const captureSignal = args[0] === '--capture-signal';
  if (captureSignal) args.shift();
  const captureOutputLimit = captureSignal && /^\d+$/.test(args[0] || '') ? Number(args.shift()) : 1024 * 1024;
  const argv = args;
  const memoryLimitBytes = Number(memoryLimitMbRaw) > 0 ? Number(memoryLimitMbRaw) * 1024 * 1024 : null;
  const timeoutMs = Number(timeoutMsRaw) > 0 ? Number(timeoutMsRaw) : null;
  const report = (payload) => fs.writeFileSync(resultFile, JSON.stringify(payload));

  let child;
  try {
    child = spawnGuarded(argv[0], argv.slice(1), {
      shell: false,
      stdio: captureSignal ? ['ignore', 'pipe', 'inherit'] : ['ignore', 'inherit', 'inherit'],
    });
  } catch {
    report({ killed_for: 'command_not_found', code: 1, signal: null });
    return;
  }

  let killedFor = null;
  const signalStdout = [];
  let signalStdoutBytes = 0;
  const maxSignalEnvelopeBytes = Math.ceil(captureOutputLimit * 8 / 3) + 4096;
  let signalEnvelopeTooLarge = false;
  let launchError = null;
  if (captureSignal) child.stdout.on('data', (chunk) => {
    if (signalStdoutBytes + chunk.length > maxSignalEnvelopeBytes) signalEnvelopeTooLarge = true;
    else if (!signalEnvelopeTooLarge) signalStdout.push(chunk);
    if (!signalEnvelopeTooLarge) signalStdoutBytes += chunk.length;
  });
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
    launchError = error;
  });

  child.on('close', (code, signal) => {
    stopTimers();
    const task = captureSignal && !signalEnvelopeTooLarge ? parseSignalResult(Buffer.concat(signalStdout).toString()) : null;
    const expectedCode = task?.outputLimitExceeded ? 1 : task?.code;
    const taskMatches = task && code === expectedCode;
    if (captureSignal && task) {
      if (task.stdout) process.stdout.write(task.stdout);
      if (task.stderr) process.stderr.write(task.stderr);
    }
    const captureFailure = captureSignal && !taskMatches && !killedFor && !launchError ? 'signal_metadata_unavailable' : null;
    report({ killed_for: killedFor || (taskMatches && task.outputLimitExceeded ? 'partial_output' : null) || captureFailure || (launchError?.code === 'ENOENT' ? 'command_not_found' : null), code: taskMatches ? task.code : (captureFailure ? 1 : code), signal: killedFor ? signal : taskMatches ? task.signal : signal });
  });
}

if (require.main === module) {
  run(process.argv.slice(2));
}

module.exports = { run, rssBytesTree, isChildRunning, scriptPath: __filename, SIGNAL_SUPERVISOR_SOURCE, parseSignalResult };
