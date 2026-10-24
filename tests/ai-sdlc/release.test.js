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

test('PT-044 stale or failed health prevents eligibility', () => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const qaCommit = release.record(repo, { kind: 'qa-commit' }).commit;
  release.record(repo, { kind: 'health', status: 'pass', commit: 'some-older-commit' });

  const stale = release.eligible(repo, { commit: qaCommit });
  assert.equal(stale.eligible, false);
  assert.match(stale.reason, /health/i);

  release.record(repo, { kind: 'health', status: 'fail', commit: qaCommit });
  assert.equal(release.eligible(repo, { commit: qaCommit }).eligible, false, 'a failing health check is not eligibility');
});

test('PT-045 missing or stale install evidence prevents eligibility', () => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const qaCommit = release.record(repo, { kind: 'qa-commit' }).commit;
  release.record(repo, { kind: 'health', status: 'pass', commit: qaCommit });

  const missing = release.eligible(repo, { commit: qaCommit });
  assert.equal(missing.eligible, false);
  assert.match(missing.reason, /install/i);

  release.record(repo, { kind: 'clean-install', status: 'pass', commit: 'other-commit', source: 'real-download' });
  assert.equal(release.eligible(repo, { commit: qaCommit }).eligible, false, 'install evidence from another commit is stale');
});

test('PT-046 a readiness report alone cannot execute a protected action', () => {
  const repo = releaseRepo();
  const release = capability('release-evidence');
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'review', 'security']) {
    release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  }
  assert.equal(release.eligible(repo, { commit }).eligible, true, 'the readiness report may say ready');

  const attempt = release.publish(repo, { commit });
  assert.equal(attempt.published, false);
  assert.match(attempt.reason, /authoriz/i, 'readiness is not authorization');
  assert.equal(release.publish(repo, { commit, authorization: { signed_by: 'gate1-owner' } }).published, true);
});
