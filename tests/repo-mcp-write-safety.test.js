#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { mergeMcpEntry } = require('../rig/lib/renderers');

const server = { name: 'rig-test' };
const entry = { command: 'node', args: ['server.js'] };

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mcp-write-safety-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function seed(target, body) {
  const file = path.join(target, '.openclaw', 'openclaw.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
  return file;
}

test('an invalid repository MCP file is left byte-identical', () => withTarget((target) => {
  const original = '{ invalid JSON\n';
  const file = seed(target, original);
  assert.throws(() => mergeMcpEntry(target, 'openclaw', server, entry), /left unchanged|invalid JSON/i);
  assert.equal(fs.readFileSync(file, 'utf8'), original);
}));

test('an OpenClaw JSON5 file is never clobbered', () => withTarget((target) => {
  const original = '{\n  // user comment\n  mcp: { servers: {}, },\n}\n';
  const file = seed(target, original);
  try {
    mergeMcpEntry(target, 'openclaw', server, entry);
  } catch (error) {
    assert.match(error.message, /left unchanged|JSON5|invalid JSON/i);
    assert.equal(fs.readFileSync(file, 'utf8'), original);
    return;
  }
  const result = fs.readFileSync(file, 'utf8');
  assert.match(result, /user comment/);
  assert.match(result, /rig-test/);
}));

test('a primitive dotted-path segment is rejected without a write', () => withTarget((target) => {
  const original = '{\n  "mcp": true\n}\n';
  const file = seed(target, original);
  assert.throws(() => mergeMcpEntry(target, 'openclaw', server, entry), /left unchanged|object|invalid/i);
  assert.equal(fs.readFileSync(file, 'utf8'), original);
}));

test('a valid repository MCP merge preserves unrelated content and is idempotent', () => withTarget((target) => {
  const file = seed(target, '{\n  "mcp": { "servers": { "keep": { "command": "keep" } } },\n  "user": true\n}\n');
  mergeMcpEntry(target, 'openclaw', server, entry);
  const first = fs.readFileSync(file, 'utf8');
  const parsed = JSON.parse(first);
  assert.deepEqual(parsed.mcp.servers.keep, { command: 'keep' });
  assert.equal(parsed.user, true);
  assert.deepEqual(parsed.mcp.servers['rig-test'], entry);
  mergeMcpEntry(target, 'openclaw', server, entry);
  assert.equal(fs.readFileSync(file, 'utf8'), first);
}));
