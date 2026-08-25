const fs = require('node:fs');
const path = require('node:path');
const { SUPPORTED_HOSTS } = require('./config');
const { assignVariants } = require('./variants');
const { readReceipt } = require('./receipt');
const { evaluateAction } = require('./enforcement');
const { MCP_HOSTS } = require('./mcp-hosts');

const BASELINE_NETWORK_POLICY_PATH = path.join(__dirname, '..', 'catalog', 'baseline', 'network-policy.json');

const HOST_TIER = Object.fromEntries(SUPPORTED_HOSTS.map((host) => [host, 'B']));
Object.assign(HOST_TIER, {
  claude: 'A',
  codex: 'A',
  cursor: 'A',
  copilot: 'A',
  opencode: 'A',
  pi: 'A',
  gemini: 'A',
  kiro: 'A',
  devin: 'A',
  openclaw: 'A',
  codewhale: 'A',
  swival: 'A',
  'vscode-codex': 'A',
  generic: 'C',
});

function mergeJson(filePath, mutate) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let obj = {};
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    try {
      obj = JSON.parse(raw);
    } catch {
      throw new Error(`invalid JSON in ${filePath}; left unchanged`);
    }
  }
  mutate(obj);
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
}

const CREDENTIAL_SAFETY = {};
for (const host of Object.keys(HOST_TIER).filter((host) => HOST_TIER[host] === 'A')) {
  CREDENTIAL_SAFETY[`${host}:stdio`] = 'manual_note_required';
  CREDENTIAL_SAFETY[`${host}:http`] = 'manual_note_required';
}
CREDENTIAL_SAFETY['cursor:stdio'] = 'config_only_safe';
CREDENTIAL_SAFETY['copilot:stdio'] = 'config_only_safe';
CREDENTIAL_SAFETY['copilot:http'] = 'config_only_safe';

function appendTomlBlock(filePath, header, body) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (existing.split('\n').includes(`[${header}]`)) return;
  const sep = existing && !existing.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(filePath, `${existing}${sep}\n[${header}]\n${body}`);
}

const ref = (fmt, name) => fmt.replace('%s', name);
const envMap = (fmt, variant) => Object.fromEntries(variant.credentials.map((name) => [name, ref(fmt, name)]));
const authHeader = (fmt, variant) => ({ Authorization: `Bearer ${ref(fmt, variant.credentials[0])}` });
const jsonFile = (target, rel, mutate) => mergeJson(path.join(target, rel), mutate);

function setAtPath(obj, dottedKey, name, entry) {
  const parts = dottedKey.split('.');
  let node = obj;
  for (const part of parts.slice(0, -1)) {
    if (node[part] == null) node[part] = {};
    else if (typeof node[part] !== 'object' || Array.isArray(node[part])) {
      throw new Error(`invalid JSON path ${dottedKey}; left unchanged`);
    }
    node = node[part];
  }
  const last = parts[parts.length - 1];
  if (node[last] == null) node[last] = {};
  else if (typeof node[last] !== 'object' || Array.isArray(node[last])) {
    throw new Error(`invalid JSON path ${dottedKey}; left unchanged`);
  }
  node[last][name] = entry;
}

function mergeMcpEntry(target, host, server, entry) {
  const spec = MCP_HOSTS[host];
  if (!spec || !spec.file) throw new Error(`rig: no MCP write contract for host "${host}"`);
  jsonFile(target, spec.file, (obj) => setAtPath(obj, spec.key, server.name, entry));
  return { file: spec.file, serverName: server.name };
}

function genericEntry(variant, tokenFmt = '${%s}') {
  if (variant.transport === 'http') return { type: 'http', url: variant.url, headers: authHeader(tokenFmt, variant) };
  return { command: variant.command, args: variant.args, env: envMap(tokenFmt, variant) };
}

function renderClaude(target, server, variant) {
  return mergeMcpEntry(target, 'claude', server, genericEntry(variant, '${%s}'));
}

function renderCursor(target, server, variant) {
  const entry = genericEntry(variant, '${env:%s}');
  if (variant.transport === 'stdio') entry.envFile = '${workspaceFolder}/.env';
  return mergeMcpEntry(target, 'cursor', server, entry);
}

function renderCodex(target, server, variant) {
  const file = MCP_HOSTS.codex.file;
  const body = variant.transport === 'http'
    ? `url = "${variant.url}"\nbearer_token_env_var = "${variant.credentials[0]}"\n`
    : `command = "${variant.command}"\nargs = [${variant.args.map((arg) => JSON.stringify(arg)).join(', ')}]\nenv_vars = [${variant.credentials.map((name) => JSON.stringify(name)).join(', ')}]\n`;
  appendTomlBlock(path.join(target, file), `mcp_servers.${server.name}`, body);
  return { file, serverName: server.name };
}

function renderCopilot(target, server, variant) {
  const file = MCP_HOSTS.copilot.file;
  const inputs = variant.credentials.map((name) => ({ id: name, type: 'promptString', password: true }));
  const entry = variant.transport === 'http'
    ? { type: 'http', url: variant.url, headers: authHeader('${input:%s}', variant) }
    : { command: variant.command, args: variant.args, env: envMap('${input:%s}', variant), envFile: '${workspaceFolder}/.env' };
  jsonFile(target, file, (obj) => {
    obj.inputs = mergeById(obj.inputs || [], inputs);
    setAtPath(obj, MCP_HOSTS.copilot.key, server.name, entry);
  });
  return { file, serverName: server.name };
}

function renderOpencode(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { type: 'remote', url: variant.url, headers: authHeader('{env:%s}', variant) }
    : { type: 'local', command: variant.command, args: variant.args, environment: envMap('{env:%s}', variant) };
  return mergeMcpEntry(target, 'opencode', server, entry);
}

function renderPi(target, server, variant) {
  return mergeMcpEntry(target, 'pi', server, genericEntry(variant, '${%s}'));
}

function renderGemini(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { httpUrl: variant.url, headers: authHeader('${%s}', variant) }
    : { command: variant.command, args: variant.args, env: envMap('${%s}', variant) };
  return mergeMcpEntry(target, 'gemini', server, entry);
}

function renderKiro(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { type: 'remote', url: variant.url, headers: authHeader('${%s}', variant) }
    : { type: 'local', command: variant.command, args: variant.args, env: envMap('${%s}', variant) };
  return mergeMcpEntry(target, 'kiro', server, entry);
}

function renderDevin(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { transport: 'http', url: variant.url, headers: authHeader('${env:%s}', variant) }
    : genericEntry(variant, '${env:%s}');
  return mergeMcpEntry(target, 'devin', server, entry);
}

function renderOpenclaw(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { transport: 'streamable-http', url: variant.url, headers: authHeader('${%s}', variant) }
    : genericEntry(variant, '${%s}');
  return mergeMcpEntry(target, 'openclaw', server, entry);
}

function renderCodewhale(target, server, variant) {
  const entry = variant.transport === 'http'
    ? { url: variant.url, bearer_token_env_var: variant.credentials[0] }
    : { command: variant.command, args: variant.args, env: envMap('${%s}', variant) };
  return mergeMcpEntry(target, 'codewhale', server, entry);
}

function renderSwival(target, server, variant) {
  const entry = variant.transport === 'http' ? { url: variant.url } : { command: variant.command, args: variant.args };
  return mergeMcpEntry(target, 'swival', server, entry);
}

function renderCopilotCli(target, server, variant) {
  return mergeMcpEntry(target, 'copilot-cli', server, genericEntry(variant, '${%s}'));
}

const RENDERERS = {
  claude: renderClaude,
  cursor: renderCursor,
  codex: renderCodex,
  copilot: renderCopilot,
  'copilot-cli': renderCopilotCli,
  opencode: renderOpencode,
  pi: renderPi,
  gemini: renderGemini,
  kiro: renderKiro,
  devin: renderDevin,
  openclaw: renderOpenclaw,
  codewhale: renderCodewhale,
  swival: renderSwival,
  'vscode-codex': renderCodex,
};


function baselineNetworkPolicy() {
  return JSON.parse(fs.readFileSync(BASELINE_NETWORK_POLICY_PATH, 'utf8'));
}

function activeNetworkPolicy(target) {
  const activePath = path.join(target, '.rig', 'network-policy.json');
  if (!fs.existsSync(activePath)) return baselineNetworkPolicy();
  try {
    return JSON.parse(fs.readFileSync(activePath, 'utf8'));
  } catch {
    return baselineNetworkPolicy();
  }
}

// MCP is never an enforcement bypass (host-coverage-spec §3.2, §4): a
// network-capable (http-transport) MCP entry is evaluated through the exact
// same `evaluateAction` engine as shell/web network access, against the
// exact same active policy. The decision is recorded on the receipt; it does
// not block config emission, since writing config is not itself the guarded
// network action — the runtime hook that fires when the entry is used is.
function networkPolicyDecision(target, server, variant) {
  if (variant.transport !== 'http') return null;
  const decision = evaluateAction(activeNetworkPolicy(target), {
    surface: 'mcp',
    category: 'network_access',
    target: variant.url,
  });
  return { serverName: server.name, url: variant.url, decision: decision.decision, rule: decision.rule };
}

const AUTO_WRITE_HOSTS = Object.keys(MCP_HOSTS).filter((host) => MCP_HOSTS[host].autoWrite && RENDERERS[host]);

function renderMcp(target, config) {
  const previous = readReceipt(target) || {};
  const receipt = {
    ownedFiles: [...new Set(previous.ownedFiles || [])],
    mergedEntries: [],
    noteHosts: [],
    credentialNames: [],
    tierC: [],
    migrationHosts: [],
    manualEntries: {},
    networkPolicy: [],
    chainedBackup: Boolean(previous.chainedBackup),
  };
  const hosts = config.hosts && config.hosts.length ? config.hosts : SUPPORTED_HOSTS;
  const tierA = hosts.filter((host) => AUTO_WRITE_HOSTS.includes(host));
  const credentialNames = new Set();

  for (const server of config.mcp_servers) {
    const assigned = assignVariants(server, tierA);
    for (const [host, variant] of Object.entries(assigned)) {
      const file = fileFor(host);
      const existed = fs.existsSync(path.join(target, file));
      const rendered = RENDERERS[host](target, server, variant);
      if (!existed || receipt.ownedFiles.includes(rendered.file)) recordOwned(receipt, rendered.file);
      else receipt.mergedEntries.push({ file: rendered.file, serverName: rendered.serverName });
      if (CREDENTIAL_SAFETY[`${host}:${variant.transport}`] === 'manual_note_required') record(receipt.noteHosts, host);
      const policyDecision = networkPolicyDecision(target, server, variant);
      if (policyDecision) receipt.networkPolicy.push({ host, ...policyDecision });
      for (const name of variant.credentials) credentialNames.add(name);
    }
    if (hosts.includes('antigravity')) {
      const variant = assignVariants(server, ['antigravity']).antigravity;
      if (variant) {
        (receipt.manualEntries.antigravity ??= {})[server.name] = genericEntry(variant, '${%s}');
        for (const name of variant.credentials) credentialNames.add(name);
      }
    }
  }
  for (const host of hosts) {
    const entry = MCP_HOSTS[host];
    if (host === 'generic') { record(receipt.tierC, host); continue; }
    if (!entry || AUTO_WRITE_HOSTS.includes(host)) continue;
    record(receipt.noteHosts, host);
    if (entry.file && !entry.file.startsWith('~') && fs.existsSync(path.join(target, entry.file))) {
      record(receipt.migrationHosts, host);
    }
  }
  receipt.credentialNames = [...credentialNames].sort();
  receipt.mergedEntries.sort((a, b) => `${a.file}:${a.serverName}`.localeCompare(`${b.file}:${b.serverName}`));
  receipt.noteHosts.sort();
  receipt.tierC.sort();
  receipt.migrationHosts.sort();
  receipt.ownedFiles.sort();
  return receipt;
}

function fileFor(host) {
  return MCP_HOSTS[host].file;
}

function mergeById(existing, additions) {
  const byId = Object.fromEntries(existing.map((item) => [item.id, item]));
  for (const item of additions) byId[item.id] = item;
  return Object.values(byId);
}

function record(list, value) {
  if (!list.includes(value)) list.push(value);
}

function recordOwned(receipt, file) {
  record(receipt.ownedFiles, file);
}

module.exports = { HOST_TIER, CREDENTIAL_SAFETY, mergeJson, appendTomlBlock, mergeMcpEntry, renderMcp, RENDERERS, fileFor };
