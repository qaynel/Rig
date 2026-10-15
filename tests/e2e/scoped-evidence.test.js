'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
test('scoped evidence cleanup restores preexisting reports and keeps unrelated ignored files', () => {
  const { writeEvidence, cleanupEvidence } = require('../../rig/lib/evidence-artifacts');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-evidence-'));
  try {
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'user report\r\n');
    fs.writeFileSync(path.join(target, 'reports/rig/ignored.json'), 'ignored user bytes');
    writeEvidence(target, 'reports/rig/last-uninstall.json', 'new result');
    writeEvidence(target, '.rig/state.json', 'transient');
    writeEvidence(target, '.rig/state.json', 'new transient');
    assert.deepEqual(cleanupEvidence(target), []);
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'utf8'), 'user report\r\n');
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/ignored.json'), 'utf8'), 'ignored user bytes');
    assert.equal(fs.existsSync(path.join(target, '.rig/state.json')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/evidence-artifacts.json')), false);
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});
test('scoped cleanup retains edited evidence and refuses a symlink before mutation', () => {
  const { writeEvidence, cleanupEvidence } = require('../../rig/lib/evidence-artifacts');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-evidence-conflict-'));
  try {
    writeEvidence(target, 'reports/rig/new.json', 'owned report');
    fs.writeFileSync(path.join(target, 'reports/rig/new.json'), 'user edit');
    assert.deepEqual(cleanupEvidence(target), ['reports/rig/new.json']);
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/new.json'), 'utf8'), 'user edit');
    fs.writeFileSync(path.join(target, 'user.md'), 'preserve');
    fs.symlinkSync(path.join(target, 'user.md'), path.join(target, '.rig/state.json'));
    assert.throws(() => writeEvidence(target, '.rig/state.json', 'overwrite'), /unsafe evidence/);
    assert.equal(fs.readFileSync(path.join(target, 'user.md'), 'utf8'), 'preserve');
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('uninstall purge preserves pre-existing reports under reports/rig', () => {
  const { runPayload } = require('../../rig/lib/payload');
  const { uninstall } = require('../../rig/lib/lifecycle');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-purge-reports-'));
  try {
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'owner report\r\n');
    fs.writeFileSync(path.join(target, 'reports/rig/user.json'), 'ignored owner report');
    runPayload(target, ['codex']);
    assert.equal(uninstall(target, { purge: true }).status, 'removed');
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'utf8'), 'owner report\r\n');
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/user.json'), 'utf8'), 'ignored owner report');
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});
