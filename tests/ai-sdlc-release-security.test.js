'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const release = require('../rig/catalog/baseline/release-evidence');
const signoff = require('../rig/catalog/baseline/user-signoff');

function fixture(t, mode) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-security-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  fs.writeFileSync(path.join(repo, 'app.js'), 'module.exports = 1;\n');
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-test-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'test');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  fs.mkdirSync(path.join(repo, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.rig/trust/gate1.allowed-signers'), `test-owner ${fs.readFileSync(key + '.pub', 'utf8')}`);
  if (mode) signoff.select(repo, { confirm: true, mode, release_integrity: 'self-attestation' });
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['full-gate', 'security', 'independent-review', 'scenario-coherence', 'health', 'clean-install']) {
    release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  }
  return { repo, key, keys, commit };
}

function signed(f, fields = {}) {
  const authorization = { identity: 'test-owner', nonce: 'a'.repeat(32), expires_at: new Date(Date.now() + 60000).toISOString(), ...fields };
  const message = release.authorizationMessage(f.repo, { commit: f.commit, ...authorization });
  const input = path.join(f.keys, 'message');
  fs.writeFileSync(input, message);
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', f.key, '-n', 'rig-release', input]).status, 0);
  authorization.signature = fs.readFileSync(input + '.sig', 'utf8');
  fs.rmSync(input + '.sig');
  return authorization;
}

test('publication refuses a typed identity and persists no caller authorization fields', (t) => {
  const f = fixture(t);
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization: { signed_by: 'gate1-owner', secret: 'do-not-persist' } }).published, false);
  const authorization = { ...signed(f), secret: 'do-not-persist' };
  const result = release.publish(f.repo, { commit: f.commit, authorization });
  assert.equal(result.published, true, result.reason);
  const bytes = fs.readFileSync(path.join(f.repo, result.artifact), 'utf8');
  assert.ok(!bytes.includes('test-owner') && !bytes.includes('SSH SIGNATURE') && !bytes.includes('do-not-persist'));
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization }).published, false, 'approval cannot publish twice');
});

test('approval binds the candidate, identity, namespace and expiration', (t) => {
  const f = fixture(t);
  const authorization = signed(f);
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, identity: 'attacker' } }).published, false);
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, nonce: 'b'.repeat(32) } }).published, false);
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, expires_at: '2000-01-01T00:00:00.000Z' } }).published, false);
});

test('protected installed bytes invalidate evidence while mutable memory does not', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, '.rig/memory'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.rig/memory/records.json'), '{"records":[]}');
  assert.equal(release.sourceDigest(f.repo), f.commit);
  fs.mkdirSync(path.join(f.repo, '.rig/oracle'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.rig/oracle/contract.json'), '{"changed":true}');
  assert.notEqual(release.sourceDigest(f.repo), f.commit);
  assert.equal(release.publish(f.repo, { commit: '../escape', authorization: { signed_by: 'owner' } }).published, false);
});

test('failed current evidence and missing public evidence prevent publication', (t) => {
  const f = fixture(t);
  const authorization = signed(f);
  release.record(f.repo, { kind: 'security', status: 'fail', commit: f.commit });
  assert.equal(release.publish(f.repo, { commit: f.commit, authorization }).published, false);
});

test('acknowledgement publication requires public security and review evidence', (t) => {
  const f = fixture(t, 'acknowledgement');
  for (const kind of ['security', 'independent-review', 'scenario-coherence']) {
    release.record(f.repo, { kind, status: 'fail', commit: f.commit });
  }
  const authorization = { acknowledgement: signoff.acknowledge(f.repo, { action: signoff.releaseAction(f.commit) }).id };
  const result = release.publish(f.repo, { commit: f.commit, authorization });
  assert.equal(result.published, false);
  assert.match(result.reason, /security.*independent-review.*scenario-coherence/);
});

test('labels from another candidate cannot be relabelled as passing evidence', (t) => {
  const f = fixture(t);
  const original = fs.readFileSync(path.join(f.repo, 'app.js'));
  fs.writeFileSync(path.join(f.repo, 'app.js'), 'different candidate');
  for (const kind of ['qa-commit', 'full-gate', 'health', 'clean-install', 'independent-review', 'security', 'scenario-coherence']) {
    release.record(f.repo, { kind, status: 'pass', commit: f.commit, source: 'real-download' });
  }
  fs.writeFileSync(path.join(f.repo, 'app.js'), original);
  assert.equal(release.eligible(f.repo, { commit: f.commit }).eligible, false);
  assert.equal(release.publicReadiness(f.repo, { commit: f.commit }).ready, false);
});

test('publication refuses a source change between approval and artifact write', (t) => {
  const f = fixture(t);
  const authorization = signed(f);
  const exists = fs.existsSync;
  let changed = false;
  fs.existsSync = (file) => {
    if (typeof file === 'string' && file.endsWith(`${f.commit.slice(7)}.json`)) {
      changed = true;
      fs.writeFileSync(path.join(f.repo, 'app.js'), 'changed after approval');
    }
    return exists(file);
  };
  try {
    const result = release.publish(f.repo, { commit: f.commit, authorization });
    assert.equal(changed, true);
    assert.equal(result.published, false);
    assert.match(result.reason, /changed/i);
  } finally { fs.existsSync = exists; }
});
