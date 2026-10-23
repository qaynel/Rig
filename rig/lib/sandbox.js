// Filesystem and network sandbox for agent-written projection scripts.
//
// `spawn-guarded` supplies process cleanup, not isolation, so this module owns
// the isolation promise. It never claims one it cannot show: availability is
// established by running a probe script *inside* the sandbox that must fail to
// write outside its output directory and must fail to open a TCP connection to
// a listener it can reach unsandboxed. Anything less is reported as an
// unavailable sandbox with a named reason, and callers refuse to execute.
//
// macOS: sandbox-exec with a deny-by-default-write, deny-network profile.
// Linux: bubblewrap with a read-only root, a private network namespace, and a
//        single writable output directory. Other platforms have no enforcing
//        mechanism Rig can verify, so they refuse.
'use strict';

const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { spawnGuardedSync } = require('./spawn-guarded');
const { SIGNAL_SUPERVISOR_SOURCE, parseSignalResult } = require('./memory-guarded-exec');

const PROBE_TIMEOUT_MS = 8000;
const DEFAULT_ENV_KEYS = ['PATH', 'TMPDIR', 'LANG', 'LC_ALL', 'TZ'];

function unavailable(code, reason) {
  return { available: false, code, reason };
}

function withRealPaths(...dirs) {
  const out = new Set();
  for (const dir of dirs) {
    if (!dir) continue;
    out.add(path.resolve(dir));
    try { out.add(fs.realpathSync(dir)); } catch { /* a missing directory grants nothing */ }
  }
  return [...out];
}

function sbString(value) {
  return JSON.stringify(value);
}

// Reads are denied under the user's home directory (credentials, other
// repositories) except for the directories the script legitimately needs: the
// repository and corpus it reads, its own script, and the Node installation.
function darwinProfile({ outDir, outDirs, readDirs, home, protectedDirs = [], network = false }) {
  const subpaths = (dirs) => dirs.map((dir) => `(subpath ${sbString(dir)})`).join(' ');
  const tempRoot = path.resolve(os.tmpdir());
  return [
    '(version 1)',
    '(allow default)',
    '(deny file-read*)',
    '(allow file-read-metadata)',
    // dyld opens the root directory while resolving sealed system images.
    '(allow file-read-data (literal "/"))',
    ...['/System/Library', '/usr/lib', '/dev'].map(dir => `(allow file-read* (subpath ${sbString(dir)}))`),
    '(allow process-info*)',
    ...(!network ? ['(deny network*)'] : []),
    '(deny mach-lookup (global-name "com.apple.dnssd.service") (global-name "com.apple.networkd") (global-name "com.apple.SystemConfiguration.DNSConfiguration"))',
    `(deny file-read* ${subpaths(withRealPaths(tempRoot))})`,
    `(allow file-read-metadata ${subpaths(withRealPaths(tempRoot))})`,
    `(allow file-read* ${subpaths(withRealPaths(...readDirs))})`,
    '(deny file-write*)',
    `(allow file-write* ${subpaths(withRealPaths(...(outDirs || [outDir])))} (literal "/dev/null") (literal "/dev/dtracehelper"))`,
    ...withRealPaths(...protectedDirs).map(dir => `(deny file-write* (subpath ${sbString(dir)}))`),
    `(deny file-read* ${subpaths(withRealPaths(home))})`,
    `(allow file-read-metadata ${subpaths(withRealPaths(home))})`,
    `(allow file-read* ${subpaths(withRealPaths(...readDirs))})`,
    '',
  ].join('\n');
}

function nodeReadDirs() {
  const real = fs.realpathSync(process.execPath);
  return [path.dirname(path.dirname(real)), path.dirname(real)];
}

function commandFor(kind, { script, outDir, outDirs, readDirs, home, argv, cwd = outDir, protectedDirs = [], network = false, captureSignal = false, captureOutputLimit = 1024 * 1024 }) {
  if (kind === 'sandbox-exec') {
    return {
      command: sandboxToolPath('sandbox-exec'),
      args: ['-p', darwinProfile({ outDir, outDirs, readDirs, home, protectedDirs, network }), ...(argv || [process.execPath, script])],
    };
  }
  // bubblewrap: start from an empty root. Binding the host root read-only
  // still exposes credentials and unrelated repositories to task reads.
  const args = ['--die-with-parent', '--new-session', ...(network
    ? ['--unshare-user', '--unshare-pid', '--unshare-ipc', '--unshare-uts']
    : ['--unshare-all']), '--tmpfs', '/'];
  const tempRoot = path.resolve(os.tmpdir());
  if (fs.existsSync(tempRoot)) {
    args.push('--dir', tempRoot, '--tmpfs', tempRoot);
  }

  const ensureParents = (destination) => {
    let current = path.resolve(destination);
    const missing = [];
    while (current !== path.dirname(current)) {
      missing.push(current);
      current = path.dirname(current);
    }
    for (const dir of missing.reverse()) args.push('--dir', dir);
  };
  args.push('--dir', '/dev', '--dir', '/proc');
  for (const dir of [...readDirs, ...(outDirs || [outDir]), outDir, cwd]) {
    let destination = dir;
    try { if (fs.statSync(dir).isFile()) destination = path.dirname(dir); } catch {}
    ensureParents(destination);
  }

  const systemDirs = ['/usr', '/bin', '/sbin', '/lib', '/lib64'];
  const systemFiles = [
    '/etc/hosts', '/etc/resolv.conf', '/etc/nsswitch.conf', '/etc/passwd',
    '/etc/group', '/etc/ld.so.cache',
  ];
  const systemTrustDirs = ['/etc/ssl/certs', '/etc/ca-certificates'];
  args.push('--dev', '/dev', '--proc', '/proc');
  for (const source of [...systemDirs, ...systemTrustDirs]) {
    if (!fs.existsSync(source)) continue;
    const resolved = fs.realpathSync(source);
    args.push('--ro-bind', resolved, source);
  }
  for (const source of systemFiles) {
    if (fs.existsSync(source)) args.push('--ro-bind', source, source);
  }

  const writable = new Set(withRealPaths(...(outDirs || [outDir])));
  const exposedSystem = ['/dev', '/proc', ...systemDirs]
    .filter((dir) => fs.existsSync(dir)).map((dir) => path.resolve(dir));
  for (const dir of withRealPaths(...readDirs)) {
    if (writable.has(dir) || exposedSystem.some((base) => dir === base || dir.startsWith(`${base}${path.sep}`))) continue;
    args.push('--ro-bind', dir, dir);
  }
  // Both tmpfs mounts above (the root and, separately, the scratch tmpdir)
  // are writable by default, so an unbound path anywhere in either of them
  // (e.g. a sibling of outDir under the same tmpdir) stays writable unless
  // remounted read-only here, before the writable binds below layer back on
  // top of it for only outDir/outDirs.
  args.push('--remount-ro', '/');
  if (fs.existsSync(tempRoot)) args.push('--remount-ro', tempRoot);
  for (const dir of withRealPaths(outDir)) args.push('--bind', dir, dir);
  for (const dir of withRealPaths(...(outDirs || []))) if (dir !== fs.realpathSync(outDir)) args.push('--bind', dir, dir);
  for (const dir of protectedDirs) if (fs.existsSync(dir)) args.push('--ro-bind', dir, dir);
  let launch = captureSignal ? [process.execPath, '-e', SIGNAL_SUPERVISOR_SOURCE, '--', String(captureOutputLimit), ...(argv || [process.execPath, script])] : (argv || [process.execPath, script]);
  if (!network) {
    // bwrap always brings the namespace's own loopback up with 127.0.0.1
    // assigned, so a denied task that probes it would otherwise reach a real
    // (if empty) loopback instead of getting a network-unreachable error.
    // Setting lo administratively down is not enough: the kernel then drops
    // the packets with no response at all (the connect attempt hangs rather
    // than erroring), which is indistinguishable from a wedged sandbox.
    // Flushing the address removes the route outright, so the same attempt
    // fails immediately and explicitly with ENETUNREACH. A missing `ip` is a
    // no-op, not a failure.
    launch = ['/bin/sh', '-c', 'ip addr flush dev lo 2>/dev/null; exec "$@"', 'sh', ...launch];
  }
  args.push('--chdir', cwd, '--', ...launch);
  return { command: sandboxToolPath('bwrap'), args };
}

function sandboxEnv(extra = {}) {
  const env = {};
  for (const key of DEFAULT_ENV_KEYS) if (process.env[key] != null) env[key] = process.env[key];
  return { ...env, ...extra };
}

function toolFor(platform) {
  if (platform === 'darwin') return 'sandbox-exec';
  if (platform === 'linux') return 'bwrap';
  return null;
}

function sandboxToolPath(kind, env = process.env) {
  const candidates = ['/usr/bin', '/bin', '/usr/local/bin', ...(env.PATH || '').split(path.delimiter)]
    .filter(Boolean).map((dir) => path.join(dir, kind));
  return candidates.find((file) => {
    try { fs.accessSync(file, fs.constants.X_OK); return true; } catch { return false; }
  }) || null;
}

const PROBE_SOURCE = `
const fs = require('node:fs');
const net = require('node:net');
const result = {};
try { fs.writeFileSync(process.env.RIG_PROBE_FORBIDDEN, 'x'); result.write = 'escaped'; } catch { result.write = 'denied'; }
try { fs.writeFileSync(require('node:path').join(process.env.RIG_OUT_DIR, 'probe.txt'), 'x'); result.out = 'ok'; } catch { result.out = 'denied'; }
const done = () => { console.log(JSON.stringify(result)); };
const socket = net.connect(Number(process.env.RIG_PROBE_PORT), '127.0.0.1');
socket.setTimeout(2000, () => { result.net = 'denied'; socket.destroy(); done(); });
socket.on('connect', () => { result.net = 'connected'; socket.destroy(); done(); });
socket.on('error', () => { result.net = 'denied'; done(); });
`;

// Run `script` under the sandbox with the repository and corpus readable and
// only `outDir` writable. Always returns; callers inspect status/timedOut.
function runSandboxed(kind, {
  script, outDir, readDirs, timeoutMs, env = {},
}) {
  const home = os.homedir();
  const spec = commandFor(kind, { script, outDir, readDirs: [...readDirs, ...nodeReadDirs(), path.dirname(script)], home });
  const result = spawnGuardedSync(spec.command, spec.args, {
    cwd: outDir,
    env: sandboxEnv(env),
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    timedOut: result.error?.code === 'ETIMEDOUT',
  };
}

function executablePath(command, cwd, env) {
  const candidate = command.includes(path.sep)
    ? path.resolve(cwd, command)
    : (env.PATH || '').split(path.delimiter).filter(Boolean)
      .map((dir) => path.join(dir, command)).find((file) => {
        try { fs.accessSync(file, fs.constants.X_OK); return true; } catch { return false; }
      });
  if (!candidate) return null;
  try { return fs.realpathSync(candidate); } catch { return candidate; }
}

// Repository-owned check tasks share the projection-script OS sandbox: the
// repository is the only writable mount and the user's home is hidden except
// for the repository and the runtimes needed to launch the selected tools.
function taskPath(env = {}) {
  const native = process.platform === 'darwin' && fs.existsSync('/Library/Developer/CommandLineTools/usr/bin/git')
    ? ['/Library/Developer/CommandLineTools/usr/bin'] : [];
  return [...native, env.PATH ?? process.env.PATH ?? ''].filter(Boolean).join(path.delimiter);
}

function taskCommandSpec({ target, cwd, argv, env = {}, network = false, trustedReadDirs = [], captureOutputLimit = 1024 * 1024 }) {
  const detected = detectSandboxSync();
  if (!detected.available) return { unavailable: detected.code, reason: detected.reason };
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-task-runtime-'));
  const toolPaths = process.platform === 'darwin' && fs.existsSync('/Library/Developer/CommandLineTools/usr/bin/git')
    ? ['/Library/Developer/CommandLineTools/usr/bin'] : [];
  const taskEnv = sandboxEnv({
    ...env,
    PATH: taskPath(env),
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_TERMINAL_PROMPT: '0',
    HOME: scratch,
    USERPROFILE: scratch,
    TMPDIR: scratch,
    TMP: scratch,
    TEMP: scratch,
  });
  const runtimeDirs = [...nodeReadDirs()];
  for (const command of [argv?.[0], process.execPath, '/bin/sh', '/bin/bash', '/usr/bin/env']) {
    if (!command) continue;
    const resolved = executablePath(command, cwd, taskEnv);
    if (resolved) runtimeDirs.push(resolved);
  }
  const systemDirs = process.platform === 'darwin'
    ? ['/System/Library', '/Library/Apple/System/Library', '/Library/Developer/CommandLineTools/usr/lib', '/Library/Developer/CommandLineTools/usr/share', '/usr/lib', '/usr/bin', '/bin', '/sbin', '/dev', ...toolPaths]
    : ['/usr/lib', '/usr/lib64', '/usr/bin', '/bin', '/sbin', '/dev'];
  const captureSignal = detected.kind === 'bwrap';
  const spec = commandFor(detected.kind, {
    outDir: target,
    outDirs: [target, scratch],
    protectedDirs: ['.git', '.rig'].map(name => path.join(target, name)),
    cwd,
    readDirs: [...runtimeDirs, ...systemDirs.filter(dir => fs.existsSync(dir)), ...trustedReadDirs, target, scratch],
    home: os.homedir(),
    argv,
    network,
    captureSignal,
    captureOutputLimit,
  });
  return { ...spec, env: taskEnv, scratch, captureSignal, captureOutputLimit, cleanup: () => fs.rmSync(scratch, { recursive: true, force: true }) };
}

function runTaskSandboxed(options) {
  const spec = taskCommandSpec({ ...options, captureOutputLimit: options.maxBuffer || 1024 * 1024 });
  if (spec.unavailable) return { status: 1, stdout: '', stderr: spec.reason, unavailable: spec.unavailable };
  let result;
  try {
    result = spawnGuardedSync(spec.command, spec.args, {
      cwd: options.cwd,
      env: spec.env,
      encoding: 'utf8',
      timeout: options.timeoutMs,
      // rig: reserve separate envelope headroom; the supervisor enforces the
      // original per-stream task-output ceiling before encoding its result.
      maxBuffer: spec.captureSignal ? Math.ceil((options.maxBuffer || 1024 * 1024) * 8 / 3) + 4096 : options.maxBuffer,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } finally { spec.cleanup(); }
  const task = spec.captureSignal ? parseSignalResult(result.stdout) : null;
  const expectedStatus = task?.outputLimitExceeded ? 1 : task?.code;
  const metadataMatches = task && result.status === expectedStatus;
  const stdout = task?.stdout ?? (spec.captureSignal ? '' : result.stdout || '');
  const stderr = task?.stderr ?? (result.stderr || '');
  const outputLimitExceeded = Boolean(task?.outputLimitExceeded);
  const captureFailure = spec.captureSignal && (!metadataMatches || result.error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER');
  return {
    status: captureFailure ? 1 : task?.code ?? result.status,
    signal: metadataMatches ? task.signal : result.signal,
    stdout,
    stderr,
    error: result.error || (captureFailure ? { code: 'RIG_SIGNAL_METADATA_UNAVAILABLE' }
      : outputLimitExceeded ? { code: 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' } : undefined),
    unavailable: result.error?.code === 'ENOENT' ? 'sandbox-tool-missing' : null,
    scratch: spec.scratch,
  };
}

function probe(kind) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-sandbox-probe-'));
  const outDir = path.join(work, 'out');
  const forbidden = path.join(work, 'forbidden.txt');
  const script = path.join(work, 'probe.js');
  fs.mkdirSync(outDir);
  fs.writeFileSync(script, PROBE_SOURCE);
  // The listener lives in this process. spawnSync blocks our event loop, but
  // the kernel completes the TCP handshake into the backlog on its own, so an
  // unsandboxed connect() succeeds without us ever calling accept().
  const server = net.createServer();
  try {
    return new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        const run = runSandboxed(kind, {
          script, outDir, readDirs: [work], timeoutMs: PROBE_TIMEOUT_MS,
          env: { RIG_OUT_DIR: outDir, RIG_PROBE_FORBIDDEN: forbidden, RIG_PROBE_PORT: String(port) },
        });
        server.close();
        let report = null;
        try { report = JSON.parse(run.stdout.trim().split('\n').pop()); } catch { /* handled below */ }
        const escaped = fs.existsSync(forbidden);
        fs.rmSync(work, { recursive: true, force: true });
        if (!report || run.status !== 0) {
          resolve(unavailable('sandbox-probe-failed', `the ${kind} probe could not run (status ${run.status}); isolation cannot be shown`));
        } else if (escaped || report.write !== 'denied') {
          resolve(unavailable('sandbox-probe-failed', `the ${kind} probe wrote outside its output directory; filesystem isolation is not enforced`));
        } else if (report.net !== 'denied') {
          resolve(unavailable('sandbox-probe-failed', `the ${kind} probe reached the network; network isolation is not enforced`));
        } else if (report.out !== 'ok') {
          resolve(unavailable('sandbox-probe-failed', `the ${kind} probe could not write its own output directory`));
        } else {
          resolve({ available: true, kind });
        }
      });
    });
  } catch (error) {
    server.close();
    fs.rmSync(work, { recursive: true, force: true });
    return Promise.resolve(unavailable('sandbox-probe-failed', error.message));
  }
}

let cached = null;

// The probe needs the event loop for its loopback listener, so detection is
// asynchronous; a synchronous caller (apply) uses detectSandboxSync below,
// which runs the probe in a short-lived child process.
async function detectSandbox({ env = process.env, platform = process.platform } = {}) {
  if (env.RIG_SANDBOX_DISABLE === '1') {
    return unavailable('sandbox-disabled', 'RIG_SANDBOX_DISABLE=1 forbids running agent-written projection scripts');
  }
  const kind = toolFor(platform);
  if (!kind) return unavailable('sandbox-unsupported-platform', `no verifiable filesystem and network sandbox exists for ${platform}`);
  if (!sandboxToolPath(kind, env)) return unavailable('sandbox-tool-missing', `${kind} is not installed; install it to run agent-written projection scripts`);
  if (!cached || cached.kind !== kind) cached = await probe(kind);
  return cached;
}

// Synchronous detection for the apply path: the same probe, run in a child
// process whose event loop hosts the listener.
function detectSandboxSync({ env = process.env, platform = process.platform } = {}) {
  if (env.RIG_SANDBOX_DISABLE === '1') {
    return unavailable('sandbox-disabled', 'RIG_SANDBOX_DISABLE=1 forbids running agent-written projection scripts');
  }
  const kind = toolFor(platform);
  if (!kind) return unavailable('sandbox-unsupported-platform', `no verifiable filesystem and network sandbox exists for ${platform}`);
  if (!sandboxToolPath(kind, env)) return unavailable('sandbox-tool-missing', `${kind} is not installed; install it to run agent-written projection scripts`);
  if (cached && cached.kind === kind) return cached;
  const result = spawnGuardedSync(process.execPath, [
    '-e', `require(${JSON.stringify(__filename)}).detectSandbox({ env: {}, platform: ${JSON.stringify(platform)} }).then((r) => console.log(JSON.stringify(r)))`,
  ], { encoding: 'utf8', timeout: PROBE_TIMEOUT_MS * 2, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    cached = JSON.parse(result.stdout.trim().split('\n').pop());
  } catch {
    cached = unavailable('sandbox-probe-failed', `the ${kind} probe produced no result`);
  }
  return cached;
}

function resetSandboxCache() {
  cached = null;
}

module.exports = {
  detectSandbox, detectSandboxSync, runSandboxed, runTaskSandboxed, resetSandboxCache, darwinProfile,
  taskCommandSpec, commandFor, taskPath,
};
