#!/usr/bin/env node
'use strict';

// RIG-135 oracle: the recursive-cleanup contract for rig/lib/spawn-guarded.js.
// This module does not exist yet -- these tests are the frozen acceptance
// criteria for it, written red-first per rig-grilling. They must fail against
// a naive `child.kill()` / `process.kill(child.pid, ...)` implementation
// (that is the exact bug RIG-124.1 and this ticket's survey found) and pass
// only once cleanup is guaranteed to reach every descendant, at any depth.
//
// Assumed API shape (declare/correct before implementation freezes):
//   spawnGuardedSync(command, args, options) -- spawnSync-shaped return value.
//     options.timeout behaves like node:child_process's spawnSync timeout.
//   spawnGuarded(command, args, options) -- returns an object exposing at
//     least { pid, cancel(signal) } where cancel() guarantees the whole
//     subtree is signalled (escalating SIGTERM -> SIGKILL) before resolving.
//   options.cleanup -- () => void, invoked exactly once on any terminal
//     outcome (cancel, timeout, normal exit, error exit).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

let spawnGuarded;
let spawnGuardedSync;
try {
  ({ spawnGuarded, spawnGuardedSync } = require('../rig/lib/spawn-guarded'));
} catch {
  // Module doesn't exist yet -- expected before RIG-135 lands. Every test
  // below reports the same clear failure instead of a cryptic MODULE_NOT_FOUND.
}

function withMarkerDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-spawn-guarded-'));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Shell stand-in that forks a grandchild, which forks a great-grandchild --
// three generations deep, all long-sleeping, each one dropping a marker file
// the instant it starts so "did it ever run" and "is it still alive" are
// both directly observable without racing the fork.
function threeGenerationStub(markerDir) {
  const gg = path.join(markerDir, 'great-grandchild-alive');
  const gc = path.join(markerDir, 'grandchild-alive');
  return (
    `#!/bin/sh\n`
    + `( printf x > '${gc}'; ( printf x > '${gg}'; sleep 3600 ) & sleep 3600 ) &\n`
    + `sleep 3600\n`
  );
}

function writeExecutable(file, contents) {
  fs.writeFileSync(file, contents, { mode: 0o755 });
}

test('spawnGuarded cancel kills the entire descendant subtree, not just the direct child (RIG-135)', async () => {
  assert.ok(spawnGuarded, 'rig/lib/spawn-guarded.js must export spawnGuarded');
  await withMarkerDir(async (dir) => {
    const stub = path.join(dir, 'stub.sh');
    writeExecutable(stub, threeGenerationStub(dir));

    const handle = spawnGuarded(stub, [], {});
    // Give the fork chain time to actually start before cancelling.
    for (let i = 0; i < 50 && !fs.existsSync(path.join(dir, 'grandchild-alive')); i += 1) {
      spawnSync('sleep', ['0.1']);
    }
    assert.ok(fs.existsSync(path.join(dir, 'grandchild-alive')), 'fixture setup: grandchild must have started');

    await handle.cancel('SIGTERM');
    spawnSync('sleep', ['1']); // let anything that survived actually run

    assert.equal(isPidAlive(handle.pid), false, 'the direct child must be dead after cancel');
    assert.equal(anyDescendantAlive(dir), false, 'no grandchild or great-grandchild may survive the cancel');
  });
});

test('spawnGuardedSync timeout kills descendants, not just the timed-out direct child (RIG-135)', () => {
  assert.ok(spawnGuardedSync, 'rig/lib/spawn-guarded.js must export spawnGuardedSync');
  withMarkerDir((dir) => {
    const stub = path.join(dir, 'stub.sh');
    writeExecutable(stub, threeGenerationStub(dir));

    const result = spawnGuardedSync(stub, [], { timeout: 300 });
    assert.notEqual(result.status, 0, 'a timed-out guarded spawn must report a non-clean status');

    spawnSync('sleep', ['1']); // let anything that survived the timeout actually run
    assert.equal(anyDescendantAlive(dir), false, 'no descendant of the timed-out spawn may still be running');
  });
});

test('the per-invocation cleanup callback runs exactly once regardless of outcome (RIG-135)', async () => {
  assert.ok(spawnGuarded && spawnGuardedSync, 'rig/lib/spawn-guarded.js must export both entry points');

  const outcomes = [];

  withMarkerDir((dir) => {
    const hang = path.join(dir, 'hang.sh');
    writeExecutable(hang, '#!/bin/sh\nsleep 3600\n');
    let calls = 0;
    spawnGuardedSync(hang, [], { timeout: 200, cleanup: () => { calls += 1; } });
    outcomes.push(['timeout', calls]);
  });

  withMarkerDir((dir) => {
    const ok = path.join(dir, 'ok.sh');
    writeExecutable(ok, '#!/bin/sh\nexit 0\n');
    let calls = 0;
    spawnGuardedSync(ok, [], { cleanup: () => { calls += 1; } });
    outcomes.push(['normal-exit', calls]);
  });

  withMarkerDir((dir) => {
    const fail = path.join(dir, 'fail.sh');
    writeExecutable(fail, '#!/bin/sh\nexit 1\n');
    let calls = 0;
    spawnGuardedSync(fail, [], { cleanup: () => { calls += 1; } });
    outcomes.push(['error-exit', calls]);
  });

  await withMarkerDir(async (dir) => {
    const hang = path.join(dir, 'hang.sh');
    writeExecutable(hang, '#!/bin/sh\nsleep 3600\n');
    let calls = 0;
    const handle = spawnGuarded(hang, [], { cleanup: () => { calls += 1; } });
    await handle.cancel('SIGTERM');
    outcomes.push(['cancel', calls]);
  });

  for (const [outcome, calls] of outcomes) {
    assert.equal(calls, 1, `cleanup must run exactly once for the '${outcome}' outcome (ran ${calls} times)`);
  }
});

test('an abnormal parent exit (SIGKILL) still tears down the guarded child subtree via parent-death signal (RIG-135)', { skip: os.platform() !== 'linux' && 'PR_SET_PDEATHSIG is Linux-only; not testable on this host' }, () => {
  withMarkerDir((dir) => {
    const parentScript = path.join(dir, 'parent.js');
    const childMarker = path.join(dir, 'child-alive');
    fs.writeFileSync(
      parentScript,
      `const { spawnGuarded } = require(${JSON.stringify(path.join(__dirname, '..', 'rig', 'lib', 'spawn-guarded.js'))});\n`
      + `spawnGuarded('/bin/sh', ['-c', 'printf x > ${childMarker}; sleep 3600']);\n`
      + `setInterval(() => {}, 1000);\n`,
    );
    const parent = require('node:child_process').spawn(process.execPath, [parentScript]);
    for (let i = 0; i < 50 && !fs.existsSync(childMarker); i += 1) spawnSync('sleep', ['0.1']);
    assert.ok(fs.existsSync(childMarker), 'fixture setup: guarded child must have started');

    process.kill(parent.pid, 'SIGKILL'); // the parent gets no chance to run its own exit handlers
    spawnSync('sleep', ['1']);

    assert.equal(anyDescendantAlive(dir), false, 'the guarded child must not outlive an abnormally-killed parent');
  });
});

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function anyDescendantAlive(dir) {
  // Conservative black-box check: ask the OS for any process whose command
  // line references this fixture's own tmpdir path -- if the fork chain is
  // still alive, at least one process still has it open/referenced.
  const result = spawnSync('sh', ['-c', `ps -eo pid,command | grep -F ${JSON.stringify(dir)} | grep -v grep`], { encoding: 'utf8' });
  return Boolean(result.stdout && result.stdout.trim());
}

