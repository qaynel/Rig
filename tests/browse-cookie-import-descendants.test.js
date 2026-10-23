#!/usr/bin/env node
'use strict';

// RIG-135.1: the Windows cookie import launches Chromium against the user's
// real profile. A leader-only kill can leave renderer/GPU descendants holding
// the profile lock, blocking the user's real browser. A forking stub replaces
// Chromium; no descendant may survive success, timeout, cancellation, or the
// importer itself being killed. Runs on every platform; the dedicated
// windows-latest job (.github/workflows/browse-process-cleanup.yml) proves the
// Windows tree-kill and watchdog.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { skipReason, tmpDir, fixtures, runBun, waitDead, reap } = require('./helpers/browse-process');

const reason = skipReason();
let nextPort = 9300 + Math.floor(Math.random() * 200);

function scenarioEnv(mode) {
  const dir = tmpDir('rig-fake-chrome-');
  const pidFile = path.join(dir, 'child.pid');
  return { dir, pidFile, env: { FAKE_CHROME_CHILD_PID: pidFile, FAKE_CHROME_MODE: mode } };
}

async function expectNoDescendant(scenario, mode, outcome) {
  const { dir, pidFile, env } = scenarioEnv(mode);
  const report = runBun('cookie-import.ts', [scenario, String(nextPort++)], env);
  const descendant = Number(fs.readFileSync(pidFile, 'utf8'));
  try {
    assert.match(report.outcome, outcome);
    assert.ok(descendant > 0, 'the fake Chrome must have forked a descendant');
    assert.equal(await waitDead(descendant, 5000), true, `descendant ${descendant} survived (${scenario})`);
  } finally {
    reap(descendant);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('no descendant survives a successful import (RIG-135.1)', { skip: reason }, async () => {
  await expectNoDescendant('success', 'serve', /^returned$/);
});

test('no descendant survives a startup timeout (RIG-135.1)', { skip: reason }, async () => {
  await expectNoDescendant('timeout', 'hang', /CookieImportError:cdp_timeout/);
});

test('no descendant survives cancellation (RIG-135.1)', { skip: reason }, async () => {
  await expectNoDescendant('cancel', 'serve', /CookieImportError:cancelled/);
});

test('no descendant survives the importer process being killed (RIG-135.1)', { skip: reason }, async () => {
  const { dir, pidFile, env } = scenarioEnv('serve');
  const importer = spawn('bun', ['run', path.join(fixtures, 'cookie-import.ts'), 'hold', String(nextPort++)], {
    env: { ...process.env, ...env },
    stdio: 'ignore',
  });
  let descendant = 0;
  try {
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline && !fs.existsSync(pidFile)) await new Promise((r) => setTimeout(r, 100));
    descendant = Number(fs.readFileSync(pidFile, 'utf8'));
    await new Promise((r) => setTimeout(r, 1500)); // let the watchdog arm
    importer.kill('SIGKILL');
    assert.equal(await waitDead(descendant, 8000), true, `descendant ${descendant} survived importer death`);
  } finally {
    importer.kill('SIGKILL');
    if (descendant) reap(descendant);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
