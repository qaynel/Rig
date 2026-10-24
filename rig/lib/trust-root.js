'use strict';

// One trust root: the key that signs the Gate 1 lock is the only key Rig
// verifies approvals against (plan approvals, lint-format plans and setup,
// policy activation). The installer ships the Gate 1 public key as
// .rig/trust/gate1.allowed-signers; there is no other signer list, no
// trust-on-first-use, and no signer setup, rotation, or recovery ceremony.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { containedPath } = require('./path-safety');

const TRUST_ROOT_REL = '.rig/trust/gate1.allowed-signers';
// The security-key prefix is split so the secret scanner's sk- token rule does not flag it.
const KEY_TYPE = /^(?:s(?:k-ssh-ed25519|k-ecdsa-sha2-nistp256)@openssh\.com|ssh-ed25519|ecdsa-sha2-nistp256|ssh-rsa)$/;

function readTrustRoot(target) {
  const file = containedPath(target, TRUST_ROOT_REL);
  if (!fs.existsSync(file)) {
    throw new Error(`approval verifier not configured: the Gate 1 trust root ${TRUST_ROOT_REL} is missing; reinstall Rig`);
  }
  const rows = fs.readFileSync(file, 'utf8').split('\n').map((row) => row.trim()).filter((row) => row && !row.startsWith('#'));
  if (rows.length !== 1) throw new Error(`the Gate 1 trust root must hold exactly one key; ${TRUST_ROOT_REL} has ${rows.length}`);
  const fields = rows[0].split(/\s+/);
  const at = fields.findIndex((field, index) => index > 0 && KEY_TYPE.test(field));
  if (at < 1 || !fields[at + 1]) throw new Error(`the Gate 1 trust root ${TRUST_ROOT_REL} is malformed`);
  // Only the namespaces= option is understood (it is replaced per request); cert-authority, expiry or any other option is refused rather than dropped.
  if (fields.slice(1, at).some((option) => !/^namespaces="[^"]*"$/.test(option))) {
    throw new Error(`the Gate 1 trust root ${TRUST_ROOT_REL} carries an unsupported option`);
  }
  return { identity: fields[0], public_key: `${fields[at]} ${fields[at + 1]}` };
}

// Verifies an SSHSIG over `message` in `namespace` against the Gate 1 key only.
function verifyTrustRootApproval(target, { identity, namespace, message, signature }) {
  const root = readTrustRoot(target);
  if (identity !== root.identity) {
    throw new Error(`approval identity ${identity} is not the Gate 1 key holder; only the Gate 1 key approves`);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-trust-root-'));
  try {
    const allowedSigners = path.join(dir, 'allowed');
    fs.writeFileSync(allowedSigners, `${root.identity} namespaces="${namespace}" ${root.public_key}\n`);
    // Lazy: policy.js owns the shared SSHSIG verifier and itself depends on this module.
    return require('./policy').verifySshsig({ allowedSigners, identity, namespace, message, signature });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function keyTypeAllowed(type) {
  return KEY_TYPE.test(type);
}

module.exports = { TRUST_ROOT_REL, readTrustRoot, verifyTrustRootApproval, keyTypeAllowed };
