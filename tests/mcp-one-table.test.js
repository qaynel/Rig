#!/usr/bin/env node
'use strict';

// RIG-125 property, finished by subplan 03: the MCP descriptor a host contract
// advertises, the interpreted write table, and the renderer that actually
// writes agree for every host, and no second table of MCP dispositions exists.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const hostCapabilities = require('../rig/lib/host-capabilities');
const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');
const { RENDERERS } = require('../rig/lib/renderers');
const { PROJECTOR_HOSTS } = require('../rig/lib/project');

const { REGISTRY, materializeHostAdapters } = hostCapabilities;
const server = { name: 'demo' };
const variant = { id: 'v1', transport: 'stdio', command: 'node', args: ['server.js'], credentials: ['DEMO_TOKEN'] };

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mcp-table-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function descriptor(target, host) {
  materializeHostAdapters(target, host);
  return JSON.parse(fs.readFileSync(path.join(target, '.rig/host-contracts', host, 'mcp_config.json'), 'utf8'));
}

const valueAt = (object, dotted) => dotted.split('.').reduce((node, part) => (node == null ? node : node[part]), object);

test('the advertised descriptor, the write table and the renderer name the same file and key', () => {
  const writable = Object.keys(RENDERERS).filter((host) => MCP_HOSTS[host].autoWrite);
  assert.ok(writable.length >= 10, 'the write path serves the auto-write hosts');
  for (const host of writable) {
    withTarget((target) => {
      const advertised = descriptor(target, host);
      assert.equal(advertised.auto_write, true, `${host} advertises auto-write`);
      const written = RENDERERS[host](target, server, variant);
      assert.equal(written.file, MCP_HOSTS[host].file, `${host} renderer writes the table's file`);
      assert.equal(advertised.output.path, written.file, `${host} descriptor path is the written path`);
      assert.equal(advertised.output.key, MCP_HOSTS[host].key, `${host} descriptor key is the table's key`);
      const body = fs.readFileSync(path.join(target, written.file), 'utf8');
      if (written.file.endsWith('.toml')) {
        assert.match(body, /\[mcp_servers\.demo\]/, `${host} TOML entry lands under mcp_servers`);
      } else {
        assert.ok(valueAt(JSON.parse(body), advertised.output.key)?.demo, `${host} entry lands at ${advertised.output.key}`);
      }
    });
  }
});

test('no host claims auto-write without a renderer, and every projector host has a descriptor', () => {
  for (const [host, row] of Object.entries(MCP_HOSTS)) {
    if (row.autoWrite) assert.ok(RENDERERS[host], `${host} claims auto-write but nothing writes`);
  }
  for (const host of PROJECTOR_HOSTS) {
    assert.ok(REGISTRY[host], `${host} is a registry host`);
    withTarget((target) => assert.ok(descriptor(target, host), `${host} emits an MCP descriptor`));
  }
});

test('there is exactly one MCP disposition table: the dead second reader is gone', () => {
  assert.equal('materializeSelectedHosts' in hostCapabilities, false);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '../rig/lib/host-capabilities.js'), 'utf8'), /materializeSelectedHosts/);
});
