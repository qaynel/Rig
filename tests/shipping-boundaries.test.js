#!/usr/bin/env node
'use strict';

// Finding 9 (2026-10-20 binding review): the install, report and receipt
// contracts exercised at their real shipping boundaries, in editable tests.
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { root, readJson, withRepo, allowedReview, writeSelection, plan, apply, createRepoFixture, writePlanApproval } = require('./helpers/advanced');
const { policyStatus } = require('../rig/lib/policy');
const { writeReport } = require('../rig/lib/reports');
const { validateReviewReceipt } = require('../rig/lib/release-evidence');
const { PROVIDERS, renderPipeline } = require('../rig/lib/ci-adapters');

test('AT-INSTALL-1 (finding 9): an interrupted apply withholds every protection claim until the public resume completes it', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const unrelated = path.join(target, 'notes.txt');
    fs.writeFileSync(unrelated, 'user data\n');
    const { reviewPath } = allowedReview(target, { host: 'codex' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const approvalPath = writePlanApproval(target, planned.outPath);

    const receipt = path.join(target, '.rig', 'catalog-receipt.json');
    fs.mkdirSync(receipt, { recursive: true }); // a real write failure at the last write boundary
    const interrupted = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(interrupted.status, 0);
    assert.doesNotMatch(interrupted.stdout, /installed|protected/i, 'a failed apply must not print a success claim');

    const status = policyStatus(target);
    assert.equal(status.install.complete, false);
    assert.equal(status.protection, 'withheld');
    assert.ok(Object.values(status.surfaces).every((surface) => surface.state === 'withheld_install_incomplete'), 'no surface claims protection');
    const reportFile = writeReport(target, { status: 'failed', service_id: 'x.y.z', summary: 's', reason: 'r' });
    assert.deepEqual(
      [readJson(reportFile).install, readJson(reportFile).protection],
      ['incomplete', 'withheld'],
      'run reports disclose the incomplete install instead of implying protection',
    );

    fs.rmSync(receipt, { recursive: true, force: true });
    const resumed = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(resumed.status, 0, resumed.stderr);
    const done = policyStatus(target);
    assert.equal(done.install.complete, true);
    assert.equal(done.protection, 'per_surface');
    assert.equal(done.surfaces.git_pre_commit.state, 'integrated');
    assert.equal(fs.readFileSync(unrelated, 'utf8'), 'user data\n', 'unrelated user data is untouched');
    assert.ok(fs.existsSync(receipt) && fs.statSync(receipt).isFile(), 'final receipt exists only after recovery');
  });
});

test('AT-REPORT-1 (finding 9): no supported CI provider uploads local reports, and reports are never tracked', () => {
  assert.equal(Object.keys(PROVIDERS).length, 6);
  for (const provider of Object.keys(PROVIDERS)) {
    const pipeline = renderPipeline(provider, { services: [], controls: [] });
    assert.doesNotMatch(pipeline, /upload-artifact|store_artifacts|archiveArtifacts|publishPipelineArtifact|PublishBuildArtifacts|artifacts:|reports\/rig/, `${provider} pipeline must not upload local reports`);
  }
  withRepo((target) => {
    const file = writeReport(target, { status: 'failed', service_id: 'x.y.z', summary: 's', reason: 'r' });
    const rel = path.relative(target, file);
    execFileSync('git', ['add', '-A'], { cwd: target });
    const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { cwd: target, encoding: 'utf8' });
    assert.doesNotMatch(staged, /reports\/rig/, `${rel} must not be staged by a blanket add`);
  });
});

test('AT-REPORT-1 (finding 9): a failing CI command with seeded detail keeps that detail out of the disclosed output', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-ci-leak-'));
  try {
    for (const name of ['check.js', 'check-copies.js']) {
      fs.mkdirSync(path.join(dir, '.rig', 'bin'), { recursive: true });
      fs.copyFileSync(path.join(root, 'rig', 'catalog', 'baseline', name), path.join(dir, '.rig', 'bin', name));
    }
    fs.mkdirSync(path.join(dir, '.rig', 'lib'), { recursive: true });
    for (const name of ['spawn-guarded', 'path-safety', 'check-runner', 'memory-guarded-exec']) {
      fs.copyFileSync(path.join(root, 'rig', 'lib', `${name}.js`), path.join(dir, '.rig', 'lib', `${name}.js`));
    }
    const seeded = ['ghp_', 'seededDetail1234567890abcdefghijklmnop'].join('');
    fs.writeFileSync(path.join(dir, '.rig', 'service-bindings.json'), JSON.stringify({
      'seeded-failure-service': { repo: [process.execPath, '-e', `console.error(${JSON.stringify(seeded)}); process.exit(1)`] },
    }));
    const env = { ...process.env, GITHUB_ACTIONS: 'true', CI: 'true' };
    const run = spawnSync(process.execPath, [path.join(dir, '.rig', 'bin', 'check.js'), '--scope', 'repo'], { cwd: dir, encoding: 'utf8', env });
    assert.notEqual(run.status, 0, 'the seeded command fails the CI check');
    assert.doesNotMatch(`${run.stdout}${run.stderr}`, new RegExp(seeded), 'secret detail never reaches the CI log');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('AT-GATE-3 (finding 9): the receipt contract binds spec, catalogue, implementation, base, and fresh context', () => {
  const expected = {
    technical_spec_digest: 'a'.repeat(64),
    catalogue_digest: 'b'.repeat(64),
    implementation_digest: 'c'.repeat(64),
    implementation_base: 'origin/prod',
    acceptance_ids: ['AT-A-1', 'AT-A-2'],
  };
  const receipt = {
    schema_version: 2,
    kind: 'report-only',
    author_context: 'author-1',
    reviewer_context: 'reviewer-1',
    technical_spec_digest: expected.technical_spec_digest,
    catalogue_digest: expected.catalogue_digest,
    implementation_digest: expected.implementation_digest,
    implementation_base: expected.implementation_base,
    verdict: 'pass',
    verdicts: expected.acceptance_ids.map((id) => ({ id, verdict: 'pass' })),
    findings: [],
    unresolved: [],
  };
  assert.equal(validateReviewReceipt(receipt, expected), true, 'one complete current receipt is accepted');
  const refused = {
    'same context': [{ reviewer_context: 'author-1' }, /fresh/],
    'stale spec': [{ technical_spec_digest: 'f'.repeat(64) }, /technical_spec_digest/],
    'stale catalogue': [{ catalogue_digest: 'f'.repeat(64) }, /catalogue_digest/],
    'stale implementation': [{ implementation_digest: 'f'.repeat(64) }, /implementation_digest/],
    'stale base': [{ implementation_base: 'origin/other' }, /implementation_base/],
    'missing verdict': [{ verdicts: receipt.verdicts.slice(1) }, /missing/],
    'extra verdict': [{ verdicts: [...receipt.verdicts, { id: 'AT-X', verdict: 'pass' }] }, /extra/],
    'duplicate verdict': [{ verdicts: [receipt.verdicts[0], receipt.verdicts[0]] }, /duplicate/],
    'failing verdict': [{ verdicts: [receipt.verdicts[0], { id: 'AT-A-2', verdict: 'fail' }] }, /must pass/],
    'unresolved case': [{ unresolved: ['AT-A-2'] }, /unresolved/],
  };
  for (const [label, [change, pattern]] of Object.entries(refused)) {
    assert.throws(() => validateReviewReceipt({ ...receipt, ...change }, expected), pattern, label);
  }
});
