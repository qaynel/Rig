#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { REGISTRY, materializeHostAdapters } = require('../rig/lib/host-capabilities');
const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-host-contract-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function mcpDescriptor(target, host) {
  materializeHostAdapters(target, host);
  const file = path.join(target, '.rig', 'host-contracts', host, 'mcp_config.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

test('every emitted MCP descriptor agrees with the interpreted write contract', () => withTarget((target) => {
  for (const host of Object.keys(REGISTRY)) {
    const descriptor = mcpDescriptor(target, host);
    const expected = MCP_HOSTS[host];
    assert.ok(descriptor, `${host} emits an MCP descriptor`);
    assert.equal(descriptor.auto_write, expected.autoWrite, `${host} auto-write disposition`);
    if (expected.autoWrite) {
      assert.equal(descriptor.config_scope, 'repo', `${host} repo scope`);
      assert.equal(descriptor.output.path, expected.file, `${host} config path`);
      assert.equal(descriptor.output.key, expected.key, `${host} config key`);
    }
  }
}));

test('antigravity advertises only the manual global setup', () => withTarget((target) => {
  const descriptor = mcpDescriptor(target, 'antigravity');
  assert.equal(descriptor.auto_write, false);
  assert.equal(descriptor.config_scope, 'manual');
  assert.equal(descriptor.output.path, '~/.gemini/config/mcp_config.json');
  assert.equal(descriptor.output.key, 'mcpServers');
}));

test('codewhale advertises the repo redirect used by the writer', () => withTarget((target) => {
  const descriptor = mcpDescriptor(target, 'codewhale');
  assert.equal(descriptor.auto_write, true);
  assert.equal(descriptor.config_scope, 'repo');
  assert.equal(descriptor.output.path, '.codewhale/mcp.json');
  assert.equal(descriptor.output.key, 'mcpServers');
}));

test('pi does not advertise a writable MCP file', () => withTarget((target) => {
  const userFile = path.join(target, '.omp', 'mcp.json');
  fs.mkdirSync(path.dirname(userFile), { recursive: true });
  fs.writeFileSync(userFile, '{"user":true}\n');
  const descriptor = mcpDescriptor(target, 'pi');
  assert.ok(descriptor, 'pi emits an explicit unsupported MCP descriptor');
  assert.equal(descriptor.emission, 'unsupported');
  assert.equal(descriptor.auto_write, false);
  assert.equal(descriptor.output, undefined);
  assert.equal(fs.readFileSync(userFile, 'utf8'), '{"user":true}\n');
}));
