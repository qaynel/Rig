#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { REGISTRY, materializeHostAdapters } = require('../rig/lib/host-capabilities');
const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');
const { runPayload } = require('../rig/lib/payload');

test('bootstrap refuses unowned or edited host adapters without losing user bytes or modes', () => {
  for (const [host, rel] of [
    ['cursor', '.cursor/rules/rig.mdc'], ['kiro', '.kiro/steering/rig.md'],
    ['antigravity', '.agents/rules/rig.md'], ['windsurf', '.windsurf/rules/rig.md'],
    ['cline', '.clinerules/rig.md'],
  ]) withTarget(target => {
    const file = path.join(target, rel);
    const sentinel = Buffer.from('User-owned host instructions\r\nPreserve exactly.');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, sentinel, { mode: 0o640 });
    assert.throws(() => runPayload(target, [host], { activeDelivery: true }), error => error.message.includes(rel), `${host} names its collision`);
    assert.deepEqual(fs.readFileSync(file), sentinel);
    assert.equal(fs.statSync(file).mode & 0o777, 0o640);
    fs.unlinkSync(file);
    runPayload(target, [host], { activeDelivery: true });
    const installed = fs.readFileSync(file);
    runPayload(target, [host], { activeDelivery: true });
    assert.deepEqual(fs.readFileSync(file), installed, `${host} repeats cleanly`);
    fs.writeFileSync(file, sentinel, { mode: 0o640 });
    fs.chmodSync(file, 0o640);
    assert.throws(() => runPayload(target, [host], { activeDelivery: true }), error => error.message.includes(rel));
    assert.deepEqual(fs.readFileSync(file), sentinel);
    assert.equal(fs.statSync(file).mode & 0o777, 0o640);
  });
});

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
    if (expected.autoWrite) {
      assert.equal(descriptor.emission, 'emitted');
      assert.equal(descriptor.auto_write, true, `${host} auto-write disposition`);
      assert.equal(descriptor.config_scope, 'repo', `${host} repo scope`);
      assert.equal(descriptor.output.path, expected.file, `${host} config path`);
      assert.equal(descriptor.output.key, expected.key, `${host} config key`);
    } else if (expected.emission === 'unsupported') {
      assert.equal(descriptor.emission, 'unsupported');
      assert.equal(descriptor.output, undefined);
    } else {
      assert.equal(descriptor.emission, 'not_integrated');
      assert.equal(descriptor.auto_write, false);
      assert.ok(descriptor.gap);
      assert.equal(descriptor.output, undefined);
    }
  }
}));

test('antigravity records its manual global MCP setup as not integrated', () => withTarget((target) => {
  const descriptor = mcpDescriptor(target, 'antigravity');
  assert.equal(descriptor.auto_write, false);
  assert.equal(descriptor.emission, 'not_integrated');
  assert.equal(descriptor.supported_surface, '~/.gemini/config/mcp_config.json');
  assert.equal(descriptor.output, undefined);
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
