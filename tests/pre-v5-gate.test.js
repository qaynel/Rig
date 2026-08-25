#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const suites = [
  'tests/ticket-traceability.test.js',
  'tests/host-contract-parity.test.js',
  'tests/install-uninstall-roundtrip.test.js',
  'tests/runtime-onboarding.test.js',
  'tests/repo-mcp-write-safety.test.js',
  'tests/pi-mcp-claim.test.js',
  'tests/raw-registry-allowlist.test.js',
];

test('every v5-observable finding has a green deterministic test', () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--test', ...suites], {
    cwd: root,
    encoding: 'utf8',
    env,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
