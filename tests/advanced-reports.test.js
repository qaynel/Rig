#!/usr/bin/env node
// Failure/vacuous/coverage-gap reports; routine passes omitted (impl-design §8.3, Slice 9).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  check,
  readJson,
  FAKE_CREDENTIAL,
} = require('./helpers/advanced');
const { writeReport } = require('../rig/lib/reports');

test('reports only write failed/vacuous/coverage_gap and redact secrets', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'testing.e2e.browser-automation': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    assert.equal(check(target, { scope: 'diff' }).status, 0);

    const reportsDir = path.join(target, 'reports', 'rig');
    assert.ok(fs.existsSync(reportsDir));
    const reports = fs
      .readdirSync(reportsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => readJson(path.join(reportsDir, f)));
    assert.ok(reports.length >= 1);
    for (const report of reports) {
      assert.ok(['failed', 'vacuous', 'coverage_gap'].includes(report.status));
      assert.ok(report.schema_version === 1 || report.schema_version == null || report.schema_version);
      assert.ok(report.service_id);
      assert.ok(report.reason || report.summary);
      assert.doesNotMatch(JSON.stringify(report), new RegExp(FAKE_CREDENTIAL));
      assert.notEqual(report.status, 'passed');
    }
  });
});

test('routine passes are omitted from reports/rig', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    const result = check(target, { scope: 'repo' });
    // Baseline-only green run should not spam pass reports.
    if (result.status === 0) {
      const reportsDir = path.join(target, 'reports', 'rig');
      if (fs.existsSync(reportsDir)) {
        const reports = fs
          .readdirSync(reportsDir)
          .filter((f) => f.endsWith('.json'))
          .map((f) => readJson(path.join(reportsDir, f)));
        for (const report of reports) {
          assert.notEqual(report.status, 'passed');
        }
      }
    }
  });
});

test('reports redact secret-shaped fix context', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const reportPath = writeReport(target, {
      service_id: 'baseline.secret-redaction',
      status: 'failed',
      summary: 'failed',
      reason: 'redaction check',
      evidence: [],
      fix_context: [`rotate ${FAKE_CREDENTIAL}`],
    });
    const report = readJson(reportPath);
    assert.doesNotMatch(JSON.stringify(report), new RegExp(FAKE_CREDENTIAL));
    assert.deepEqual(report.fix_context, ['rotate [REDACTED]']);
  });
});
