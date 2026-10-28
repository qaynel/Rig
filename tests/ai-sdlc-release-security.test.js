'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const release = require('../rig/catalog/baseline/release-evidence');
const signoff = require('../rig/catalog/baseline/user-signoff');

function signMessage(key, message, namespace) {
  const tmp = key + '.msg';
  fs.writeFileSync(tmp, message);
  const r = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', namespace, tmp], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const sig = fs.readFileSync(tmp + '.sig', 'utf8');
  fs.rmSync(tmp, { force: true });
  fs.rmSync(tmp + '.sig', { force: true });
  return sig;
}

function fixture(t, mode) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-security-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  fs.writeFileSync(path.join(repo, 'app.js'), 'module.exports = 1;\n');
  spawnSync('git', ['init', '-q'], { cwd: repo });
  spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/owner/repo.git'], { cwd: repo });
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-test-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'test');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  fs.mkdirSync(path.join(repo, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.rig/trust/gate1.allowed-signers'), `test-owner ${fs.readFileSync(key + '.pub', 'utf8')}`);
  spawnSync('git', ['add', '-A'], { cwd: repo });
  const created = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Release Test', '-c', 'user.email=release@example.invalid', 'commit', '-qm', 'candidate'], { cwd: repo });
  assert.equal(created.status, 0, created.stderr?.toString());
  if (mode) {
    const action = { purpose: 'rig-signoff-select', mode, release_integrity: 'self-attestation', key_protection: 'unspecified' };
    const authorization = { identity: 'test-owner', signature: signMessage(key, signoff.approvalMessage(repo, action), 'rig-signoff') };
    signoff.select(repo, { confirm: true, mode, release_integrity: 'self-attestation', authorization });
  }
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['full-gate', 'security', 'independent-review', 'scenario-coherence', 'health', 'clean-install']) {
    release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  }
  return { repo, key, keys, commit };
}

function integration(f, t) {
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: f.repo, encoding: 'utf8' }).stdout.trim();
  const state = { WP01: { status: 'accepted', candidate_digest: f.commit,
    evidence: [{ source: 'local-worker', status: 'pass', package: 'WP01', candidate_digest: f.commit }] } };
  const stateFile = path.join(f.repo, '.rig/workers/state.json');
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(state));
  const batch = release.prepareIntegrationBatch(f.repo, { commit: gitSha, repository: 'owner/repo' });
  release.storeIntegrationBatch(f.repo, { commit: gitSha, repository: 'owner/repo', identity: 'test-owner', signature: signMessage(f.key, batch.message, 'rig-integration') });
  const savedFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = savedFetch; });
  globalThis.fetch = async (url) => String(url).includes('/runs?')
    ? new Response(JSON.stringify({ workflow_runs: [
      { id: 42, workflow_id: 7, head_sha: gitSha, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'success' },
    ] }), { status: 200 })
    : new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  return release.verifyExternalChecks(f.repo, { commit: gitSha, repository: 'owner/repo', token: 'test-token' });
}

function signed(f, fields = {}) {
  const authorization = { identity: 'test-owner', nonce: 'a'.repeat(32), expires_at: new Date(Date.now() + 60000).toISOString(), ...fields };
  const message = release.authorizationMessage(f.repo, { commit: f.commit, ...authorization });
  const input = path.join(f.keys, 'message');
  fs.writeFileSync(input, message);
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', f.key, '-n', 'rig-release', input]).status, 0);
  authorization.signature = fs.readFileSync(input + '.sig', 'utf8');
  fs.rmSync(input + '.sig');
  return authorization;
}

test('publication rejects typed identity and only writes after exact external and signed evidence', async (t) => {
  const f = fixture(t);
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization: { signed_by: 'gate1-owner', secret: 'do-not-persist' } })).published, false);
  const external_checks = await integration(f, t);
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: f.repo, encoding: 'utf8' }).stdout.trim();
  const authorization = { ...signed(f, { expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() }), secret: 'do-not-persist' };
  const successfulFetch = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).includes('/runs?')
    ? new Response(JSON.stringify({ workflow_runs: [
      { id: 43, workflow_id: 7, head_sha: gitSha, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'failure' },
    ] }), { status: 200 })
    : new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  try {
    const stale = await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' });
    assert.equal(stale.published, false);
    assert.match(stale.reason, /latest exact-SHA GitHub/);
  } finally { globalThis.fetch = successfulFetch; }
  const result = await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' });
  assert.equal(result.published, true, result.reason);
  const bytes = fs.readFileSync(path.join(f.repo, result.artifact), 'utf8');
  assert.ok(!bytes.includes('test-owner') && !bytes.includes('SSH SIGNATURE') && !bytes.includes('do-not-persist'));
  assert.equal(release.validatePublished(f.repo, { artifact: result.artifact, health: 'pass' }).healthy, true);
  const forgedBytes = Buffer.from(`${bytes.toString('utf8').trim()} `);
  fs.writeFileSync(path.join(f.repo, result.artifact), forgedBytes);
  fs.appendFileSync(path.join(f.repo, '.rig/release/evidence.jsonl'), `${JSON.stringify({
    kind: 'publish', status: 'pass', commit: f.commit, artifact: result.artifact,
    artifact_digest: `sha256:${require('node:crypto').createHash('sha256').update(forgedBytes).digest('hex')}`,
  })}\n`);
  assert.equal(release.validatePublished(f.repo, { artifact: result.artifact, health: 'pass' }).healthy, false,
    'a forged publish row and matching artifact hash do not replace the signed artifact proof');
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' })).published, false, 'approval cannot publish twice');
});

test('approval binds the candidate, identity, namespace and expiration', async (t) => {
  const f = fixture(t);
  const authorization = signed(f);
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, identity: 'attacker' } })).published, false);
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, nonce: 'b'.repeat(32) } })).published, false);
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization: { ...authorization, expires_at: '2000-01-01T00:00:00.000Z' } })).published, false);
});

test('authorization that expires during the latest-workflow recheck cannot write publication files', async (t) => {
  const f = fixture(t);
  const external_checks = await integration(f, t);
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: f.repo, encoding: 'utf8' }).stdout.trim();
  const authorization = signed(f, { expires_at: new Date(Date.now() + 30_000).toISOString() });
  let offset = 0;
  const realNow = Date.now;
  Date.now = () => realNow() + offset;
  globalThis.fetch = async (url) => {
    if (String(url).includes('/runs?')) {
      offset = 60_000;
      return new Response(JSON.stringify({ workflow_runs: [
        { id: 43, workflow_id: 7, head_sha: gitSha, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'success' },
      ] }), { status: 200 });
    }
    return new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  };
  let result;
  try { result = await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' }); }
  finally { Date.now = realNow; }
  assert.equal(result.published, false);
  assert.match(result.reason, /expired|evidence changed/i);
  const artifact = path.join(f.repo, '.rig/release/published', `${f.commit.slice('sha256:'.length)}.json`);
  const proof = artifact.replace(/\.json$/, '.proof.json');
  assert.equal(fs.existsSync(artifact), false);
  assert.equal(fs.existsSync(proof), false);
});

test('protected installed bytes invalidate evidence while mutable memory does not', async (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, '.rig/memory'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.rig/memory/records.json'), '{"records":[]}');
  assert.equal(release.sourceDigest(f.repo), f.commit);
  fs.mkdirSync(path.join(f.repo, '.rig/oracle'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.rig/oracle/contract.json'), '{"changed":true}');
  assert.notEqual(release.sourceDigest(f.repo), f.commit);
  assert.equal((await release.publish(f.repo, { commit: '../escape', authorization: { signed_by: 'owner' } })).published, false);
});

test('failed current evidence and missing public evidence prevent publication', async (t) => {
  const f = fixture(t);
  const external_checks = await integration(f, t);
  const authorization = signed(f);
  release.record(f.repo, { kind: 'security', status: 'fail', commit: f.commit });
  assert.equal((await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' })).published, false);
});

test('acknowledgement publication requires public security and review evidence', async (t) => {
  const f = fixture(t, 'acknowledgement');
  for (const kind of ['security', 'independent-review', 'scenario-coherence']) {
    release.record(f.repo, { kind, status: 'fail', commit: f.commit });
  }
  const authorization = { acknowledgement: signoff.acknowledge(f.repo, { action: signoff.releaseAction(f.commit) }).id };
  const result = await release.publish(f.repo, { commit: f.commit, authorization });
  assert.equal(result.published, false);
  assert.match(result.reason, /real signature.*Gate 1 trust root/i);
});

test('labels from another candidate cannot be relabelled as passing evidence', (t) => {
  const f = fixture(t);
  const original = fs.readFileSync(path.join(f.repo, 'app.js'));
  fs.writeFileSync(path.join(f.repo, 'app.js'), 'different candidate');
  for (const kind of ['qa-commit', 'full-gate', 'health', 'clean-install', 'independent-review', 'security', 'scenario-coherence']) {
    release.record(f.repo, { kind, status: 'pass', commit: f.commit, source: 'real-download' });
  }
  fs.writeFileSync(path.join(f.repo, 'app.js'), original);
  assert.equal(release.eligible(f.repo, { commit: f.commit }).eligible, false);
  assert.equal(release.publicReadiness(f.repo, { commit: f.commit }).ready, false);
});

test('publication refuses a source change between approval and artifact write', async (t) => {
  const f = fixture(t);
  const external_checks = await integration(f, t);
  const authorization = signed(f);
  fs.writeFileSync(path.join(f.repo, 'app.js'), 'changed after approval');
  const result = await release.publish(f.repo, { commit: f.commit, authorization, external_checks, token: 'test-token' });
  assert.equal(result.published, false);
  assert.match(result.reason, /changed/i);
});
