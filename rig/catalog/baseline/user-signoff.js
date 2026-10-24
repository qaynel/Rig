'use strict';

// Configurable user sign-off. The repository's agent interviews the owner and
// records an explicit mode. Nothing here selects a mode by itself, and a
// missing key never falls through to a weaker one.
//
// A typed name is not a signature. Caller-supplied flags cannot satisfy a mode
// that promises an independent owner. Acknowledgement is a declaration: an
// agent that can write files can forge it. Platform prompts are not treated as
// human presence, because cached credentials and an existing session can
// satisfy them. One Gate 1 trust root verifies signatures; this module does
// not enrol a second key.
//
// rig: a raw rewrite of the policy file can point a new unsigned candidate at
// acknowledgement. It cannot mint cryptographic_signature. Sealing the file
// against that rewrite would mean failing closed unless the owner key has
// signed the policy body; that seal is the change() signature, not a second
// trust root.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath } = require('../../lib/path-safety');
const { readTrustRoot, verifyTrustRootApproval, keyTypeAllowed } = require('../../lib/trust-root');

const POLICY_REL = '.rig/trust/signoff-policy.json';
const STORE_REL = '.rig/signoff';
const MODES = {
  cryptographic: {
    id: 'cryptographic',
    label: 'Strong cryptographic sign-off',
    guarantees: {
      interactive_approval: 'not-claimed',
      signer_identity: 'verified-when-the-signature-checks',
      human_presence: 'only-a-security-key-signature-proves-a-person',
      artifact_integrity: 'verified-when-the-signature-checks',
    },
    ceiling: 'A verified signature proves the enrolled key signed this action. Human presence is proven only for a security-key signature. A platform prompt on an ordinary key algorithm is designated, not proven by the signature.',
  },
  platform: {
    id: 'platform',
    label: 'Platform-mediated owner authorisation',
    guarantees: {
      interactive_approval: 'not-shown',
      signer_identity: 'not-claimed',
      human_presence: 'not-guaranteed',
      artifact_integrity: 'not-claimed',
    },
    ceiling: 'No verified platform authorisation adapter is installed. This mode cannot approve actions until one is provided and tested.',
  },
  acknowledgement: {
    id: 'acknowledgement',
    label: 'Simple owner acknowledgement',
    guarantees: {
      interactive_approval: 'not-claimed',
      signer_identity: 'not-claimed',
      human_presence: 'not-claimed',
      artifact_integrity: 'not-claimed',
    },
    ceiling: 'An agent that can write files can forge this acknowledgement. It is a declaration, not proof of an independent human act.',
  },
};

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function requireRepo(repo) {
  if (typeof repo !== 'string' || !fs.existsSync(repo) || !fs.statSync(repo).isDirectory()) {
    throw new Error('sign-off repository must be an existing directory');
  }
  return repo;
}

function writeJson(repo, rel, value) {
  const file = containedPath(repo, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return rel;
}

function readJson(repo, rel) {
  const file = containedPath(repo, rel);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    throw new Error(`sign-off record is not valid JSON: ${rel}`);
  }
}

function current(repo) {
  requireRepo(repo);
  const parsed = readJson(repo, POLICY_REL);
  if (!parsed) return null;
  if (!MODES[parsed.mode]) throw new Error('sign-off policy has no known mode');
  if (parsed.release_integrity !== 'signature' && parsed.release_integrity !== 'self-attestation') {
    throw new Error('sign-off policy has no release integrity choice');
  }
  return parsed;
}

function normalise({ mode, release_integrity, key_protection }) {
  const spec = MODES[mode];
  if (!spec) throw new Error('sign-off mode must be an explicit choice: cryptographic, platform, or acknowledgement');
  let integrity = release_integrity;
  if (mode === 'cryptographic') {
    if (integrity && integrity !== 'signature') throw new Error('cryptographic sign-off always requires a real signature for release integrity');
    integrity = 'signature';
  } else if (integrity !== 'signature' && integrity !== 'self-attestation') {
    throw new Error('release integrity must be chosen explicitly: signature or self-attestation');
  }
  const protection = key_protection || 'unspecified';
  if (!['unspecified', 'platform-prompt', 'security-key'].includes(protection)) throw new Error('unknown key protection');
  if (mode !== 'cryptographic' && protection !== 'unspecified') throw new Error('key protection applies only to cryptographic sign-off');
  return {
    version: 1,
    mode,
    label: spec.label,
    release_integrity: integrity,
    key_protection: protection,
    ceiling: spec.ceiling,
    guarantees: spec.guarantees,
  };
}

function audit(repo, row) {
  const file = containedPath(repo, `${STORE_REL}/audit.jsonl`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify({ ...row, at: new Date().toISOString() })}\n`);
}

function select(repo, choice = {}) {
  requireRepo(repo);
  if (choice.confirm !== true) throw new Error('sign-off selection requires explicit confirmation');
  if (current(repo)) throw new Error('a sign-off mode is already selected; change it under that mode');
  const policy = { ...normalise(choice), selected_at: new Date().toISOString() };
  writeJson(repo, POLICY_REL, policy);
  audit(repo, { event: 'select', mode: policy.mode, release_integrity: policy.release_integrity });
  return policy;
}

function approvalMessage(repo, action) {
  requireRepo(repo);
  if (!action || typeof action !== 'object' || Array.isArray(action)) throw new Error('sign-off action must be an object');
  return `${JSON.stringify({ purpose: 'rig-signoff-v1', repo: fs.realpathSync(repo), action: canonical(action) })}\n`;
}

function presenceFor(publicKey, keyProtection) {
  const type = String(publicKey || '').split(' ')[0];
  if (!keyTypeAllowed(type)) return 'not-guaranteed';
  if (type.startsWith('sk-')) return 'verified';
  if (keyProtection === 'platform-prompt') return 'designated-not-proven';
  return 'not-guaranteed';
}

function signatureAssurance(repo, keyProtection) {
  const root = readTrustRoot(repo);
  return {
    mode: 'cryptographic',
    cryptographic_signature: true,
    signer_identity: 'verified',
    human_presence: presenceFor(root.public_key, keyProtection),
    artifact_integrity: 'signed',
    interactive_approval: 'not-claimed',
    ceiling: MODES.cryptographic.ceiling,
  };
}

function unsignedAssurance(mode) {
  const spec = MODES[mode] || {
    ceiling: 'No sign-off mode is configured. A typed name is not a signature and is not owner authorisation.',
  };
  return {
    mode: mode || 'unconfigured',
    cryptographic_signature: false,
    signer_identity: 'unverified',
    human_presence: 'not-claimed',
    artifact_integrity: 'unsigned',
    interactive_approval: 'not-claimed',
    ceiling: spec.ceiling,
  };
}

function verifyPolicySignature(repo, action, authorization) {
  if (!authorization || typeof authorization.signature !== 'string') {
    return { ok: false, reason: 'a typed name is not a cryptographic signature' };
  }
  let message;
  try { message = approvalMessage(repo, action); } catch {
    return { ok: false, reason: 'sign-off action is not signable' };
  }
  try {
    verifyTrustRootApproval(repo, {
      identity: authorization.identity,
      namespace: 'rig-signoff',
      message,
      signature: authorization.signature,
    });
  } catch (error) {
    if (/missing|not configured/i.test(error.message)) {
      return { ok: false, reason: 'cryptographic sign-off cannot be verified because the trust root is missing; the mode was not downgraded' };
    }
    return { ok: false, reason: 'owner authorization did not verify against the single trust root' };
  }
  return { ok: true };
}

function acknowledgementRel(id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{32}$/.test(id)) return null;
  return `${STORE_REL}/acknowledgements/${id}.json`;
}

function acknowledge(repo, { action } = {}) {
  const policy = current(repo);
  if (!policy || policy.mode !== 'acknowledgement') throw new Error('acknowledgement requires acknowledgement mode to be the selected sign-off');
  const id = crypto.randomBytes(16).toString('hex');
  const record = {
    id,
    kind: 'self-attestation',
    action: canonical(action),
    ceiling: MODES.acknowledgement.ceiling,
    human_presence: 'not-claimed',
    cryptographic_signature: false,
  };
  writeJson(repo, acknowledgementRel(id), record);
  return record;
}

function approveAcknowledgement(repo, action, authorization) {
  const rel = acknowledgementRel(authorization && authorization.acknowledgement);
  const record = rel ? readJson(repo, rel) : null;
  if (!record || record.kind !== 'self-attestation' || record.ceiling !== MODES.acknowledgement.ceiling) {
    return { ok: false, reason: 'acknowledgement is missing or is not the declared self-attestation' };
  }
  if (record.action !== canonical(action) || record.cryptographic_signature !== false) {
    return { ok: false, reason: 'acknowledgement does not match this action' };
  }
  return { ok: true, assurance: unsignedAssurance('acknowledgement') };
}

function authorizePlatform(repo, { action } = {}) {
  const policy = current(repo);
  if (!policy || policy.mode !== 'platform') throw new Error('platform authorisation requires platform mode to be the selected sign-off');
  // rig: no platform adapter is verified yet; retain the selectable mode but refuse approval.
  throw new Error('platform authorisation is unavailable until a verified adapter is installed');
}

function approvePlatform(repo, action, authorization) {
  return { ok: false, reason: 'platform authorisation is unavailable until a verified adapter is installed' };
}

function approve(repo, { action, authorization } = {}) {
  const policy = current(repo);
  if (!policy) return { ok: false, reason: 'sign-off mode is not configured' };
  if (policy.mode === 'cryptographic') {
    const verified = verifyPolicySignature(repo, action, authorization);
    if (!verified.ok) return verified;
    return { ok: true, assurance: { ...signatureAssurance(repo, policy.key_protection), approval_mode: 'cryptographic' } };
  }
  if (policy.mode === 'acknowledgement') return approveAcknowledgement(repo, action, authorization);
  if (policy.mode === 'platform') return approvePlatform(repo, action, authorization);
  return { ok: false, reason: 'sign-off mode is not configured' };
}

function verifyReleaseSignature(repo, commit, authorization) {
  if (!authorization || typeof authorization.signature !== 'string') {
    return { ok: false, reason: 'a typed name is not a cryptographic signature' };
  }
  let message;
  try {
    message = require('./release-evidence').authorizationMessage(repo, { ...authorization, commit });
  } catch {
    return { ok: false, reason: 'release signature is incomplete or did not verify' };
  }
  try {
    verifyTrustRootApproval(repo, {
      identity: authorization.identity,
      namespace: 'rig-release',
      message,
      signature: authorization.signature,
    });
  } catch (error) {
    if (/missing|not configured/i.test(error.message)) {
      return { ok: false, reason: 'cryptographic sign-off cannot be verified because the trust root is missing; the mode was not downgraded' };
    }
    return { ok: false, reason: 'owner authorization did not verify against the single trust root' };
  }
  return { ok: true };
}

function releaseAction(commit) {
  return { purpose: 'rig-release-publish', commit };
}

function authorizeRelease(repo, { commit, authorization } = {}) {
  const policy = current(repo);
  if (!policy) return { ok: false, reason: 'sign-off mode is not configured' };
  if (policy.release_integrity === 'signature') {
    const verified = verifyReleaseSignature(repo, commit, authorization);
    if (!verified.ok) return verified;
    if (policy.mode !== 'cryptographic') {
      const approval = approve(repo, { action: releaseAction(commit), authorization });
      if (!approval.ok) return approval;
    }
    return {
      ok: true,
      requires_public_readiness: true,
      assurance: { ...signatureAssurance(repo, policy.key_protection), approval_mode: policy.mode },
    };
  }
  const approval = approve(repo, { action: releaseAction(commit), authorization });
  if (!approval.ok) return approval;
  return { ok: true, requires_public_readiness: false, assurance: { ...approval.assurance, approval_mode: policy.mode } };
}

function change(repo, choice = {}) {
  const policy = current(repo);
  if (!policy) throw new Error('no sign-off policy to change; select one explicitly');
  const next = normalise(choice);
  if (next.mode === policy.mode && next.release_integrity === policy.release_integrity && next.key_protection === policy.key_protection) {
    return policy;
  }
  const action = {
    purpose: 'rig-signoff-change',
    from: policy.mode,
    to: next.mode,
    release_integrity: next.release_integrity,
    key_protection: next.key_protection,
  };
  const gate = approve(repo, { action, authorization: choice.authorization });
  if (!gate.ok) throw new Error(`sign-off change refused under the current ${policy.mode} policy: ${gate.reason}`);
  const saved = { ...next, selected_at: policy.selected_at, changed_at: new Date().toISOString() };
  writeJson(repo, POLICY_REL, saved);
  audit(repo, { event: 'change', from: policy.mode, to: next.mode, release_integrity: next.release_integrity });
  return saved;
}

function assessPlatform() {
  const mechanisms = [{
    id: 'sudo-or-password-prompt',
    available: process.platform !== 'win32',
    agent_resistant: false,
    human_presence: 'not-guaranteed',
    why: 'An agent may have cached credentials, an authorised session, or the ability to invoke a privileged command. A successful sudo or password prompt is not human presence.',
  }];
  if (process.platform === 'darwin') {
    mechanisms.push({
      id: 'macos-secure-enclave-signature',
      available: 'use-cryptographic-mode',
      agent_resistant: true,
      human_presence: 'only-when-the-enrolled-key-requires-a-person',
      why: 'Touch ID or Secure Enclave protection belongs to cryptographic mode and the enrolled key. This probe does not treat a dialog or sudo as that proof.',
    });
  } else if (process.platform === 'linux') {
    mechanisms.push({
      id: 'polkit-or-pam',
      available: 'not-proven-by-this-process',
      agent_resistant: false,
      human_presence: 'not-guaranteed',
      why: 'A PAM or polkit success can be a cached authorisation. This probe does not show that an agent cannot complete it.',
    });
  } else if (process.platform === 'win32') {
    mechanisms.push({
      id: 'windows-elevation-prompt',
      available: 'not-proven-by-this-process',
      agent_resistant: false,
      human_presence: 'not-guaranteed',
      why: 'An elevation prompt is not human presence unless a separate check shows the agent cannot complete it. This probe does not show that.',
    });
  }
  return { platform: process.platform, mechanisms, offers_human_presence: false };
}

function interview(repo) {
  const policy = current(repo);
  return {
    configured: Boolean(policy),
    required: !policy,
    policy,
    platform: assessPlatform(),
    modes: Object.values(MODES).map(({ id, label, ceiling, guarantees }) => ({ id, label, ceiling, guarantees })),
  };
}

module.exports = {
  MODES,
  POLICY_REL,
  current,
  select,
  change,
  acknowledge,
  authorizePlatform,
  approve,
  authorizeRelease,
  releaseAction,
  approvalMessage,
  assessPlatform,
  interview,
  unsignedAssurance,
  signatureAssurance,
};
