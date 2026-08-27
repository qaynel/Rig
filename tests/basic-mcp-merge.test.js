#!/usr/bin/env node
// RIG-104: one merge writer drives every JSON MCP shape. This proves the
// contract directly: re-applying the same server is a byte-identical no-op,
// and every unrelated pre-existing entry survives, for each supported shape
// (flat mcpServers, copilot servers+inputs, opencode mcp, OpenClaw's nested
// mcp.servers) plus the Codex TOML block writer.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { materialize, exampleServer, withRepo } = require('./helpers/basic-install');

const stdioOnly = { ...exampleServer, variants: [exampleServer.variants.find((v) => v.transport === 'stdio')] };
const read = (target, rel) => fs.readFileSync(path.join(target, rel), 'utf8');

const CASES = [
  { host: 'claude', file: '.mcp.json', seed: (obj) => { obj.mcpServers = { keep: { command: 'x' } }; }, unrelated: (obj) => obj.mcpServers.keep },
  { host: 'copilot-cli', file: '.github/mcp.json', seed: (obj) => { obj.mcpServers = { keep: { command: 'x' } }; }, unrelated: (obj) => obj.mcpServers.keep },
  { host: 'gemini', file: '.gemini/settings.json', seed: (obj) => { obj.mcpServers = { keep: { command: 'x' } }; obj.otherSetting = true; }, unrelated: (obj) => obj.mcpServers.keep && obj.otherSetting === true },
  { host: 'opencode', file: 'opencode.json', seed: (obj) => { obj.mcp = { keep: { type: 'local' } }; obj.$schema = 'https://opencode.ai/config.json'; }, unrelated: (obj) => obj.mcp.keep && obj.$schema },
  { host: 'openclaw', file: '.openclaw/openclaw.json', seed: (obj) => { obj.mcp = { servers: { keep: { command: 'x' } } }; obj.other = 1; }, unrelated: (obj) => obj.mcp.servers.keep && obj.other === 1 },
  {
    host: 'copilot',
    file: '.vscode/mcp.json',
    seed: (obj) => { obj.servers = { keep: { command: 'x' } }; obj.inputs = [{ id: 'KEEP_TOKEN', type: 'promptString', password: true }]; },
    unrelated: (obj) => obj.servers.keep && obj.inputs.some((i) => i.id === 'KEEP_TOKEN'),
  },
];

for (const { host, file, seed, unrelated } of CASES) {
  test(`RIG-104 merge writer for ${host} preserves unrelated entries and is idempotent`, () => {
    withRepo((target) => {
      const abs = path.join(target, file);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      const seeded = {};
      seed(seeded);
      fs.writeFileSync(abs, JSON.stringify(seeded, null, 2) + '\n');

      materialize(target, { hosts: [host], mcp_servers: [stdioOnly] });
      const afterFirst = read(target, file);
      const parsedFirst = JSON.parse(afterFirst);
      assert.ok(unrelated(parsedFirst), `${host}: unrelated pre-existing entry survives the first merge`);

      materialize(target, { hosts: [host], mcp_servers: [stdioOnly] });
      const afterSecond = read(target, file);
      assert.equal(afterSecond, afterFirst, `${host}: re-applying the same server is a byte-identical no-op`);
      assert.ok(unrelated(JSON.parse(afterSecond)), `${host}: unrelated pre-existing entry survives the second merge`);
    });
  });
}

test('RIG-104 codex TOML merge writer preserves unrelated content and is idempotent', () => {
  withRepo((target) => {
    const abs = path.join(target, '.codex', 'config.toml');
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, '[other_section]\nkeep = "value"\n');

    materialize(target, { hosts: ['codex'], mcp_servers: [stdioOnly] });
    const afterFirst = read(target, '.codex/config.toml');
    assert.match(afterFirst, /\[other_section\]\nkeep = "value"/, 'unrelated TOML section survives the first merge');
    assert.match(afterFirst, /\[mcp_servers\.example-db\]/, 'the server block landed');

    materialize(target, { hosts: ['codex'], mcp_servers: [stdioOnly] });
    const afterSecond = read(target, '.codex/config.toml');
    assert.equal(afterSecond, afterFirst, 're-applying the same server is a byte-identical no-op');
  });
});
