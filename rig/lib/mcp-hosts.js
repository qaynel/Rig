// Single source of truth for MCP disposition, feeding both the legacy Basic
// `renderers.js` path and the catalogue materializer (host-capabilities.js),
// per host-coverage-spec §3.2. RIG-104.
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

// pi's disposition is 'unsupported' so REGISTRY carries no `surfaces.mcp`
// path, but a prior renderer wrote here — kept only so a pre-existing
// user-owned file is preserved with migration guidance rather than ignored
// silently (AT-HOST-5).
const LEGACY_FILE = { pi: '.omp/mcp.json' };

const MCP_HOSTS = {};
for (const [host, caps] of Object.entries(REGISTRY)) {
  const scope = caps.mcp_config.scope;
  const override = AUTO_WRITE_OVERRIDE[host];
  MCP_HOSTS[host] = {
    disposition: scope,
    autoWrite: override !== undefined ? override : scope === 'repo',
    file: FILE_OVERRIDE[host] || (caps.surfaces && caps.surfaces.mcp) || LEGACY_FILE[host] || null,
    key: (caps.surfaces && caps.surfaces.mcp_key) || 'mcpServers',
  };
}

module.exports = { MCP_HOSTS };
