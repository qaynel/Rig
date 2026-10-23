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
  const allowed = path.join(root, 'wiki/gate1/gate1.allowed-signers');
  const originalSigner = fs.readFileSync(allowed, 'utf8');
  fs.writeFileSync(allowed, originalSigner.replace('namespaces="rig-gate1" ', ''));
  assert.throws(() => gate.verifySignature(root, gate.oracleMessage(root)), /namespace/);
  fs.writeFileSync(allowed, originalSigner);
  for (const relative of ['wiki/gate1/business-spec.md', 'wiki/gate1/acceptance.md', 'wiki/gate1/testing-infrastructure.manifest']) {
    const file = path.join(root, relative); const original = fs.readFileSync(file);
    fs.appendFileSync(file, '// TEST mutated frozen bytes\n');
    assert.throws(() => gate.verifySignature(root, gate.oracleMessage(root)), /signature does not verify/, relative);
    fs.writeFileSync(file, original);
  }
  const signatureFile = path.join(root, 'wiki/gate1/gate1.sig');
  const signatureBytes = fs.readFileSync(signatureFile);
  fs.writeFileSync(signatureFile, 'TEST malformed SSHSIG');
  assert.throws(() => gate.verifySignature(root, gate.oracleMessage(root)), /signature does not verify/);
  fs.writeFileSync(signatureFile, signatureBytes);
  const namespaceRoot = tempRoot();
  const sentinelRoot = tempRoot();
  try {
    writeManifest(namespaceRoot, ['tests/oracle.test.js']);
    sign(namespaceRoot, 'TEST-wrong-namespace');
    assert.throws(() => gate.verifySignature(namespaceRoot, gate.oracleMessage(namespaceRoot)), /signature does not verify/);
    const namespaceAllowed = path.join(namespaceRoot, 'wiki/gate1/gate1.allowed-signers');
    const originalAllowed = fs.readFileSync(namespaceAllowed, 'utf8');
    fs.writeFileSync(allowed, originalAllowed);
    assert.throws(() => gate.verifySignature(root, gate.oracleMessage(root)), /signature does not verify/, 'substituting another TEST signer cannot validate the original signature');
    fs.writeFileSync(allowed, originalSigner);
    for (const restriction of ['namespaces="*"', 'namespaces="rig-gate1,other"', 'namespaces="other"']) {
      fs.writeFileSync(namespaceAllowed, originalAllowed.replace('namespaces="rig-gate1"', restriction));
      assert.throws(() => gate.verifySignature(namespaceRoot, gate.oracleMessage(namespaceRoot)), /namespace/);
    }
    // The actual npm entrypoint must stop before its code command. These are
    // disposable TEST keys and scripts, never the repository's signing helper.
    fs.mkdirSync(path.join(sentinelRoot, 'scripts'));
    fs.copyFileSync(path.join(__dirname, '../scripts/check-advanced-spec.js'), path.join(sentinelRoot, 'scripts/check-advanced-spec.js'));
    const scripts = { test: 'node scripts/check-advanced-spec.js && npm run test:code', 'test:code': 'node code-sentinel.js' };
    fs.writeFileSync(path.join(sentinelRoot, 'package.json'), JSON.stringify({ private: true, scripts }));
    fs.writeFileSync(path.join(sentinelRoot, 'code-sentinel.js'), "require('node:fs').writeFileSync('CODE-RAN', 'unexpected')");
    fs.writeFileSync(path.join(sentinelRoot, 'wiki/gate1/package-scripts.json'), JSON.stringify(scripts));
    writeManifest(sentinelRoot, ['tests/oracle.test.js', 'wiki/gate1/package-scripts.json']);
    sign(sentinelRoot);
    const runnable = spawnSync('npm', ['run', 'test:code', '--ignore-scripts'], { cwd: sentinelRoot, encoding: 'utf8' });
    assert.equal(runnable.status, 0, runnable.stderr); assert.equal(fs.readFileSync(path.join(sentinelRoot, 'CODE-RAN'), 'utf8'), 'unexpected');
    fs.unlinkSync(path.join(sentinelRoot, 'CODE-RAN'));
    fs.appendFileSync(path.join(sentinelRoot, 'tests/oracle.test.js'), '// corrupted oracle\n');
    const stopped = spawnSync('npm', ['test', '--ignore-scripts'], { cwd: sentinelRoot, encoding: 'utf8' });
    assert.notEqual(stopped.status, 0); assert.match(stopped.stderr, /changed oracle file/);
    assert.equal(fs.existsSync(path.join(sentinelRoot, 'CODE-RAN')), false, 'invalid frozen bytes prevent test:code');
  } finally {
    fs.rmSync(namespaceRoot, { recursive: true, force: true }); fs.rmSync(sentinelRoot, { recursive: true, force: true });
  }
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
