'use strict';

// North star 13: one trust root. The Gate 1 key is the only key that approves.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');
const { readTrustRoot, verifyTrustRootApproval, TRUST_ROOT_REL } = require('../rig/lib/trust-root');
const policy = require('../rig/lib/policy');

function withDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-trust-root-test-'));
  try { return fn(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function keypair(dir, name) {
  const key = path.join(dir, name);
  const made = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(made.status, 0, made.stderr);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
  const sign = (message, namespace) => {
    const file = path.join(dir, `${name}-message`);
    fs.writeFileSync(file, message);
    fs.rmSync(`${file}.sig`, { force: true });
    const signed = spawnSync('ssh-keygen', ['-q', '-Y', 'sign', '-f', key, '-n', namespace, file], { encoding: 'utf8' });
    assert.equal(signed.status, 0, signed.stderr);
    return fs.readFileSync(`${file}.sig`, 'utf8');
  };
  return { publicKey, sign };
}

function installRoot(target, line) {
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(target, TRUST_ROOT_REL), line);
}

test('the shipped trust root is byte-identical to the Gate 1 allowed signers', () => {
  const gate1 = fs.readFileSync(path.join(root, 'wiki/gate1/gate1.allowed-signers'));
  assert.deepEqual(fs.readFileSync(path.join(root, 'rig/corpus/trust/gate1.allowed-signers')), gate1);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rig/manifest.json'), 'utf8'));
  assert.match(JSON.stringify(manifest), /"from":"rig\/corpus\/trust\/gate1\.allowed-signers","to":"\.rig\/trust\/gate1\.allowed-signers"/);
});

test('only the Gate 1 key verifies: another key, identity, namespace or message is refused', () => withDir((dir) => {
  const owner = keypair(dir, 'owner');
  const stranger = keypair(dir, 'stranger');
  const target = path.join(dir, 'repo');
  installRoot(target, `gate1-owner namespaces="rig-gate1" ${owner.publicKey} gate1-signing-key\n`);
  const message = 'rig-plan-approval\ndigest=abc\n';
  const check = (signature, over = {}) => verifyTrustRootApproval(target, { identity: 'gate1-owner', namespace: 'rig-plan-approval', message, signature, ...over });
  assert.equal(check(owner.sign(message, 'rig-plan-approval')).identity, 'gate1-owner');
  assert.throws(() => check(stranger.sign(message, 'rig-plan-approval')), /SSHSIG verification failed/);
  assert.throws(() => check(owner.sign(message, 'rig-policy-activation')), /SSHSIG verification failed/);
  assert.throws(() => check(owner.sign('other', 'rig-plan-approval')), /SSHSIG verification failed/);
  assert.throws(() => check(owner.sign(message, 'rig-plan-approval'), { identity: 'someone-else' }), /not the Gate 1 key holder/);
}));

test('the trust root must exist and hold exactly one well-formed key', () => withDir((dir) => {
  const a = keypair(dir, 'a');
  const b = keypair(dir, 'b');
  const target = path.join(dir, 'repo');
  fs.mkdirSync(target);
  assert.throws(() => readTrustRoot(target), /trust root .* is missing/);
  installRoot(target, `one ${a.publicKey}\ntwo ${b.publicKey}\n`);
  assert.throws(() => readTrustRoot(target), /exactly one key/);
  installRoot(target, 'one not-a-key\n');
  assert.throws(() => readTrustRoot(target), /malformed/);
  installRoot(target, `# comment\n\none ${a.publicKey}\n`);
  assert.equal(readTrustRoot(target).identity, 'one');
}));

test('independent signer lists and trust-on-first-use are ignored by every approval path', () => withDir((dir) => {
  const owner = keypair(dir, 'owner');
  const attacker = keypair(dir, 'attacker');
  const target = path.join(dir, 'repo');
  installRoot(target, `gate1-owner ${owner.publicKey}\n`);
  // A repository writer plants the retired signer lists and a trust.json for their own key.
  fs.mkdirSync(path.join(target, '.rig/policy'), { recursive: true });
  const planted = `gate1-owner ${attacker.publicKey}\nattacker ${attacker.publicKey}\n`;
  for (const rel of ['.rig/allowed-signers', '.rig/policy/allowed-signers', '.rig/policy/recovery.allowed-signers']) fs.writeFileSync(path.join(target, rel), planted);
  fs.writeFileSync(path.join(target, '.rig/policy/trust.json'), '{"schema_version":1,"chain":[],"signer":null,"recovery":[]}\n');

  // Policy activation: attacker-signed approval is refused, owner-signed approval is accepted.
  const proposal = policy.proposePolicy(target, Buffer.from('{"schema_version":1,"controls":{},"enforcement":{},"allow":[]}\n'), { explicit_request: true });
  const approval = (signer, identity) => ({ schema_version: 1, kind: 'policy-approval', proposal_digest: proposal.digest, approval: { method: 'external-sshsig', identity, signature: signer.sign(policy.activationMessage(proposal), 'rig-policy-activation') } });
  assert.throws(() => policy.activatePolicy(target, proposal, { approval: approval(attacker, 'attacker') }), /Gate 1 key holder/);
  assert.throws(() => policy.activatePolicy(target, proposal, { approval: approval(attacker, 'gate1-owner') }), /SSHSIG verification failed/);
  assert.equal(fs.existsSync(path.join(target, '.rig/policy/active.json')), false, 'a refused approval writes nothing');
  assert.equal(policy.activatePolicy(target, proposal, { approval: approval(owner, 'gate1-owner') }).receipt.signer.identity, 'gate1-owner');
  assert.equal(policy.policyStatus(target).activation_receipt.proposal_digest, proposal.digest);

  // Every approval path calls the shared root verifier; nothing else may name a signer list.
  for (const name of fs.readdirSync(path.join(root, 'rig/lib')).filter((file) => file.endsWith('.js') && !['policy.js', 'trust-root.js'].includes(file))) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, 'rig/lib', name), 'utf8'), /verifySshsig\(/, `${name} must verify through the trust root`);
  }
}));

test('the signer setup, recovery registration, recovery and TOFU mechanisms no longer exist', () => {
  for (const name of ['proposeSignerSetup', 'setupPolicySigner', 'signerSetupMessage', 'proposeRecoveryRegistration', 'generateRecoveryCredential', 'registerRecoveryCredential', 'registrationMessage', 'proposeRecovery', 'recoverPolicy', 'recoveryMessage', 'recoverSigner']) {
    assert.equal(policy[name], undefined, `${name} must not exist`);
  }
  for (const action of ['signer-challenge', 'signer-setup', 'recovery-key', 'recovery-register', 'recovery-challenge', 'recover']) {
    const out = spawnSync(process.execPath, [path.join(root, 'rig/materialize.js'), 'policy', action, '--target', root], { encoding: 'utf8' });
    assert.notEqual(out.status, 0, `policy ${action} must be refused`);
    assert.match(out.stderr, /policy requires status, propose, activate, evaluate, or grant-approval/);
  }
  const libs = fs.readdirSync(path.join(root, 'rig/lib')).filter((name) => name.endsWith('.js'));
  for (const name of libs) {
    const text = fs.readFileSync(path.join(root, 'rig/lib', name), 'utf8');
    assert.doesNotMatch(text, /trust\.json|recovery\.allowed-signers|signer_setup|signer_recovery|\.rig\/allowed-signers|policy\/allowed-signers/, `${name} references a retired signer mechanism`);
  }
  assert.equal(fs.existsSync(path.join(root, 'rig/corpus/allowed-signers.example.md')), false);
});

test('a trust root row with options other than namespaces= is refused, not silently rewritten', () => withDir((dir) => {
  const owner = keypair(dir, 'owner');
  for (const option of ['cert-authority', 'valid-before="20200101"', 'principals="x"']) {
    const target = path.join(dir, `repo-${option.split('=')[0]}`);
    installRoot(target, `gate1-owner ${option} ${owner.publicKey}\n`);
    assert.throws(() => readTrustRoot(target), /unsupported option/, option);
  }
}));
