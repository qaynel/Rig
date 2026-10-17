'use strict';

// The change-management sequence is enforced, not just documented: a stale
// receipt, a dirty tree or a missing changelog entry each block the release,
// and a blocked step stops the ones after it from being reached.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { steps } = require('../scripts/check-deployment-gate');
const { implementationDigest } = require('../rig/lib/release-evidence');

const FREEZE = 0;
const RECEIPT = 3;
const CHANGELOG = 4;

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-deploy-gate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'x', version: '6.0.0' }));
  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), '# Changelog\n\n## [6.0.0]\n\n- shipped\n');
  for (const args of [['init', '-q'], ['add', '-A'], ['-c', 'user.email=t@t', '-c', 'user.name=t', '-c', 'core.hooksPath=', 'commit', '-qm', 'base', '--no-verify']]) {
    const run = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
  }
  return root;
}

// The receipt lives outside the tree it binds, because the implementation
// digest hashes every publishable file: a receipt written inside the repository
// would change the bytes it claims to describe.
function receiptFor(root, overrides = {}) {
  const receipt = {
    schema_version: 2,
    kind: 'report-only',
    author_context: 'author-1',
    reviewer_context: 'reviewer-1',
    implementation_digest: implementationDigest(root).digest,
    implementation_files: implementationDigest(root).files,
    implementation_base: 'origin/qa-prod',
    verdict: 'pass',
    verdicts: [{ id: 'AT-X-1', verdict: 'pass' }],
    findings: [],
    unresolved: [],
    ...overrides,
  };
  const at = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'rig-deploy-receipt-')), 'receipt.json');
  fs.writeFileSync(at, JSON.stringify(receipt));
  return at;
}

const run = (root, receipt, index) => steps(root, receipt)[index][1]();

test('a receipt from different bytes is rejected as stale', (t) => {
  const root = fixture(t);
  const receipt = receiptFor(root, { implementation_digest: 'f'.repeat(64), implementation_files: 2 });
  assert.match(run(root, receipt, RECEIPT), /stale/);
});

test('a receipt bound to the current bytes meets the step', (t) => {
  const root = fixture(t);
  assert.equal(run(root, receiptFor(root), RECEIPT), null);
});

test('a failing review verdict is rejected even when the digest matches', (t) => {
  const root = fixture(t);
  const receipt = receiptFor(root, { verdict: 'fail' });
  assert.match(run(root, receipt, RECEIPT), /rejected/);
});

test('an uncommitted file blocks the candidate freeze and names it', (t) => {
  const root = fixture(t);
  const receipt = receiptFor(root);
  assert.equal(run(root, receipt, FREEZE), null);
  fs.writeFileSync(path.join(root, 'stray.txt'), 'x\n');
  assert.match(run(root, receipt, FREEZE), /stray\.txt/);
});

test('the changelog must name the version in package.json', (t) => {
  const root = fixture(t);
  const receipt = receiptFor(root);
  assert.equal(run(root, receipt, CHANGELOG), null);
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'x', version: '6.1.0' }));
  assert.match(run(root, receipt, CHANGELOG), /no "## \[6\.1\.0\]" entry/);
});

test('the gate step refuses to pass without a receipt binding it to these bytes', (t) => {
  const root = fixture(t);
  assert.match(steps(root, null)[2][1](), /nothing binds the gate run/);
});
