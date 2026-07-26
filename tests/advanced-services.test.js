#!/usr/bin/env node
// Full catalogue pack coverage (impl-design Slice 10). Kept RED until all
// service fragments are authored.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { root, readJson } = require('./helpers/advanced');

const expected = require('./fixtures/advanced/expected-catalogue-ids.json');

function flattenExpected(fixture) {
  const ids = [];
  for (const family of Object.values(fixture.families)) {
    for (const groupIds of Object.values(family.groups)) ids.push(...groupIds);
  }
  return ids.sort();
}

test('every frozen leaf has identity + cumulative grade fragments on disk', () => {
  const catalogPath = path.join(root, 'rig', 'catalog.json');
  assert.ok(fs.existsSync(catalogPath), 'rig/catalog.json must exist');
  const catalog = readJson(catalogPath);
  const byId = Object.fromEntries(
    (catalog.services || catalog.entries || []).map((s) => [s.id, s]),
  );

  for (const id of flattenExpected(expected)) {
    const service = byId[id];
    assert.ok(service, `missing catalogue entry ${id}`);
    const fragments = service.fragments || {};
    for (const grade of ['identity', 'minimal', 'mid', 'maximal']) {
      const rel = fragments[grade];
      assert.ok(rel, `${id} missing ${grade} fragment ref`);
      const abs = path.isAbsolute(rel) ? rel : path.join(root, 'rig', rel);
      assert.ok(fs.existsSync(abs), `${id} missing fragment file ${rel}`);
      const body = fs.readFileSync(abs, 'utf8').trim();
      assert.ok(body.length > 0, `${id} ${grade} fragment must be non-empty`);
    }
    assert.ok((service.checks?.minimal || []).length >= 1, `${id} needs minimal checks`);
    assert.ok(Array.isArray(service.owns) && service.owns.length >= 1, `${id} needs owns[]`);
  }
});

test('Development / Testing / Infrastructure / Product-Security pack counts', () => {
  const ids = flattenExpected(expected);
  const count = (prefix) => ids.filter((id) => id.startsWith(prefix)).length;
  assert.ok(count('development.') >= 20);
  assert.ok(count('testing.') >= 40);
  assert.equal(count('testing.mutation.'), 10);
  assert.ok(count('infrastructure.') >= 30);
  assert.ok(count('product-security.') >= 15);
});
