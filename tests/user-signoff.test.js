'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const release = require('../rig/catalog/baseline/release-evidence');
const signoff = require('../rig/catalog/baseline/user-signoff');
const learning = require('../rig/catalog/baseline/learning');
const workers = require('../rig/catalog/baseline/workers');
const review = require('../rig/catalog/baseline/review-loop');
const onboarding = require('../rig/catalog/baseline/onboarding');

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-signoff-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'app.js'), 'module.exports = 1;\n');
  spawnSync('git', ['init', '-q'], { cwd: dir });
  spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/owner/repo.git'], { cwd: dir });
  spawnSync('git', ['add', '-A'], { cwd: dir });
  const created = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig@example.invalid', 'commit', '-qm', 'candidate'], { cwd: dir });
  assert.equal(created.status, 0, created.stderr?.toString());
  return dir;
}

function evidence(dir) {
  const commit = release.record(dir, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'security', 'independent-review', 'scenario-coherence', 'review']) {
    release.record(dir, { kind, status: 'pass', commit, source: 'real-download' });
  }
  return commit;
}

function freezeCandidate(dir) {
  spawnSync('git', ['add', '-A'], { cwd: dir });
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig@example.invalid', 'commit', '--amend', '--no-edit', '-qm', 'candidate'], { cwd: dir });
  assert.equal(result.status, 0, result.stderr?.toString());
}

function enroll(t, dir) {
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-signoff-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'owner');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  fs.mkdirSync(path.join(dir, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.rig/trust/gate1.allowed-signers'), `test-owner ${fs.readFileSync(`${key}.pub`, 'utf8')}`);
  spawnSync('git', ['add', '.rig/trust/gate1.allowed-signers'], { cwd: dir });
  const committed = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig@example.invalid', 'commit', '--amend', '--no-edit', '-qm', 'candidate'], { cwd: dir });
  assert.equal(committed.status, 0, committed.stderr?.toString());
  return key;
}

async function externallyVerified(t, dir, key, commit) {
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  const digest = release.sourceDigest(dir);
  fs.mkdirSync(path.join(dir, '.rig/workers'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.rig/workers/state.json'), JSON.stringify({ WP1: {
    status: 'accepted', candidate_digest: digest,
    evidence: [{ source: 'local-worker', status: 'pass', package: 'WP1', candidate_digest: digest }],
  } }));
  const batch = release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' });
  const integration = { commit: gitSha, repository: 'owner/repo', identity: 'test-owner', signature: sign(key, batch.message, 'rig-integration') };
  release.storeIntegrationBatch(dir, integration);
  const savedFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = savedFetch; });
  globalThis.fetch = async (url) => String(url).includes('/runs?')
    ? new Response(JSON.stringify({ workflow_runs: [
      { id: 42, workflow_id: 7, head_sha: gitSha, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'success' },
    ] }), { status: 200 })
    : new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  return release.verifyExternalChecks(dir, { commit: gitSha, repository: 'owner/repo', token: 'test-token' });
}

function sign(key, message, namespace) {
  const input = path.join(path.dirname(key), 'message');
  fs.writeFileSync(input, message);
  const signed = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', namespace, input], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  const signature = fs.readFileSync(`${input}.sig`, 'utf8');
  fs.rmSync(input, { force: true });
  fs.rmSync(`${input}.sig`, { force: true });
  return signature;
}

function releaseAuthorization(dir, key, commit) {
  const authorization = {
    identity: 'test-owner',
    nonce: 'a'.repeat(32),
    expires_at: new Date(Date.now() + 60000).toISOString(),
  };
  authorization.signature = sign(key, release.authorizationMessage(dir, { commit, ...authorization }), 'rig-release');
  return authorization;
}

test('sign-off is not selected silently and a missing choice is refused', (t) => {
  const dir = repo(t);
  assert.equal(signoff.current(dir), null);
  assert.throws(() => signoff.select(dir, { mode: 'acknowledgement' }), /explicit confirmation/);
  assert.throws(() => signoff.select(dir, { confirm: true }), /explicit choice/);
  assert.throws(() => signoff.select(dir, { confirm: true, mode: 'acknowledgement' }), /release integrity/);
  assert.equal(signoff.current(dir), null);
  const proposal = onboarding.propose(dir);
  assert.equal(proposal.signoff.configured, false);
  assert.equal(proposal.signoff.required, true);
  assert.equal(proposal.signoff.platform.offers_human_presence, false);
  assert.ok(proposal.signoff.platform.mechanisms.some((item) => item.id === 'sudo-or-password-prompt' && item.human_presence === 'not-guaranteed'));
});

test('acknowledgement and typed identity cannot publish production artifacts', async (t) => {
  const dir = repo(t);
  signoff.select(dir, { confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation' });
  const commit = evidence(dir);
  const named = await release.publish(dir, { commit, authorization: { signed_by: 'gate1-owner', owner_approved: true } });
  assert.equal(named.published, false);
  assert.equal(named.cryptographic_signature, false);
  const action = signoff.releaseAction(commit);
  const ack = signoff.acknowledge(dir, { action });
  const published = await release.publish(dir, { commit, authorization: { acknowledgement: ack.id } });
  assert.equal(published.published, false);
  assert.match(published.reason, /real signature.*Gate 1 trust root/i);
  assert.equal(fs.existsSync(path.join(dir, '.rig/release/published')), false);
  assert.equal((await release.publish(dir, { commit, authorization: { acknowledgement: 'deadbeef'.repeat(4) } })).published, false);
});

test('cryptographic mode rejects a typed name, a missing trust root, and a downgrade without a signature', async (t) => {
  const dir = repo(t);
  signoff.select(dir, { confirm: true, mode: 'cryptographic', key_protection: 'platform-prompt' });
  const open = evidence(dir);
  const unnamed = await release.publish(dir, { commit: open, authorization: { signed_by: 'gate1-owner' } });
  assert.equal(unnamed.published, false);
  assert.match(unnamed.reason, /typed name|signature/i);
  assert.equal(signoff.current(dir).mode, 'cryptographic');
  const fake = await release.publish(dir, {
    commit: open,
    authorization: { identity: 'test-owner', nonce: 'b'.repeat(32), expires_at: new Date(Date.now() + 60000).toISOString(), signature: 'nope' },
  });
  assert.equal(fake.published, false);
  assert.match(fake.reason, /Gate 1 trust root|real signature/i);
  assert.equal(signoff.current(dir).mode, 'cryptographic');
  assert.throws(
    () => signoff.change(dir, { mode: 'acknowledgement', release_integrity: 'self-attestation', authorization: { signed_by: 'agent', owner_approved: true } }),
    /refused/,
  );
  assert.equal(signoff.current(dir).mode, 'cryptographic');
});

test('a verified signature and external candidate evidence publish, and weakening the mode requires one', async (t) => {
  const dir = repo(t);
  const key = enroll(t, dir);
  const selectAction = { purpose: 'rig-signoff-select', mode: 'cryptographic', release_integrity: 'signature', key_protection: 'platform-prompt' };
  signoff.select(dir, { confirm: true, mode: 'cryptographic', key_protection: 'platform-prompt', authorization: { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, selectAction), 'rig-signoff') } });
  freezeCandidate(dir);
  const commit = evidence(dir);
  const external_checks = await externallyVerified(t, dir, key, commit);
  const realNow = Date.now;
  let offset = 20 * 60 * 1000;
  Date.now = () => realNow() + offset;
  let published;
  try {
    published = await release.publish(dir, { commit, authorization: releaseAuthorization(dir, key, commit), external_checks, token: 'test-token' });
  } finally { Date.now = realNow; }
  assert.equal(published.published, true, published.reason);
  assert.equal(published.cryptographic_signature, true);
  assert.equal(published.assurance.human_presence, 'designated-not-proven');
  assert.equal(published.assurance.signer_identity, 'verified');
  const bytes = fs.readFileSync(path.join(dir, published.artifact), 'utf8');
  assert.ok(!bytes.includes('test-owner') && !bytes.includes('SSH SIGNATURE'));
  offset = 22 * 60 * 1000;
  Date.now = () => realNow() + offset;
  try { assert.equal(release.validatePublished(dir, { artifact: published.artifact, health: 'pass' }).healthy, true,
    'the release signature remains verifiable after its authorization expires'); }
  finally { Date.now = realNow; }

  const action = { purpose: 'rig-signoff-change', from: 'cryptographic', to: 'acknowledgement', release_integrity: 'self-attestation', key_protection: 'unspecified' };
  const authorization = { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, action), 'rig-signoff') };
  const next = signoff.change(dir, { mode: 'acknowledgement', release_integrity: 'self-attestation', authorization });
  assert.equal(next.mode, 'acknowledgement');
  assert.match(next.ceiling, /forge|declaration/i);
  const audit = fs.readFileSync(path.join(dir, '.rig/signoff/audit.jsonl'), 'utf8');
  assert.match(audit, /"event":"change"/);
});

test('a sign-off change signature binds the requested key protection', (t) => {
  const dir = repo(t);
  const key = enroll(t, dir);
  const selectAction = { purpose: 'rig-signoff-select', mode: 'cryptographic', release_integrity: 'signature', key_protection: 'platform-prompt' };
  signoff.select(dir, { confirm: true, mode: 'cryptographic', key_protection: 'platform-prompt', authorization: { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, selectAction), 'rig-signoff') } });
  const action = {
    purpose: 'rig-signoff-change',
    from: 'cryptographic',
    to: 'cryptographic',
    release_integrity: 'signature',
    key_protection: 'security-key',
  };
  const authorization = { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, action), 'rig-signoff') };
  const next = signoff.change(dir, {
    mode: 'cryptographic',
    release_integrity: 'signature',
    key_protection: 'security-key',
    authorization,
  });
  assert.equal(next.key_protection, 'security-key');
});

test('select requires owner authorization when a trust root is enrolled', (t) => {
  const dir = repo(t);
  const key = enroll(t, dir);
  assert.throws(
    () => signoff.select(dir, { confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation' }),
    /trust root enrolled/,
  );
  assert.equal(signoff.current(dir), null);
  const action = { purpose: 'rig-signoff-select', mode: 'acknowledgement', release_integrity: 'self-attestation', key_protection: 'unspecified' };
  signoff.select(dir, {
    confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation',
    authorization: { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, action), 'rig-signoff') },
  });
  assert.equal(signoff.current(dir).mode, 'acknowledgement');
});

test('platform mode refuses approval without a verified adapter', async (t) => {
  const dir = repo(t);
  assert.throws(() => signoff.select(dir, { confirm: true, mode: 'platform', release_integrity: 'self-attestation' }), /Gate 1 trust root/);
  const key = enroll(t, dir);
  const selection = { purpose: 'rig-signoff-select', mode: 'platform', release_integrity: 'self-attestation', key_protection: 'unspecified' };
  signoff.select(dir, {
    confirm: true, mode: 'platform', release_integrity: 'self-attestation',
    authorization: { identity: 'test-owner', signature: sign(key, signoff.approvalMessage(dir, selection), 'rig-signoff') },
  });
  const commit = evidence(dir);
  const action = signoff.releaseAction(commit);
  assert.throws(() => signoff.authorizePlatform(dir, { action }), /unavailable/);
  const published = await release.publish(dir, { commit, authorization: { receipt: 'f'.repeat(32), human_presence: 'verified' } });
  assert.equal(published.published, false);
  assert.match(published.reason, /real signature.*Gate 1 trust root/i);
});

test('an unconfigured repository refuses typed-name publication', async (t) => {
  const dir = repo(t);
  const commit = evidence(dir);
  const published = await release.publish(dir, { commit, authorization: { signed_by: 'gate1-owner' } });
  assert.equal(published.published, false);
  assert.equal(published.cryptographic_signature, false);
  assert.match(published.reason, /real signature|authoriz/i);
});

test('declared learning history is not admitted, and a promoted check required execution', (t) => {
  const dir = repo(t);
  fs.mkdirSync(path.join(dir, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.rig/history.json'), JSON.stringify({
    findings: [{ id: 'a', class: 'null', where: 'a.js' }, { id: 'b', class: 'null', where: 'b.js' }],
    cases: [{ id: 'pos', fails_before: true }, { id: 'neg', fails_before: false }],
  }));
  const evaluation = learning.evaluate(dir, 'cand-null');
  assert.equal(evaluation.evidence_kind, 'synthetic-fixture');
  assert.equal(evaluation.admits_learning, false);
  assert.equal(evaluation.outcome, 'confounded');
  assert.match(evaluation.gap, /not execution evidence/);
  assert.equal(learning.promote(dir, 'cand-null', { full_gate: { passed: true }, evaluation }).promoted, false);
});

test('worker identity distinguishes exit, reuse and a still-live owner', async (t) => {
  assert.equal(workers.classifyOwner({ started_at: 'A' }, { alive: true, started_at: 'B' }), 'reused');
  assert.equal(workers.classifyOwner({ started_at: 'A' }, { alive: true, started_at: 'A' }), 'alive');
  assert.equal(workers.classifyOwner({ started_at: 'A' }, { alive: false, started_at: null }), 'exited');
  assert.equal(workers.classifyOwner({ started_at: null }, { alive: null, started_at: null }), 'unknown');

  const dir = repo(t);
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src/a.js'), 'original');
  const child = spawn(process.execPath, ['-e', "process.stdout.write('ready');setInterval(()=>{},1000);"]);
  t.after(() => { if (child.exitCode === null) child.kill(); });
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); });
  assert.equal(workers.reserve(dir, { package: 'old', owner_pid: child.pid, owns: ['src/a.js'], lease_seconds: 0 }).granted, true);
  const leases = JSON.parse(fs.readFileSync(path.join(dir, '.rig/workers/leases.json'), 'utf8'));
  const recorded = Object.values(leases)[0];
  if (process.platform === 'darwin' || process.platform === 'linux') assert.equal(typeof recorded.owner_started_at, 'string');
  const live = workers.reclaim(dir, { package: 'new', owns: ['src/a.js'], evidence: { owner_exited: true, no_pending_writes: true } });
  assert.equal(live.granted, false);
  child.kill();
  await new Promise((resolve) => child.once('close', resolve));
  const reclaimed = workers.reclaim(dir, { package: 'new', owns: ['src/a.js'], evidence: { owner_exited: true, no_pending_writes: true } });
  assert.equal(reclaimed.granted, true, reclaimed.reason);
  assert.ok(reclaimed.evidence_checked.owner_verdicts.includes('exited'));
});

test('review separation stays a different session unless a stronger provider rule is selected', (t) => {
  const dir = repo(t);
  fs.writeFileSync(path.join(dir, 'src.js'), 'module.exports = 1;\n');
  const round = review.prepare(dir, { round: 1, diff: 'note' });
  assert.equal(round.independence.level, 'session');
  assert.equal(round.independence.same_model, true);
  assert.equal(review.record(dir, { round: 1, verdict: 'fail', findings: [], reviewer: 'same-model-other-session' }).verdict, 'fail');
  fs.mkdirSync(path.join(dir, '.rig/review'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.rig/review/independence.json'), JSON.stringify({ level: 'provider' }));
  assert.throws(
    () => review.record(dir, { round: 2, verdict: 'pass', findings: [], reviewer: 'other', reviewer_provider: 'one', author_provider: 'one' }),
    /different provider/,
  );
  assert.equal(review.record(dir, {
    round: 2, verdict: 'pass', findings: [], reviewer: 'other', reviewer_provider: 'two', author_provider: 'one',
  }).verdict, 'pass');
});
