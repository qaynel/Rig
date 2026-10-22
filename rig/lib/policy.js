'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { TRIAGE_DISCLOSURE } = require('./reports');
const { verifyTrustRootApproval } = require('./trust-root');
const { policyPath, atomicWrite, withPolicyLock, syncDirectory } = require('./policy-transaction');

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
  return digest(fs.realpathSync(target));
}

function activationMessage(proposal) {
  return `rig-policy-activation-v1\n${proposal.digest}\n`;
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
    const result = spawnSync(fs.existsSync('/usr/bin/ssh-keygen') ? '/usr/bin/ssh-keygen' : 'ssh-keygen', ['-lf', pub], { encoding: 'utf8', shell: false });
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
    const result = spawnSync(fs.existsSync('/usr/bin/ssh-keygen') ? '/usr/bin/ssh-keygen' : 'ssh-keygen', [
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

// A control is on only when the status seam says so: global, section, and leaf
// switches all apply, in either schema, and a missing leaf is not on.
function controlEnabled(policy, legacyKey, currentKey) {
  const states = effectiveStatus(policy).controls;
  return (legacyKey in states ? states[legacyKey] : states[currentKey]) === 'enabled';
}

function onboardingOrder(policy) {
  const steps = [];
  steps.push(controlEnabled(policy, 'sanitation', 'sanitation.harness') ? 'sanitize' : 'record_sanitation_disabled');
  steps.push('profile');
  steps.push('recommend');
  return steps;
}

const SHIPPED_POLICY = path.join(__dirname, '..', 'catalog', 'baseline', 'network-policy.json');

// The only policy any security decision may read. The shipped default is
// authoritative until a first activation; from then on the activated bundle and
// its signed receipt must both be present and verify, or the caller is refused
// with a named reason. The user-owned candidate (.rig/network-policy.json) is
// never read here, so editing it changes no permission.
function loadActivePolicy(target) {
  if (fs.existsSync(policyPath(target, '.rig/policy/transaction.json'))) throw new Error('policy_active_incomplete: interrupted publication; run rig policy recover-activation');
  const activeAbs = policyPath(target, '.rig/policy/active.json');
  const receiptAbs = policyPath(target, '.rig/policy/activation-receipt.json');
  const hasActive = fs.existsSync(activeAbs);
  const hasReceipt = fs.existsSync(receiptAbs);
  if (!hasActive && !hasReceipt) {
    const parsed = parsePolicyBytes(fs.readFileSync(fs.existsSync(SHIPPED_POLICY) ? SHIPPED_POLICY : path.join(__dirname, 'network-policy-default.json')));
    return { source: 'shipped_default', policy: parsed.candidate, digest: parsed.digest, generation: 'default' };
  }
  const refuse = (reason, detail) => { throw new Error(`policy_active_${reason}: ${detail}`); };
  if (!hasActive) refuse('missing', '.rig/policy/active.json is missing but an activation receipt exists');
  if (!hasReceipt) refuse('unreceipted', '.rig/policy/active.json has no activation receipt');
  let parsed; let receipt;
  try { parsed = parsePolicyBytes(fs.readFileSync(activeAbs)); } catch (err) { refuse('invalid', err.message); }
  try { receipt = JSON.parse(fs.readFileSync(receiptAbs, 'utf8')); } catch (err) { refuse('receipt_invalid', err.message); }
  if (receipt?.signer?.method !== 'external-sshsig') refuse('unverifiable', 'only an externally signed activation can be re-verified');
  const proposal = receipt.proposal;
  if (!proposal || digest(JSON.stringify(proposal)) !== receipt.proposal_digest || proposal.candidate_digest !== parsed.digest ||
      proposal.repository_id !== repositoryIdentity(target) || receipt.repository_id !== proposal.repository_id ||
      receipt.sequence !== proposal.sequence || receipt.previous_receipt_digest !== proposal.previous_receipt_digest) {
    refuse('stale', 'active.json does not match the digest the activation receipt signed');
  }
  try {
    const verified = verifyTrustRootApproval(target, {
      identity: receipt.approval?.identity,
      namespace: 'rig-policy-activation',
      message: activationMessage({ digest: receipt.proposal_digest }),
      signature: receipt.approval?.signature,
    });
    if (verified.fingerprint !== receipt.signer.fingerprint) refuse('signer', 'activation receipt signer differs from the Gate 1 key');
  } catch (err) {
    if (/^policy_active_/.test(err.message)) throw err;
    refuse('unsigned', err.message);
  }
  return { source: 'activated', policy: parsed.candidate, digest: parsed.digest, generation: `${receipt.sequence}:${receipt.proposal_digest}` };
}

// Which surfaces mechanically deny, and which are a named gap (North star 12).
// Supported host hooks Rig does not install are available but not integrated:
// their decisions are advisory until the user wires a hook to the entrypoint.
const HOOK_GAP = (surface) => ({
  state: 'available_not_integrated',
  claim: 'none: Rig installs no runtime hook for this surface, so nothing is blocked automatically',
  setup: `Wire your host's pre-tool hook for ${surface} calls to run \`.rig/bin/rig policy evaluate --target <repo> --action <action.json>\` and block on a nonzero exit.`,
});
const ENFORCEMENT_SURFACES = {
  git_pre_commit: { state: 'integrated', entrypoint: '.git/hooks/pre-commit -> .rig/hooks/secret-guard.sh', claim: 'blocks a commit whose staged content matches the deterministic secret floor' },
  validate_commit: { state: 'integrated_on_invocation', entrypoint: '.rig/bin/rig validate-commit', claim: 'refuses staged harness files with suspicious directives or secret-shaped content; run it from a hook or CI step' },
  shell: HOOK_GAP('shell'),
  web: HOOK_GAP('web'),
  mcp: HOOK_GAP('MCP'),
};

function policyStatus(target, { candidate, prose } = {}) {
  const authority = '.rig/network-policy.json';
  const guide = '.rig/network-rules.md';
  const activeSnapshot = '.rig/policy/active.json';
  const activeAbs = policyPath(target, activeSnapshot);
  let authoritative;
  try { authoritative = loadActivePolicy(target); }
  catch (error) {
    return { authority, active_snapshot: activeSnapshot, active: null, active_digest: null,
      protection: 'withheld', error: error.message,
      surfaces: Object.fromEntries(Object.keys(ENFORCEMENT_SURFACES).map(id => [id, { state: 'withheld_invalid_policy' }])),
      model_assisted_triage: { enabled: false, authorized: false, disclosure: null } };
  }
  const receipt = readJson(path.join(target, '.rig/policy/activation-receipt.json'));
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
    const verified = verifyTrustRootApproval(target, {
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
  // An interrupted install claims no protection, whatever the policy says.
  const install = require('./lifecycle').installState(target);
  const withheld = !install.complete;
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
    install,
    protection: withheld ? 'withheld' : 'per_surface',
    control_evidence: currentProtectionEvidence(target, authoritative),
    surfaces: withheld
      ? Object.fromEntries(Object.entries(ENFORCEMENT_SURFACES).map(([id, surface]) => [id, { ...surface, state: 'withheld_install_incomplete' }]))
      : ENFORCEMENT_SURFACES,
    model_assisted_triage: {
      enabled: triageEnabled,
      authorized: triageEnabled && activationVerified && triageDisclosureConfirmed,
      disclosure: triageEnabled ? TRIAGE_DISCLOSURE : null,
    },
  };
}

function currentProtectionEvidence(target, active = loadActivePolicy(target)) {
  let evidence;
  try { evidence = readJson(policyPath(target, '.rig/policy/control-evidence.json')); } catch { evidence = null; }
  const snapshots = new Map();
  const currentRuns = (evidence?.results || []).filter((run) => {
    if (run.generation !== active.generation || run.policy_digest !== active.digest || !['diff', 'repo'].includes(run.scope)) return false;
    try {
      if (!snapshots.has(run.scope)) snapshots.set(run.scope, require('./policy-baseline').baselineSnapshot(target, run.scope));
      const snapshot = snapshots.get(run.scope);
      return snapshot.scanned.ok && snapshot.inputDigest === run.input_digest && snapshot.implementation === run.implementation;
    } catch { return false; }
  });
  const names = { sanitation: ['sanitation'], 'sanitation.harness': ['sanitation'], drift: ['exact-copy', 'semantic-drift'],
    'drift.exact_copy': ['exact-copy'], 'drift.semantic': ['semantic-drift'], secrets: ['secrets'], 'secrets.deterministic': ['secrets'] };
  return Object.fromEntries(Object.entries(effectiveStatus(active.policy).controls).map(([control, state]) => {
    const needed = names[control] || [];
    const runs = currentRuns.filter((run) => needed.includes(run.control));
    const passed = state === 'enabled' && needed.length > 0 && needed.every((name) => runs.some((run) => run.control === name && run.status === 'passed'));
    return [control, { status: state === 'disabled' ? 'disabled' : passed ? 'passed' : runs.some((run) => run.status === 'failed') ? 'failed' : 'pending',
      generation: active.generation, runs, protection: passed }];
  }));
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
    signer = verifyTrustRootApproval(opts.target, {
      identity: approval.approval.identity,
      namespace: 'rig-policy-activation',
      message: activationMessage(proposal),
      signature: approval.approval.signature,
    });
  } else if (method === 'host-native') {
    // No host ships an attestation this process can re-verify, and a receipt
    // loadActivePolicy cannot re-verify is not an activation. Refuse (AT-PRESENCE-1's
    // reported-unavailable state) instead of minting one only a test double accepts.
    throw new Error('activatePolicy: host-native approval is unavailable (no attestation Rig can re-verify); sign with the Gate 1 key');
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
  return withPolicyLock(target, () => {
  if (fs.existsSync(policyPath(target, '.rig/policy/transaction.json'))) throw new Error('policy_active_incomplete: recover the prior transaction before activating');
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
    target,
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
  const receiptAbs = policyPath(target, '.rig/policy/activation-receipt.json');
  const transaction = {
    candidate_bytes: candidateBytes.toString('base64'), receipt,
    prior_active: fs.existsSync(activeAbs) ? digest(fs.readFileSync(activeAbs)) : null,
    prior_receipt: fs.existsSync(receiptAbs) ? digest(fs.readFileSync(receiptAbs)) : null,
  };
  atomicWrite(target, '.rig/policy/transaction.json', JSON.stringify(transaction));
  atomicWrite(target, '.rig/policy/active.json', candidateBytes);
  atomicWrite(target, '.rig/policy/activation-receipt.json', `${JSON.stringify(receipt, null, 2)}\n`);
  fs.unlinkSync(policyPath(target, '.rig/policy/transaction.json'));
  syncDirectory(path.dirname(activeAbs));
  return { active: proposal.candidate, digest: expected, receipt };
  });
}

function recoverPolicyActivation(target) {
  return withPolicyLock(target, () => {
    const file = policyPath(target, '.rig/policy/transaction.json');
    if (!fs.existsSync(file)) return loadActivePolicy(target);
    const tx = JSON.parse(fs.readFileSync(file, 'utf8'));
    const bytes = Buffer.from(tx.candidate_bytes || '', 'base64');
    const parsed = parsePolicyBytes(bytes);
    const receipt = tx.receipt;
    if (!receipt?.proposal || digest(JSON.stringify(receipt.proposal)) !== receipt.proposal_digest ||
        receipt.proposal.candidate_digest !== parsed.digest || receipt.repository_id !== repositoryIdentity(target)) {
      throw new Error('policy recovery: corrupt transaction');
    }
    validatePolicyApproval({ schema_version: 1, kind: 'policy-approval', proposal_digest: receipt.proposal_digest,
      approval: receipt.approval, confirmed_disclosures: receipt.confirmed_disclosures },
    { ...receipt.proposal, digest: receipt.proposal_digest }, { target });
    const desiredReceipt = `${JSON.stringify(receipt, null, 2)}\n`;
    for (const [rel, prior, desired] of [
      ['.rig/policy/active.json', tx.prior_active, bytes],
      ['.rig/policy/activation-receipt.json', tx.prior_receipt, desiredReceipt],
    ]) {
      const abs = policyPath(target, rel);
      const current = fs.existsSync(abs) ? digest(fs.readFileSync(abs)) : null;
      if (current !== prior && current !== digest(desired)) throw new Error('policy recovery: newer or altered policy state; refusing overwrite');
    }
    atomicWrite(target, '.rig/policy/active.json', bytes);
    atomicWrite(target, '.rig/policy/activation-receipt.json', desiredReceipt);
    fs.unlinkSync(file); syncDirectory(path.dirname(file));
    return loadActivePolicy(target);
  }, { recover: true });
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
  if (Array.isArray(candidate)) throw new Error('validatePolicy: object required');
  if (candidate.schema_version !== undefined && candidate.schema_version !== 1) throw new Error('validatePolicy: unsupported schema_version');
  if (candidate.enabled !== undefined && typeof candidate.enabled !== 'boolean') throw new Error('validatePolicy: enabled must be boolean');
  for (const section of ['controls', 'enforcement']) {
    if (candidate[section] === undefined) continue;
    if (!candidate[section] || typeof candidate[section] !== 'object' || Array.isArray(candidate[section])) throw new Error(`validatePolicy: ${section} must be an object`);
    const known = new Set(['enabled', ...REQUIRED_POLICY_LEAVES.legacy[section], ...REQUIRED_POLICY_LEAVES.current[section]]);
    for (const [key, value] of Object.entries(candidate[section])) {
      if (!known.has(key) || typeof value !== 'boolean') throw new Error(`validatePolicy: invalid ${section}.${key}; known boolean leaf required`);
    }
  }
  if (candidate.allow !== undefined && (!Array.isArray(candidate.allow) || candidate.allow.some((entry) => typeof entry !== 'string' || !entry))) throw new Error('validatePolicy: allow must contain named categories');
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

function grantApproval(target, action, { proposal, approval } = {}) {
  const { verifyActionApproval, approvalStorage } = require('./enforcement');
  const grant = { proposal, authorization: approval };
  const id = verifyActionApproval(target, grant, action);
  const approvalPath = approvalStorage(target, `${id}.json`);
  fs.mkdirSync(path.dirname(approvalPath), { recursive: true });
  const fd = fs.openSync(approvalPath, 'wx', 0o600);
  try { fs.writeFileSync(fd, `${JSON.stringify(grant)}\n`); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  syncDirectory(path.dirname(approvalPath));
  return { approval: grant, path: approvalPath };
}

module.exports = {
  onboardingOrder,
  policyStatus,
  proposePolicy,
  activatePolicy,
  recoverPolicyActivation,
  validatePolicyApproval,
  effectiveStatus,
  transitionControl,
  validatePolicy,
  choosePresenceMethod,
  controlEnabled,
  loadActivePolicy,
  currentProtectionEvidence,
  NETWORK_CATEGORIES,
  activationMessage,
  verifySshsig,
  parsePolicyBytes,
  grantApproval,
};
