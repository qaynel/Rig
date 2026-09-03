'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const gate = require('../scripts/check-advanced-spec');
const approve = require('../scripts/approve-gate1');

function tempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-gate1-approve-'));
  fs.mkdirSync(path.join(root, 'wiki/gate1'), { recursive: true });
  fs.writeFileSync(path.join(root, 'wiki/gate1/business-spec.md'), '# intent\n');
  fs.writeFileSync(path.join(root, 'wiki/gate1/acceptance.md'), '# acceptance\n');
  fs.writeFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), '');
  return root;
}

function makeKey(root) {
  const key = path.join(root, 'owner-key');
  const result = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return key;
}

test('local Gate 1 env config is parsed without shell evaluation', () => {
  const root = tempRoot();
  fs.mkdirSync(path.join(root, '.credentials'), { recursive: true });
  fs.writeFileSync(path.join(root, '.credentials/gate1.env'), 'RIG_GATE1_SIGNING_KEY="$HOME/.ssh/gate1.pub"\n');
  assert.equal(approve.loadLocalEnv(root, {}), '$HOME/.ssh/gate1.pub');
});

test('tracked example env names the one local key variable', () => {
  const example = fs.readFileSync(path.join(__dirname, '..', '.credentials/gate1.env.example'), 'utf8');
  assert.match(example, /^RIG_GATE1_SIGNING_KEY=/m);
  assert.doesNotMatch(example, /PRIVATE|SECRET|TOKEN/);
});

test('human re-freeze path has a fillable evidence request', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '..', 'wiki/gate1/unfreeze-request.template.md'),
    'utf8',
  );
  assert.match(template, /Test to change/);
  assert.match(template, /Human rationale \(no agent available\)/);
  assert.match(template, /approve-gate1\.js/);
});

test('Gate 1 approval signs the canonical oracle message', () => {
  const root = tempRoot();
  const key = makeKey(root);

  approve.approveGate1(root, {
    check: false,
    env: { RIG_GATE1_SIGNING_KEY: key },
  });

  const verified = gate.verifySignature(root, gate.oracleMessage(root));
  assert.equal(verified.principal, 'gate1-owner');
  assert.match(verified.fingerprint, /^SHA256:/);
});

test('lock requires explicit confirmation of the exact oracle digest before signing changed bytes', () => {
  const root = tempRoot();
  const key = makeKey(root);
  const listed = path.join(root, 'listed.txt');
  fs.writeFileSync(listed, 'v1\n');
  const staleManifest = `${'0'.repeat(64)}  listed.txt\n`;
  fs.writeFileSync(
    path.join(root, 'wiki/gate1/testing-infrastructure.manifest'),
    staleManifest,
  );

  let refusal;
  try {
    approve.approveGate1(root, {
      check: false,
      env: { RIG_GATE1_SIGNING_KEY: key },
    });
  } catch (error) {
    refusal = error;
  }
  assert.match(refusal?.message || '', /--confirm-digest-delta ([0-9a-f]{64})/);
  assert.equal(
    fs.readFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), 'utf8'),
    staleManifest,
    'a refused ceremony changed the frozen manifest before owner confirmation',
  );
  assert.equal(fs.existsSync(path.join(root, 'wiki/gate1/gate1.sig')), false);

  const confirmation = refusal.message.match(/--confirm-digest-delta ([0-9a-f]{64})/)[1];
  approve.approveGate1(root, {
    check: false,
    confirmDigestDelta: confirmation,
    env: { RIG_GATE1_SIGNING_KEY: key },
  });

  const manifest = fs.readFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), 'utf8');
  assert.equal(manifest, `${gate.sha256(fs.readFileSync(listed))}  listed.txt\n`);
  assert.equal(gate.verifySignature(root, gate.oracleMessage(root)).principal, 'gate1-owner');
});

test('re-signing regenerates the signers file as a single pinned principal line', () => {
  const root = tempRoot();
  const key = makeKey(root);
  const allowed = path.join(root, 'wiki/gate1/gate1.allowed-signers');

  // A file carrying hand-written provenance and a stale key, as it looks today.
  fs.writeFileSync(allowed, [
    '# key-class: plain file-based ssh-ed25519 key, not hardware-backed.',
    '# Rotation to a Secure-Enclave key was authorized but not adopted (2026-09-02).',
    '',
    'gate1-owner namespaces="rig-gate1" ssh-ed25519 AAAAstale placeholder',
    '',
  ].join('\n'));

  approve.approveGate1(root, {
    check: false,
    env: { RIG_GATE1_SIGNING_KEY: key },
  });

  // The file is a generated pin, not a hand-maintained register: one line, no prose.
  const after = fs.readFileSync(allowed, 'utf8');
  const lines = after.split('\n').filter((line) => line.trim());
  assert.equal(lines.length, 1, 'the signers file must be exactly one generated principal line');
  assert.match(lines[0], /^gate1-owner namespaces="rig-gate1" ssh-ed25519 /);
  assert.doesNotMatch(after, /^#/m, 'commentary belongs in the signing hub, not the generated pin');
  assert.doesNotMatch(after, /AAAAstale/, 'stale principal key was not replaced');
  assert.equal(gate.verifySignature(root, gate.oracleMessage(root)).principal, 'gate1-owner');
});

test('a second principal line cannot ratify a forged oracle', () => {
  const root = tempRoot();
  const allowed = path.join(root, 'wiki/gate1/gate1.allowed-signers');
  approve.approveGate1(root, {
    check: false,
    env: { RIG_GATE1_SIGNING_KEY: makeKey(root) },
  });
  assert.equal(gate.verifySignature(root, gate.oracleMessage(root)).principal, 'gate1-owner');

  // An agent appends its own key, leaving the owner line untouched, then moves
  // the goalpost and re-signs the new oracle with the key it just generated.
  const agentKey = path.join(root, 'agent-key');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', agentKey]).status, 0);
  fs.appendFileSync(allowed, `rig-bot namespaces="rig-gate1" ${fs.readFileSync(`${agentKey}.pub`, 'utf8').trim()}\n`);
  fs.writeFileSync(path.join(root, 'wiki/gate1/acceptance.md'), '# acceptance: goalpost moved by the agent\n');
  const forged = path.join(root, 'forged-message');
  fs.writeFileSync(forged, gate.oracleMessage(root));
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', agentKey, '-n', 'rig-gate1', forged]).status, 0);
  fs.renameSync(`${forged}.sig`, path.join(root, 'wiki/gate1/gate1.sig'));

  assert.throws(
    () => gate.verifySignature(root, gate.oracleMessage(root)),
    /one principal|single principal|exactly one/i,
    'a second signer must invalidate the pin outright, not be tried as an alternative',
  );
});

test('an unexpected non-owner principal line is not silently dropped', () => {
  const root = tempRoot();
  const key = makeKey(root);
  const allowed = path.join(root, 'wiki/gate1/gate1.allowed-signers');
  fs.writeFileSync(
    allowed,
    '# provenance\nintruder namespaces="rig-gate1" ssh-ed25519 AAAAother key\n',
  );

  assert.throws(
    () => approve.approveGate1(root, { check: false, env: { RIG_GATE1_SIGNING_KEY: key } }),
    /unexpected principal|non-owner principal|intruder/i,
    'a foreign principal line should stop the ceremony, not vanish',
  );
});

test('unlock is refused because an armed gate cannot be disarmed', () => {
  assert.throws(
    () => approve.main(['unlock']),
    /no unlock/,
  );
});
