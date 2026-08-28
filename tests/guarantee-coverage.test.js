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
const { withRepo, writeJson } = require('./helpers/advanced');
const { executePlan, planExecution, runGrade } = require('../rig/lib/lint-format');
const { cleanupReceiptArtifacts } = require('../rig/lib/uninstall');
const { rssBytesTree } = require('../rig/lib/memory-guarded-exec');

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
      network: true,
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

test('AT-PROC-1d (AT-LF-22): runGrade denies ungranted network access and preserves granted commands', () => {
  const net = require('node:net');
  withRepo((target) => {
    const server = net.createServer((socket) => socket.end());
    server.listen(0);
    const { port } = server.address();
    const marker = path.join(target, 'connected.marker');
    const probe = path.join(target, 'network-check.js');
    fs.writeFileSync(probe, `
      const net = require('net');
      const done = () => process.exit(0);
      setTimeout(done, 800);
      const socket = net.createConnection({ host: '127.0.0.1', port: ${port} }, () => {
        require('fs').writeFileSync(${JSON.stringify(marker)}, 'connected');
        socket.end();
        done();
      });
      socket.on('error', done);
    `);

    try {
      runGrade({
        grade: 'minimal',
        changed: [],
        commands: [{ role: 'lint', argv: [process.execPath, probe] }],
        target,
      });
      assert.equal(fs.existsSync(marker), false, 'an ungranted grade command reached the listener');

      const emptyBin = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-nobin-'));
      const savedPath = process.env.PATH;
      try {
        process.env.PATH = emptyBin;
        const mixed = runGrade({
          grade: 'minimal',
          changed: [],
          commands: [
            { role: 'lint', argv: [process.execPath, '-e', ''] },
            { role: 'lint', argv: [process.execPath, '-e', ''], network: true },
          ],
          target,
        });
        assert.equal(mixed.verdict, 'fail');
        assert.equal(mixed.commands[0].result.status, 'network_isolation_unavailable');
        assert.equal(mixed.commands[1].result.exit_code, 0);
      } finally {
        process.env.PATH = savedPath;
        fs.rmSync(emptyBin, { recursive: true, force: true });
      }
    } finally {
      server.close();
    }
  });
});

test('AT-PROC-1e (AT-LF-20/AT-LF-14 cleanup): a drift-aborted plan does not permanently burn its one-use approval', () => {
  withRepo((target) => {
    writeJson(path.join(target, 'package.json'), { scripts: { lint: 'node -e "process.exit(0)"' } });
    const planned = planExecution({
      target,
      commands: [{ role: 'lint', argv: [process.execPath, '-e', 'process.exit(0)'], source: 'package.json#scripts.lint' }],
    });

    // Source drifts after planning (e.g. a concurrent edit) -- execution must
    // abort without ever running anything.
    writeJson(path.join(target, 'package.json'), { scripts: { lint: 'node -e "process.exit(1)"' } });
    const aborted = executePlan(planned, { plan_digest: planned.plan_digest });
    assert.equal(aborted.status, 'command_drift');

    // Source reverts to exactly what was originally approved (the drift was
    // transient, or the human re-approves the identical plan). A fresh
    // approval object for the same plan_digest must be able to execute --
    // the earlier aborted attempt must not have durably consumed it.
    writeJson(path.join(target, 'package.json'), { scripts: { lint: 'node -e "process.exit(0)"' } });
    const retried = executePlan(planned, { plan_digest: planned.plan_digest });
    assert.equal(
      retried.status,
      'executed',
      'a plan aborted for command drift, then re-approved after the drift resolved, could not execute -- the aborted attempt permanently burned the one-use approval',
    );
  });
});

test('AT-PROC-1f (memory ceiling / RIG-137 cleanup): reports "unavailable" instead of silently permitting growth when ps cannot be run', () => {
  const saved = process.env.PATH;
  try {
    process.env.PATH = '';
    const { available } = rssBytesTree(process.pid);
    assert.equal(available, false, 'rssBytesTree reported RSS available with no ps binary reachable on PATH');
  } finally {
    process.env.PATH = saved;
  }
  const normal = rssBytesTree(process.pid);
  assert.equal(normal.available, true);
  assert.ok(normal.bytes > 0);
});

test('AT-PROC-1g (memory ceiling / RIG-137 cleanup): a memory ceiling catches a descendant process\'s growth, not only the directly-spawned process', () => {
  withRepo((target) => {
    const marker = path.join(target, 'grandchild-allocated.marker');
    const allocScript = `
      function sleep(ms) { const end = Date.now() + ms; while (Date.now() < end) {} }
      for (let i = 0; i < 20; i += 1) {
        const chunk = Buffer.alloc(10 * 1024 * 1024);
        chunk.fill(1);
        global.__keepAlive = global.__keepAlive || [];
        global.__keepAlive.push(chunk);
        sleep(10);
      }
      require('fs').writeFileSync(${JSON.stringify(marker)}, 'completed');
    `;
    const cmd = {
      role: 'lint',
      network: true,
      argv: [
        process.execPath,
        '-e',
        `
          const { spawn } = require('child_process');
          const child = spawn(${JSON.stringify(process.execPath)}, ['-e', ${JSON.stringify(allocScript)}], { stdio: 'inherit' });
          child.on('exit', (code) => process.exit(code == null ? 1 : code));
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
      'a descendant (grandchild) process completed a 200MB allocation under a declared 32MB memory_limit_mb -- the ceiling only sampled the directly-spawned process, not its process tree',
    );
    assert.equal(executed.result.status, 'memory_exceeded');
  });
});

test('AT-PROC-1h (uninstall cleanup): uninstall removes durable plan-approval records left by lint-format executions', () => {
  withRepo((target) => {
    const recordPath = path.join(target, '.rig', 'lint-format', 'executions', 'some-plan-digest.json');
    fs.mkdirSync(path.dirname(recordPath), { recursive: true });
    fs.writeFileSync(recordPath, '{}');

    cleanupReceiptArtifacts(target, {});

    assert.equal(
      fs.existsSync(path.join(target, '.rig', 'lint-format')),
      false,
      'uninstall left a stale one-use plan-approval record behind -- it would silently block re-execution of that plan_digest after a reinstall',
    );
  });
});
