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
const { spawnGuardedSync, executableAvailable } = require('./spawn-guarded');

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
function darwinProfile({ outDir, readDirs, home }) {
  const subpaths = (dirs) => dirs.map((dir) => `(subpath ${sbString(dir)})`).join(' ');
  return [
    '(version 1)',
    '(allow default)',
    '(deny network*)',
    '(deny mach-lookup (global-name "com.apple.dnssd.service") (global-name "com.apple.networkd") (global-name "com.apple.SystemConfiguration.DNSConfiguration"))',
    '(deny file-write*)',
    `(allow file-write* ${subpaths(withRealPaths(outDir))} (literal "/dev/null") (literal "/dev/dtracehelper"))`,
    `(deny file-read* ${subpaths(withRealPaths(home))})`,
    `(allow file-read* ${subpaths(withRealPaths(...readDirs))})`,
    '',
  ].join('\n');
}

function nodeReadDirs() {
  const real = fs.realpathSync(process.execPath);
  return [path.dirname(path.dirname(real)), path.dirname(real)];
}

function commandFor(kind, { script, outDir, readDirs, home }) {
  if (kind === 'sandbox-exec') {
    return {
      command: 'sandbox-exec',
      args: ['-p', darwinProfile({ outDir, readDirs, home }), process.execPath, script],
    };
  }
  // bubblewrap: read-only host root, private namespaces (network included),
  // home hidden behind a tmpfs with only the needed directories restored.
  const args = ['--die-with-parent', '--new-session', '--unshare-all', '--ro-bind', '/', '/', '--dev', '/dev', '--proc', '/proc'];
  if (home && fs.existsSync(home)) {
    args.push('--tmpfs', home);
    for (const dir of withRealPaths(...readDirs)) {
      if (dir === home || dir.startsWith(`${home}${path.sep}`)) args.push('--ro-bind', dir, dir);
    }
  }
  for (const dir of withRealPaths(outDir)) args.push('--bind', dir, dir);
  args.push('--chdir', outDir, '--', process.execPath, script);
  return { command: 'bwrap', args };
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
  if (!executableAvailable(kind)) return unavailable('sandbox-tool-missing', `${kind} is not installed; install it to run agent-written projection scripts`);
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
  if (!executableAvailable(kind)) return unavailable('sandbox-tool-missing', `${kind} is not installed; install it to run agent-written projection scripts`);
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
  detectSandbox, detectSandboxSync, runSandboxed, resetSandboxCache, darwinProfile,
};
