'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { containedPath, gitPath } = require('./path-safety');

function have(command) {
  return (process.env.PATH || '').split(path.delimiter).some((dir) => {
    try {
      fs.accessSync(path.join(dir, command), fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });
}

function requireTool(command) {
  if (!have(command)) throw new Error(`rig: --openclaw-mcp requires '${command}' on PATH`);
}

function installId(target) {
  const file = gitPath(target, path.join('rig', 'install-id')) || path.join(target, '.rig', 'install-id');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    const existing = fs.readFileSync(file, 'utf8').trim();
    if (existing) return existing;
  }
  const id = crypto.randomUUID();
  fs.writeFileSync(file, `${id}\n`);
  return id;
}

function configPath() {
  return process.env.OPENCLAW_CONFIG_PATH || path.join(process.env.HOME || os.homedir(), '.openclaw', 'openclaw.json');
}

function readLedger(file) {
  if (!fs.existsSync(file)) return { schema_version: 1, entries: [] };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeLedger(target, entry, writeFile = null) {
  const file = containedPath(target, '.rig/global-writes.json');
  const ledger = readLedger(file);
  ledger.entries = (ledger.entries || []).filter((existing) =>
    !(existing.kind === entry.kind && existing.install_id === entry.install_id && existing.path === entry.path));
  ledger.entries.push(entry);
  const body = `${JSON.stringify(ledger, null, 2)}\n`;
  if (writeFile) writeFile(target, '.rig/global-writes.json', body);
  else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }
}

function removeLedgerEntry(target, entry, writeFile = null) {
  const file = containedPath(target, '.rig/global-writes.json');
  const ledger = readLedger(file);
  ledger.entries = (ledger.entries || []).filter((existing) =>
    !(existing.kind === entry.kind && existing.install_id === entry.install_id && existing.path === entry.path));
  const body = `${JSON.stringify(ledger, null, 2)}\n`;
  if (writeFile) writeFile(target, '.rig/global-writes.json', body);
  else fs.writeFileSync(file, body);
}

function journalTree(target, source, destRel, writeFile) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const rel = path.join(destRel, entry.name);
    if (entry.isDirectory()) journalTree(target, src, rel, writeFile);
    else if (entry.isFile()) writeFile(target, rel, fs.readFileSync(src), fs.statSync(src).mode & 0o777);
  }
}

function openClawServers() {
  const result = spawnSync('openclaw', ['mcp', 'show', '--json'], {
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`rig: openclaw mcp show failed: ${result.stderr || result.stdout}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch {
    throw new Error('rig: openclaw mcp show returned invalid JSON');
  }
  const servers = parsed?.mcp?.servers || parsed?.servers || parsed;
  if (!servers || Array.isArray(servers) || typeof servers !== 'object') {
    throw new Error('rig: openclaw mcp show returned an invalid server registry');
  }
  return servers;
}

function sameJson(left, right) {
  if (left === right) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length &&
      left.every((value, index) => sameJson(value, right[index]));
  }
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return leftKeys.length === rightKeys.length &&
    leftKeys.every((key, index) => key === rightKeys[index] && sameJson(left[key], right[key]));
}

function hasExpectedServer(servers, entry) {
  const name = entry.server_key || entry.install_id;
  return Boolean(entry.value) && Object.hasOwn(servers, name) && sameJson(servers[name], entry.value);
}

function registerOpenClawMcp(target, opts = {}) {
  requireTool('openclaw');
  requireTool('node');
  requireTool('npm');
  const id = installId(target);
  const name = `rig-${id}`;
  const runtime = '.rig/runtime/rig-mcp';
  const runtimeDir = containedPath(target, runtime);
  const ledgerFile = containedPath(target, '.rig/global-writes.json');
  const ledger = readLedger(ledgerFile);
  const conflict = (ledger.entries || []).find((entry) => entry.server_key === name && entry.install_id !== id);
  if (conflict) throw new Error(`rig: refusing to overwrite OpenClaw server ${name}; it is owned by another install`);
  const owned = (ledger.entries || []).find((entry) => entry.kind === 'openclaw-mcp'
    && entry.install_id === id && entry.server_key === name);
  const servers = openClawServers();
  if (owned) {
    if (owned.path !== configPath() || !hasExpectedServer(servers, owned)) {
      throw new Error(`rig: refusing to overwrite changed OpenClaw server ${name}`);
    }
  } else if (Object.hasOwn(servers, name)) {
    throw new Error(`rig: refusing to overwrite existing unowned OpenClaw server ${name}`);
  }
  const serverPath = path.join(path.resolve(target), runtime, 'index.js');
  if (!fs.existsSync(path.join(runtimeDir, 'package-lock.json'))) {
    throw new Error('rig: --openclaw-mcp requires bundled rig-mcp/package-lock.json');
  }
  const server = { command: 'node', args: [serverPath] };
  writeLedger(target, {
    kind: 'openclaw-mcp',
    path: configPath(),
    server_key: name,
    install_id: id,
    runtime,
    value: server,
    state: 'pending',
  }, opts.writeFile);
  const restoreLedger = () => {
    if (owned) {
      writeLedger(target, { ...owned, state: 'applied' }, opts.writeFile);
    } else {
      removeLedgerEntry(target, { kind: 'openclaw-mcp', path: configPath(), install_id: id }, opts.writeFile);
    }
  };
  const installDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mcp-runtime-'));
  try {
    fs.copyFileSync(path.join(runtimeDir, 'package.json'), path.join(installDir, 'package.json'));
    fs.copyFileSync(path.join(runtimeDir, 'package-lock.json'), path.join(installDir, 'package-lock.json'));
    const installed = spawnSync('npm', ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--prefix', installDir], {
      encoding: 'utf8',
      shell: false,
    });
    if (installed.status !== 0) {
      throw new Error(`rig: npm ci failed for bundled rig-mcp runtime: ${installed.stderr || installed.stdout}`);
    }
    const installedModules = path.join(installDir, 'node_modules');
    if (fs.existsSync(installedModules)) {
      if (opts.writeFile) journalTree(target, installedModules, path.join(runtime, 'node_modules'), opts.writeFile);
      else fs.cpSync(installedModules, path.join(runtimeDir, 'node_modules'), { recursive: true });
    }
  } catch (error) {
    restoreLedger();
    throw error;
  } finally {
    fs.rmSync(installDir, { recursive: true, force: true });
  }
  const set = spawnSync('openclaw', ['mcp', 'set', name, JSON.stringify(server)], {
    encoding: 'utf8',
    shell: false,
  });
  if (set.status !== 0) {
    const rollback = owned
      ? spawnSync('openclaw', ['mcp', 'set', name, JSON.stringify(owned.value)], { encoding: 'utf8', shell: false }).status === 0
      : removeOpenClawMcp(target, { kind: 'openclaw-mcp', server_key: name, install_id: id, value: server }).removed;
    if (rollback) restoreLedger();
    throw new Error(`rig: openclaw mcp set failed: ${set.stderr || set.stdout}`);
  }
  writeLedger(target, {
    kind: 'openclaw-mcp',
    path: configPath(),
    server_key: name,
    install_id: id,
    runtime,
    value: server,
    state: 'applied',
  }, opts.writeFile);
  return { name, path: configPath(), server };
}

function removeOpenClawMcp(target, entry) {
  if (!have('openclaw')) return { removed: false, tooling_missing: true };
  const id = installId(target);
  const ownedName = id ? `rig-${id}` : null;
  const serverKey = entry.server_key || entry.install_id;
  if (
    !ownedName || entry.install_id !== id || serverKey !== ownedName ||
    !entry.value || typeof entry.value !== 'object' || Array.isArray(entry.value)
  ) return { removed: false, tooling_missing: false };
  let servers;
  try {
    servers = openClawServers();
  } catch {
    // Tool is present but show/unset failed — treat as unregister failure so
    // uninstall stops before deleting files a live global entry may still need.
    return { removed: false, tooling_missing: false };
  }
  if (!hasExpectedServer(servers, entry)) return { removed: false, tooling_missing: false };
  const unset = spawnSync('openclaw', ['mcp', 'unset', entry.server_key || entry.install_id], {
    encoding: 'utf8',
    shell: false,
  });
  if (unset.status !== 0) return { removed: false, tooling_missing: false };
  return { removed: true };
}

module.exports = { registerOpenClawMcp, removeOpenClawMcp };
