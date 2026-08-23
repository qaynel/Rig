'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { TRIAGE_DISCLOSURE } = require('./reports');

const KNOWN_TOP = new Set(['schema_version', 'enabled', 'controls', 'enforcement', 'network', 'allow', 'secrets']);

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
  const trust = readJson(path.join(target, '.rig/policy/trust.json'));
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
    const verified = verifySshsig({
      allowedSigners: path.join(target, '.rig/policy/allowed-signers'),
      identity: receipt.approval?.identity,
      namespace: 'rig-policy-activation',
      message: activationMessage({ digest: receipt.proposal_digest }),
      signature: receipt.approval?.signature,
    });
    activationVerified = verified.fingerprint === receipt.signer.fingerprint &&
      receipt.candidate_digest === (active ? digest(fs.readFileSync(activeAbs)) : null);
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
    signer_declared_class: receipt?.signer?.declared_class || null,
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
    signer = verifySshsig({
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
    verifyHostAttestation: opts.verifyHostAttestation,
  });
  const activeAbs = path.join(target, '.rig/policy/active.json');
  fs.mkdirSync(path.dirname(activeAbs), { recursive: true });
  const receipt = {
    schema_version: 1,
    kind: 'policy-activation',
    proposal_digest: proposal.digest,
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
  const controls = {};
  for (const [key, value] of Object.entries(policy.controls || {})) {
    controls[key] = value === false ? 'disabled' : 'enabled';
  }
  const enforcement = {};
  for (const [key, value] of Object.entries(policy.enforcement || {})) {
    enforcement[key] = value === false ? 'disabled' : 'enabled';
  }
  const controlsProtected = Object.values(controls).every((state) => state === 'enabled');
  const enforcementProtected = Object.values(enforcement).every((state) => state === 'enabled');
  return {
    controls,
    enforcement,
    protected: controlsProtected && enforcementProtected,
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

function proposeRecovery(target, replacement, recoveryIdentity) {
  const trustPath = path.join(target, '.rig/policy/trust.json');
  const state = readJson(trustPath);
  if (!state || state.schema_version !== 1) throw new Error('proposeRecovery: initialized trust state required');
  const match = (state.recovery || []).find((entry) => entry.identity === recoveryIdentity);
  if (!match || !match.registration_receipt) {
    throw new Error('proposeRecovery: pre-registered recovery identity required');
  }
  if (!replacement || !replacement.fingerprint || replacement.fingerprint === state.signer?.fingerprint ||
      replacement.fingerprint === match.fingerprint) {
    throw new Error('proposeRecovery: replacement and recovery fingerprints must be distinct');
  }
  const payload = {
    schema_version: 1,
    repository_id: repositoryIdentity(target),
    trust_state_digest: digest(JSON.stringify(state)),
    lost_signer_fingerprint: state.signer?.fingerprint || null,
    replacement_signer: replacement,
    replacement_signer_digest: digest(JSON.stringify(replacement)),
    recovery_identity: recoveryIdentity,
    recovery_fingerprint: match.fingerprint,
    sequence: (state.recovery_sequence || 0) + 1,
    previous_recovery_receipt_digest: state.previous_recovery_receipt_digest || null,
    nonce: crypto.randomBytes(32).toString('hex'),
  };
  return { ...payload, digest: digest(JSON.stringify(payload)) };
}

function recoverPolicy(target, challenge, approval) {
  const trustPath = path.join(target, '.rig/policy/trust.json');
  const state = readJson(trustPath);
  if (!state || state.schema_version !== 1) throw new Error('recoverPolicy: initialized trust state required');
  if (!challenge || challenge.schema_version !== 1 || typeof challenge.nonce !== 'string' || challenge.nonce.length < 32) {
    throw new Error('recoverPolicy: complete recovery challenge required');
  }
  const payload = {
    schema_version: challenge.schema_version,
    repository_id: challenge.repository_id,
    trust_state_digest: challenge.trust_state_digest,
    lost_signer_fingerprint: challenge.lost_signer_fingerprint,
    replacement_signer: challenge.replacement_signer,
    replacement_signer_digest: challenge.replacement_signer_digest,
    recovery_identity: challenge.recovery_identity,
    recovery_fingerprint: challenge.recovery_fingerprint,
    sequence: challenge.sequence,
    previous_recovery_receipt_digest: challenge.previous_recovery_receipt_digest || null,
    nonce: challenge.nonce,
  };
  if (challenge.digest !== digest(JSON.stringify(payload))) throw new Error('recoverPolicy: challenge digest mismatch');
  if (payload.repository_id !== repositoryIdentity(target) ||
      payload.trust_state_digest !== digest(JSON.stringify(state)) ||
      payload.lost_signer_fingerprint !== state.signer?.fingerprint ||
      payload.replacement_signer_digest !== digest(JSON.stringify(payload.replacement_signer)) ||
      payload.sequence !== (state.recovery_sequence || 0) + 1 ||
      payload.previous_recovery_receipt_digest !== (state.previous_recovery_receipt_digest || null)) {
    throw new Error('recoverPolicy: stale or foreign recovery challenge');
  }
  const match = (state.recovery || []).find((entry) => entry.identity === payload.recovery_identity);
  if (!match || !match.registration_receipt || match.fingerprint !== payload.recovery_fingerprint) {
    throw new Error('recoverPolicy: recovery credential is not pre-registered');
  }
  if (payload.replacement_signer?.fingerprint === state.signer?.fingerprint ||
      payload.replacement_signer?.fingerprint === match.fingerprint) {
    throw new Error('recoverPolicy: signer fingerprints must be distinct');
  }
  if (!approval || approval.challenge_digest !== challenge.digest || approval.identity !== match.identity) {
    throw new Error('recoverPolicy: challenge-bound recovery approval required');
  }
  const signer = verifySshsig({
    allowedSigners: path.join(target, '.rig/policy/recovery.allowed-signers'),
    identity: approval.identity,
    namespace: 'rig-policy-recovery',
    message: recoveryMessage(challenge),
    signature: approval.signature,
  });
  if (signer.fingerprint !== match.fingerprint) throw new Error('recoverPolicy: recovery fingerprint mismatch');
  const consequences = ['pending_candidate_marked_stale', 'one_use_approvals_burned', 'evidence_epoch_advanced'];
  const receipt = {
    schema_version: 1,
    kind: 'policy-recovery',
    challenge_digest: challenge.digest,
    sequence: challenge.sequence,
    previous_recovery_receipt_digest: payload.previous_recovery_receipt_digest,
    replacement_signer_fingerprint: payload.replacement_signer.fingerprint,
    recovery_credential_fingerprint: match.fingerprint,
    recovery_credential_declared_class: signer.declared_class,
    consequences,
  };
  const next = {
    ...state,
    signer: payload.replacement_signer,
    recovery: state.recovery.filter((entry) => entry.identity !== match.identity),
    approvals: [],
    pending_candidate_status: 'stale_after_recovery',
    recovery_sequence: challenge.sequence,
    previous_recovery_receipt_digest: digest(JSON.stringify(receipt)),
    evidence_epoch: (state.evidence_epoch || 0) + 1,
    last_recovery: receipt,
  };
  const receiptPath = path.join(target, `.rig/policy/recovery-receipt-${challenge.sequence}.json`);
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  const receiptFd = fs.openSync(receiptPath, 'wx', 0o600);
  fs.writeFileSync(receiptFd, `${JSON.stringify(receipt, null, 2)}\n`);
  fs.fsyncSync(receiptFd);
  fs.closeSync(receiptFd);
  const tmp = `${trustPath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(tmp, trustPath);
  return { trust: next, receipt };
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
  proposeRecovery,
  recoverPolicy,
  activationMessage,
  recoveryMessage,
  verifySshsig,
  parsePolicyBytes,
};
