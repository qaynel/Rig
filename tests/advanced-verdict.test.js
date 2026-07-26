#!/usr/bin/env node
// Security verdict contract (impl-design §5.3, AT-B4, Slice 4).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  withRepo,
  seedMaliciousAgents,
  inspect,
  recommend,
  allowedReview,
  readJson,
  root,
} = require('./helpers/advanced');

function loadVerdict() {
  const inspectMod = require(path.join(root, 'rig', 'lib', 'inspect.js'));
  return (
    inspectMod.validateReview ||
    inspectMod.validateVerdict ||
    require(path.join(root, 'rig', 'lib', 'catalog.js')).validateReview
  );
}

test('verdict enum is exactly ALLOW / ALLOW_WITH_RESTRICTIONS / QUARANTINE / BLOCK', () => {
  const validate = loadVerdict();
  for (const verdict of [
    'ALLOW',
    'ALLOW_WITH_RESTRICTIONS',
    'QUARANTINE',
    'BLOCK',
  ]) {
    assert.doesNotThrow(() =>
      validate({
        schema_version: 1,
        harness_digest: 'abc',
        host: 'codex',
        verdict,
        findings: [],
        restrictions: verdict === 'ALLOW_WITH_RESTRICTIONS' ? [{ id: 'no-network-tools' }] : [],
        unverifiable: [],
        reviewer: { kind: 'host-agent', host: 'codex' },
      }),
    );
  }
  assert.throws(
    () =>
      validate({
        schema_version: 1,
        harness_digest: 'abc',
        host: 'codex',
        verdict: 'MAYBE',
        findings: [],
        restrictions: [],
        unverifiable: [],
        reviewer: { kind: 'host-agent', host: 'codex' },
      }),
    /verdict|invalid/i,
  );
});

test('uncertainty / unverifiable inputs fail closed to QUARANTINE', () => {
  const validate = loadVerdict();
  const result = validate({
    schema_version: 1,
    harness_digest: 'abc',
    host: 'codex',
    verdict: 'ALLOW',
    findings: [],
    restrictions: [{ id: 'free-form-unknown', note: 'not typed' }],
    unverifiable: ['could-not-confirm'],
    reviewer: { kind: 'host-agent', host: 'codex' },
  });
  const verdict = result?.verdict || result;
  assert.equal(verdict, 'QUARANTINE');
});

test('recommend refuses until review is accepted', () => {
  withRepo((target) => {
    seedMaliciousAgents(target);
    const inspected = inspect(target, { host: 'codex' });
    assert.equal(inspected.status, 0, inspected.stderr);
    const inspection = readJson(inspected.outPath);

    const missing = recommend(target, {
      review: path.join(target, 'no-such-review.json'),
    });
    assert.notEqual(missing.status, 0);

    const blocked = allowedReview(target, {
      verdict: 'BLOCK',
      harness_digest: inspection.harness_digest,
    });
    assert.notEqual(recommend(target, { review: blocked.reviewPath }).status, 0);

    const quarantined = allowedReview(target, {
      verdict: 'QUARANTINE',
      harness_digest: inspection.harness_digest,
      path: path.join(target, '.rig-test', 'q.json'),
    });
    assert.notEqual(recommend(target, { review: quarantined.reviewPath }).status, 0);
  });
});
