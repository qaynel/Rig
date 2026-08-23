#!/usr/bin/env node
// Build-owned coverage for TP-C6.9 in the Tier 2 Basic test plan.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { materialize, exampleServer, withRepo, git, initRepo } = require('./helpers/basic-install');

test('TP-C6.9 installed pre-commit shim chains the user hook at commit time', () => {
  withRepo((target) => {
    initRepo(target);
    const hookDir = path.join(target, '.git', 'hooks');
    fs.mkdirSync(hookDir, { recursive: true });
    fs.writeFileSync(path.join(hookDir, 'pre-commit'), [
      '#!/bin/sh',
      'if git diff --cached --name-only | grep -qx sentinel.txt; then',
      '  echo "user hook blocked sentinel" >&2',
      '  exit 1',
      'fi',
      '',
    ].join('\n'), { mode: 0o755 });

    materialize(target, { hosts: ['claude'], mcp_servers: [exampleServer] });

    fs.writeFileSync(path.join(target, 'sentinel.txt'), 'not secret\n');
    git(target, ['add', 'sentinel.txt']);
    assert.throws(
      () => git(target, ['commit', '-m', 'sentinel']),
      (error) => /user hook blocked sentinel/.test(`${error.stdout || ''}${error.stderr || ''}${error.message}`),
      'user hook still runs after Rig install',
    );
  });
});
