#!/usr/bin/env node
'use strict';

// RIG-135.3: xvfb.ts claimed to spawn detached but never passed detached:true,
// and stop signalled the leader pid only. Xvfb must lead its own process group
// and stop must take down the whole group. A fake Xvfb that forks a descendant
// stands in for the real server (Linux only: ownership checks read /proc).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { skipReason, tmpDir, runBun, waitDead, reap } = require('./helpers/browse-process');

const reason = skipReason(process.platform === 'linux' ? false : 'Xvfb handling is Linux-only (reads /proc)');

test('stopping Xvfb leaves no process from its group (RIG-135.3)', { skip: reason }, async () => {
  const dir = tmpDir('rig-fake-xvfb-');
  const marker = path.join(dir, 'display-up');
  const childPidFile = path.join(dir, 'child.pid');
  fs.writeFileSync(path.join(dir, 'Xvfb'), `#!/bin/sh\ntouch "${marker}"\nsleep 300 &\necho $! > "${childPidFile}"\nwait\n`, { mode: 0o755 });
  fs.writeFileSync(path.join(dir, 'xdpyinfo'), `#!/bin/sh\n[ -e "${marker}" ]\n`, { mode: 0o755 });

  const report = runBun('xvfb-stop.ts', [], {
    PATH: `${dir}${path.delimiter}${process.env.PATH}`,
    FAKE_X_CHILD_PID: childPidFile,
  });
  try {
    assert.equal(report.pgid, report.pid, 'Xvfb must be the leader of its own process group (detached: true)');
    assert.equal(await waitDead(report.pid), true, 'Xvfb leader survived close()');
    assert.equal(await waitDead(report.descendantPid), true, `Xvfb descendant ${report.descendantPid} survived close()`);
  } finally {
    reap(report.pid);
    reap(report.descendantPid);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
