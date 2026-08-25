#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const checker = path.join(root, 'scripts', 'check-raw-registry-access.js');
const inventory = path.join(root, 'rig', 'raw-registry-access.json');

test('the committed raw-registry inventory is the only allowed debt list', () => {
  assert.ok(fs.existsSync(inventory), 'commit the raw-registry debt inventory');
  assert.ok(fs.existsSync(checker), 'add the raw-registry ratchet');
  const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /raw registry debt:\s*\d+/i);
});

test('the raw-registry ratchet rejects a new capability reader', () => {
  if (!fs.existsSync(checker)) return;
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-raw-registry-reader-'));
  try {
    const lib = path.join(fixture, 'lib');
    fs.mkdirSync(lib);
    fs.writeFileSync(path.join(lib, 'host-capabilities.js'), "const REGISTRY = {}; module.exports = { REGISTRY };\n");
    fs.writeFileSync(path.join(lib, 'new-reader.js'), "const { REGISTRY } = require('./host-capabilities');\nmodule.exports = REGISTRY.pi.mcp_config;\n");
    const list = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(list, JSON.stringify({ schema_version: 1, readers: [], expected_count: 0 }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', list], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /new-reader\.js/);
    assert.match(result.stderr + result.stdout, /mcp_config/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('an allowlist entry cannot hide missing debt', () => {
  if (!fs.existsSync(checker)) return;
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-raw-registry-stale-'));
  try {
    const lib = path.join(fixture, 'lib');
    fs.mkdirSync(lib);
    fs.writeFileSync(path.join(lib, 'host-capabilities.js'), "const REGISTRY = {}; module.exports = { REGISTRY };\n");
    const inventoryPath = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(inventoryPath, JSON.stringify({
      schema_version: 1,
      readers: [{ file: 'lib/missing-reader.js', fields: ['mcp_config'] }],
      expected_count: 1,
    }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', inventoryPath], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /missing-reader\.js|mcp_config/);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('the source owner and host-id validation are not counted as consumers', () => {
  if (!fs.existsSync(checker)) return;
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-raw-registry-owner-'));
  try {
    const lib = path.join(fixture, 'lib');
    fs.mkdirSync(lib);
    fs.writeFileSync(path.join(lib, 'host-capabilities.js'), "const REGISTRY = { pi: { mcp_config: {} } }; module.exports = { REGISTRY };\n");
    fs.writeFileSync(path.join(lib, 'host-id-only.js'), "const { REGISTRY } = require('./host-capabilities');\nmodule.exports = (id) => Boolean(REGISTRY[id]);\n");
    const inventoryPath = path.join(fixture, 'allowlist.json');
    fs.writeFileSync(inventoryPath, JSON.stringify({ schema_version: 1, readers: [], expected_count: 0 }));
    const result = spawnSync(process.execPath, [checker, '--root', fixture, '--inventory', inventoryPath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /raw registry debt:\s*0/i);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('the ratchet never writes target-runtime artifacts', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-raw-registry-install-'));
  try {
    const { runPayload } = require('../rig/lib/payload');
    runPayload(target, ['codex']);
    for (const name of ['HostContract', 'raw-registry-access.json', 'semantic-runtime.json']) {
      assert.equal(fs.existsSync(path.join(target, '.rig', name)), false, name);
    }
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});
