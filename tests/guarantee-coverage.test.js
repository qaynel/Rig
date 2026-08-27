#!/usr/bin/env node
'use strict';

// Guarantee-coverage regression suite (AT-PROC-1). See
// wiki/mistakes/guarantee-sharding.md and
// wiki/reasoning/2026-08-27-guarantee-sharding-mistake.md for the mistake
// this suite exists to catch: RIG-115's per-AT-LF-case branches each passed
// their own narrow test while leaving the stated guarantee false elsewhere.
//
// A skipped or vacuously-passing test here would repeat the exact mistake
// this suite is named for. Do not skip these to turn CI green; fix the code
// instead.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { withRepo } = require('./helpers/advanced');
const { executePlan, runGrade } = require('../rig/lib/lint-format');

test('AT-PROC-1a (AT-LF-20): one-use approval survives an independent approval object for the same plan, not just object identity', () => {
  withRepo((target) => {
    const plan = { plan_digest: 'digest-guarantee-coverage', target, commands: [] };

    // Process A: approves and executes once.
    const approvalA = { plan_digest: plan.plan_digest, used: false };
    const first = executePlan(plan, approvalA);
    assert.equal(first.status, 'executed');

    // Process B: independently re-derives an approval for the *same plan*
    // (e.g. reloaded from disk, or a second agent turn). It was never
    // mutated by process A, so a fix that only sets `.used` on the object it
    // was handed cannot see this. Durable one-use requires state keyed by
    // plan_digest, not by JS object identity. Refusal is a reported status,
    // matching every other outcome in this function (command_drift,
    // executed) rather than a thrown exception.
    const approvalB = { plan_digest: plan.plan_digest, used: false };
    const second = executePlan(plan, approvalB);
    assert.notEqual(
      second.status,
      'executed',
      'a plan already executed under one approval object executed again under an independently-constructed approval for the same plan_digest',
    );
  });
});

test('AT-PROC-1b (AT-LF-21/24): runGrade refuses a cwd that escapes the repository, at parity with runReadOnly', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    const marker = path.join(outsideRoot, 'marker.txt');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));

    try {
      const cmd = {
        role: 'lint',
        argv: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, 'x')`],
        cwd: 'escape-link',
      };
      runGrade({ grade: 'minimal', changed: [], commands: [cmd], target });

      assert.equal(
        fs.existsSync(marker),
        false,
        'runGrade executed a command whose cwd escaped the repository root via a symlink — the same class of escape AT-LF-24 already closed for runReadOnly',
      );
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1c (AT-LF-23): a command exceeding a configured memory ceiling is killed and reported, independent of its timeout', () => {
  withRepo((target) => {
    const marker = path.join(target, 'allocated.marker');
    // Grow in small chunks with a short pause between each rather than one
    // instant allocation: enforcement here polls RSS (see runCommand in
    // rig/lib/lint-format.js), so a single-instruction burst that completes
    // faster than one poll interval could race past a live watchdog even
    // with correct enforcement. Spreading the growth over ~200ms mirrors how
    // a real runaway lint/format process actually behaves and gives the
    // watchdog several samples to observe the threshold being crossed,
    // without weakening what the case proves. Bounded at 200MB total, and
    // each chunk is freed from the local reference after filling it, so this
    // test cannot itself exhaust memory even if nothing enforces the cap.
    const cmd = {
      role: 'lint',
      argv: [
        process.execPath,
        '-e',
        `
          function sleep(ms) { const end = Date.now() + ms; while (Date.now() < end) {} }
          for (let i = 0; i < 20; i += 1) {
            const chunk = Buffer.alloc(10 * 1024 * 1024);
            chunk.fill(1);
            global.__keepAlive = global.__keepAlive || [];
            global.__keepAlive.push(chunk);
            sleep(10);
          }
          require('fs').writeFileSync(${JSON.stringify(marker)}, 'completed');
        `,
      ],
      memory_limit_mb: 32,
      timeout_ms: 10000,
    };
    const result = runGrade({ grade: 'minimal', changed: [], commands: [cmd], target });
    const executed = result.commands[0];

    assert.equal(
      fs.existsSync(marker),
      false,
      'the command completed a 200MB allocation under a declared 32MB memory_limit_mb — no memory-ceiling enforcement exists',
    );
    assert.equal(
      executed.result.status,
      'memory_exceeded',
      `expected a distinct "memory_exceeded" status separate from timeout/completed, got "${executed.result.status}"`,
    );
  });
});
