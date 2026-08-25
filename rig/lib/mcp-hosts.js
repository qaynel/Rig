// Single source of truth for MCP disposition, feeding both the writer
// (`renderers.js`) and the shipped host-contract (`contractFor`).
// RIG-104 / RIG-128.
'use strict';

const { REGISTRY } = require('./host-capabilities');

// REGISTRY's `mcp_config.scope` is the researched vendor capability
// (repo / user_global / unsupported). Two shipped product decisions
// deliberately diverge from raw capability; both paths must honor them:
// - antigravity is repo-capable but Rig only surfaces the manual step plus a
//   verification check, never auto-writes (RIG-105, owner-approved 2026-08-24).
// - codewhale's true scope is a contested project-vs-global conflict
//   (host-coverage-spec §3.1, unresolved), but Rig already ships a documented
//   `DEEPSEEK_MCP_CONFIG` repo-redirect (rig/lib/credentials.js WIRING), so it
//   auto-writes to the repo-local file despite the raw 'user_global' scope
//   until RIG-110 resolves the conflict.
const AUTO_WRITE_OVERRIDE = { antigravity: false, codewhale: true };
const FILE_OVERRIDE = { codewhale: '.codewhale/mcp.json' };
const MANUAL_DESCRIPTOR = {
  antigravity: {
    config_scope: 'manual',
    path: '~/.gemini/config/mcp_config.json',
    key: 'mcpServers',
  },
};

// pi's disposition is 'unsupported' so REGISTRY carries no `surfaces.mcp`
// path, but a prior renderer wrote here — kept only so a pre-existing
// user-owned file is preserved with migration guidance rather than ignored
// silently (AT-HOST-5).
const LEGACY_FILE = { pi: '.omp/mcp.json' };

const MCP_HOSTS = {};
for (const [host, caps] of Object.entries(REGISTRY)) {
  const scope = caps.mcp_config.scope;
  const emission = caps.mcp_config.emission;
  const override = AUTO_WRITE_OVERRIDE[host];
  const autoWrite = override !== undefined ? override : scope === 'repo';
  const file = FILE_OVERRIDE[host] || (caps.surfaces && caps.surfaces.mcp) || LEGACY_FILE[host] || null;
  const key = (caps.surfaces && caps.surfaces.mcp_key) || 'mcpServers';
  const descriptor = emission === 'unsupported'
    ? { emission: 'unsupported', auto_write: false }
    : MANUAL_DESCRIPTOR[host]
      ? { emission: 'emitted', auto_write: autoWrite, ...MANUAL_DESCRIPTOR[host] }
      : {
        emission: 'emitted',
        auto_write: autoWrite,
        config_scope: autoWrite ? 'repo' : scope,
        path: file,
        key,
      };
  MCP_HOSTS[host] = { disposition: scope, autoWrite, file, key, descriptor };
}

module.exports = { MCP_HOSTS };
