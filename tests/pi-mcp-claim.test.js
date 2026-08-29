#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { materialize, exampleServer } = require('./helpers/basic-install');
const { REGISTRY } = require('../rig/lib/host-capabilities');
const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');

const stdioOnly = {
  ...exampleServer,
  variants: [exampleServer.variants.find((variant) => variant.transport === 'stdio')],
};

test('pi MCP guidance names the extension path and never says unsupported', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'rig', 'lib', 'host-capabilities.js'), 'utf8');
  assert.match(REGISTRY.pi.evidence.citation, /pi-mcp-extension/i);
  assert.doesNotMatch(source, /pi[^\n]{0,120}(?:refused by design|does not support MCP)/i);
});

test('pi remains a no-auto-write host and preserves a pre-existing legacy file', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-pi-mcp-'));
  try {
    const userFile = path.join(target, '.omp', 'mcp.json');
    fs.mkdirSync(path.dirname(userFile), { recursive: true });
    fs.writeFileSync(userFile, '{"user":true}\n');
    materialize(target, {
      hosts: ['pi'],
      mcp_servers: [stdioOnly],
    });
    assert.equal(fs.readFileSync(userFile, 'utf8'), '{"user":true}\n');
    assert.match(fs.readFileSync(path.join(target, '.rig', 'mcp-setup.md'), 'utf8'), /extension/i);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test('pi does not gain a fabricated repository config contract', () => {
  assert.equal(MCP_HOSTS.pi.autoWrite, false);
  assert.equal(MCP_HOSTS.pi.file, '.omp/mcp.json');
  assert.equal(REGISTRY.pi.mcp_config.emission, 'unsupported');
});
