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

function installIdFile(target) {
  return gitPath(target, path.join('rig', 'install-id')) || path.join(target, '.rig', 'install-id');
}

function readInstallId(target) {
  const file = installIdFile(target);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8').trim() || null;
}

function installId(target) {
  const existing = readInstallId(target);
  if (existing) return existing;
  const file = installIdFile(target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
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
    const absentPendingRetry = owned.state === 'pending' && !Object.hasOwn(servers, name);
    if (owned.path !== configPath() || (!hasExpectedServer(servers, owned) && !absentPendingRetry)) {
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
      writeLedger(target, owned, opts.writeFile);
    } else {
      removeLedgerEntry(target, { kind: 'openclaw-mcp', path: configPath(), install_id: id }, opts.writeFile);
    }
  };
  try {
    require('./mcp-dependencies').setupMcp(target, { writeFile: opts.writeFile });
  } catch (error) {
    restoreLedger();
    throw error;
  }
  const set = spawnSync('openclaw', ['mcp', 'set', name, JSON.stringify(server)], {
    encoding: 'utf8',
    shell: false,
  });
  if (set.status !== 0) {
    let rollback;
    if (owned) {
      rollback = spawnSync('openclaw', ['mcp', 'set', name, JSON.stringify(owned.value)], { encoding: 'utf8', shell: false }).status === 0;
    } else {
      let serversAfterFailure;
      try { serversAfterFailure = openClawServers(); } catch { serversAfterFailure = null; }
      rollback = serversAfterFailure && !Object.hasOwn(serversAfterFailure, name)
        ? true
        : removeOpenClawMcp(target, { kind: 'openclaw-mcp', server_key: name, install_id: id, value: server }).removed;
    }
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
  const id = readInstallId(target);
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
