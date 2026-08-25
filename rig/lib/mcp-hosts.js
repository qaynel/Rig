// Single interpreted MCP write contract. Raw REGISTRY stays the research
// record; descriptors and writers read this table (RIG-104 / 134.1).
'use strict';

const { REGISTRY } = require('./host-capabilities');

// Product decisions that diverge from raw vendor capability:
// - antigravity is repo-capable but manual-only (RIG-105).
// - codewhale is contested global-vs-repo; shipped write is repo-local.
// - copilot-cli has a researched repo path but no auto-writer on this branch.
const AUTO_WRITE_OVERRIDE = { antigravity: false, codewhale: true, 'copilot-cli': false };
const FILE_OVERRIDE = {
  codewhale: '.codewhale/mcp.json',
  openclaw: '.openclaw/openclaw.json',
  antigravity: '~/.gemini/config/mcp_config.json',
};
const KEY_OVERRIDE = { openclaw: 'mcp.servers', antigravity: 'mcpServers' };
const LEGACY_FILE = { pi: '.omp/mcp.json' };

const MCP_HOSTS = {};
for (const [host, caps] of Object.entries(REGISTRY)) {
  const scope = caps.mcp_config.scope;
  const override = AUTO_WRITE_OVERRIDE[host];
  const autoWrite = override !== undefined ? override : scope === 'repo';
  const unsupported = scope === 'unsupported';
  MCP_HOSTS[host] = {
    disposition: scope,
    autoWrite,
    file: FILE_OVERRIDE[host] || (caps.surfaces && caps.surfaces.mcp) || LEGACY_FILE[host] || null,
    key: KEY_OVERRIDE[host] || (caps.surfaces && caps.surfaces.mcp_key) || 'mcpServers',
    emission: unsupported ? 'unsupported' : 'emitted',
    config_scope: unsupported ? 'unsupported' : (host === 'antigravity' ? 'manual' : (autoWrite ? 'repo' : scope)),
  };
}

module.exports = { MCP_HOSTS, AUTO_WRITE_OVERRIDE, FILE_OVERRIDE, LEGACY_FILE };
