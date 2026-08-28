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
  fs.writeFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), '\n');
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

test('lock refreshes manifested file digests before signing', () => {
  const root = tempRoot();
  const key = makeKey(root);
  const listed = path.join(root, 'listed.txt');
  fs.writeFileSync(listed, 'v1\n');
  fs.writeFileSync(
    path.join(root, 'wiki/gate1/testing-infrastructure.manifest'),
    `${'0'.repeat(64)}  listed.txt\n`,
  );

  approve.approveGate1(root, {
    check: false,
    env: { RIG_GATE1_SIGNING_KEY: key },
  });

  const manifest = fs.readFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), 'utf8');
  assert.equal(manifest, `${gate.sha256(fs.readFileSync(listed))}  listed.txt\n`);
  assert.equal(gate.verifySignature(root, gate.oracleMessage(root)).principal, 'gate1-owner');
});

test('unlock is refused because an armed gate cannot be disarmed', () => {
  assert.throws(
    () => approve.main(['unlock']),
    /no unlock/,
  );
});
