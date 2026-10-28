'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F29 — a public release candidate missing each evidence class in turn, then
// the exact published archive with a health failure.
const CLASSES = ['security', 'independent-review', 'scenario-coherence', 'health', 'clean-install'];

test('PT-071 candidate is blocked if any required evidence class is absent', () => {
  const release = capability('release-evidence');

  for (const omitted of CLASSES) {
    const repo = tempRepo('rig-public-');
    write(repo, 'src/app.js', 'exports.version = "1.0.0";\n');
    const commit = release.record(repo, { kind: 'qa-commit' }).commit;
    for (const kind of CLASSES.filter((c) => c !== omitted)) {
      release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
    }
    const verdict = release.publicReadiness(repo, { commit });
    assert.equal(verdict.ready, false, `missing ${omitted} must block the candidate`);
    assert.match(verdict.reason, new RegExp(omitted.replace('-', '.?'), 'i'));
  }
});

test('PT-072 signed certified publication records post-release failure and recovery policy', async (t) => {
  const repo = tempRepo('rig-post-release-');
  write(repo, 'src/app.js', 'exports.version = "1.0.0";\n');
  const release = capability('release-evidence');
  const candidate = await require('./_harness').signedCertifiedCandidate(repo, release, CLASSES, t);
  const published = await release.publish(repo, { commit: candidate.commit, authorization: candidate.authorization,
    external_checks: candidate.external_checks, token: candidate.token });
  assert.equal(published.published, true, published.reason);
  assert.equal(published.assurance.cryptographic_signature, true);
  assert.equal(published.production_certified, true);

  const validation = release.validatePublished(repo, { artifact: published.artifact, health: 'fail' });

  assert.equal(validation.healthy, false);
  assert.equal(validation.artifact_digest, published.artifact_digest, 'validation binds to the published bytes');
  assert.ok(validation.recorded_at, 'the failure is recorded, not discarded');
  assert.match(validation.action, /rollback|recover/i);
  assert.ok(release.incidents(repo).some((i) => i.artifact === published.artifact), 'the incident is retrievable afterwards');
});
