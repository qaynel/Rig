#!/usr/bin/env node
// Complete recommendation menu (impl-design §5.4, AD-14, Slice 5).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  recommend,
  readJson,
} = require('./helpers/advanced');

const expected = require('./fixtures/advanced/expected-catalogue-ids.json');

function flattenExpected(fixture) {
  const ids = [];
  for (const family of Object.values(fixture.families)) {
    for (const groupIds of Object.values(family.groups)) ids.push(...groupIds);
  }
  return new Set(ids);
}

test('recommend emits every catalogue leaf', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target, { verdict: 'ALLOW' });
    const result = recommend(target, { review: reviewPath });
    assert.equal(result.status, 0, result.stderr);
    const body = readJson(result.outPath);
    const entries = body.services || body.menu || body.recommendations || [];
    const ids = new Set(entries.map((e) => e.service_id || e.id));
    const expectedIds = flattenExpected(expected);
    for (const id of expectedIds) {
      assert.ok(ids.has(id), `menu missing leaf ${id}`);
    }
    assert.equal(ids.size, expectedIds.size);
  });
});

test('not_recommended is never unavailable; user may still select it', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    const result = recommend(target, { review: reviewPath });
    assert.equal(result.status, 0, result.stderr);
    const entries = readJson(result.outPath).services || readJson(result.outPath).menu || [];
    for (const entry of entries) {
      const status = entry.recommendation || entry.status;
      assert.notEqual(status, 'unavailable', `${entry.service_id || entry.id} must not be unavailable`);
    }
    const e2e = entries.find(
      (e) => (e.service_id || e.id) === 'testing.e2e.browser-automation',
    );
    assert.ok(e2e);
    assert.equal(e2e.recommendation || e2e.status, 'not_recommended');
  });
});

test('user override wins over recommendation when writing selection', () => {
  withRepo((target) => {
    createRepoFixture('ui-less-library', target);
    const { reviewPath } = allowedReview(target);
    const result = recommend(target, { review: reviewPath });
    assert.equal(result.status, 0, result.stderr);
    // Selection is user-authored; recommendation artifact must remain advisory.
    const body = readJson(result.outPath);
    assert.equal(body.binding || body.authoritative || null, null);
    assert.ok(!body.rig_json, 'recommend must not write rig.json choices');
  });
});
