'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const modulePath = path.resolve('rig/catalog/baseline/user-signoff.js');

test('noninteractive passwordless sudo never counts as approval', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-sudo-stub-'));
  fs.writeFileSync(path.join(dir, 'sudo'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  const run = spawnSync(process.execPath, ['-e', `console.log(JSON.stringify(require(${JSON.stringify(modulePath)}).assessPlatform().mechanisms[0]))`], { encoding: 'utf8', env: { ...process.env, PATH: `${dir}:${process.env.PATH}` } });
  assert.equal(run.status, 0);
  const row = JSON.parse(run.stdout);
  assert.equal(row.passwordless, true);
  assert.equal(row.counts_as_approval, false);
});

test('password required sudo probe stays noninteractive', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-sudo-stub-'));
  fs.writeFileSync(path.join(dir, 'sudo'), '#!/bin/sh\n[ "$1" = -n ] || exit 2\nexit 1\n', { mode: 0o755 });
  const run = spawnSync(process.execPath, ['-e', `console.log(JSON.stringify(require(${JSON.stringify(modulePath)}).assessPlatform().mechanisms[0]))`], { encoding: 'utf8', env: { ...process.env, PATH: `${dir}:${process.env.PATH}` } });
  assert.equal(run.status, 0);
  assert.equal(JSON.parse(run.stdout).passwordless, false);
});
