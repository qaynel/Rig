'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F20 — exact-commit receipt, a changed source byte, stale QA health, stale
// real-download install evidence and absent authorization.
function releaseRepo() {
  const repo = tempRepo('rig-release-');
  write(repo, 'src/app.js', 'exports.version = "6.0.0";\n');
  return repo;
}

test('PT-043 one code-byte change invalidates the receipt', () => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const receipt = release.record(repo, { kind: 'review', verdict: 'pass' });
  assert.equal(release.check(repo, receipt).valid, true);

  write(repo, 'src/app.js', 'exports.version = "6.0.1";\n');

  const after = release.check(repo, receipt);
  assert.equal(after.valid, false);
  assert.match(after.reason, /src\/app\.js|bytes|digest/i, 'the invalidation names the changed bytes');
});

test('PT-044 stale, failed or wrong-origin health cannot certify eligibility', async (t) => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const qaCommit = release.record(repo, { kind: 'qa-commit' }).commit;
  release.record(repo, { kind: 'health', status: 'pass', commit: 'some-older-commit' });

  const stale = release.eligible(repo, { commit: qaCommit });
  assert.equal(stale.eligible, false);
  assert.match(stale.reason, /health/i);

  release.record(repo, { kind: 'health', status: 'fail', commit: qaCommit });
  assert.equal(release.eligible(repo, { commit: qaCommit }).eligible, false, 'a failing health check is not eligibility');

  {
    const repo = releaseRepo();
    const release = capability('release-evidence');
    const { spawnSync } = require('./_harness');
    spawnSync('git', ['remote', 'add', 'origin', 'https://github.com/owner/repo.git'], { cwd: repo });
    spawnSync('git', ['add', '-A'], { cwd: repo });
    assert.equal(spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'candidate'], { cwd: repo }).status, 0);
    const commit = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).stdout.trim();
    let scenario = '';
    const savedFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = savedFetch; });
    globalThis.fetch = async (url) => {
      if (String(url).includes('/runs?')) {
        const run = { id: 42, workflow_id: 7, head_sha: commit, head_branch: 'qa-prod',
          head_repository: { full_name: scenario === 'repository' ? 'fork/repo' : 'owner/repo' },
          event: 'workflow_dispatch', status: 'completed', conclusion: scenario === 'failure' ? 'failure' : 'success' };
        if (scenario === 'sha') run.head_sha = 'f'.repeat(40);
        return new Response(JSON.stringify({ workflow_runs: [run] }), { status: 200 });
      }
      return new Response(JSON.stringify({ id: 7, path: scenario === 'workflow' ? '.github/workflows/other.yml'
        : '.github/workflows/release-eligibility.yml', state: 'active' }), { status: 200 });
    };
    for (scenario of ['repository', 'workflow', 'sha', 'failure']) {
      await assert.rejects(release.verifyExternalChecks(repo, { commit, repository: 'owner/repo', token: 'offline-fixture-token' }));
    }
  }
});

test('PT-045 missing or stale install evidence prevents eligibility and cloned external proof is refused', async (t) => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const qaCommit = release.record(repo, { kind: 'qa-commit' }).commit;
  release.record(repo, { kind: 'health', status: 'pass', commit: qaCommit });

  const missing = release.eligible(repo, { commit: qaCommit });
  assert.equal(missing.eligible, false);
  assert.match(missing.reason, /install/i);

  release.record(repo, { kind: 'clean-install', status: 'pass', commit: 'other-commit', source: 'real-download' });
  assert.equal(release.eligible(repo, { commit: qaCommit }).eligible, false, 'install evidence from another commit is stale');

  const local = release.record(repo, { kind: 'clean-install', status: 'pass', commit: qaCommit, source: 'real-download' });
  assert.equal(release.eligible(repo, { commit: qaCommit }).eligible, true, 'locally recorded feature QA can continue');
  const ready = release.eligible(repo, { commit: qaCommit });
  assert.equal(ready.evidence_assurance, 'provisional');
  assert.equal(ready.production_certified, false, 'mutable local rows never claim production certification');
  assert.ok(local);

  const candidate = releaseRepo();
  const certified = await require('./_harness').signedCertifiedCandidate(candidate, release, [
    'health', 'clean-install', 'security', 'independent-review', 'scenario-coherence',
  ], t);
  const counterfeit = { ...certified.external_checks };
  const refused = await release.publish(candidate, { commit: certified.commit, authorization: certified.authorization,
    external_checks: counterfeit, token: certified.token });
  assert.equal(refused.published, false, 'copying caller-visible fields does not copy authenticated API provenance');
  assert.match(refused.reason, /freshly verified GitHub release checks/i);
});

test('PT-046 local readiness and unsigned modes cannot publish, while a signed certified candidate can', async (t) => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'security', 'independent-review', 'scenario-coherence']) {
    release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  }
  assert.equal(release.eligible(repo, { commit }).eligible, true, 'the readiness report may say ready');
  assert.equal(release.eligible(repo, { commit }).evidence_assurance, 'provisional');
  assert.equal(release.publicReadiness(repo, { commit }).production_certified, false);

  const attempt = await release.publish(repo, { commit });
  assert.equal(attempt.published, false);
  assert.match(attempt.reason, /authoriz/i, 'readiness is not authorization');
  const named = await release.publish(repo, { commit, authorization: { signed_by: 'gate1-owner' } });
  assert.equal(named.published, false, 'a typed name is not a signature and is not a selected mode');
  assert.equal(named.cryptographic_signature, false);

  const signoff = capability('user-signoff');
  signoff.select(repo, { confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation' });
  const chosen = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'security', 'independent-review', 'scenario-coherence']) {
    release.record(repo, { kind, status: 'pass', commit: chosen, source: 'real-download' });
  }
  const forged = await release.publish(repo, { commit: chosen, authorization: { signed_by: 'gate1-owner', owner_approved: true } });
  assert.equal(forged.published, false, 'agent-supplied flags do not satisfy acknowledgement');
  const ack = signoff.acknowledge(repo, { action: signoff.releaseAction(chosen) });
  const declared = await release.publish(repo, { commit: chosen, authorization: { acknowledgement: ack.id } });
  assert.equal(declared.published, false, 'acknowledgement cannot create a production artifact');
  assert.match(declared.reason, /real signature.*Gate 1 trust root/i);

  const certifiedRepo = releaseRepo();
  const certified = await require('./_harness').signedCertifiedCandidate(certifiedRepo, release, [
    'health', 'clean-install', 'security', 'independent-review', 'scenario-coherence',
  ], t);
  const signed = await release.publish(certifiedRepo, { commit: certified.commit, authorization: certified.authorization,
    external_checks: certified.external_checks, token: certified.token });
  assert.equal(signed.published, true, signed.reason);
  assert.equal(signed.production_certified, true);
  assert.match(signed.evidence_assurance, /verified-external.*signed-integration.*release-signature/);
});
