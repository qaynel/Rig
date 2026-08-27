#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { mergeHostGlobalMcp, GLOBAL_MCP_CONTRACTS } = require('../rig/lib/global-writes');
const { uninstall } = require('../rig/lib/lifecycle');

const server = { command: 'node', args: ['/tmp/rig-mcp.js'], env: { TOKEN: '${TOKEN}' } };

function withFixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-global-mcp-'));
  const home = path.join(root, 'home');
  const target = path.join(root, 'repo');
  fs.mkdirSync(home);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  const originalHome = process.env.HOME;
  process.env.HOME = home;
  try {
    run({ home, target });
  } finally {
    if (originalHome === undefined) delete process.env.HOME;
    else process.env.HOME = originalHome;
    fs.rmSync(root, { recursive: true, force: true });
  }
}

for (const [host, contract] of Object.entries(GLOBAL_MCP_CONTRACTS)) {
  test(`RIG-111 ${host} global MCP merge is attributed, idempotent, and exactly removable`, () => {
    withFixture(({ home, target }) => {
      const file = path.join(home, contract.relative_path);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const seed = contract.format === 'yaml'
        ? 'theme: dark\nmcp_servers:\n  keep: {"command":"keep"}\ntelemetry: false\n'
        : `${JSON.stringify({ userSetting: true, [contract.server_key]: { keep: { command: 'keep' } } }, null, 2)}\n`;
      fs.writeFileSync(file, seed);

      const owned = mergeHostGlobalMcp(host, home, {
        install_id: 'repo-a',
        server_name: 'example-db',
        value: server,
      });
      const first = fs.readFileSync(file, 'utf8');
      assert.match(first, /rig-repo-a-example-db/, 'the vendor-visible key carries repository attribution');
      assert.match(first, /keep/, 'the unrelated server survives');
      assert.match(first, /userSetting|theme: dark/, 'unrelated settings survive');

      mergeHostGlobalMcp(host, home, {
        install_id: 'repo-a',
        server_name: 'example-db',
        value: server,
      });
      assert.equal(fs.readFileSync(file, 'utf8'), first, 'repeat merge is a byte-identical no-op');

      mergeHostGlobalMcp(host, home, {
        install_id: 'repo-b',
        server_name: 'example-db',
        value: { command: 'node', args: ['/tmp/other.js'] },
      });
      fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({
        schema_version: 1,
        entries: [owned],
      }, null, 2)}\n`);

      const result = uninstall(target);
      assert.equal(result.status, 'removed');
      const after = fs.readFileSync(file, 'utf8');
      assert.doesNotMatch(after, /rig-repo-a-example-db/, 'uninstall removes this repository entry');
      assert.match(after, /rig-repo-b-example-db/, 'another repository entry survives');
      assert.match(after, /keep/, 'unattributed server survives');
      assert.match(after, /userSetting|theme: dark/, 'unrelated settings survive uninstall');
    });
  });
}

test('RIG-111 refuses malformed or incompatible global configuration', () => {
  withFixture(({ home }) => {
    assert.throws(
      () => mergeHostGlobalMcp('windsurf', home, {
        install_id: 'repo-a', server_name: '***', value: server,
      }),
      /usable character/,
    );
    const windsurf = path.join(home, GLOBAL_MCP_CONTRACTS.windsurf.relative_path);
    fs.mkdirSync(path.dirname(windsurf), { recursive: true });
    fs.writeFileSync(windsurf, '{not json}\n');
    assert.throws(
      () => mergeHostGlobalMcp('windsurf', home, {
        install_id: 'repo-a', server_name: 'example-db', value: server,
      }),
      /invalid JSON/,
    );
    assert.equal(fs.readFileSync(windsurf, 'utf8'), '{not json}\n');

    const cline = path.join(home, GLOBAL_MCP_CONTRACTS.cline.relative_path);
    fs.mkdirSync(path.dirname(cline), { recursive: true });
    fs.writeFileSync(cline, '{"mcpServers":[]}\n');
    assert.throws(
      () => mergeHostGlobalMcp('cline', home, {
        install_id: 'repo-a', server_name: 'example-db', value: server,
      }),
      /mcpServers.*object/,
    );
    assert.equal(fs.readFileSync(cline, 'utf8'), '{"mcpServers":[]}\n');

    const hermes = path.join(home, GLOBAL_MCP_CONTRACTS.hermes.relative_path);
    fs.mkdirSync(path.dirname(hermes), { recursive: true });
    fs.writeFileSync(hermes, 'mcp_servers: {keep: {command: keep}}\n');
    assert.throws(
      () => mergeHostGlobalMcp('hermes', home, {
        install_id: 'repo-a', server_name: 'example-db', value: server,
      }),
      /block mapping/,
    );
    assert.equal(fs.readFileSync(hermes, 'utf8'), 'mcp_servers: {keep: {command: keep}}\n');
  });
});

test('RIG-111 uninstall rejects a ledger path outside the selected host contract', () => {
  withFixture(({ home, target }) => {
    const victim = path.join(home, 'victim.json');
    const value = { command: 'keep' };
    fs.writeFileSync(victim, `${JSON.stringify({ mcpServers: { 'rig-repo-a-example-db': value } })}\n`);
    fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({ entries: [{
      kind: 'global-mcp', host: 'windsurf', path: victim, format: 'json',
      container_key: 'mcpServers', server_key: 'rig-repo-a-example-db', install_id: 'repo-a', value,
    }] })}\n`);
    const result = uninstall(target);
    assert.equal(result.status, 'best_effort');
    assert.match(fs.readFileSync(victim, 'utf8'), /rig-repo-a-example-db/);
  });
});

test('RIG-111 uninstall preserves a user-changed owned value and malformed ledger', () => {
  withFixture(({ home, target }) => {
    const owned = mergeHostGlobalMcp('windsurf', home, {
      install_id: 'repo-a', server_name: 'example-db', value: server,
    });
    const config = JSON.parse(fs.readFileSync(owned.path, 'utf8'));
    config.mcpServers[owned.server_key].args = ['/tmp/user-replacement.js'];
    fs.writeFileSync(owned.path, `${JSON.stringify(config, null, 2)}\n`);
    fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({ entries: [owned] })}\n`);
    assert.equal(uninstall(target).status, 'best_effort');
    assert.match(fs.readFileSync(owned.path, 'utf8'), /user-replacement/);

    fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), '{bad ledger}\n');
    assert.doesNotThrow(() => uninstall(target));
    assert.equal(fs.readFileSync(path.join(target, '.rig', 'global-writes.json'), 'utf8'), '{bad ledger}\n');
  });
});
