'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const gate = require('../scripts/check-advanced-spec');

function tempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-oracle-'));
  fs.mkdirSync(path.join(root, 'wiki/gate1'), { recursive: true });
  fs.mkdirSync(path.join(root, 'wiki/gate2'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(root, 'wiki/gate1/business-spec.md'), '# intent\n');
  fs.writeFileSync(path.join(root, 'wiki/gate1/acceptance.md'), '# acceptance\n');
  fs.writeFileSync(path.join(root, 'wiki/gate2/technical-spec.md'), '# Tier 2 Advanced - Working Implementation Design v9.9\n');
  fs.writeFileSync(path.join(root, 'tests/oracle.test.js'), 'test(\'AT-X1 example\', () => {});\n');
  return root;
}

function writeManifest(root, files) {
  const lines = [...files].sort().map((file) => {
    const bytes = fs.readFileSync(path.join(root, file));
    return `${crypto.createHash('sha256').update(bytes).digest('hex')}  ${file}`;
  });
  fs.writeFileSync(path.join(root, 'wiki/gate1/testing-infrastructure.manifest'), `${lines.join('\n')}\n`);
}

function sign(root, namespace = 'rig-gate1') {
  const key = path.join(root, 'owner-key');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim();
  fs.writeFileSync(
    path.join(root, 'wiki/gate1/gate1.allowed-signers'),
    `owner namespaces=\"rig-gate1\" ${publicKey}\n`,
  );
  const messageFile = path.join(root, 'oracle-message');
  fs.writeFileSync(messageFile, gate.oracleMessage(root));
  const signed = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', namespace, messageFile], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  fs.renameSync(`${messageFile}.sig`, path.join(root, 'wiki/gate1/gate1.sig'));
}

test('AT-GATE-1 one current technical approach', () => {
  const root = tempRoot();
  writeManifest(root, ['tests/oracle.test.js']);
  gate.verifyTechnicalApproach(root);
  const before = gate.oracleMessage(root);
  fs.appendFileSync(path.join(root, 'wiki/gate2/technical-spec.md'), '\nworking detail\n');
  assert.equal(gate.oracleMessage(root), before, 'the technical approach must not be part of the signed oracle');
  fs.rmSync(path.join(root, 'wiki/gate2/technical-spec.md'));
  assert.throws(() => gate.verifyTechnicalApproach(root), /missing/);
});

test('AT-GATE-2 signed oracle runs before code', () => {
  const root = tempRoot();
  writeManifest(root, ['tests/oracle.test.js']);
  assert.deepEqual(gate.verifySignature(root, gate.oracleMessage(root)), { armed: false });
  sign(root);
  const verified = gate.verifySignature(root, gate.oracleMessage(root));
  assert.equal(verified.principal, 'owner');
  assert.match(verified.fingerprint, /^SHA256:/);
  gate.verifyManifest(root);
  fs.appendFileSync(path.join(root, 'tests/oracle.test.js'), '// changed\n');
  assert.throws(() => gate.verifyManifest(root), /changed oracle file/);
  fs.rmSync(path.join(root, 'wiki/gate1/gate1.sig'));
  assert.throws(() => gate.verifySignature(root, gate.oracleMessage(root)), /missing gate1.sig/);
});

test('AT-GATE-3 review is fresh report-only release evidence', () => {
  const { validateReviewReceipt } = require('../rig/lib/release-evidence');
  const receipt = {
    kind: 'report-only',
    author_context: 'implementation-1',
    reviewer_context: 'review-1',
    technical_spec_digest: 'a'.repeat(64),
    catalogue_digest: 'b'.repeat(64),
    verdicts: ['AT-GATE-1'],
    unresolved: [],
  };
  assert.equal(validateReviewReceipt(receipt, {
    technical_spec_digest: 'a'.repeat(64),
    catalogue_digest: 'b'.repeat(64),
    acceptance_ids: ['AT-GATE-1'],
  }), true);
  assert.throws(() => validateReviewReceipt({ ...receipt, reviewer_context: 'implementation-1' }, {}), /fresh/);
});

test('AT-GATE-4 workflow separation is not staffing', () => {
  const { validateWorkflowReceipt } = require('../rig/lib/release-evidence');
  assert.equal(validateWorkflowReceipt({ maintainer: 'one', implementation_context: 'i-1', review_context: 'r-1' }), true);
  assert.throws(
    () => validateWorkflowReceipt({ maintainer: 'one', implementation_context: 'same', review_context: 'same' }),
    /distinct/,
  );
});
