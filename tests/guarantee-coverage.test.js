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
const { execFileSync } = require('node:child_process');
const { withRepo, writeJson } = require('./helpers/advanced');
const { executePlan, planExecution, runCommand, runGrade, runReadOnly, runAutofix } = require('../rig/lib/lint-format');
const { cleanupReceiptArtifacts } = require('../rig/lib/uninstall');
const { rssBytesTree, isChildRunning } = require('../rig/lib/memory-guarded-exec');
const { runBinding, semanticDrift } = require('../rig/lib/checks');
const { runArgv } = require('../rig/lib/check-runner');

// The materialized target-repo runner (`.rig/bin/check.js`/`check-copies.js`)
// used to be a hand-maintained duplicate of `rig/lib/checks.js` -- fixing
// one silently left the other's bug live. Both now require the single
// canonical `rig/lib/check-runner.js` (GA-38) instead of each carrying their
// own copy of the containment/argv-execution logic. `rig/catalog/baseline/
// check.js` requires `../lib/spawn-guarded`, `../lib/path-safety`, and
// `../lib/check-runner`, which only resolve once the file sits at the
// post-materialization layout (`.rig/bin/check.js` next to `.rig/lib/`),
// exactly as `apply.js` lays it out -- so require it from a real copy at
// that layout, not straight from its source location, to exercise the
// actual bytes CI actually runs.
const materializedCheckDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-materialized-check-'));
fs.mkdirSync(path.join(materializedCheckDir, '.rig', 'bin'), { recursive: true });
fs.mkdirSync(path.join(materializedCheckDir, '.rig', 'lib'), { recursive: true });
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'catalog', 'baseline', 'check.js'),
  path.join(materializedCheckDir, '.rig', 'bin', 'check.js'),
);
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'catalog', 'baseline', 'check-copies.js'),
  path.join(materializedCheckDir, '.rig', 'bin', 'check-copies.js'),
);
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'lib', 'spawn-guarded.js'),
  path.join(materializedCheckDir, '.rig', 'lib', 'spawn-guarded.js'),
);
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'lib', 'path-safety.js'),
  path.join(materializedCheckDir, '.rig', 'lib', 'path-safety.js'),
);
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'lib', 'check-runner.js'),
  path.join(materializedCheckDir, '.rig', 'lib', 'check-runner.js'),
);
fs.copyFileSync(
  path.join(__dirname, '..', 'rig', 'lib', 'memory-guarded-exec.js'),
  path.join(materializedCheckDir, '.rig', 'lib', 'memory-guarded-exec.js'),
);
const catalogCheck = require(path.join(materializedCheckDir, '.rig', 'bin', 'check.js'));
const catalogCheckCopies = require(path.join(materializedCheckDir, '.rig', 'bin', 'check-copies.js'));

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

test('AT-PROC-1r (2026-08-29 review): runAutofix denies ungranted network access and reports isolation-unavailable, at parity with runGrade/runReadOnly', () => {
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
      runAutofix(target, { argv: [process.execPath, probe] }, { verified: true });
      assert.equal(
        fs.existsSync(marker),
        false,
        'runAutofix reached an outbound listener from an ungranted fix command -- the fix seam has no network isolation, unlike runGrade/runReadOnly',
      );

      const emptyBin = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-nobin-'));
      const savedPath = process.env.PATH;
      try {
        process.env.PATH = emptyBin;
        const result = runAutofix(target, { argv: [process.execPath, '-e', ''] }, { verified: true });
        assert.equal(
          result.status,
          'network_isolation_unavailable',
          'runAutofix ran an ungranted fix command with no OS network isolation available instead of refusing',
        );
      } finally {
        process.env.PATH = savedPath;
        fs.rmSync(emptyBin, { recursive: true, force: true });
      }
    } finally {
      server.close();
    }
  });
});

test('AT-PROC-1s (2026-08-29 review): runAutofix kills and reports a fix command that exceeds its configured memory ceiling', () => {
  withRepo((target) => {
    const marker = path.join(target, 'allocated.marker');
    const cmd = {
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
      network: true,
      memory_limit_mb: 32,
      timeout_ms: 10000,
      verify: [process.execPath, '-e', 'process.exit(0)'],
    };
    const result = runAutofix(target, cmd, { verified: true });

    assert.equal(
      fs.existsSync(marker),
      false,
      'the autofix command completed a 200MB allocation under a declared 32MB memory_limit_mb -- the fix seam has no memory ceiling, unlike runGrade/runReadOnly',
    );
    assert.equal(
      result.status,
      'memory_exceeded',
      `expected the fix command's memory-ceiling breach to halt autofix before verification, got status "${result.status}"`,
    );
    assert.notEqual(result.verification, 'pass', 'autofix reported the verify step as passing after the fix command was killed for exceeding memory');
  });
});

test('AT-PROC-1t (2026-08-29 review): installed and interactive check runners do not inherit ambient environment secrets', () => {
  withRepo((target) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-env-outside-'));
    const marker = path.join(outside, 'leaked.marker');
    const probe = path.join(target, 'env-probe.js');
    fs.writeFileSync(probe, `if (process.env.RIG_TEST_SECRET_PROC_1T) require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'leaked')`);
    process.env.RIG_TEST_SECRET_PROC_1T = 'must-not-cross-boundary';
    try {
      for (const runner of [runArgv, catalogCheck.runArgv]) {
        const result = runner(process.execPath, [probe], target);
        assert.equal(result.status, 0, `runner failed while checking environment isolation: ${result.reason || result.stderr || result.status}`);
      }
      assert.equal(fs.existsSync(marker), false, 'a check runner inherited a secret from the agent process environment');
    } finally {
      delete process.env.RIG_TEST_SECRET_PROC_1T;
      fs.rmSync(outside, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1u (2026-08-29 review): the undeclared network compatibility state is returned as a diagnostic', () => {
  withRepo((target) => {
    for (const runner of [runBinding, catalogCheck.runBinding]) {
      const result = runner('undeclared-network-service', {
        repo: [process.execPath, '-e', ''],
      }, 'repo', target);
      assert.equal(result.status, 0);
      assert.equal(result.network_state, 'undeclared');
      assert.match(result.diagnostic, /network capability undeclared/);
    }
  });
});

test('AT-PROC-1v (2026-08-29 review): ending classification consumes real command outcomes', () => {
  const classifyEnding = require('../rig/lib/lint-format').classifyEnding;
  withRepo((target) => {
    const timeout = runCommand([process.execPath, '-e', 'setTimeout(() => {}, 2000)'], {
      cwd: target, timeoutMs: 50, memoryLimitMb: null,
    });
    const signalled = runCommand([process.execPath, '-e', 'process.kill(process.pid, "SIGTERM")'], {
      cwd: target, memoryLimitMb: null,
    });
    const missing = runCommand(['rig-command-that-does-not-exist-1v'], {
      cwd: target, memoryLimitMb: null,
    });
    assert.deepEqual(
      [timeout, signalled, missing].map(classifyEnding).map((entry) => entry.status),
      ['timeout', 'signalled', 'command_not_found'],
    );
    assert.ok([timeout, signalled, missing].map(classifyEnding)
      .every((entry) => entry.passing === false && entry.blocking === true));
  });
});

test('AT-PROC-1ab (AT-LF-16): every declared abnormal ending has a runner producer', () => {
  const classifyEnding = require('../rig/lib/lint-format').classifyEnding;
  withRepo((target) => {
    const cancelled = runCommand([process.execPath, '-e', ''], {
      cwd: target, memoryLimitMb: null, cancelled: true,
    });
    const missingDependency = runCommand([process.execPath, '-e', ''], {
      cwd: target, memoryLimitMb: null, dependencies: ['rig-dependency-that-does-not-exist-1ab'],
    });
    const partialOutput = runCommand([process.execPath, '-e', 'process.stdout.write("too much")'], {
      cwd: target, memoryLimitMb: null, maxOutputBytes: 1,
    });
    assert.deepEqual(
      [cancelled, missingDependency, partialOutput].map(classifyEnding).map((entry) => entry.status),
      ['cancelled', 'missing_dependency', 'partial_output'],
    );
    assert.ok([cancelled, missingDependency, partialOutput]
      .every((entry) => entry.exit_code !== 0));
  });
});

test('AT-PROC-1w (2026-08-29 review): lint-format install and uninstall use the lifecycle journal', () => {
  const install = require('../rig/lib/lint-format').install;
  const remove = require('../rig/lib/lint-format').uninstall;
  withRepo((target) => {
    const state = install(target);
    const journal = path.join(target, '.rig', 'install-manifest.jsonl');
    assert.equal(fs.existsSync(journal), true, 'lint-format install did not create the lifecycle journal');
    assert.match(fs.readFileSync(journal, 'utf8'), /"transaction_kind":"install"/);
    assert.equal(JSON.parse(fs.readFileSync(path.join(target, '.rig', 'lint-format', 'plan.json'), 'utf8')).kind, 'lint-format-install-plan');
    assert.equal(JSON.parse(fs.readFileSync(path.join(target, '.rig', 'lint-format', 'binding.json'), 'utf8')).engine, 'component-lint-format-v1');
    const result = remove(target, state.manifest);
    assert.equal(result.status, 'removed');
    assert.equal(fs.existsSync(journal), false, 'lifecycle uninstall did not remove the install journal');
  });
});

test('AT-PROC-1y (2026-08-29 review): the guarded Linux wrapper preserves missing-command classification', () => {
  const { spawnGuardedSync, linuxPdeathCommand } = require('../rig/lib/spawn-guarded');
  const spec = linuxPdeathCommand('rig-command-that-does-not-exist-1y', [], true);
  assert.equal(spec.command, 'rig-command-that-does-not-exist-1y');
  const result = spawnGuardedSync('rig-command-that-does-not-exist-1y', [], { forceLinuxWrapper: true });
  assert.equal(result.error?.code, 'ENOENT');
});

test('AT-PROC-1z (2026-08-29 review): a materialized CI runner enforces the same capability floor', () => {
  withRepo((target) => {
    const binding = {
      repo: [process.execPath, '-e', ''],
      timeout_ms: 10 * 60 * 1000 + 1,
    };
    const result = catalogCheck.runBinding('ci-floor-service', binding, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'capability_not_authorized');
  });
});

test('AT-PROC-1aa (AT-LF-24): a source symlink escape is refused before approval consumption', () => {
  withRepo((target) => {
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    try {
      fs.writeFileSync(path.join(outside, 'secret.json'), JSON.stringify({ scripts: { lint: 'node -e "process.exit(0)"' } }));
      fs.symlinkSync(path.join(outside, 'secret.json'), path.join(target, 'linked.json'));

      const planned = planExecution({
        target,
        commands: [{ role: 'lint', argv: ['npm', 'run', 'lint'], source: 'linked.json#scripts.lint' }],
      });
      assert.equal(planned.commands[0].source_snapshot, null);
      assert.equal(planned.commands[0].source_boundary_violation, true);

      const result = executePlan(planned, { plan_digest: planned.plan_digest });
      assert.equal(result.status, 'boundary_violation');
      assert.equal(
        fs.existsSync(path.join(target, '.rig', 'lint-format', 'executions')),
        false,
        'a source-boundary refusal consumed the one-use approval before execution',
      );
    } finally {
      fs.rmSync(outside, { recursive: true, force: true });
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

test('AT-PROC-1j (memory ceiling / fail-closed): rssBytesTree treats a missing root pid in ps output as unavailable', () => {
  const result = rssBytesTree(99999999);
  assert.equal(
    result.available,
    false,
    'rssBytesTree reported RSS available when the root pid was absent from ps output -- partial listing was treated as zero usage',
  );
});

test('AT-PROC-1k (memory ceiling / fail-closed): a poll landing after the child has already exited is not treated as unavailable RSS', () => {
  const { spawn } = require('node:child_process');
  const child = spawn(process.execPath, ['-e', 'process.exit(0)']);
  assert.equal(
    isChildRunning(child),
    true,
    'isChildRunning reported a just-spawned child as not running -- the memory-poll guard would never poll a live child',
  );
  return new Promise((resolve) => {
    child.once('exit', () => {
      assert.equal(
        isChildRunning(child),
        false,
        'isChildRunning still reported the child as running immediately after its exit event fired -- a poll landing in this window would read the already-reaped pid out of `ps`, see it missing, and report memory_ceiling_unavailable / kill for a command that actually finished clean',
      );
      resolve();
    });
  });
});

test('AT-PROC-1i (memory ceiling / fail-closed): runReadOnly reports memory_ceiling_unavailable when ps is absent, not clean', () => {
  withRepo((target) => {
    const saved = process.env.PATH;
    try {
      // Empty PATH: ps cannot be found by the memory watchdog, triggering the
      // fail-closed kill path. The command itself uses an absolute execPath so
      // it still starts, but it runs long enough for at least one poll interval
      // (15ms) to fire before it exits naturally.
      process.env.PATH = '';
      const result = runReadOnly(target, [{
        argv: [
          process.execPath,
          '-e',
          'function sleep(ms){const end=Date.now()+ms;while(Date.now()<end){}}sleep(500);',
        ],
        network: true,
        memory_limit_mb: 64,
        timeout_ms: 5000,
      }]);
      assert.equal(
        result.status,
        'memory_ceiling_unavailable',
        `runReadOnly returned "${result.status}" instead of "memory_ceiling_unavailable" when ps is absent -- a killed command was reported as clean`,
      );
    } finally {
      process.env.PATH = saved;
    }
  });
});

test('AT-PROC-1l (RIG-144): runBinding refuses a component cwd that escapes the repository through a symlink', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    const marker = path.join(outsideRoot, 'marker.txt');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    try {
      const binding = {
        checks: {
          demo: {
            commands: [{
              argv: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, 'x')`],
              cwd: 'escape-link',
            }],
          },
        },
      };
      const result = runBinding('demo-service', binding, 'repo', target);
      assert.equal(
        fs.existsSync(marker),
        false,
        'runBinding executed a command whose cwd escaped the repository root via a symlink -- the lexical path.resolve/startsWith cwd check RIG-144 flagged as not realpath-based',
      );
      assert.equal(result.kind, 'coverage_gap');
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1m (RIG-144): runBinding refuses a required_paths entry that resolves outside the repository through a symlink', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    fs.writeFileSync(path.join(outsideRoot, 'secret.txt'), 'x');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    try {
      const binding = { checks: { demo: { required_paths: ['escape-link/secret.txt'] } } };
      const result = runBinding('demo-service', binding, 'repo', target);
      assert.equal(
        result.kind,
        'coverage_gap',
        'runBinding treated a required_paths entry that escapes the repository through a symlink as present, via a lexical containment check rather than a realpath one',
      );
      assert.match(result.reason, /invalid required path/);
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1n (RIG-144 generalization): semanticDrift refuses to read a context-index document path that escapes the repository through a symlink', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    fs.writeFileSync(path.join(outsideRoot, 'secret.md'), '# secret');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    writeJson(path.join(target, '.rig', 'context-index.json'), {
      documents: [{ path: 'escape-link/secret.md', digest: 'whatever' }],
    });
    try {
      const findings = semanticDrift(target);
      const finding = findings.find((f) => f.path === 'escape-link/secret.md');
      assert.ok(finding, 'expected a coverage_gap finding for the escaping document path, got none');
      assert.equal(finding.reason, 'escaping_context_path');
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1o (RIG-144, materialized runner parity): the actual .rig/bin/check.js source refuses a component cwd that escapes the repository through a symlink', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    const marker = path.join(outsideRoot, 'marker.txt');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    try {
      const binding = {
        checks: {
          demo: {
            commands: [{
              argv: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, 'x')`],
              cwd: 'escape-link',
            }],
          },
        },
      };
      const result = catalogCheck.runBinding('demo-service', binding, 'repo', target);
      assert.equal(
        fs.existsSync(marker),
        false,
        'the materialized runner (rig/catalog/baseline/check.js, copied byte-for-byte to .rig/bin/check.js and invoked directly by every generated CI workflow) executed a command whose cwd escaped the repository via a symlink -- fixing rig/lib/checks.js alone left this hand-duplicated copy vulnerable',
      );
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1p (RIG-144, materialized runner parity): the actual .rig/bin/check.js source refuses a required_paths entry that escapes through a symlink', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    fs.writeFileSync(path.join(outsideRoot, 'secret.txt'), 'x');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    try {
      const binding = { checks: { demo: { required_paths: ['escape-link/secret.txt'] } } };
      const result = catalogCheck.runBinding('demo-service', binding, 'repo', target);
      assert.equal(result.status, 1, 'the materialized runner treated an escaping required_paths entry as present');
      assert.match(result.reason, /invalid required path/);
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-PROC-1q (RIG-144, materialized runner parity): the actual .rig/bin/check-copies.js source refuses a copy path reached only through an intermediate symlinked directory', () => {
  withRepo((target) => {
    const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-outside-'));
    fs.writeFileSync(path.join(outsideRoot, 'secret.txt'), 'attacker bytes');
    fs.symlinkSync(outsideRoot, path.join(target, 'escape-link'));
    try {
      // The leaf ("secret.txt") is not itself a symlink -- only an
      // intermediate directory segment ("escape-link") is. A leaf-only
      // symlink check (the previous implementation here) misses this.
      const result = catalogCheckCopies.inspectInside(fs.realpathSync(target), 'escape-link/secret.txt', 'copy');
      assert.equal(
        result.ok,
        false,
        'inspectInside treated a path reached only through an intermediate symlinked directory as inside the repository',
      );
    } finally {
      fs.rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

test('AT-CAP-6 (RIG-144/GA-38, no runner duplication): the interactive runner and the installed runner delegate to one canonical runBinding, not two implementations that merely agree', () => {
  // rig/lib/checks.js requires rig/lib/check-runner.js directly -- same
  // module, same object identity. This is the strong version of the
  // guarantee: not "these two functions currently behave the same," but
  // "there is exactly one function."
  const canonical = require('../rig/lib/check-runner');
  assert.equal(
    runBinding,
    canonical.runBinding,
    'rig/lib/checks.js no longer re-exports the canonical rig/lib/check-runner.js runBinding by reference -- ' +
      'a hand-written copy has crept back in, which is the exact defect class RIG-144 found and GA-38 closed',
  );

  // The materialized .rig/bin/check.js is required from a temp-directory
  // copy of the install layout (see the file-header comment above), so its
  // `../lib/check-runner` resolves to a different absolute path than
  // rig/lib/check-runner.js and therefore cannot be object-identical to
  // `canonical` even when correct. Source-text equality is the right check
  // here: it proves the materialized runner still delegates to an unedited
  // copy of the canonical module rather than carrying its own hand-written
  // runBinding again.
  assert.equal(
    catalogCheck.runBinding.toString(),
    canonical.runBinding.toString(),
    'the materialized .rig/bin/check.js runBinding source no longer matches rig/lib/check-runner.js byte-for-byte -- ' +
      'it has drifted back into a hand-maintained duplicate instead of requiring the canonical module',
  );
});

test('AT-CAP-1 (RIG-144): every check command has an enforced, configurable wall-clock ceiling that kills its descendant process tree', () => {
  withRepo((target) => {
    for (const runner of [runBinding, catalogCheck.runBinding]) {
      const marker = path.join(target, `timeout-child-${Math.random()}.marker`);
      const result = runner('timeout-service', {
        repo: [
          process.execPath,
          '-e',
          `
            const { spawn } = require('node:child_process');
            spawn(${JSON.stringify(process.execPath)}, ['-e', ${JSON.stringify(`setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran'), 250)`)}]);
            setTimeout(() => {}, 500);
          `,
        ],
        timeout_ms: 50,
      }, 'repo', target);
      const until = Date.now() + 350;
      while (Date.now() < until) {}
      assert.equal(result.status, 1, 'a command exceeding its declared wall-clock ceiling was not a non-passing result');
      assert.equal(result.kind, 'timeout', `expected the distinct timeout status, got ${result.kind}`);
      assert.equal(fs.existsSync(marker), false, 'the timed-out command left a descendant running after its process tree should have been killed');
    }
  });
});

test('AT-CAP-2 (RIG-144): every check command has an enforced, configurable memory ceiling', () => {
  withRepo((target) => {
    for (const runner of [runBinding, catalogCheck.runBinding]) {
      const marker = path.join(target, `memory-child-${Math.random()}.marker`);
      const result = runner('memory-service', {
        repo: [
          process.execPath,
          '-e',
          `
            function sleep(ms) { const end = Date.now() + ms; while (Date.now() < end) {} }
            for (let i = 0; i < 10; i += 1) {
              const chunk = Buffer.alloc(10 * 1024 * 1024); chunk.fill(1);
              global.keep = global.keep || []; global.keep.push(chunk); sleep(15);
            }
            require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');
          `,
        ],
        memory_limit_mb: 32,
        timeout_ms: 5000,
      }, 'repo', target);
      assert.equal(result.status, 1, 'a command exceeding its declared memory ceiling was not a non-passing result');
      assert.equal(result.kind, 'memory_exceeded', `expected the distinct memory_exceeded status, got ${result.kind}`);
      assert.equal(fs.existsSync(marker), false, 'the memory-limited command completed after crossing its declared ceiling');
    }
  });
});

test('AT-CAP-3 (RIG-144): explicit network denial is isolated, while an undeclared binding remains a visibly distinct compatibility state', () => {
  const net = require('node:net');
  withRepo((target) => {
    const server = net.createServer((socket) => socket.end());
    server.listen(0);
    const { port } = server.address();
    try {
      for (const runner of [runBinding, catalogCheck.runBinding]) {
        const marker = path.join(target, `network-denied-${Math.random()}.marker`);
        const denied = runner('network-service', {
          repo: [process.execPath, '-e', `
            const socket = require('node:net').createConnection({ host: '127.0.0.1', port: ${port} }, () => {
              require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'connected'); socket.end();
            });
            setTimeout(() => process.exit(0), 300);
            socket.on('error', () => process.exit(0));
          `],
          network: 'none',
        }, 'repo', target);
        assert.equal(fs.existsSync(marker), false, 'a binding declared network:none reached a local listener');
        assert.ok(
          denied.status === 0 || denied.kind === 'network_isolation_unavailable',
          `expected isolated execution or a named unavailable-isolation refusal, got ${denied.kind}`,
        );
        assert.equal(denied.network_state, 'none');

        const undeclared = runner('legacy-network-service', {
          repo: [process.execPath, '-e', ''],
        }, 'repo', target);
        assert.equal(undeclared.status, 0);
        assert.equal(undeclared.network_state, 'undeclared');
        assert.match(undeclared.diagnostic, /network capability undeclared/);
      }
    } finally {
      server.close();
    }
  });
});

test('AT-CAP-4 (RIG-144): elevated network and resource requests run only when a clean committed policy grants that exact service', () => {
  for (const runner of [runBinding, catalogCheck.runBinding]) {
    withRepo((target) => {
      const marker = path.join(target, `authorised-${Math.random()}.marker`);
      const binding = {
        repo: [process.execPath, '-e', `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran')`],
        network: 'required',
        timeout_ms: 700000,
        memory_limit_mb: 3072,
      };
      const missing = runner('elevated-service', binding, 'repo', target);
      assert.equal(missing.status, 1);
      assert.equal(missing.kind, 'capability_not_authorized');
      assert.equal(fs.existsSync(marker), false, 'an elevated binding ran without a committed policy grant');

      writeJson(path.join(target, '.rig', 'execution-policy.json'), {
        schema_version: 1,
        grants: {
          'elevated-service': { network: 'required', timeout_ms: 700000, memory_limit_mb: 3072 },
        },
      });
      const dirty = runner('elevated-service', binding, 'repo', target);
      assert.equal(dirty.status, 1);
      assert.equal(dirty.kind, 'capability_policy_not_committed');

      execFileSync('git', ['add', '.rig/execution-policy.json'], { cwd: target });
      execFileSync('git', ['commit', '-m', 'grant elevated check capability'], { cwd: target, stdio: 'pipe' });
      const authorized = runner('elevated-service', binding, 'repo', target);
      assert.equal(authorized.status, 0);
      assert.equal(authorized.network_state, 'required');
      assert.equal(fs.existsSync(marker), true, 'a committed exact policy grant did not authorize its matching binding');
    });
  }
});

test('AT-CAP-5 (RIG-144): malformed or unenforceable capability controls refuse execution instead of running unprotected', () => {
  for (const runner of [runBinding, catalogCheck.runBinding]) {
    withRepo((target) => {
      const marker = path.join(target, `fail-closed-${Math.random()}.marker`);
      writeJson(path.join(target, '.rig', 'execution-policy.json'), { schema_version: 1, grants: [], unexpected: true });
      execFileSync('git', ['add', '.rig/execution-policy.json'], { cwd: target });
      execFileSync('git', ['commit', '-m', 'invalid capability policy fixture'], { cwd: target, stdio: 'pipe' });
      const invalidPolicy = runner('elevated-service', {
        repo: [process.execPath, '-e', `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran')`],
        network: 'required',
      }, 'repo', target);
      assert.equal(invalidPolicy.status, 1);
      assert.equal(invalidPolicy.kind, 'capability_policy_invalid');
      assert.equal(fs.existsSync(marker), false, 'an invalid policy silently downgraded to an allowed elevated command');

      const savedPath = process.env.PATH;
      try {
        process.env.PATH = '';
        const unavailable = runner('denied-service', {
          repo: [process.execPath, '-e', ''], network: 'none',
        }, 'repo', target);
        assert.equal(unavailable.status, 1);
        assert.equal(unavailable.kind, 'network_isolation_unavailable');
      } finally {
        process.env.PATH = savedPath;
      }
    });
  }
});
