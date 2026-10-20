'use strict';

// Explicit synthetic authenticator boundary: these fixture signatures model
// OpenSSH's sk protocol in memory. They prove cryptographic binding, never a
// hardware touch or an authenticator's physical user-verification ceremony.
// Protocol: https://github.com/openssh/openssh-portable/blob/master/PROTOCOL.u2f
// https://github.com/openssh/openssh-portable/blob/master/PROTOCOL.sshsig
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const api = require('../rig/lib/policy');
const uint = n => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const str = v => { const b = Buffer.from(v); return Buffer.concat([uint(b.length), b]); };
const hash = (type, value) => crypto.createHash(type).update(value).digest();

function fixtureSigner(identity, securityKey = false) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const type = securityKey ? 'sk-ssh-ed25519@openssh.com' : 'ssh-ed25519';
  const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
  const pub = Buffer.concat([str(type), str(raw), ...(securityKey ? [str('ssh:')] : [])]);
  return { identity, public_key: `${type} ${pub.toString('base64')}`, sign(message, namespace) {
    const data = Buffer.concat([Buffer.from('SSHSIG'), str(namespace), str(''), str('sha512'), str(hash('sha512', message))]);
    const flags = Buffer.from([5]), counter = uint(1);
    const input = securityKey ? Buffer.concat([hash('sha256', 'ssh:'), flags, counter, hash('sha256', data)]) : data;
    const signature = Buffer.concat([str(type), str(crypto.sign(null, input, privateKey)), ...(securityKey ? [flags, counter] : [])]);
    const blob = Buffer.concat([Buffer.from('SSHSIG'), uint(1), str(pub), str(namespace), str(''), str('sha512'), str(signature)]);
    return `-----BEGIN SSH SIGNATURE-----\n${blob.toString('base64').match(/.{1,70}/g).join('\n')}\n-----END SSH SIGNATURE-----\n`;
  } };
}
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-policy-trust-test-'));
  const target = path.join(root, 'repo'); fs.mkdirSync(target);
  try { fn({ root, target }); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function approval(challenge, signer, message, namespace = 'rig-policy-activation') {
  return { challenge_digest: challenge.digest, identity: signer.identity, signature: signer.sign(message(challenge), namespace) };
}
function setup(target, signer) {
  const challenge = api.proposeSignerSetup(target, signer);
  return api.setupPolicySigner(target, challenge, approval(challenge, signer, api.signerSetupMessage));
}
function generate(target, root, signer) {
  return api.generateRecoveryCredential(target, { identity: signer.identity, output: path.join(root, signer.identity) }, {
    // Only this generation fixture is injected; signature verification uses
    // the real platform OpenSSH, including namespace and key fingerprints.
    generate: (program, argv) => {
      assert.equal(program, 'ssh-keygen');
      assert.ok(argv.includes('ed25519-sk')); assert.ok(argv.includes('verify-required'));
      assert.ok(!argv.includes('-Y'), 'Rig never signs');
      fs.writeFileSync(`${argv[argv.indexOf('-f') + 1]}.pub`, signer.public_key + '\n');
      return { status: 0 };
    },
  });
}

test('signer setup is signed, offers three initial recovery identities, and rotations require the current signer', () => fixture(({ target }) => {
  const owner = fixtureSigner('owner'), replacement = fixtureSigner('replacement');
  const first = setup(target, owner);
  assert.equal(first.trust.signer.identity, 'owner');
  assert.equal(first.recovery_offer.count, 3);
  assert.match(api.policyStatus(target).signer_declared_class, /^ssh-ed25519$/);
  const next = api.proposeSignerSetup(target, replacement);
  assert.throws(() => api.setupPolicySigner(target, next, approval(next, replacement, api.signerSetupMessage)), /verification|identity/i);
  const rotated = api.setupPolicySigner(target, next, approval(next, owner, api.signerSetupMessage));
  assert.equal(rotated.trust.signer.identity, 'replacement');
  assert.equal(rotated.recovery_offer.add_more, true);
  assert.throws(() => api.setupPolicySigner(target, next, approval(next, owner, api.signerSetupMessage)), /stale|sequence/i);
}));

test('software recovery registration and unavailable user verification are refused without trust mutation', () => fixture(({ target, root }) => {
  const owner = fixtureSigner('owner'); setup(target, owner);
  const trust = path.join(target, '.rig/policy/trust.json'); const before = fs.readFileSync(trust);
  assert.throws(() => api.proposeRecoveryRegistration(target, fixtureSigner('software')), /security.key|sk-|user_verification/i);
  assert.throws(() => api.generateRecoveryCredential(target, { identity: 'recovery', output: path.join(root, 'key') }, {
    generate: () => ({ status: 1, stderr: 'Unsupported option verify-required' }),
  }), /user_verification_unavailable/);
  assert.equal(fs.existsSync(path.join(root, 'key')), false);
  assert.deepEqual(fs.readFileSync(trust), before);
  assert.throws(() => api.generateRecoveryCredential(target, { identity: 'recovery', output: path.join(target, 'private-key') }), /outside/i);
}));

test('recovery registration verifies a signed chain and recovery commits consequences only for a registered distinct sk credential', () => fixture(({ target, root }) => {
  const owner = fixtureSigner('owner'), recovery = fixtureSigner('recovery', true), replacement = fixtureSigner('replacement');
  setup(target, owner);
  const registration = generate(target, root, recovery);
  const signed = approval(registration, owner, api.registrationMessage);
  const wrong = approval(registration, owner, api.registrationMessage, 'rig-policy-recovery');
  assert.throws(() => api.registerRecoveryCredential(target, registration, wrong), /verification/i);
  const result = api.registerRecoveryCredential(target, registration, signed);
  assert.equal(result.trust.recovery.length, 1);
  assert.equal(result.trust.recovery[0].declared_class, 'sk-ssh-ed25519@openssh.com');
  assert.throws(() => api.registerRecoveryCredential(target, registration, signed), /stale|sequence|duplicate/i);
  fs.mkdirSync(path.join(target, '.rig/approvals'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/approvals/old.json'), '{"used":false}\n');
  fs.writeFileSync(path.join(target, '.rig/network-policy.json'), '{"enabled":true}\n');
  const challenge = api.proposeRecovery(target, replacement, recovery.identity);
  const recovered = api.recoverPolicy(target, challenge, approval(challenge, recovery, api.recoveryMessage, 'rig-policy-recovery'));
  assert.equal(recovered.trust.signer.identity, 'replacement');
  assert.equal(recovered.trust.recovery.length, 0);
  assert.equal(recovered.trust.pending_candidate_status, 'stale_after_recovery');
  assert.equal(recovered.trust.evidence_epoch, 1);
  assert.equal(fs.existsSync(path.join(target, '.rig/approvals/old.json')), false);
  assert.equal(fs.readFileSync(path.join(target, '.rig/network-policy.json'), 'utf8'), '{"enabled":true}\n');
  assert.equal(api.policyStatus(target).recovery.sequence, 1);
  assert.throws(() => api.proposeRecovery(target, owner, recovery.identity), /recovery_credentials_exhausted/);
  assert.throws(() => api.recoverPolicy(target, challenge, signed), /stale|exhausted/i);
}));

test('caller-written registration claims cannot add a recovery credential to the verified trust chain', () => fixture(({ target }) => {
  setup(target, fixtureSigner('owner'));
  const trustPath = path.join(target, '.rig/policy/trust.json');
  const trust = JSON.parse(fs.readFileSync(trustPath));
  trust.recovery.push({ identity: 'forged', fingerprint: 'SHA256:forged', declared_class: 'sk-ssh-ed25519@openssh.com', registration_receipt: { signed_before_loss: true } });
  fs.writeFileSync(trustPath, JSON.stringify(trust));
  const before = fs.readFileSync(trustPath);
  assert.throws(() => api.proposeRecovery(target, fixtureSigner('replacement'), 'forged'), /registration|chain|trust/i);
  assert.deepEqual(fs.readFileSync(trustPath), before);
}));

test('first signer setup cannot replace an already configured ordinary signer with a self-approved key', () => fixture(({ target }) => {
  const owner = fixtureSigner('owner'), attacker = fixtureSigner('attacker');
  fs.mkdirSync(path.join(target, '.rig/policy'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/policy/allowed-signers'), `owner namespaces="rig-policy-activation" ${owner.public_key}\n`);
  const challenge = api.proposeSignerSetup(target, attacker);
  const { digest: ignored, ...payload } = challenge;
  payload.initial_authorizer = null;
  const forged = { ...payload, digest: crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex') };
  assert.throws(() => api.setupPolicySigner(target, forged, approval(forged, attacker, api.signerSetupMessage)), /authorizer|configured/i);
  assert.equal(fs.existsSync(path.join(target, '.rig/policy/trust.json')), false);
}));

test('signed signer rotation preserves historical active policy proof and rejects an edited current signer list', () => fixture(({ target }) => {
  const owner = fixtureSigner('owner'), replacement = fixtureSigner('replacement'), attacker = fixtureSigner('attacker');
  setup(target, owner);
  const policy = { enabled: true, controls: {}, enforcement: {} };
  const proposed = api.proposePolicy(target, policy, { explicit_request: true });
  const policyApproval = (challenge, signer) => ({ schema_version: 1, kind: 'policy-approval', proposal_digest: challenge.digest,
    approval: { method: 'external-sshsig', identity: signer.identity, signature: signer.sign(api.activationMessage(challenge), 'rig-policy-activation') } });
  api.activatePolicy(target, proposed, { approval: policyApproval(proposed, owner) });
  const rotation = api.proposeSignerSetup(target, replacement);
  api.setupPolicySigner(target, rotation, approval(rotation, owner, api.signerSetupMessage));
  assert.equal(api.policyStatus(target).active.enabled, true);
  const next = api.proposePolicy(target, policy, { explicit_request: true });
  fs.writeFileSync(path.join(target, '.rig/policy/allowed-signers'), `attacker namespaces="rig-policy-activation" ${attacker.public_key}\n`);
  assert.throws(() => api.activatePolicy(target, next, { approval: policyApproval(next, attacker) }), /identity|verification/i);
}));

test('public policy CLI performs signed setup and discloses the signer and initial recovery offer', () => fixture(({ target, root }) => {
  const owner = fixtureSigner('owner');
  const signerFile = path.join(root, 'signer.json'), challengeFile = path.join(root, 'challenge.json'), approvalFile = path.join(root, 'approval.json');
  fs.writeFileSync(signerFile, JSON.stringify({ identity: owner.identity, public_key: owner.public_key }));
  const cli = (...args) => spawnSync(process.execPath, [path.join(__dirname, '../rig/materialize.js'), 'policy', ...args, '--target', target], { encoding: 'utf8' });
  const proposed = cli('signer-challenge', '--signer', signerFile, '--out', challengeFile);
  assert.equal(proposed.status, 0, proposed.stderr);
  const challenge = JSON.parse(fs.readFileSync(challengeFile));
  fs.writeFileSync(approvalFile, JSON.stringify(approval(challenge, owner, api.signerSetupMessage)));
  const applied = cli('signer-setup', '--challenge', challengeFile, '--approval', approvalFile);
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(JSON.parse(applied.stdout).recovery_offer.count, 3);
  const status = cli('status');
  assert.equal(status.status, 0, status.stderr);
  assert.equal(JSON.parse(status.stdout).signer_declared_class, 'ssh-ed25519');
  assert.equal(fs.readdirSync(path.join(target, '.rig/policy')).some(name => /private|\.pub$|key$/.test(name)), false);
}));
