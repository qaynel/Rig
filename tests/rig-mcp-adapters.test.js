#!/usr/bin/env node
// RIG-101: every host manifest that supports an inline mcpServers/mcp block
// registers rig-mcp so hosts without always-on injection can still reach it
// through their native config. This fails if an entry is removed, its shape
// drifts from that host's real MCP schema, or the entrypoint it points at
// disappears. openclaw is excluded pending a scope conflict (repo vs
// user-global — see host-coverage-spec §3.2.1); windsurf/cline/hermes/
// codewhale accept only user-global MCP files and get copy-paste config in
// docs/agent-portability.md instead.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ENTRYPOINT = 'rig-mcp/index.js';

function loadJson(relPath) {
  const filePath = path.join(root, relPath);
  assert.ok(fs.existsSync(filePath), `${relPath} must exist`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('opencode.json registers rig-mcp as a local MCP server', () => {
  const entry = loadJson('opencode.json').mcp?.rig;
  assert.ok(entry, 'opencode.json must declare an "mcp.rig" server entry');
  // OpenCode's local MCP schema takes the full executable + args as one array
  // (not separate command/args fields) — see https://opencode.ai/docs/mcp-servers.
  assert.equal(entry.type, 'local');
  assert.ok(Array.isArray(entry.command), 'local MCP entries must use an array-form command');
  assert.equal(entry.enabled, true);
  const [command, ...args] = entry.command;
  assert.equal(command, 'node');
  assert.equal(args[0], ENTRYPOINT);
  assert.ok(fs.existsSync(path.join(root, args[0])));
});

test('.claude-plugin/plugin.json registers rig-mcp with the plugin-root variable', () => {
  const entry = loadJson('.claude-plugin/plugin.json').mcpServers?.rig;
  assert.ok(entry, 'plugin.json must declare an "mcpServers.rig" entry');
  // Claude plugin MCP servers resolve paths through ${CLAUDE_PLUGIN_ROOT}, not
  // cwd — see https://code.claude.com/docs/en/plugins-reference.
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], `\${CLAUDE_PLUGIN_ROOT}/${ENTRYPOINT}`);
});

test('.codex-plugin/plugin.json registers rig-mcp with a plugin-relative path', () => {
  const entry = loadJson('.codex-plugin/plugin.json').mcpServers?.rig;
  assert.ok(entry, 'plugin.json must declare an "mcpServers.rig" entry');
  // Codex plugin paths are relative to the plugin root by convention (no
  // root variable) — see openai/codex plugin-json-spec.md "Path conventions".
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], `./${ENTRYPOINT}`);
  assert.ok(fs.existsSync(path.join(root, entry.args[0])));
});

test('gemini-extension.json registers rig-mcp with the extension-path variable', () => {
  const entry = loadJson('gemini-extension.json').mcpServers?.rig;
  assert.ok(entry, 'gemini-extension.json must declare an "mcpServers.rig" entry');
  // Gemini CLI extensions resolve paths through ${extensionPath} — see
  // https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/reference.md.
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], `\${extensionPath}/${ENTRYPOINT}`);
  assert.equal(entry.cwd, '${extensionPath}');
});

test('.cursor/mcp.json registers rig-mcp with an explicit stdio type', () => {
  const entry = loadJson('.cursor/mcp.json').mcpServers?.rig;
  assert.ok(entry, '.cursor/mcp.json must declare an "mcpServers.rig" entry');
  // Cursor's field table marks `type` required for stdio even though its own
  // example snippets omit it — see https://cursor.com/docs/mcp.
  assert.equal(entry.type, 'stdio');
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
  assert.ok(fs.existsSync(path.join(root, entry.args[0])));
});

test('.kiro/settings/mcp.json registers rig-mcp', () => {
  const entry = loadJson('.kiro/settings/mcp.json').mcpServers?.rig;
  assert.ok(entry, '.kiro/settings/mcp.json must declare an "mcpServers.rig" entry');
  // Kiro needs no `type` field for stdio — see https://kiro.dev/docs/mcp/configuration/.
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
});

test('.devin/config.json registers rig-mcp', () => {
  const entry = loadJson('.devin/config.json').mcpServers?.rig;
  assert.ok(entry, '.devin/config.json must declare an "mcpServers.rig" entry');
  // Devin CLI: https://docs.devin.ai/cli/extensibility/mcp/configuration.
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
});

test('.swival/mcp.json registers rig-mcp', () => {
  const entry = loadJson('.swival/mcp.json').mcpServers?.rig;
  assert.ok(entry, '.swival/mcp.json must declare an "mcpServers.rig" entry');
  // Swival: https://swival.dev/pages/mcp.html.
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
});

test('.vscode/mcp.json registers rig-mcp under the "servers" key', () => {
  const entry = loadJson('.vscode/mcp.json').servers?.rig;
  assert.ok(entry, '.vscode/mcp.json must declare a "servers.rig" entry');
  // VS Code Copilot uses "servers", not "mcpServers", and requires `type` —
  // see https://code.visualstudio.com/docs/agents/reference/mcp-configuration.
  assert.equal(entry.type, 'stdio');
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
});

test('.github/mcp.json registers rig-mcp for Copilot CLI', () => {
  const entry = loadJson('.github/mcp.json').mcpServers?.rig;
  assert.ok(entry, '.github/mcp.json must declare an "mcpServers.rig" entry');
  // Copilot CLI is a distinct surface from the VS Code extension and requires
  // `type: "local"` — see
  // https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers.
  assert.equal(entry.type, 'local');
  assert.equal(entry.command, 'node');
  assert.equal(entry.args[0], ENTRYPOINT);
});

test('.codex/config.toml registers rig-mcp for the Codex CLI and IDE extension', () => {
  const filePath = path.join(root, '.codex/config.toml');
  assert.ok(fs.existsSync(filePath), '.codex/config.toml must exist');
  const toml = fs.readFileSync(filePath, 'utf8');
  // The IDE extension shares this file with the CLI — see
  // https://developers.openai.com/codex/mcp and /codex/local-config.
  assert.match(toml, /\[mcp_servers\.rig\]/);
  assert.match(toml, /command = "node"/);
  assert.match(toml, new RegExp(`args = \\["${ENTRYPOINT.replace(/\//g, '\\/')}"\\]`));
});
