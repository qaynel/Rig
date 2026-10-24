'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
test('scoped evidence cleanup restores preexisting reports and keeps unrelated ignored files', () => {
  const { writeEvidence, cleanupEvidence } = require('../rig/lib/evidence-artifacts');
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
  const { writeEvidence, cleanupEvidence } = require('../rig/lib/evidence-artifacts');
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

function uninstall(target, ...flags) {
  return spawnSync(process.execPath, [path.join(__dirname, '..', 'rig/materialize.js'), '--target', target, '--uninstall', ...flags], { encoding: 'utf8' });
}
function uninstallCommand(target, ...flags) {
  return spawnSync(process.execPath, [path.join(__dirname, '..', 'rig/materialize.js'), 'uninstall', '--target', target, ...flags], { encoding: 'utf8' });
}

test('public generated-only purge preserves preexisting reports and removes owned evidence', () => {
  const { runPayload } = require('../rig/lib/payload');
  const { writeEvidence } = require('../rig/lib/evidence-artifacts');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-generated-purge-'));
  try {
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'owner report\r\n', { mode: 0o640 });
    fs.writeFileSync(path.join(target, 'reports/rig/user.json'), 'ignored owner report', { mode: 0o600 });
    runPayload(target, ['codex']);
    writeEvidence(target, 'reports/rig/generated.json', 'generated report');
    writeEvidence(target, '.rig/state.json', 'generated state');

    const manifestBefore = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'));
    const routingBefore = fs.readFileSync(path.join(target, '.rig/routing.md'));
    const ambiguous = uninstall(target, '--purge', '--purge-generated');
    assert.notEqual(ambiguous.status, 0);
    assert.deepEqual(fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl')), manifestBefore);
    assert.deepEqual(fs.readFileSync(path.join(target, '.rig/routing.md')), routingBefore);

    const result = uninstall(target, '--purge-generated');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'utf8'), 'owner report\r\n');
    assert.equal(fs.statSync(path.join(target, 'reports/rig/last-uninstall.json')).mode & 0o777, 0o640);
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/user.json'), 'utf8'), 'ignored owner report');
    assert.equal(fs.statSync(path.join(target, 'reports/rig/user.json')).mode & 0o777, 0o600);
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/generated.json')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/state.json')), false);

    runPayload(target, ['codex']);
    writeEvidence(target, 'reports/rig/generated.json', 'generated report');
    const advanced = uninstallCommand(target, '--purge-generated');
    assert.equal(advanced.status, 0, advanced.stderr);
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/user.json'), 'utf8'), 'ignored owner report');
    assert.equal(fs.existsSync(path.join(target, 'reports/rig/generated.json')), false);
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('public broad purge still deletes the complete reports scope', () => {
  const { runPayload } = require('../rig/lib/payload');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-broad-purge-'));
  try {
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, 'reports/rig/user.json'), 'explicitly purged');
    runPayload(target, ['codex']);
    const result = uninstall(target, '--purge');
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.existsSync(path.join(target, 'reports/rig')), false);
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('generated-only purge preserves edited evidence and its ownership ledger for retry', () => {
  const { runPayload } = require('../rig/lib/payload');
  const { writeEvidence } = require('../rig/lib/evidence-artifacts');
  const { uninstall: remove } = require('../rig/lib/lifecycle');
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-generated-conflict-'));
  try {
    runPayload(target, ['codex']);
    writeEvidence(target, 'reports/rig/generated.json', 'Rig report');
    fs.writeFileSync(path.join(target, 'reports/rig/generated.json'), 'user edit');
    const result = remove(target, { purgeGenerated: true });
    assert.equal(result.status, 'best_effort');
    assert.equal(fs.readFileSync(path.join(target, 'reports/rig/generated.json'), 'utf8'), 'user edit');
    assert.equal(fs.existsSync(path.join(target, '.rig/evidence-artifacts.json')), true);
    assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), true);
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('generated-only purge refuses symlinked or hard-linked evidence', () => {
  const { runPayload } = require('../rig/lib/payload');
  const { writeEvidence } = require('../rig/lib/evidence-artifacts');
  const { uninstall: remove } = require('../rig/lib/lifecycle');
  for (const kind of ['symlink', 'hardlink']) {
    const target = fs.mkdtempSync(path.join(os.tmpdir(), `rig-generated-${kind}-`));
    const outside = path.join(path.dirname(target), `rig-generated-${kind}-outside-${path.basename(target)}`);
    try {
      runPayload(target, ['codex']);
      writeEvidence(target, 'reports/rig/generated.json', 'Rig report');
      fs.writeFileSync(outside, 'outside bytes');
      const generated = path.join(target, 'reports/rig/generated.json');
      fs.unlinkSync(generated);
      if (kind === 'symlink') fs.symlinkSync(outside, generated);
      else fs.linkSync(outside, generated);
      assert.throws(() => remove(target, { purgeGenerated: true }), /unsafe evidence path|outside symlink/);
      assert.equal(fs.readFileSync(outside, 'utf8'), 'outside bytes');
      assert.equal(fs.existsSync(path.join(target, '.rig/evidence-artifacts.json')), true);
    } finally {
      fs.rmSync(target, { recursive: true, force: true });
      fs.rmSync(outside, { force: true });
    }
  }
});
