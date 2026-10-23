'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const gate = require('../../../../scripts/check-advanced-spec');

test('probe: current Gate 1 verifier accepts a signer with no namespace restriction', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-gate1-namespace-probe-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const gateDir = path.join(root, 'wiki/gate1');
  fs.mkdirSync(gateDir, { recursive: true });
  fs.writeFileSync(path.join(gateDir, 'business-spec.md'), '# intent\n');
  fs.writeFileSync(path.join(gateDir, 'acceptance.md'), '# acceptance\n');
  fs.writeFileSync(path.join(gateDir, 'testing-infrastructure.manifest'), '');

  const key = path.join(root, 'owner-key');
  const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim();
  fs.writeFileSync(path.join(gateDir, 'gate1.allowed-signers'), `owner ${publicKey}\n`);

  const message = gate.oracleMessage(root);
  const messageFile = path.join(root, 'oracle-message');
  fs.writeFileSync(messageFile, message);
  const signed = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-gate1', messageFile], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  fs.renameSync(`${messageFile}.sig`, path.join(gateDir, 'gate1.sig'));

  assert.equal(gate.verifySignature(root, message).armed, true);
});
