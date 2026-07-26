#!/usr/bin/env node
// Catalogue inventory + MECE spot checks (impl-design §4, §13 Slice 2/10).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { root, readJson } = require('./helpers/advanced');

const expectedPath = path.join(
  __dirname,
  'fixtures',
  'advanced',
  'expected-catalogue-ids.json',
);
const catalogPath = path.join(root, 'rig', 'catalog.json');

function flattenExpected(expected) {
  const ids = [];
  for (const family of Object.values(expected.families)) {
    for (const groupIds of Object.values(family.groups)) {
      ids.push(...groupIds);
    }
  }
  return ids.sort();
}

test('expected-ID inventory fixture is well-formed and unique', () => {
  const expected = readJson(expectedPath);
  const ids = flattenExpected(expected);
  assert.ok(ids.length >= 100, `expected ~114 leaves; got ${ids.length}`);
  assert.equal(new Set(ids).size, ids.length, 'expected IDs must be unique');
  for (const id of ids) {
    assert.match(id, /^[a-z0-9-]+(?:\.[a-z0-9-]+){2}$/, `canonical id shape: ${id}`);
  }
  assert.equal(Object.keys(expected.families.development.groups).length, 9);
  assert.equal(Object.keys(expected.families.testing.groups).length, 11);
  assert.equal(Object.keys(expected.families.infrastructure.groups).length, 10);
  assert.equal(Object.keys(expected.families['product-security'].groups).length, 4);
  assert.equal(
    expected.families.testing.groups.mutation.length,
    10,
    'mutation group must have 10 services',
  );
});

test('rig/catalog.json exists and matches expected-ID inventory', () => {
  assert.ok(fs.existsSync(catalogPath), 'rig/catalog.json must exist');
  const catalog = readJson(catalogPath);
  const services = catalog.services || catalog.entries || [];
  const actual = services.map((s) => s.id).sort();
  const expected = flattenExpected(readJson(expectedPath));
  assert.deepEqual(actual, expected, 'catalogue inventory must match expected-ID fixture');
});

test('strict grade growth: maximal ⊃ mid ⊃ minimal check IDs', () => {
  assert.ok(fs.existsSync(catalogPath), 'rig/catalog.json must exist');
  const catalog = readJson(catalogPath);
  for (const service of catalog.services || catalog.entries || []) {
    const checks = service.checks || {};
    const minimal = new Set(checks.minimal || []);
    const mid = new Set([...(checks.minimal || []), ...(checks.mid || [])]);
    const maximal = new Set([
      ...(checks.minimal || []),
      ...(checks.mid || []),
      ...(checks.maximal || []),
    ]);
    assert.ok(minimal.size >= 1, `${service.id} minimal checks must be non-empty`);
    for (const id of minimal) assert.ok(mid.has(id), `${service.id} mid must include minimal`);
    for (const id of mid) assert.ok(maximal.has(id), `${service.id} maximal must include mid`);
    assert.ok(
      maximal.size > minimal.size,
      `${service.id} maximal must strictly grow beyond minimal`,
    );
  }
});

test('MECE scope-map spot checks (Gate 1 AT-P3)', () => {
  assert.ok(fs.existsSync(catalogPath), 'rig/catalog.json must exist');
  const catalog = readJson(catalogPath);
  const services = catalog.services || catalog.entries || [];
  const owns = new Map();
  for (const service of services) {
    assert.equal(service.family, service.id.split('.')[0].replace('product-security', 'product-security') || service.family);
    for (const key of service.owns || []) {
      assert.equal(owns.has(key), false, `duplicate owned scope ${key}`);
      owns.set(key, service.id);
    }
  }

  for (const service of services) {
    const owned = service.owns || [];
    if (owned.some((k) => /perf-?load|load-test|load_test/i.test(k))) {
      assert.equal(service.family, 'testing', `perf/load authoring → Testing (${service.id})`);
    }
    if (owned.some((k) => /secret-injection|runtime-secret-injection/i.test(k))) {
      assert.equal(
        service.family,
        'infrastructure',
        `secret injection → Infrastructure (${service.id})`,
      );
    }
  }

  const correctness = services.find((s) => s.id === 'development.code-quality.correctness-static');
  assert.ok(correctness, 'correctness-static service must exist');
  assert.ok(
    !(correctness.owns || []).some((k) => /sast|security-vuln/i.test(k)),
    'correctness-static ≠ security-SAST',
  );

  const profiling = services.find((s) => s.id === 'development.performance.profiling');
  assert.ok(profiling, 'development profiling service must exist');
  assert.ok(
    !(profiling.owns || []).some((k) => /load-test|load_test|perf-test-author/i.test(k)),
    'Development performance owns profiling only',
  );
});
