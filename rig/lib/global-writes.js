'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const GLOBAL_MCP_CONTRACTS = Object.freeze({
  windsurf: Object.freeze({
    relative_path: '.codeium/windsurf/mcp_config.json',
    format: 'json',
    server_key: 'mcpServers',
    citation: 'https://docs.devin.ai/desktop/cascade/mcp',
  }),
  cline: Object.freeze({
    relative_path: '.cline/data/settings/cline_mcp_settings.json',
    format: 'json',
    server_key: 'mcpServers',
    citation: 'https://docs.cline.bot/getting-started/config',
  }),
  hermes: Object.freeze({
    relative_path: '.hermes/config.yaml',
    format: 'yaml',
    server_key: 'mcp_servers',
    citation: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp',
  }),
  codewhale: Object.freeze({
    relative_path: '.codewhale/mcp.json',
    format: 'json',
    server_key: 'servers',
    citation: 'https://github.com/Hmbown/CodeWhale/blob/main/docs/MCP.md',
  }),
});

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function cleanKeyPart(value) {
  return value.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function ownedServerKey(installId, serverName) {
  for (const [label, value] of [['install_id', installId], ['server_name', serverName]]) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} required`);
  }
  const id = cleanKeyPart(installId);
  const name = cleanKeyPart(serverName);
  if (!id || !name) throw new Error('install_id and server_name need a usable character');
  const key = `rig-${id}-${name}`;
  return key;
}

function yamlBlock(serverKey, value) {
  return [
    `  # rig:${serverKey}:start`,
    `  ${serverKey}: ${JSON.stringify(value)}`,
    `  # rig:${serverKey}:end`,
  ].join('\n');
}

function mergeYamlServer(file, containerKey, serverKey, value) {
  const original = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (/\t/.test(original)) throw new Error(`rig: ${file} uses unsupported YAML tabs; left unchanged`);
  const block = yamlBlock(serverKey, value);
  const marker = serverKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const owned = new RegExp(`  # rig:${marker}:start\\n[\\s\\S]*?  # rig:${marker}:end`);
  let next;
  let createdContainer = false;
  if (owned.test(original)) {
    next = original.replace(owned, block);
  } else {
    const lines = original.split('\n');
    const declarations = lines.reduce((found, line, index) => {
      if (new RegExp(`^${containerKey}:`).test(line)) found.push(index);
      return found;
    }, []);
    if (declarations.length > 1) throw new Error(`rig: ${file} has duplicate ${containerKey} sections; left unchanged`);
    if (declarations.length === 0) {
      createdContainer = true;
      const separator = original && !original.endsWith('\n') ? '\n' : '';
      next = `${original}${separator}${containerKey}:\n${block}\n`;
    } else {
      const index = declarations[0];
      if (!new RegExp(`^${containerKey}:[ \\t]*(?:#.*)?$`).test(lines[index])) {
        throw new Error(`rig: ${containerKey} in ${file} must be a block mapping; left unchanged`);
      }
      lines.splice(index + 1, 0, block);
      next = lines.join('\n');
    }
  }
  if (next !== original) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, next);
  }
  return { created_container: createdContainer };
}

function mergeHostGlobalMcp(host, home, { install_id, server_name, value }) {
  const contract = GLOBAL_MCP_CONTRACTS[host];
  if (!contract) throw new Error(`rig: no user-global MCP contract for ${host}`);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('value must be an object');
  const file = path.join(home, contract.relative_path);
  const serverKey = ownedServerKey(install_id, server_name);
  let metadata = {};
  if (contract.format === 'json') {
    let current = {};
    if (fs.existsSync(file)) {
      try {
        current = readJson(file);
      } catch {
        throw new Error(`rig: invalid JSON in ${file}; left unchanged`);
      }
    }
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      throw new Error(`rig: ${file} root must be an object; left unchanged`);
    }
    const existing = current[contract.server_key];
    if (existing !== undefined && (!existing || typeof existing !== 'object' || Array.isArray(existing))) {
      throw new Error(`rig: ${contract.server_key} in ${file} must be an object; left unchanged`);
    }
    const next = { ...current, [contract.server_key]: { ...(existing || {}), [serverKey]: value } };
    if (!sameJson(current, next)) writeJson(file, next);
    metadata.created_container = existing === undefined;
  } else {
    metadata = mergeYamlServer(file, contract.server_key, serverKey, value);
  }
  return {
    kind: 'global-mcp',
    host,
    path: file,
    format: contract.format,
    container_key: contract.server_key,
    server_key: serverKey,
    install_id,
    value,
    ...metadata,
  };
}

function removeGlobalMcp(entry) {
  if (!entry || !fs.existsSync(entry.path)) return { removed: false };
  const contract = GLOBAL_MCP_CONTRACTS[entry.host];
  const home = process.env.HOME || os.homedir();
  if (
    !contract || entry.format !== contract.format || entry.container_key !== contract.server_key ||
    path.resolve(entry.path) !== path.resolve(home, contract.relative_path) ||
    typeof entry.install_id !== 'string' || typeof entry.server_key !== 'string' ||
    !cleanKeyPart(entry.install_id) || !entry.server_key.startsWith(`rig-${cleanKeyPart(entry.install_id)}-`) ||
    !entry.value || typeof entry.value !== 'object' || Array.isArray(entry.value)
  ) return { removed: false };
  if (entry.format === 'yaml') {
    const source = fs.readFileSync(entry.path, 'utf8');
    const expected = yamlBlock(entry.server_key, entry.value);
    if (!source.includes(expected)) return { removed: false };
    let next = source.replace(expected, '');
    if (entry.created_container) {
      const escaped = entry.container_key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      next = next.replace(new RegExp(`(?:^|\\n)${escaped}:\\n(?=\\n|$)`), (match) => match.startsWith('\n') ? '\n' : '');
    }
    fs.writeFileSync(entry.path, next);
    return { removed: true };
  }
  let current;
  try {
    current = readJson(entry.path);
  } catch {
    return { removed: false };
  }
  const servers = current && current[entry.container_key];
  if (!servers || !Object.hasOwn(servers, entry.server_key) || !sameJson(servers[entry.server_key], entry.value)) {
    return { removed: false };
  }
  delete servers[entry.server_key];
  if (entry.created_container && Object.keys(servers).length === 0) delete current[entry.container_key];
  writeJson(entry.path, current);
  return { removed: true };
}

function mergeGlobalConfig(file, { install_id, value }) {
  if (!install_id) throw new Error('install_id required');
  const current = fs.existsSync(file) ? readJson(file) : {};
  const rig = current.rig && typeof current.rig === 'object' ? current.rig : {};
  rig[install_id] = value;
  const next = { ...current, rig };
  writeJson(file, next);
  return { install_line: `rig install ${install_id} at ${file}`, path: file };
}

function removeGlobalConfig(file, install_id) {
  if (!fs.existsSync(file)) return { removed: false };
  const current = readJson(file);
  if (!current.rig || !(install_id in current.rig)) return { removed: false };
  delete current.rig[install_id];
  writeJson(file, current);
  return { removed: true };
}

module.exports = {
  GLOBAL_MCP_CONTRACTS,
  mergeGlobalConfig,
  mergeHostGlobalMcp,
  removeGlobalConfig,
  removeGlobalMcp,
};
