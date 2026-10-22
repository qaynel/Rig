'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
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

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function jsonSpans(source) {
  JSON.parse(source);
  let at = 0;
  const whitespace = () => { while (/\s/.test(source[at] || '')) at += 1; };
  const string = () => {
    const start = at++;
    while (at < source.length) {
      if (source[at] === '\\') at += 2;
      else if (source[at++] === '"') return { start, end: at, value: JSON.parse(source.slice(start, at)) };
    }
    throw new Error('invalid JSON string');
  };
  const value = () => {
    whitespace();
    const start = at;
    if (source[at] === '"') {
      const parsed = string();
      return { type: 'scalar', start, end: parsed.end };
    }
    if (source[at] === '{') {
      at += 1;
      const properties = [];
      const keys = new Set();
      whitespace();
      while (source[at] !== '}') {
        whitespace();
        const key = string();
        if (keys.has(key.value)) throw new Error(`duplicate JSON key: ${key.value}`);
        keys.add(key.value);
        whitespace();
        if (source[at++] !== ':') throw new Error('invalid JSON object');
        const child = value();
        properties.push({ key: key.value, keyStart: key.start, value: child });
        whitespace();
        if (source[at] === '}') break;
        if (source[at++] !== ',') throw new Error('invalid JSON object');
      }
      at += 1;
      return { type: 'object', start, end: at, properties };
    }
    if (source[at] === '[') {
      at += 1;
      whitespace();
      while (source[at] !== ']') {
        value();
        whitespace();
        if (source[at] === ']') break;
        if (source[at++] !== ',') throw new Error('invalid JSON array');
      }
      at += 1;
      return { type: 'array', start, end: at };
    }
    while (at < source.length && !/[\s,\]}]/.test(source[at])) at += 1;
    return { type: 'scalar', start, end: at };
  };
  whitespace();
  const root = value();
  whitespace();
  if (at !== source.length || root.type !== 'object') throw new Error('JSON root must be an object');
  return root;
}

function jsonObjectAt(root, keys) {
  let current = root;
  for (const key of keys) {
    if (current.type !== 'object') return null;
    const property = current.properties.find((entry) => entry.key === key);
    current = property?.value;
  }
  return current?.type === 'object' ? current : null;
}

function setJsonMember(source, objectPath, key, value) {
  const root = jsonSpans(source);
  const object = jsonObjectAt(root, objectPath);
  if (!object) throw new Error(`rig: JSON object ${objectPath.join('.')} is unavailable`);
  const existing = object.properties.find((property) => property.key === key);
  const encoded = JSON.stringify(value);
  if (existing) return `${source.slice(0, existing.value.start)}${encoded}${source.slice(existing.value.end)}`;
  const indent = '  '.repeat(objectPath.length + 1);
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  if (object.properties.length === 0) {
    const whitespaceInside = source.slice(object.start + 1, object.end - 1);
    const insertion = whitespaceInside.includes('\n')
      ? `${newline}${indent}${JSON.stringify(key)}: ${encoded}`
      : ` ${JSON.stringify(key)}: ${encoded}`;
    return `${source.slice(0, object.start + 1)}${insertion}${source.slice(object.start + 1)}`;
  }
  const last = object.properties.at(-1);
  const tail = source.slice(last.value.end, object.end - 1);
  const insertion = tail.includes('\n')
    ? `,${newline}${indent}${JSON.stringify(key)}: ${encoded}`
    : `, ${JSON.stringify(key)}: ${encoded}`;
  return `${source.slice(0, last.value.end)}${insertion}${source.slice(last.value.end)}`;
}

function removeJsonMember(source, objectPath, key) {
  const root = jsonSpans(source);
  const object = jsonObjectAt(root, objectPath);
  if (!object) return { source, removed: false };
  const index = object.properties.findIndex((property) => property.key === key);
  if (index < 0) return { source, removed: false };
  const property = object.properties[index];
  if (index < object.properties.length - 1) {
    const comma = source.indexOf(',', property.value.end);
    return { source: `${source.slice(0, property.keyStart)}${source.slice(comma + 1)}`, removed: true };
  }
  if (index > 0) {
    const comma = source.lastIndexOf(',', property.keyStart);
    return { source: `${source.slice(0, comma)}${source.slice(property.value.end)}`, removed: true };
  }
  return { source: `${source.slice(0, property.keyStart)}${source.slice(property.value.end)}`, removed: true };
}

// Shared metadata carries container provenance across repository removal order.
// It never stores unrelated credentials: only the original lexical container insertion.
function lexicalDigest(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function ownershipFile(file) { return path.join(path.dirname(file), `.rig-${path.basename(file)}.ownership.json`); }
function ownershipStat(metadata) {
  let stat;
  try { stat = fs.lstatSync(metadata); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) {
    throw new Error('rig: unsafe global ownership metadata; manual repair required');
  }
  return stat;
}
function globalConfigSnapshot(file) {
  let pathStat;
  try { pathStat = fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!pathStat.isFile() || pathStat.isSymbolicLink() || pathStat.nlink !== 1) {
    throw new Error('rig: unsafe global config file; manual repair required');
  }
  let fd;
  try {
    fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.nlink !== 1 || opened.dev !== pathStat.dev || opened.ino !== pathStat.ino) {
      throw new Error('rig: unsafe global config file; manual repair required');
    }
    const bytes = fs.readFileSync(fd);
    const current = fs.lstatSync(file);
    if (!current.isFile() || current.isSymbolicLink() || current.nlink !== 1
        || current.dev !== opened.dev || current.ino !== opened.ino) {
      throw new Error('rig: global config changed while reading; manual repair required');
    }
    return { bytes, stat: opened };
  } catch (error) {
    if (error.code === 'ELOOP') throw new Error('rig: unsafe global config file; manual repair required');
    throw error;
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}
function sameGlobalConfigSnapshot(current, expected) {
  if (current === null || expected === null) return current === expected;
  return current.stat.dev === expected.stat.dev && current.stat.ino === expected.stat.ino
    && current.bytes.equals(expected.bytes);
}
function assertGlobalConfigUnchanged(file, expected) {
  let current;
  try { current = globalConfigSnapshot(file); }
  catch (error) { throw new Error(`rig: unsafe or changed global config file; manual repair required (${error.message})`); }
  if (!sameGlobalConfigSnapshot(current, expected)) {
    throw new Error('rig: global config changed during update; manual repair required');
  }
}
function syncGlobalDirectory(dir) {
  const fd = fs.openSync(dir, 'r');
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function writeGlobalConfig(file, bytes, expected) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  assertGlobalConfigUnchanged(file, expected);
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(tmp, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (fs.constants.O_NOFOLLOW || 0), expected ? (expected.stat.mode & 0o777) : 0o600);
    fs.fchmodSync(fd, expected ? (expected.stat.mode & 0o777) : 0o600);
    fs.writeFileSync(fd, bytes);
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    assertGlobalConfigUnchanged(file, expected);
    fs.renameSync(tmp, file);
    syncGlobalDirectory(path.dirname(file));
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    fs.rmSync(tmp, { force: true });
  }
}
function removeGlobalConfigFile(file, expected) {
  assertGlobalConfigUnchanged(file, expected);
  fs.unlinkSync(file);
  syncGlobalDirectory(path.dirname(file));
}
function readOwnership(file) {
  const metadata = ownershipFile(file);
  if (!ownershipStat(metadata)) return { entries: {} };
  const value = readJson(metadata);
  if (!value || !value.entries || typeof value.entries !== 'object' || Array.isArray(value.entries)) throw new Error('rig: invalid global ownership metadata; manual repair required');
  return value;
}
function saveOwnership(file, ownership) {
  const metadata = ownershipFile(file);
  if (!Object.keys(ownership.entries).length) {
    if (ownershipStat(metadata)) fs.unlinkSync(metadata);
    return;
  }
  fs.mkdirSync(path.dirname(metadata), { recursive: true });
  ownershipStat(metadata);
  const tmp = `${metadata}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeFileSync(fd, `${JSON.stringify(ownership)}\n`);
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    // Replacing a sidecar atomically never writes through a preexisting hard link.
    ownershipStat(metadata);
    fs.renameSync(tmp, metadata);
    const dirFd = fs.openSync(path.dirname(metadata), 'r');
    try { fs.fsyncSync(dirFd); } finally { fs.closeSync(dirFd); }
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    fs.rmSync(tmp, { force: true });
  }
}
function trackJsonAddition(file, source, container, key, value) {
  const ownership = readOwnership(file);
  const root = jsonSpans(source);
  const object = jsonObjectAt(root, [container]);
  const property = object?.properties.find(row => row.key === key);
  const prior = ownership.entries[key];
  if (property && (!prior || source.slice(property.value.start, property.value.end) !== prior.bytes)) {
    throw new Error('rig: global entry changed or is unowned; left unchanged; manual repair required');
  }
  if (!object && ownership.baseline_digest === undefined) {
    // Keep only the lexical outer bytes needed to remove our added container.
    const template = setJsonMember(source, [], container, {});
    let start = 0;
    while (start < source.length && source[start] === template[start]) start += 1;
    ownership.baseline_digest = lexicalDigest(source);
    ownership.container = container;
    ownership.empty_template_digest = lexicalDigest(template);
    ownership.insertion_start = start;
    ownership.insertion_length = template.length - source.length;
    ownership.created_file = !fs.existsSync(file);
  }
  ownership.entries[key] = { bytes: JSON.stringify(value) };
  return ownership;
}
function finishJsonRemoval(file, source, container, key, ownership, snapshot) {
  delete ownership.entries[key];
  let next = source;
  const object = jsonObjectAt(jsonSpans(next), [container]);
  if (object?.properties.length === 0 && ownership.container === container) {
    const normalized = `${next.slice(0, object.start)}{}${next.slice(object.end)}`;
    if (lexicalDigest(normalized) === ownership.empty_template_digest) next = normalized.slice(0, ownership.insertion_start) + normalized.slice(ownership.insertion_start + ownership.insertion_length);
    else next = removeJsonMember(next, [], container).source;
  }
  if (ownership.created_file && lexicalDigest(next) === ownership.baseline_digest && !Object.keys(ownership.entries).length) removeGlobalConfigFile(file, snapshot);
  else writeGlobalConfig(file, next, snapshot);
  saveOwnership(file, ownership);
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
  const snapshot = globalConfigSnapshot(file);
  const original = snapshot ? snapshot.bytes.toString('utf8') : '';
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
    writeGlobalConfig(file, next, snapshot);
  }
  return { created_container: createdContainer, created_file: snapshot === null };
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
    const snapshot = globalConfigSnapshot(file);
    const created_file = snapshot === null;
    let source = created_file ? '{}' : snapshot.bytes.toString('utf8');
    if (!created_file) {
      try {
        current = JSON.parse(source);
        jsonSpans(source);
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
    const ownership = trackJsonAddition(file, source, contract.server_key, serverKey, value);
    const created_container = existing === undefined;
    if (created_container) source = setJsonMember(source, [], contract.server_key, {});
    if (!existing || !Object.hasOwn(existing, serverKey) || !sameJson(existing[serverKey], value)) {
      source = setJsonMember(source, [contract.server_key], serverKey, value);
    }
    if (created_file || source !== snapshot.bytes.toString('utf8')) writeGlobalConfig(file, source, snapshot);
    saveOwnership(file, ownership);
    metadata = { created_container, created_file, ownership_file: ownershipFile(file) };
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
  if (!entry) return { removed: false };
  const contract = GLOBAL_MCP_CONTRACTS[entry.host];
  const home = process.env.HOME || os.homedir();
  if (
    !contract || entry.format !== contract.format || entry.container_key !== contract.server_key ||
    path.resolve(entry.path) !== path.resolve(home, contract.relative_path) ||
    typeof entry.install_id !== 'string' || typeof entry.server_key !== 'string' ||
    !cleanKeyPart(entry.install_id) || !entry.server_key.startsWith(`rig-${cleanKeyPart(entry.install_id)}-`) ||
    !entry.value || typeof entry.value !== 'object' || Array.isArray(entry.value)
  ) return { removed: false };
  let snapshot;
  try { snapshot = globalConfigSnapshot(entry.path); }
  catch { return { removed: false, reason: 'unsafe_config_file' }; }
  if (!snapshot) return { removed: false };
  if (entry.format === 'yaml') {
    const source = snapshot.bytes.toString('utf8');
    const expected = yamlBlock(entry.server_key, entry.value);
    if (!source.includes(expected)) return { removed: false };
    let next = source.replace(expected, '');
    if (entry.created_container) {
      const escaped = entry.container_key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      next = next.replace(new RegExp(`(?:^|\\n)${escaped}:\\n(?=\\n|$)`), (match) => match.startsWith('\n') ? '\n' : '');
    }
    try { writeGlobalConfig(entry.path, next, snapshot); }
    catch { return { removed: false, reason: 'unsafe_config_file' }; }
    return { removed: true };
  }
  let current;
  let source;
  try {
    source = snapshot.bytes.toString('utf8');
    current = JSON.parse(source);
    jsonSpans(source);
  } catch {
    return { removed: false };
  }
  const servers = current && current[entry.container_key];
  // An entry an interrupted earlier uninstall already took out is done, not a user edit to preserve.
  const plain = (value) => value && typeof value === 'object' && !Array.isArray(value);
  if (plain(current) && (servers === undefined || (plain(servers) && !Object.hasOwn(servers, entry.server_key)))) {
    return { removed: true, already_absent: true };
  }
  if (!servers || !Object.hasOwn(servers, entry.server_key) || !sameJson(servers[entry.server_key], entry.value)) {
    return { removed: false };
  }
  let ownership;
  try { ownership = readOwnership(entry.path); } catch { return { removed: false, reason: 'ownership_metadata_invalid' }; }
  const member = jsonObjectAt(jsonSpans(source), [entry.container_key]).properties.find(row => row.key === entry.server_key);
  if (ownership.entries[entry.server_key] && source.slice(member.value.start, member.value.end) !== ownership.entries[entry.server_key].bytes) return { removed: false, reason: 'user_modified' };
  const removed = removeJsonMember(source, [entry.container_key], entry.server_key);
  if (ownership.entries[entry.server_key]) {
    try { finishJsonRemoval(entry.path, removed.source, entry.container_key, entry.server_key, ownership, snapshot); }
    catch { return { removed: false, reason: 'unsafe_config_file' }; }
    return { removed: true };
  }
  let next = removed.source;
  const nextRoot = jsonSpans(next);
  const nextServers = jsonObjectAt(nextRoot, [entry.container_key]);
  if (entry.created_container && nextServers?.properties.length === 0) {
    next = removeJsonMember(next, [], entry.container_key).source;
  }
  try {
    if (entry.created_file && Object.keys(JSON.parse(next)).length === 0) removeGlobalConfigFile(entry.path, snapshot);
    else writeGlobalConfig(entry.path, next, snapshot);
  } catch { return { removed: false, reason: 'unsafe_config_file' }; }
  return { removed: true };
}

function mergeGlobalConfig(file, { install_id, value }) {
  if (!install_id) throw new Error('install_id required');
  const snapshot = globalConfigSnapshot(file);
  const created_file = snapshot === null;
  const source = created_file ? '{}' : snapshot.bytes.toString('utf8');
  const current = JSON.parse(source);
  jsonSpans(source);
  if (!current || typeof current !== 'object' || Array.isArray(current)) throw new Error('global config root must be an object');
  const rig = current.rig && typeof current.rig === 'object' ? current.rig : {};
  if (current.rig !== undefined && (!current.rig || typeof current.rig !== 'object' || Array.isArray(current.rig))) throw new Error('global config rig entry must be an object');
  const ownership = trackJsonAddition(file, source, 'rig', install_id, value);
  let next = source;
  if (current.rig === undefined) next = setJsonMember(next, [], 'rig', {});
  if (!Object.hasOwn(rig, install_id) || !sameJson(rig[install_id], value)) next = setJsonMember(next, ['rig'], install_id, value);
  if (created_file || next !== source) {
    writeGlobalConfig(file, next, snapshot);
  }
  saveOwnership(file, ownership);
  return { install_line: `rig install ${install_id} at ${file}`, path: file, created_file, created_container: current.rig === undefined };
}

function removeGlobalConfig(file, install_id) {
  let snapshot;
  try { snapshot = globalConfigSnapshot(file); }
  catch { return { removed: false, reason: 'unsafe_config_file' }; }
  if (!snapshot) return { removed: false };
  let current;
  let source;
  try {
    source = snapshot.bytes.toString('utf8');
    current = JSON.parse(source);
    jsonSpans(source);
  } catch {
    return { removed: false };
  }
  if (!current || typeof current !== 'object' || Array.isArray(current)
    || !current.rig || typeof current.rig !== 'object' || Array.isArray(current.rig)
    || !Object.hasOwn(current.rig, install_id)) return { removed: false };
  let ownership;
  try { ownership = readOwnership(file); } catch { return { removed: false, reason: 'ownership_metadata_invalid' }; }
  const property = jsonObjectAt(jsonSpans(source), ['rig']).properties.find(row => row.key === install_id);
  const owned = ownership.entries[install_id];
  if (!owned || source.slice(property.value.start, property.value.end) !== owned.bytes) return { removed: false, reason: 'user_modified_or_unowned' };
  const next = removeJsonMember(source, ['rig'], install_id).source;
  try { finishJsonRemoval(file, next, 'rig', install_id, ownership, snapshot); }
  catch { return { removed: false, reason: 'unsafe_config_file' }; }
  return { removed: true };
}

module.exports = {
  GLOBAL_MCP_CONTRACTS,
  mergeGlobalConfig,
  mergeHostGlobalMcp,
  removeGlobalConfig,
  removeGlobalMcp,
};
