'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const release = require('../rig/catalog/baseline/release-evidence');

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-provenance-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const write = (rel, contents) => {
    const file = path.join(dir, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
    return file;
  };
  spawnSync('git', ['init', '-q'], { cwd: dir });
  spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/owner/repo.git'], { cwd: dir });
  write('app.js', 'module.exports = 1;\n');
  spawnSync('git', ['add', '.'], { cwd: dir });
  spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig@example.invalid', 'commit', '-qm', 'candidate'], { cwd: dir });
  return { dir, write };
}

function enrolledKey(t, dir) {
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-provenance-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'owner');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  fs.mkdirSync(path.join(dir, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.rig/trust/gate1.allowed-signers'), `owner ${fs.readFileSync(`${key}.pub`, 'utf8')}`);
  return key;
}

function signed(key, dir, message, namespace) {
  const file = path.join(dir, 'signing-message');
  fs.writeFileSync(file, message);
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', namespace, file]).status, 0);
  const signature = fs.readFileSync(`${file}.sig`, 'utf8');
  fs.rmSync(file);
  fs.rmSync(`${file}.sig`);
  return signature;
}

function freezeCandidate(dir) {
  spawnSync('git', ['add', '-A'], { cwd: dir });
  const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Rig Test', '-c', 'user.email=rig@example.invalid', 'commit', '--amend', '--no-edit', '-q'], { cwd: dir });
  assert.equal(result.status, 0, result.stderr?.toString() || 'candidate commit failed');
}

test('local worker completion needs one Gate 1 signature before release integration', (t) => {
  const { dir, write } = repo(t);
  const key = enrolledKey(t, dir);
  write('packages.json', JSON.stringify({ packages: [{ id: 'WP1', outcome: 'complete', owns: ['src/a.js'], requirements: ['R001'], exit: ['PT-001'] }] }));
  write('src/a.js', 'module.exports = 2;\n');
  freezeCandidate(dir);
  const digest = release.sourceDigest(dir);
  write('.rig/workers/state.json', JSON.stringify({ WP1: {
    status: 'accepted', candidate_digest: digest,
    evidence: [{ source: 'local-worker', status: 'pass', package: 'WP1', candidate_digest: digest }],
  } }));
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();

  const pending = release.prepareIntegrationBatch(dir, { commit, repository: 'owner/repo' });
  assert.throws(() => release.prepareIntegrationBatch(dir, { commit, repository: 'fork/repo' }), /origin/i);
  assert.equal(release.verifyIntegrationBatch(dir, { commit, repository: 'owner/repo', identity: 'owner', signature: 'forged' }).valid, false);
  assert.deepEqual(require('../rig/catalog/baseline/work-packages').audit(dir, { file: 'packages.json', approved: ['R001'] }).provisional, ['WP1']);
  const batch = { commit, repository: 'owner/repo', identity: 'owner', signature: signed(key, dir, pending.message, 'rig-integration') };
  assert.equal(release.storeIntegrationBatch(dir, batch).valid, true);
  assert.equal(release.integrationStatus(dir, { commit }).valid, true);
  assert.deepEqual(require('../rig/catalog/baseline/work-packages').audit(dir, { file: 'packages.json', approved: ['R001'] }).provisional, []);

  write('.rig/workers/state.json', JSON.stringify({ WP1: { status: 'accepted', candidate_digest: digest, evidence: [] } }));
  assert.equal(release.integrationStatus(dir, { commit }).valid, false, 'changed mutable evidence invalidates the signature');
});

test('an owner-signed zero-worker batch supports candidates that use no workers', (t) => {
  const { dir } = repo(t);
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  const batch = release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' });
  assert.equal(batch.worker_count, 0);
  assert.match(batch.worker_state_digest, /^[a-f0-9]{64}$/);
});

test('clean source check permits only the exact installed Gate 1 root projection', (t) => {
  const { dir, write } = repo(t);
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-trust-projection-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'fixture');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  const canonical = `test-owner ${fs.readFileSync(`${key}.pub`, 'utf8')}`;
  write('rig/corpus/trust/gate1.allowed-signers', canonical);
  freezeCandidate(dir);
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  const projection = path.join(dir, '.rig/trust/gate1.allowed-signers');
  fs.mkdirSync(path.dirname(projection), { recursive: true });
  fs.symlinkSync('../../rig/corpus/trust/gate1.allowed-signers', projection);
  const symlinkDigest = release.sourceDigest(dir);
  assert.ok(Object.hasOwn(release.sourceSnapshot(dir).files, '.rig/trust/gate1.allowed-signers'));
  assert.equal(release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' }).source_digest, symlinkDigest);

  fs.rmSync(projection);
  fs.writeFileSync(projection, canonical);
  assert.equal(release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' }).source_digest, release.sourceDigest(dir),
    'an exact regular-file projection is also bound into the snapshot');

  fs.writeFileSync(projection, `${canonical}forged\n`);
  assert.throws(() => release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' }), /committed/);
  fs.writeFileSync(projection, canonical);
  write('unrelated-untracked.js', 'not in Git HEAD\n');
  assert.throws(() => release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' }), /committed/);
});

test('external release check is fetched from fixed GitHub API and bound to exact workflow and SHA', async (t) => {
  const { dir } = repo(t);
  const commit = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  const savedFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = savedFetch; });
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: String(url), authorization: options.headers.Authorization });
    if (String(url).includes('/runs?')) return new Response(JSON.stringify({ workflow_runs: [
      { id: 42, workflow_id: 7, head_sha: commit, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'success' },
    ] }), { status: 200 });
    return new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  };
  const proof = await release.verifyExternalChecks(dir, { commit, repository: 'owner/repo', token: 'test-token' });
  assert.equal(proof.verified, true);
  assert.equal(proof.git_sha, commit);
  assert.match(proof.source_digest, /^sha256:[a-f0-9]{64}$/);
  assert.equal(requests.length, 2);
  assert.ok(requests.every((row) => row.url.startsWith('https://api.github.com/repos/owner/repo/')));
  assert.ok(requests.every((row) => row.authorization === 'Bearer test-token'));
  spawnSync('git', ['remote', 'set-url', 'origin', 'https://github.com/fork/repo.git'], { cwd: dir });
  await assert.rejects(release.verifyExternalChecks(dir, { commit, repository: 'owner/repo', token: 'test-token' }), /origin/i);
  spawnSync('git', ['remote', 'set-url', 'origin', 'https://github.com/owner/repo.git'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'app.js'), 'module.exports = 2;\n');
  await assert.rejects(release.verifyExternalChecks(dir, { commit, repository: 'owner/repo', token: 'test-token' }), /source bytes must be committed/);
});

test('real publication signature is required even when ordinary approval could be unsigned', async (t) => {
  const { dir, write } = repo(t);
  const key = enrolledKey(t, dir);
  freezeCandidate(dir);
  const digest = release.sourceDigest(dir);
  const workers = { WP1: { status: 'accepted', candidate_digest: digest,
    evidence: [{ source: 'local-worker', status: 'pass', package: 'WP1', candidate_digest: digest }] } };
  write('.rig/workers/state.json', JSON.stringify(workers));
  const gitSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).stdout.trim();
  release.record(dir, { kind: 'qa-commit' });
  for (const kind of ['security', 'independent-review', 'scenario-coherence', 'health', 'clean-install']) {
    release.record(dir, { kind, status: 'pass', source: kind === 'clean-install' ? 'real-download' : 'verified-ci' });
  }
  const integration = release.prepareIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo' });
  release.storeIntegrationBatch(dir, { commit: gitSha, repository: 'owner/repo', identity: 'owner', signature: signed(key, dir, integration.message, 'rig-integration') });

  const savedFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = savedFetch; });
  globalThis.fetch = async (url) => String(url).includes('/runs?')
    ? new Response(JSON.stringify({ workflow_runs: [
      { id: 42, workflow_id: 7, head_sha: gitSha, head_branch: 'qa-prod', head_repository: { full_name: 'owner/repo' }, event: 'workflow_dispatch', status: 'completed', conclusion: 'success' },
    ] }), { status: 200 })
    : new Response(JSON.stringify({ id: 7, path: '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
  const external_checks = await release.verifyExternalChecks(dir, { commit: gitSha, repository: 'owner/repo', token: 'test-token' });
  const commit = release.sourceDigest(dir);
  const authorization = { identity: 'owner', nonce: 'b'.repeat(32), expires_at: new Date(Date.now() + 60000).toISOString() };
  assert.equal((await release.publish(dir, { commit, authorization: { ...authorization, acknowledgement: 'typed-name' }, external_checks, token: 'test-token' })).published, false);
  authorization.signature = signed(key, dir, release.authorizationMessage(dir, { ...authorization, commit }), 'rig-release');
  assert.equal((await release.publish(dir, { commit, authorization, external_checks, token: 'test-token' })).published, true);
  assert.equal(release.integrationStatus(dir, { commit: gitSha }).valid, true,
    'the publish event itself does not invalidate the owner-signed input evidence batch');
});

