const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { ensureLine } = require('./payload');
const { readReceipt } = require('./receipt');

const LOAD_STEP = 'set -a; source .env; set +a';
const WIRING = {
  openclaw: 'export OPENCLAW_CONFIG_PATH=./.openclaw/openclaw.json',
  codewhale: 'export DEEPSEEK_MCP_CONFIG=./.codewhale/mcp.json',
};
const CAVEAT = {
  openclaw: 'Confirm on first wire that ${VAR} interpolation is honored inside mcp.servers.',
  codewhale: 'Confirm on first wire whether the mcp_config_path overlay can replace DEEPSEEK_MCP_CONFIG.',
  antigravity: 'The Antigravity CLI may ignore workspace-local `.agents/mcp_config.json` while issue #60 remains open; use ~/.gemini/config/mcp_config.json for this manual setup.',
};
const MIGRATION = {
  pi: 'pi supports MCP through the pi-mcp-extension. Rig has no mergeable first-party config file, so any existing .omp/mcp.json was left untouched.',
};
const LABELS = {
  claude: 'Claude',
  codex: 'Codex',
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  opencode: 'OpenCode',
  pi: 'pi',
  gemini: 'Gemini',
  kiro: 'Kiro',
  devin: 'Devin',
  openclaw: 'OpenClaw',
  codewhale: 'CodeWhale',
  swival: 'Swival',
  hermes: 'Hermes',
  windsurf: 'Windsurf',
  cline: 'Cline',
  'copilot-cli': 'Copilot CLI',
  antigravity: 'Antigravity',
  generic: 'Generic',
  'vscode-codex': 'Codex',
};

function writeEnvExample(target, names) {
  fs.writeFileSync(path.join(target, '.env.example'), names.map((name) => `${name}=`).join('\n') + (names.length ? '\n' : ''));
}

function gitignoreEnv(target) {
  ensureLine(target, '.gitignore', '.env');
  ensureLine(target, '.gitignore', '!.env.example');
}

function writeMcpSetup(target, receipt) {
  const blocks = [];
  for (const host of receipt.noteHosts || []) {
    const lines = [`${LABELS[host] || host}:`];
    if (WIRING[host]) lines.push(WIRING[host]);
    lines.push(LOAD_STEP);
    if (host === 'codex' || host === 'vscode-codex') lines.push('Never paste the key into config.toml; use env_vars or bearer_token_env_var by name.');
    if (host === 'antigravity' && receipt.manualEntries?.antigravity) {
      lines.push(
        'Merge this exact object into ~/.gemini/config/mcp_config.json without replacing unrelated servers:',
        '```json',
        JSON.stringify({ mcpServers: receipt.manualEntries.antigravity }, null, 2),
        '```',
        'This generated block uses stdio; remote servers require serverUrl plus a supported authProviderType.',
      );
    } else if (host === 'antigravity') {
      lines.push('No MCP server was selected for Antigravity; add one and re-apply, or skip this check.');
    }
    if (CAVEAT[host]) lines.push(CAVEAT[host]);
    if (host === 'antigravity') lines.push('Verify after saving: .rig/bin/rig check --host antigravity');
    if ((receipt.migrationHosts || []).includes(host) || host === 'pi') {
      lines.push(MIGRATION[host] || `${LABELS[host] || host}: Rig did not modify a pre-existing config file.`);
    }
    const block = lines.join('\n');
    if (!blocks.includes(block)) blocks.push(block);
  }
  for (const host of receipt.tierC || []) {
    blocks.push(`${LABELS[host] || host}: no MCP renderer is emitted; instruction payload only.`);
  }
  const body = blocks.length ? blocks : ['No manual MCP credential setup is required for the selected hosts.'];
  const doc = ['# Rig MCP setup', '', ...body, ''].join('\n\n');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig', 'mcp-setup.md'), doc);
}

function pointReadme(target) {
  ensureLine(target, 'README.md', 'See `.rig/mcp-setup.md` for MCP server setup.');
}

function writeCredentialOutputs(target, config, receipt) {
  writeEnvExample(target, receipt.credentialNames || []);
  gitignoreEnv(target);
  writeMcpSetup(target, receipt);
  pointReadme(target);
}

function readManualReceipt(target) {
  const catalog = path.join(target, '.rig', 'catalog-receipt.json');
  if (fs.existsSync(catalog)) return JSON.parse(fs.readFileSync(catalog, 'utf8'));
  return readReceipt(target);
}

function verifyManualMcp(target, host, home = os.homedir()) {
  if (host !== 'antigravity') throw new Error(`rig: no manual MCP verification contract for host "${host}"`);
  const expected = readManualReceipt(target)?.manualEntries?.antigravity;
  const file = path.join(home || os.homedir(), '.gemini', 'config', 'mcp_config.json');
  if (!fs.existsSync(file)) {
    return { status: 1, host, path: '~/.gemini/config/mcp_config.json', reason: 'global MCP config is missing' };
  }
  let config;
  try { config = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) {
    return { status: 1, host, path: '~/.gemini/config/mcp_config.json', reason: `global MCP config is invalid JSON: ${error.message}` };
  }
  if (!config || typeof config !== 'object' || Array.isArray(config) ||
      !config.mcpServers || typeof config.mcpServers !== 'object' || Array.isArray(config.mcpServers)) {
    return { status: 1, host, path: '~/.gemini/config/mcp_config.json', reason: 'global MCP config has no mcpServers object' };
  }
  if (!expected || !Object.keys(expected).length) {
    const rig = config.mcpServers.rig;
    if (!rig || typeof rig !== 'object' || Array.isArray(rig) ||
        !((typeof rig.command === 'string' && rig.command) || (typeof rig.serverUrl === 'string' && rig.serverUrl))) {
      return { status: 1, host, path: '~/.gemini/config/mcp_config.json', reason: 'global MCP config has no runnable rig server entry' };
    }
    return { status: 0, host, path: '~/.gemini/config/mcp_config.json', verified: ['rig'] };
  }
  const mismatched = Object.keys(expected).filter((name) => !isDeepStrictEqual(config.mcpServers[name], expected[name]));
  if (mismatched.length) {
    return { status: 1, host, path: '~/.gemini/config/mcp_config.json', reason: `${mismatched.join(', ')} does not match the selected server entry` };
  }
  return { status: 0, host, path: '~/.gemini/config/mcp_config.json', verified: Object.keys(expected).sort() };
}

module.exports = { writeCredentialOutputs, writeEnvExample, gitignoreEnv, writeMcpSetup, pointReadme, verifyManualMcp, LOAD_STEP };
