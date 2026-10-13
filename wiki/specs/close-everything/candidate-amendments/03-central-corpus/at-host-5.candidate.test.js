'use strict';

// UNSIGNED CANDIDATE for subplan 03 (RIG-125/132). Never part of `npm test`,
// never signed, never a replacement for tests/advanced-oracle.test.js (frozen).
// It is the proposed body of AT-HOST-5 once `materializeSelectedHosts` (dead
// code with a second, divergent MCP table) is removed.
// Run: node --test wiki/specs/close-everything/candidate-amendments/03-central-corpus/at-host-5.candidate.test.js

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..', '..');
const h = require(path.join(repoRoot, 'tests', 'helpers', 'advanced'));

function api(file, name) {
  const root = process.env.RIG_CANDIDATE_ROOT || repoRoot;
  const absolute = path.join(root, 'rig', 'lib', file);
  assert.ok(fs.existsSync(absolute), `missing public module rig/lib/${file}`);
  const fn = require(absolute)[name];
  assert.equal(typeof fn, 'function', `missing public function ${file}:${name}`);
  return fn;
}

test('AT-HOST-5 unsupported MCP emits nothing and preserves user files', () => {
  const materializeHostAdapters = api('host-capabilities.js', 'materializeHostAdapters');
  const { MCP_HOSTS } = require(path.join(process.env.RIG_CANDIDATE_ROOT || repoRoot, 'rig', 'lib', 'mcp-hosts.js'));
  h.withRepo((target) => {
    const userFile = path.join(target, '.omp', 'mcp.json');
    fs.mkdirSync(path.dirname(userFile), { recursive: true });
    fs.writeFileSync(userFile, '{"user":true}\n');
    materializeHostAdapters(target, 'pi');
    assert.equal(fs.readFileSync(userFile, 'utf8'), '{"user":true}\n');
    assert.equal(MCP_HOSTS.pi.emission, 'unsupported');
    assert.equal(MCP_HOSTS.pi.autoWrite, false);
    const descriptor = JSON.parse(fs.readFileSync(path.join(target, '.rig/host-contracts/pi/mcp_config.json'), 'utf8'));
    assert.equal(descriptor.emission, 'unsupported');
    assert.equal(descriptor.auto_write, false);
    assert.equal(fs.existsSync(path.join(target, '.mcp.json')), false, 'nothing is written for an unsupported host');
  });
});
