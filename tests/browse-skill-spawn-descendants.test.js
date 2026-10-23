#!/usr/bin/env node
'use strict';

// RIG-135.2: a browse skill script that forks must leave no descendant when
// the daemon kills it on timeout. Bun's Subprocess#kill() cannot signal a
// process group (oven-sh/bun#15791), so spawnSkill goes through
// node:child_process with detached:true and a group kill.

const test = require('node:test');
const assert = require('node:assert/strict');
const { skipReason, runBun, waitDead, reap } = require('./helpers/browse-process');

test('a timed-out browse skill leaves no forked descendant (RIG-135.2)', { skip: skipReason() }, async () => {
  const report = runBun('skill-timeout.ts');
  assert.equal(report.timedOut, true);
  assert.equal(report.exitCode, 124);
  assert.ok(report.descendantPid > 0, 'the skill script must have forked a descendant');
  try {
    assert.equal(await waitDead(report.descendantPid), true, `descendant ${report.descendantPid} survived the skill timeout`);
  } finally {
    reap(report.descendantPid);
  }
});
