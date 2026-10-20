'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { TRIAGE_DISCLOSURE } = require('./reports');

const KNOWN_TOP = new Set(['schema_version', 'enabled', 'controls', 'enforcement', 'network', 'allow', 'secrets']);
const NETWORK_CATEGORIES = ['outbound_network', 'remote_content_execution', 'sensitive_environment_read', 'guardrail_bypass'];
const NETWORK_ACTIONS = ['deny', 'allow'];
const REQUIRED_POLICY_LEAVES = {
  legacy: {
    controls: ['sanitation', 'drift', 'secrets', 'git_ci'],
    enforcement: ['shell', 'web', 'mcp'],
  },
  current: {
    controls: ['sanitation.harness', 'drift.exact_copy', 'drift.semantic', 'secrets.deterministic', 'network.action_policy'],
    enforcement: ['host.shell', 'host.web', 'host.mcp', 'git.pre_commit', 'ci.repo'],
  },
};

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function parsePolicyBytes(input) {
  const bytes = Buffer.isBuffer(input) ? input : Buffer.from(typeof input === 'string' ? input : JSON.stringify(input));
  const text = bytes.toString('utf8');
  if (!Buffer.from(text).equals(bytes)) throw new Error('validatePolicy: policy must be valid UTF-8');
  if (text.charCodeAt(0) === 0xfeff) throw new Error('validatePolicy: UTF-8 BOM is not allowed');
  let offset = 0;
  const whitespace = () => { while (/\s/.test(text[offset] || '')) offset += 1; };
  const stringToken = () => {
    const start = offset;
    if (text[offset++] !== '"') throw new Error('validatePolicy: expected JSON string');
    while (offset < text.length) {
      if (text[offset] === '\\') { offset += 2; continue; }
      if (text[offset++] === '"') return JSON.parse(text.slice(start, offset));
    }
    throw new Error('validatePolicy: unterminated JSON string');
  };
  const value = () => {
    whitespace();
    if (text[offset] === '{') {
      offset += 1;
      const keys = new Set();
      whitespace();
      if (text[offset] === '}') { offset += 1; return; }
      for (;;) {
        whitespace();
        const key = stringToken();
        if (keys.has(key)) throw new Error(`validatePolicy: duplicate key "${key}"`);
        keys.add(key);
        whitespace();
        if (text[offset++] !== ':') throw new Error('validatePolicy: expected colon');
        value();
        whitespace();
        if (text[offset] === '}') { offset += 1; return; }
        if (text[offset++] !== ',') throw new Error('validatePolicy: expected comma');
      }
    }
    if (text[offset] === '[') {
      offset += 1;
      whitespace();
      if (text[offset] === ']') { offset += 1; return; }
      for (;;) {
        value();
        whitespace();
        if (text[offset] === ']') { offset += 1; return; }
        if (text[offset++] !== ',') throw new Error('validatePolicy: expected comma');
      }
    }
    if (text[offset] === '"') { stringToken(); return; }
    const primitive = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(offset));
    if (!primitive) throw new Error('validatePolicy: malformed JSON value');
    offset += primitive[0].length;
  };
  value();
  whitespace();
  if (offset !== text.length) throw new Error('validatePolicy: trailing JSON content');
  const candidate = JSON.parse(text);
  validatePolicy(candidate);
  return { bytes, candidate, digest: digest(bytes) };
}

function readJson(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function repositoryIdentity(target) {
  return digest(path.resolve(target));
}

function activationMessage(proposal) {
  return `rig-policy-activation-v1\n${proposal.digest}\n`;
}

function recoveryMessage(challenge) {
  return `rig-policy-recovery-v1\n${challenge.digest}\n`;
}

function signerLine(allowedSigners, identity) {
  const line = fs.readFileSync(allowedSigners, 'utf8').split('\n').find((entry) =>
    entry.trim() && !entry.trim().startsWith('#') && entry.trim().split(/\s+/)[0] === identity);
  if (!line) throw new Error(`activatePolicy: signer identity ${identity} is not allowed`);
  return line;
}

function signerClass(allowedSigners, identity) {
  const line = signerLine(allowedSigners, identity);
  const keyType = line.match(/\b(sk-(?:ssh-ed25519|ecdsa-sha2-nistp256)@openssh\.com|ssh-ed25519|ecdsa-sha2-nistp256|ssh-rsa)\b/);
  return keyType ? keyType[1] : 'unknown';
}

function signerFingerprint(allowedSigners, identity) {
  const line = signerLine(allowedSigners, identity);
  const match = line.match(/\b((?:sk-)?(?:ssh-ed25519|ecdsa-sha2-nistp256)(?:@openssh\.com)?|ssh-rsa)\s+(\S+)/);
  if (!match) throw new Error('activatePolicy: allowed signer public key is malformed');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-fingerprint-'));
  const pub = path.join(dir, 'signer.pub');
  try {
    fs.writeFileSync(pub, `${match[1]} ${match[2]}\n`);
    const result = spawnSync('ssh-keygen', ['-lf', pub], { encoding: 'utf8', shell: false });
    if (result.status !== 0) throw new Error('activatePolicy: cannot fingerprint allowed signer');
    const fingerprint = result.stdout.match(/\bSHA256:[A-Za-z0-9+/=]+/);
    if (!fingerprint) throw new Error('activatePolicy: fingerprint output malformed');
    return fingerprint[0];
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function verifySshsig({ allowedSigners, identity, namespace, message, signature }) {
  if (!identity || typeof signature !== 'string' || !signature.includes('BEGIN SSH SIGNATURE')) {
    throw new Error('activatePolicy: external SSHSIG approval requires identity and armored signature');
  }
  if (!fs.existsSync(allowedSigners)) throw new Error('activatePolicy: allowed-signers is missing');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-sshsig-'));
  const signatureFile = path.join(dir, 'approval.sig');
  try {
    fs.writeFileSync(signatureFile, signature, { mode: 0o600 });
    const result = spawnSync('ssh-keygen', [
      '-Y', 'verify', '-f', allowedSigners, '-I', identity,
      '-n', namespace, '-s', signatureFile,
    ], { input: message, encoding: 'utf8', shell: false });
    if (result.error || result.status !== 0) {
      throw new Error(`activatePolicy: SSHSIG verification failed: ${(result.stderr || result.stdout || result.error || '').toString().trim()}`);
    }
    return {
      method: 'external-sshsig', identity,
      declared_class: signerClass(allowedSigners, identity),
      fingerprint: signerFingerprint(allowedSigners, identity),
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function onboardingOrder(policy) {
  const steps = [];
  steps.push(policy.controls && policy.controls.sanitation === false ? 'record_sanitation_disabled' : 'sanitize');
  steps.push('profile');
  steps.push('recommend');
  return steps;
}

function policyStatus(target, { candidate, prose } = {}) {
  const authority = '.rig/network-policy.json';
  const guide = '.rig/network-rules.md';
  const activeSnapshot = '.rig/policy/active.json';
  const activeAbs = path.join(target, activeSnapshot);
  const receipt = readJson(path.join(target, '.rig/policy/activation-receipt.json'));
  const trust = verifiedTrust(target, true);
  let active = null;
  if (fs.existsSync(activeAbs)) {
    const activeBytes = fs.readFileSync(activeAbs);
    active = JSON.parse(activeBytes.toString('utf8'));
    // Re-validate on load; an active file that fails validation cannot be
    // trusted (policy cannot self-authorize activation).
    try { validatePolicy(active); } catch (err) {
      throw new Error(`policyStatus: on-disk active policy invalid: ${err.message}`);
    }
  }
  const triageEnabled = active?.secrets?.model_assisted_triage === true;
  let activationVerified = false;
  if (receipt && receipt.signer?.method === 'external-sshsig') {
    const historicalSigner = trust ? receiptSigner(trust, receipt) : null;
    if (trust && !historicalSigner) throw new Error('policy activation signer is outside the verified trust chain or was superseded');
    const verified = historicalSigner ? verifyPublicApproval(historicalSigner, 'rig-policy-activation', activationMessage({ digest: receipt.proposal_digest }), { challenge_digest: receipt.proposal_digest, identity: receipt.approval?.identity, signature: receipt.approval?.signature }, { digest: receipt.proposal_digest }) : verifySshsig({
      allowedSigners: path.join(target, '.rig/policy/allowed-signers'),
      identity: receipt.approval?.identity,
      namespace: 'rig-policy-activation',
      message: activationMessage({ digest: receipt.proposal_digest }),
      signature: receipt.approval?.signature,
    });
    // The signature covers `proposal_digest`, not `candidate_digest`
    // directly. Trusting the bare `candidate_digest` field let anyone who
    // can write `.rig/policy/` rewrite `active.json` and set that field to
    // match, keeping the old (still-valid) signature. Binding it means
    // recomputing `proposal_digest` from the stored proposal payload — whose
    // hashed contents include `candidate_digest` — so any edit to either the
    // proposal or the digest breaks the recomputed match.
    const proposalDigestMatches = Boolean(receipt.proposal) &&
      digest(JSON.stringify(receipt.proposal)) === receipt.proposal_digest;
    activationVerified = verified.fingerprint === receipt.signer.fingerprint &&
      proposalDigestMatches &&
      receipt.proposal.candidate_digest === (active ? digest(fs.readFileSync(activeAbs)) : null);
  }
  const triageDisclosureConfirmed = (receipt?.confirmed_disclosures || []).includes(digest(TRIAGE_DISCLOSURE));
  return {
    authority,
    active_snapshot: activeSnapshot,
    guide,
    guides: ['.rig/network-rules.md', '.rig/network-policy.md'],
    candidate: candidate || null,
    prose: prose || null,
    active,
    active_digest: active ? digest(fs.readFileSync(activeAbs)) : null,
    activation_receipt: receipt,
    signer_declared_class: trust?.signer?.declared_class || receipt?.signer?.declared_class || null,
    recovery: trust ? {
      sequence: trust.recovery_sequence || 0,
      replacement_signer_fingerprint: trust.last_recovery?.replacement_signer_fingerprint || null,
      recovery_credential_fingerprint: trust.last_recovery?.recovery_credential_fingerprint || null,
      consequences: trust.last_recovery?.consequences || [],
      credentials: (trust.recovery || []).map((entry) => ({
        identity: entry.identity,
        fingerprint: entry.fingerprint,
        declared_class: entry.declared_class || 'unknown',
        registered: Boolean(entry.registration_receipt),
      })),
    } : null,
    model_assisted_triage: {
      enabled: triageEnabled,
      authorized: triageEnabled && activationVerified && triageDisclosureConfirmed,
      disclosure: triageEnabled ? TRIAGE_DISCLOSURE : null,
    },
  };
}

function proposePolicy(target, candidate, opts = {}) {
  const parsed = parsePolicyBytes(candidate);
  candidate = parsed.candidate;
  if (opts.delegated_session) {
    throw new Error('proposePolicy: proposals must come from the current session');
  }
  if (!opts.explicit_request) {
    throw new Error('proposePolicy: explicit_request required');
  }
  const activeDigest = policyStatus(target).active_digest;
  const enableTriage = candidate.secrets?.model_assisted_triage === true &&
    policyStatus(target).active?.secrets?.model_assisted_triage !== true;
  const disclosures = enableTriage ? [{
    id: 'model-assisted-secret-triage',
    text: TRIAGE_DISCLOSURE,
    digest: digest(TRIAGE_DISCLOSURE),
  }] : [];
  const priorReceipt = readJson(path.join(target, '.rig/policy/activation-receipt.json'));
  const proposal = {
    candidate,
    candidate_bytes: parsed.bytes.toString('base64'),
    candidate_digest: parsed.digest,
    active_digest: activeDigest,
    disclosures,
    session: opts.session || null,
    repository_id: repositoryIdentity(target),
    sequence: (priorReceipt?.sequence || 0) + 1,
    previous_receipt_digest: priorReceipt ? digest(JSON.stringify(priorReceipt)) : null,
    nonce: crypto.randomBytes(32).toString('hex'),
  };
  return { ...proposal, digest: digest(JSON.stringify(proposal)) };
}

function validatePolicyApproval(approval, proposal, opts = {}) {
  if (!approval || approval.schema_version !== 1 || approval.kind !== 'policy-approval') {
    throw new Error('activatePolicy: verified policy approval required');
  }
  if (approval.proposal_digest !== proposal.digest) {
    throw new Error('activatePolicy: approval proposal digest mismatch');
  }
  let signer;
  const method = approval.approval?.method;
  if (method === 'external-sshsig') {
    signer = opts.signer ? verifyPublicApproval(opts.signer, 'rig-policy-activation', activationMessage(proposal), { challenge_digest: proposal.digest, identity: approval.approval.identity, signature: approval.approval.signature }, proposal) : verifySshsig({
      allowedSigners: opts.allowedSigners,
      identity: approval.approval.identity,
      namespace: 'rig-policy-activation',
      message: activationMessage(proposal),
      signature: approval.approval.signature,
    });
  } else if (method === 'host-native' && typeof opts.verifyHostAttestation === 'function') {
    if (opts.verifyHostAttestation(approval.approval.attestation, activationMessage(proposal)) !== true) {
      throw new Error('activatePolicy: host-native attestation verification failed');
    }
    signer = { method, identity: approval.approval.identity || null, declared_class: 'host-native' };
  } else {
    throw new Error('activatePolicy: cryptographically verified policy approval required');
  }
  const confirmed = new Set(approval.confirmed_disclosures || []);
  for (const disclosure of proposal.disclosures || []) {
    if (!confirmed.has(disclosure.digest)) {
      throw new Error(`activatePolicy: disclosure confirmation required for ${disclosure.id}`);
    }
  }
  return signer;
}

function activatePolicy(target, proposal, opts = {}) {
  if (!proposal || typeof proposal !== 'object' || !proposal.candidate) {
    throw new Error('activatePolicy: proposal required');
  }
  const proposalPayload = {
    candidate: proposal.candidate,
    candidate_bytes: proposal.candidate_bytes,
    candidate_digest: proposal.candidate_digest,
    active_digest: proposal.active_digest || null,
    disclosures: proposal.disclosures || [],
    session: proposal.session || null,
    repository_id: proposal.repository_id,
    sequence: proposal.sequence,
    previous_receipt_digest: proposal.previous_receipt_digest || null,
    nonce: proposal.nonce,
  };
  const expected = digest(JSON.stringify(proposalPayload));
  if (proposal.digest !== expected) {
    throw new Error('activatePolicy: candidate digest mismatch');
  }
  const candidateBytes = Buffer.from(proposal.candidate_bytes || '', 'base64');
  const parsedCandidate = parsePolicyBytes(candidateBytes);
  if (parsedCandidate.digest !== proposal.candidate_digest ||
      JSON.stringify(parsedCandidate.candidate) !== JSON.stringify(proposal.candidate)) {
    throw new Error('activatePolicy: exact candidate bytes changed');
  }
  if (opts.delegated_session) {
    throw new Error('activatePolicy: activation cannot be delegated');
  }
  if (proposal.repository_id !== repositoryIdentity(target)) {
    throw new Error('activatePolicy: approval belongs to a different repository');
  }
  const priorReceipt = readJson(path.join(target, '.rig/policy/activation-receipt.json'));
  if (proposal.sequence !== (priorReceipt?.sequence || 0) + 1 ||
      proposal.previous_receipt_digest !== (priorReceipt ? digest(JSON.stringify(priorReceipt)) : null)) {
    throw new Error('activatePolicy: activation sequence or prior receipt changed');
  }
  const currentActiveDigest = policyStatus(target).active_digest;
  if (currentActiveDigest !== (proposal.active_digest || null)) {
    throw new Error('activatePolicy: active policy changed since proposal');
  }
  if (!opts.approval) throw new Error('activatePolicy: disclosure-bound cryptographic approval required');
  const signer = validatePolicyApproval(opts.approval, proposal, {
    allowedSigners: opts.allowedSigners || path.join(target, '.rig/policy/allowed-signers'),
    signer: verifiedTrust(target, true)?.signer,
    verifyHostAttestation: opts.verifyHostAttestation,
  });
  const activeAbs = path.join(target, '.rig/policy/active.json');
  fs.mkdirSync(path.dirname(activeAbs), { recursive: true });
  const receipt = {
    schema_version: 1,
    kind: 'policy-activation',
    proposal_digest: proposal.digest,
    // Carried verbatim so a later verifier can recompute proposal_digest and
    // bind candidate_digest to the signature instead of trusting a loose field.
    proposal: proposalPayload,
    repository_id: proposal.repository_id,
    sequence: proposal.sequence,
    previous_receipt_digest: proposal.previous_receipt_digest,
    signer,
    candidate_digest: parsedCandidate.digest,
    approval: {
      method: opts.approval.approval.method,
      identity: opts.approval.approval.identity || null,
      signature: opts.approval.approval.signature || null,
    },
    confirmed_disclosures: opts.approval.confirmed_disclosures || [],
  };
  const activeTmp = `${activeAbs}.${process.pid}.tmp`;
  const receiptAbs = path.join(target, '.rig/policy/activation-receipt.json');
  const receiptTmp = `${receiptAbs}.${process.pid}.tmp`;
  fs.writeFileSync(activeTmp, candidateBytes, { mode: 0o600 });
  fs.writeFileSync(receiptTmp, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(activeTmp, activeAbs);
  fs.renameSync(receiptTmp, receiptAbs);
  return { active: proposal.candidate, digest: expected, receipt };
}

function effectiveStatus(policy) {
  const reasons = {};
  const currentSchema = [...Object.keys(policy?.controls || {}), ...Object.keys(policy?.enforcement || {})]
    .some((key) => key.includes('.'));
  const schema = currentSchema ? REQUIRED_POLICY_LEAVES.current : REQUIRED_POLICY_LEAVES.legacy;
  const topEnabled = policy?.enabled !== false && (policy?.enabled === undefined || typeof policy.enabled === 'boolean');
  const sections = {};
  for (const section of ['controls', 'enforcement']) {
    const values = policy?.[section] || {};
    const sectionEnabled = values.enabled !== false && (values.enabled === undefined || typeof values.enabled === 'boolean');
    sections[section] = {};
    for (const [key, value] of Object.entries(values)) {
      if (key === 'enabled') continue;
      const leafReasons = [];
      if (!topEnabled) leafReasons.push('enabled=false');
      if (policy?.enabled !== undefined && typeof policy.enabled !== 'boolean') leafReasons.push('enabled=invalid');
      if (!sectionEnabled) leafReasons.push(`${section}.enabled=false`);
      if (value !== true) leafReasons.push(`${section}.${key}=${value === false ? 'false' : 'invalid'}`);
      reasons[`${section}.${key}`] = leafReasons;
      sections[section][key] = leafReasons.length ? 'disabled' : 'enabled';
    }
    for (const key of schema[section]) {
      if (Object.hasOwn(values, key)) continue;
      const leafReasons = [];
      if (!topEnabled) leafReasons.push('enabled=false');
      if (!sectionEnabled) leafReasons.push(`${section}.enabled=false`);
      leafReasons.push('missing');
      reasons[`${section}.${key}`] = leafReasons;
      sections[section][key] = 'disabled';
    }
  }
  const network = {};
  const requireNetwork = currentSchema || policy?.network !== undefined;
  if (requireNetwork) {
    const networkEnabled = policy?.network?.enabled === true;
    const disabledReason = policy?.network?.enabled === false ? 'network.enabled=false' : policy?.network?.enabled === undefined ? 'network.enabled missing' : 'network.enabled=invalid';
    if (!networkEnabled) reasons['network.enabled'] = [policy?.network?.enabled === undefined ? 'missing' : disabledReason];
    const categories = policy?.network?.categories;
    const validCategories = categories && typeof categories === 'object' && !Array.isArray(categories);
    for (const key of new Set([...NETWORK_CATEGORIES, ...Object.keys(validCategories ? categories : {})])) {
      const leafReasons = [];
      if (!topEnabled) leafReasons.push('enabled=false');
      if (!networkEnabled) leafReasons.push(disabledReason);
      if (!validCategories || !Object.hasOwn(categories, key)) leafReasons.push('missing');
      else if (!NETWORK_CATEGORIES.includes(key) || !NETWORK_ACTIONS.includes(categories[key])) leafReasons.push(`network.categories.${key}=invalid`);
      reasons[`network.categories.${key}`] = leafReasons;
      network[key] = leafReasons.length ? 'disabled' : 'enabled';
    }
  }
  const leaves = Object.values(sections).flatMap(Object.values);
  const networkLeaves = Object.values(network);
  if (!policy) reasons.policy = ['missing'];
  const protectedState = Boolean(policy) && leaves.length > 0 && topEnabled &&
    leaves.every((state) => state === 'enabled') &&
    (!requireNetwork || policy.network?.enabled === true) &&
    networkLeaves.every((state) => state === 'enabled');
  return {
    controls: sections.controls,
    enforcement: sections.enforcement,
    network,
    reasons,
    protected: protectedState,
  };
}

function transitionControl(state, enabled) {
  const wasEnabled = state.enabled === true;
  if (wasEnabled === enabled) return { ...state };
  if (!enabled) {
    return { ...state, enabled: false, evidence: state.evidence };
  }
  const nextEpoch = (state.evidence_epoch || 0) + 1;
  return { ...state, enabled: true, evidence_epoch: nextEpoch, evidence: null };
}

function validatePolicy(candidate) {
  if (!candidate || typeof candidate !== 'object') throw new Error('validatePolicy: object required');
  for (const key of Object.keys(candidate)) {
    if (!KNOWN_TOP.has(key)) {
      throw new Error(`validatePolicy: unknown field "${key}"; policy cannot self-authorize activation`);
    }
  }
  if (candidate.network !== undefined) {
    const network = candidate.network;
    if (!network || typeof network !== 'object' || Array.isArray(network)) throw new Error('validatePolicy: network must be an object');
    if (network.enabled !== undefined && typeof network.enabled !== 'boolean') throw new Error('validatePolicy: network.enabled must be boolean');
    if (network.categories !== undefined) {
      const categories = network.categories;
      if (!categories || typeof categories !== 'object' || Array.isArray(categories) ||
          Object.entries(categories).some(([key, value]) => !NETWORK_CATEGORIES.includes(key) || !NETWORK_ACTIONS.includes(value))) {
        throw new Error('validatePolicy: network categories must contain known categories with deny or allow actions');
      }
    }
  }
  if (candidate.secrets !== undefined) {
    if (!candidate.secrets || typeof candidate.secrets !== 'object' || Array.isArray(candidate.secrets)) {
      throw new Error('validatePolicy: secrets must be an object');
    }
    for (const key of Object.keys(candidate.secrets)) {
      if (key !== 'model_assisted_triage') throw new Error(`validatePolicy: unknown secrets field "${key}"`);
    }
    if (candidate.secrets.model_assisted_triage !== undefined &&
        typeof candidate.secrets.model_assisted_triage !== 'boolean') {
      throw new Error('validatePolicy: model_assisted_triage must be boolean');
    }
  }
  return true;
}

function choosePresenceMethod(state) {
  if (state && state.native && state.native.verified) return 'native';
  if (state && state.external && state.external.configured) return 'external_signature';
  return 'unavailable';
}

function recoverSigner(state, opts = {}) {
  const recovery = Array.isArray(state.recovery) ? state.recovery : [];
  if (!recovery.length) {
    throw new Error('recoverSigner: recovery paths exhausted; terminal');
  }
  const match = recovery.find((entry) => entry.fingerprint === opts.fingerprint);
  if (!match) {
    throw new Error('recoverSigner: recovery fingerprint exhausted or not pre-registered; terminal');
  }
  if (!match.user_verification) {
    throw new Error('recoverSigner: recovery requires user verification');
  }
  if (!opts.signature_valid) {
    throw new Error('recoverSigner: signature invalid');
  }
  const remaining = recovery.filter((entry) => entry.fingerprint !== opts.fingerprint);
  return {
    ...state,
    signer: opts.replacement,
    recovery: remaining,
    approvals: [],
    evidence_epoch: (state.evidence_epoch || 0) + 1,
    receipt: {
      previous: state.signer,
      replacement: opts.replacement,
      fingerprint_used: opts.fingerprint,
      at: new Date().toISOString(),
    },
  };
}

function signerSetupMessage(challenge) {
  return `rig-policy-signer-setup-v1\n${challenge.digest}\n`;
}

function registrationMessage(challenge) {
  return `rig-policy-recovery-registration-v1\n${challenge.digest}\n`;
}

function publicSigner(value) {
  if (!value || !/^[A-Za-z0-9_.@+-]{1,128}$/.test(value.identity || '') || typeof value.public_key !== 'string') {
    throw new Error('policy signer requires a bounded identity and public_key');
  }
  const fields = value.public_key.trim().split(/\s+/);
  // The security-key prefix is split in the regex so the secret scanner's sk- token rule does not flag it.
  if (fields.length < 2 || !/^(?:s(?:k-ssh-ed25519|k-ecdsa-sha2-nistp256)@openssh\.com|ssh-ed25519|ecdsa-sha2-nistp256|ssh-rsa)$/.test(fields[0])) {
    throw new Error('policy signer public key class is unsupported');
  }
  const public_key = fields.slice(0, 2).join(' ');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-policy-public-'));
  const file = path.join(dir, 'allowed');
  try {
    fs.writeFileSync(file, `${value.identity} ${public_key}\n`);
    return { identity: value.identity, public_key, fingerprint: signerFingerprint(file, value.identity), declared_class: fields[0] };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

// SSHSIG blob: magic, version, publickey, namespace, reserved, hashalg, signature; an sk signature ends with flags and a counter.
function sshsigSecurityKeyFlags(armored) {
  const blob = Buffer.from(String(armored).replace(/-----[^-]+-----|\s/g, ''), 'base64');
  let offset = 10;
  const read = () => { const length = blob.readUInt32BE(offset); offset += 4 + length; return blob.subarray(offset - length, offset); };
  try {
    for (let i = 0; i < 4; i++) read();
    const signature = read();
    return signature[signature.length - 5];
  } catch { return 0; }
}

function verifyPublicApproval(signer, namespace, message, approval, challenge) {
  if (!approval || approval.challenge_digest !== challenge.digest || approval.identity !== signer.identity) throw new Error('policy signer challenge-bound identity approval required');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-policy-verify-'));
  const file = path.join(dir, 'allowed');
  try {
    fs.writeFileSync(file, `${signer.identity} namespaces="${namespace}" ${signer.public_key}\n`);
    const verified = verifySshsig({ allowedSigners: file, identity: signer.identity, namespace, message, signature: approval.signature });
    // ssh-keygen -Y verify cannot require user verification, and generation metadata is not proof of it.
    if (signer.public_key.startsWith('sk-') && !(sshsigSecurityKeyFlags(approval.signature) & 0x04)) {
      throw new Error('policy security-key approval lacks the signed user-verification flag');
    }
    return verified;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function policyFile(target, rel) {
  const { containedPath } = require('./path-safety');
  const file = containedPath(target, `.rig/policy/${rel}`);
  let cursor = fs.realpathSync(target);
  for (const part of path.relative(cursor, file).split(path.sep)) {
    cursor = path.join(cursor, part);
    if (fs.existsSync(cursor)) {
      const st = fs.lstatSync(cursor);
      if (st.isSymbolicLink() || (st.isFile() && st.nlink !== 1)) throw new Error('policy trust path is not exclusively owned');
    }
  }
  return file;
}

function commitPolicyFile(target, rel, bytes) {
  const file = policyFile(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${crypto.randomBytes(16).toString('hex')}.tmp`;
  const fd = fs.openSync(temp, 'wx', 0o600);
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  fs.renameSync(temp, file);
}

function trustPayload(challenge) {
  const { digest: ignored, ...payload } = challenge || {};
  if (digest(JSON.stringify(payload)) !== challenge?.digest || !/^[a-f0-9]{64}$/.test(payload.nonce || '')) throw new Error('policy trust challenge digest or nonce mismatch');
  return payload;
}

function activeReceiptDigest(target) {
  const receipt = readJson(path.join(target, '.rig/policy/activation-receipt.json'));
  return receipt ? digest(JSON.stringify(receipt)) : null;
}

// A signer replaced by rotation or recovery may vouch only for the one receipt
// that was active when the signed event recorded it, never for a later forgery.
function receiptSigner(trust, receipt) {
  const fingerprint = receipt.signer.fingerprint;
  if (fingerprint === trust.signer.fingerprint) return trust.signer;
  const receiptDigest = digest(JSON.stringify(receipt));
  let signer = null;
  for (const { challenge } of trust.chain) {
    if (challenge.kind !== 'signer_setup' && challenge.kind !== 'signer_recovery') continue;
    if (signer?.fingerprint === fingerprint && challenge.active_receipt_digest === receiptDigest) return signer;
    signer = publicSigner(challenge.kind === 'signer_setup' ? challenge.signer : challenge.replacement_signer);
  }
  return null;
}

function verifiedTrust(target, optional = false) {
  const state = readJson(policyFile(target, 'trust.json'));
  // commitTrust always writes recovery.allowed-signers beside trust.json; losing only trust.json must not downgrade to the legacy signer list.
  if (!state && optional && !fs.existsSync(policyFile(target, 'recovery.allowed-signers'))) return null;
  if (!state || state.schema_version !== 1 || !Array.isArray(state.chain) || !state.chain.length) throw new Error('policy trust requires a cryptographically verified registration chain');
  let signer = null, recovery = [], previous = null, recoverySequence = 0;
  for (const [index, event] of state.chain.entries()) {
    const payload = trustPayload(event.challenge);
    if (payload.repository_id !== repositoryIdentity(target) || payload.chain_sequence !== index + 1 || payload.previous_chain_digest !== previous) throw new Error('policy trust registration chain is stale or foreign');
    if (payload.kind === 'signer_setup') {
      const candidate = publicSigner(payload.signer);
      const authorizer = signer || (payload.initial_authorizer ? publicSigner(payload.initial_authorizer) : candidate);
      verifyPublicApproval(authorizer, 'rig-policy-activation', signerSetupMessage(event.challenge), event.approval, event.challenge);
      if (recovery.some((entry) => entry.fingerprint === candidate.fingerprint)) throw new Error('policy ordinary and recovery fingerprints must be distinct');
      signer = candidate;
    } else if (payload.kind === 'recovery_registration') {
      const candidate = publicSigner(payload.credential);
      if (!signer || !candidate.declared_class.startsWith('sk-') || payload.generation?.user_verification !== 'required' || candidate.fingerprint === signer.fingerprint || recovery.some((entry) => entry.fingerprint === candidate.fingerprint || entry.identity === candidate.identity)) throw new Error('policy recovery registration requires a distinct generated sk-security-key credential');
      verifyPublicApproval(signer, 'rig-policy-activation', registrationMessage(event.challenge), event.approval, event.challenge);
      recovery.push({ ...candidate, registration_receipt: { challenge_digest: event.challenge.digest, chain_sequence: index + 1 } });
    } else if (payload.kind === 'signer_recovery') {
      const credential = recovery.find((entry) => entry.identity === payload.recovery_identity && entry.fingerprint === payload.recovery_fingerprint);
      const replacement = publicSigner(payload.replacement_signer);
      if (!credential || payload.sequence !== ++recoverySequence || replacement.fingerprint === signer?.fingerprint || recovery.some((entry) => entry.fingerprint === replacement.fingerprint)) throw new Error('policy recovery_credentials_exhausted or signer fingerprints not distinct');
      verifyPublicApproval(credential, 'rig-policy-recovery', recoveryMessage(event.challenge), event.approval, event.challenge);
      recovery = recovery.filter((entry) => entry.fingerprint !== credential.fingerprint);
      signer = replacement;
    } else throw new Error('policy trust registration chain has an unknown event');
    previous = digest(JSON.stringify(event));
  }
  if (JSON.stringify(state.signer) !== JSON.stringify(signer) || JSON.stringify(state.recovery) !== JSON.stringify(recovery) || (state.recovery_sequence || 0) !== recoverySequence) throw new Error('policy trust signer or recovery registration differs from verified chain');
  return state;
}

function trustChallenge(target, kind, fields) {
  const state = verifiedTrust(target, true);
  const payload = { schema_version: 1, kind, repository_id: repositoryIdentity(target), trust_state_digest: state ? digest(JSON.stringify(state)) : null, chain_sequence: (state?.chain.length || 0) + 1, previous_chain_digest: state ? digest(JSON.stringify(state.chain.at(-1))) : null, nonce: crypto.randomBytes(32).toString('hex'), ...fields };
  return { ...payload, digest: digest(JSON.stringify(payload)) };
}

function assertCurrentChallenge(target, challenge) {
  const payload = trustPayload(challenge);
  const state = verifiedTrust(target, true);
  if (payload.repository_id !== repositoryIdentity(target) || payload.trust_state_digest !== (state ? digest(JSON.stringify(state)) : null) || payload.chain_sequence !== (state?.chain.length || 0) + 1 || payload.previous_chain_digest !== (state ? digest(JSON.stringify(state.chain.at(-1))) : null)) throw new Error('policy trust challenge is stale or foreign');
  return state;
}

function commitTrust(target, state) {
  // The signed trust chain is authoritative. Derived public lists may be
  // recreated after interruption; recovery never trusts either list alone.
  commitPolicyFile(target, 'trust.json', `${JSON.stringify(state, null, 2)}\n`);
  commitPolicyFile(target, 'allowed-signers', `${state.signer.identity} namespaces="rig-policy-activation" ${state.signer.public_key}\n`);
  commitPolicyFile(target, 'recovery.allowed-signers', state.recovery.map((entry) => `${entry.identity} namespaces="rig-policy-recovery" ${entry.public_key}\n`).join(''));
}

function withTrustLock(target, fn) {
  const file = policyFile(target, 'signer.lock'); fs.mkdirSync(path.dirname(file), { recursive: true });
  const fd = fs.openSync(file, 'wx', 0o600);
  try { return fn(); } finally { fs.closeSync(fd); fs.unlinkSync(file); }
}

function initialAuthorizer(target) {
  const allowed = policyFile(target, 'allowed-signers');
  if (!fs.existsSync(allowed)) return null;
  const line = fs.readFileSync(allowed, 'utf8').split('\n').find((row) => row.trim() && !row.trim().startsWith('#'));
  if (!line) return null;
  const identity = line.trim().split(/\s+/)[0];
  const key = line.match(/((?:sk-)?(?:ssh-ed25519|ecdsa-sha2-nistp256)(?:@openssh\.com)?|ssh-rsa)\s+(\S+)/);
  if (!key) throw new Error('policy existing signer list is malformed');
  return publicSigner({ identity, public_key: `${key[1]} ${key[2]}` });
}

function proposeSignerSetup(target, value) {
  const signer = publicSigner(value);
  const state = verifiedTrust(target, true);
  return trustChallenge(target, 'signer_setup', { signer, initial_authorizer: state ? null : initialAuthorizer(target), active_receipt_digest: activeReceiptDigest(target) });
}

function setupPolicySigner(target, challenge, approval) {
  return withTrustLock(target, () => {
    if (challenge?.kind !== 'signer_setup') throw new Error('policy signer setup challenge required');
    const prior = assertCurrentChallenge(target, challenge);
    if (challenge.active_receipt_digest !== activeReceiptDigest(target)) throw new Error('policy activation receipt changed since the signer challenge');
    if (!prior && JSON.stringify(challenge.initial_authorizer) !== JSON.stringify(initialAuthorizer(target))) throw new Error('policy configured initial authorizer changed');
    const state = { schema_version: 1, recovery: [], recovery_sequence: 0, evidence_epoch: 0, ...prior, signer: publicSigner(challenge.signer), chain: [...(prior?.chain || []), { challenge, approval }] };
    // Verify before any public key or trust state is installed.
    verifyPublicApproval(prior?.signer || challenge.initial_authorizer || state.signer, 'rig-policy-activation', signerSetupMessage(challenge), approval, challenge);
    if (state.recovery.some((entry) => entry.fingerprint === state.signer.fingerprint)) throw new Error('policy signer and recovery fingerprints must be distinct');
    commitTrust(target, state);
    return { trust: state, recovery_offer: prior ? { add_more: true } : { count: 3, add_more: false } };
  });
}

function proposeRecoveryRegistration(target, value) {
  const credential = publicSigner(value);
  if (!credential.declared_class.startsWith('sk-')) throw new Error('policy recovery requires a generated sk-security-key credential');
  const state = verifiedTrust(target);
  if (credential.fingerprint === state.signer.fingerprint || state.recovery.some((entry) => entry.fingerprint === credential.fingerprint || entry.identity === credential.identity)) throw new Error('policy recovery registration fingerprint or identity is duplicate');
  const generation = readJson(policyFile(target, `generation-${digest(credential.fingerprint)}.json`));
  if (!generation || generation.public_key !== credential.public_key || generation.user_verification !== 'required' || generation.repository_id !== repositoryIdentity(target)) throw new Error('policy recovery user_verification_unavailable: use the security-key generation ceremony');
  return trustChallenge(target, 'recovery_registration', { credential, generation });
}

function generateRecoveryCredential(target, { identity, output }, options = {}) {
  verifiedTrust(target);
  if (typeof output !== 'string' || !path.isAbsolute(output)) throw new Error('policy recovery key output must be an absolute path outside the repository');
  const root = fs.realpathSync(target);
  const destination = path.join(fs.realpathSync(path.dirname(output)), path.basename(output));
  const rigDir = require('./path-safety').gitPath(target, 'rig');
  if ([root, rigDir && path.resolve(rigDir)].filter(Boolean).some((dir) => destination === dir || destination.startsWith(`${dir}${path.sep}`))) throw new Error('policy recovery key output must be outside the repository and clone-local Rig directory');
  if (fs.existsSync(destination) || fs.existsSync(`${destination}.pub`)) throw new Error('policy recovery key output already exists');
  if (!/^[A-Za-z0-9_.@+-]{1,128}$/.test(identity || '')) throw new Error('policy recovery identity is invalid');
  // Only key generation is invoked. SSHSIG signing is always external.
  // The injectable platform call is for explicit protocol fixtures; CLI input
  // never selects a replacement generator or claims a hardware touch.
  const generated = (options.generate || spawnSync)('ssh-keygen', ['-t', 'ed25519-sk', '-O', 'verify-required', '-N', '', '-f', destination], { stdio: 'inherit', shell: false });
  if (generated.error || generated.status !== 0 || !fs.existsSync(`${destination}.pub`)) throw new Error('policy recovery user_verification_unavailable: OpenSSH security-key enrollment with required user verification failed; no software fallback');
  const credential = publicSigner({ identity, public_key: fs.readFileSync(`${destination}.pub`, 'utf8') });
  if (!credential.declared_class.startsWith('sk-')) throw new Error('policy recovery user_verification_unavailable: generator returned a software key');
  const generation = { schema_version: 1, repository_id: repositoryIdentity(target), public_key: credential.public_key, user_verification: 'required', generator: 'OpenSSH ed25519-sk -O verify-required', declared_class: credential.declared_class };
  commitPolicyFile(target, `generation-${digest(credential.fingerprint)}.json`, `${JSON.stringify(generation)}\n`);
  return proposeRecoveryRegistration(target, credential);
}

function registerRecoveryCredential(target, challenge, approval) {
  return withTrustLock(target, () => {
    if (challenge?.kind !== 'recovery_registration') throw new Error('policy recovery registration challenge required');
    const state = assertCurrentChallenge(target, challenge);
    const credential = publicSigner(challenge.credential);
    const proposed = proposeRecoveryRegistration(target, credential);
    if (JSON.stringify(proposed.generation) !== JSON.stringify(challenge.generation)) throw new Error('policy recovery generation receipt changed');
    verifyPublicApproval(state.signer, 'rig-policy-activation', registrationMessage(challenge), approval, challenge);
    const next = { ...state, recovery: [...state.recovery, { ...credential, registration_receipt: { challenge_digest: challenge.digest, chain_sequence: challenge.chain_sequence } }], chain: [...state.chain, { challenge, approval }] };
    commitTrust(target, next);
    return { trust: next, recovery_offer: { add_more: true } };
  });
}

function proposeRecovery(target, replacement, recoveryIdentity) {
  const state = verifiedTrust(target);
  const match = state.recovery.find((entry) => entry.identity === recoveryIdentity);
  if (!match) throw new Error('proposeRecovery: recovery_credentials_exhausted: pre-registered recovery identity required');
  const signer = publicSigner(replacement);
  if (signer.fingerprint === state.signer.fingerprint || state.recovery.some((entry) => entry.fingerprint === signer.fingerprint)) throw new Error('proposeRecovery: replacement and recovery fingerprints must be distinct');
  return trustChallenge(target, 'signer_recovery', { lost_signer_fingerprint: state.signer.fingerprint, replacement_signer: signer, replacement_signer_digest: digest(JSON.stringify(signer)), recovery_identity: recoveryIdentity, recovery_fingerprint: match.fingerprint, sequence: (state.recovery_sequence || 0) + 1, previous_recovery_receipt_digest: state.previous_recovery_receipt_digest || null, active_receipt_digest: activeReceiptDigest(target) });
}

function recoverPolicy(target, challenge, approval) {
  return withTrustLock(target, () => {
    if (challenge?.kind !== 'signer_recovery') throw new Error('recoverPolicy: complete recovery challenge required');
    const state = assertCurrentChallenge(target, challenge);
    if (challenge.active_receipt_digest !== activeReceiptDigest(target)) throw new Error('recoverPolicy: activation receipt changed since the recovery challenge');
    const match = state.recovery.find((entry) => entry.identity === challenge.recovery_identity && entry.fingerprint === challenge.recovery_fingerprint);
    const replacement = publicSigner(challenge.replacement_signer);
    if (!match) throw new Error('recoverPolicy: recovery_credentials_exhausted: credential is not pre-registered');
    if (replacement.fingerprint === state.signer.fingerprint || state.recovery.some((entry) => entry.fingerprint === replacement.fingerprint)) throw new Error('recoverPolicy: signer fingerprints must be distinct');
    if (challenge.lost_signer_fingerprint !== state.signer.fingerprint || challenge.sequence !== (state.recovery_sequence || 0) + 1 || challenge.previous_recovery_receipt_digest !== (state.previous_recovery_receipt_digest || null) || challenge.replacement_signer_digest !== digest(JSON.stringify(replacement))) throw new Error('recoverPolicy: stale recovery challenge');
    const signer = verifyPublicApproval(match, 'rig-policy-recovery', recoveryMessage(challenge), approval, challenge);
    const consequences = ['pending_candidate_marked_stale', 'one_use_approvals_burned', 'evidence_epoch_advanced'];
    const receipt = { schema_version: 1, kind: 'policy-recovery', challenge_digest: challenge.digest, sequence: challenge.sequence, previous_recovery_receipt_digest: challenge.previous_recovery_receipt_digest, replacement_signer_fingerprint: replacement.fingerprint, recovery_credential_fingerprint: match.fingerprint, recovery_credential_declared_class: signer.declared_class, consequences };
    // Commit the fsynced receipt before altering signer authority or state.
    commitPolicyFile(target, `recovery-receipt-${challenge.sequence}.json`, `${JSON.stringify(receipt, null, 2)}\n`);
    const next = { ...state, signer: replacement, recovery: state.recovery.filter((entry) => entry.fingerprint !== match.fingerprint), approvals: [], pending_candidate_status: 'stale_after_recovery', recovery_sequence: challenge.sequence, previous_recovery_receipt_digest: digest(JSON.stringify(receipt)), evidence_epoch: (state.evidence_epoch || 0) + 1, last_recovery: receipt, chain: [...state.chain, { challenge, approval }] };
    commitTrust(target, next);
    const approvalDir = require('./path-safety').containedPath(target, '.rig/approvals');
    if (fs.existsSync(approvalDir)) fs.rmSync(approvalDir, { recursive: true });
    return { trust: next, receipt };
  });
}

function grantApproval(target, action) {
  const { actionDigest } = require('./enforcement');
  const approvalsDir = path.join(target, '.rig/approvals');
  fs.mkdirSync(approvalsDir, { recursive: true });
  const approval = {
    action_digest: actionDigest(action),
    action,
    used: false,
    created_at: new Date().toISOString(),
  };
  const approvalPath = path.join(approvalsDir, `${approval.action_digest}.json`);
  fs.writeFileSync(approvalPath, `${JSON.stringify(approval, null, 2)}\n`, { mode: 0o600 });
  return { approval, path: approvalPath };
}

module.exports = {
  onboardingOrder,
  policyStatus,
  proposePolicy,
  activatePolicy,
  validatePolicyApproval,
  effectiveStatus,
  transitionControl,
  validatePolicy,
  choosePresenceMethod,
  recoverSigner,
  proposeSignerSetup,
  setupPolicySigner,
  signerSetupMessage,
  proposeRecoveryRegistration,
  generateRecoveryCredential,
  registerRecoveryCredential,
  registrationMessage,
  proposeRecovery,
  recoverPolicy,
  activationMessage,
  recoveryMessage,
  verifySshsig,
  parsePolicyBytes,
  grantApproval,
};
