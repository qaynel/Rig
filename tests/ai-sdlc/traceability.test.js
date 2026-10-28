'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo, write } = require('./_harness');

// F06 — machine-readable graph with complete, duplicate, missing, orphaned and
// changed mappings. The validator ships in the corpus, so this group is green.
const graph = capability('check-traceability');

const CONTRACT = (rows) => [
  '| Requirement and source | Atomic obligation | Primary acceptance criterion | Proving test | Journey | Depends on | Status |',
  '|---|---|---|---|---|---|---|',
  ...rows,
].join('\n');

const JOURNEYS = (rows) => ['| Journey | Scenario | Requirements | E2E |', '|---|---|---|---|', ...rows].join('\n');
const FIXTURES = (rows) => ['| Fixture | Setup | Home |', '|---|---|---|', ...rows].join('\n');
const PACKAGES = (rows) => ['| Package | Scope | Ownership | Checks |', '|---|---|---|---|', ...rows].join('\n');

function contractDir(rows, { journeys, fixtures, packages } = {}) {
  const dir = tempRepo('rig-graph-');
  write(dir, 'contract.md', CONTRACT(rows));
  write(dir, 'journeys.md', JOURNEYS(journeys || ['| J01 | one journey | R001 | E2E-J01: fixture |']));
  write(dir, 'fixtures.md', FIXTURES(fixtures || ['| F01 | setup | `tests/x.test.js` |']));
  write(dir, 'packages.md', PACKAGES(packages || ['| **WP01 — one.** outcome. | R001; in: x | owner | PT-001 |']));
  return dir;
}

const COMPLETE = '| R001 F01 | An obligation. | AC-001: an observable result. | PT-001 F01 | J01 | — | P |';

function problems(dir) {
  return graph.validate(graph.parse(dir));
}

test('PT-009 compound obligations are split and IDs are unique', () => {
  const dir = contractDir([COMPLETE, COMPLETE]);
  const errors = problems(dir);
  assert.ok(errors.some((e) => /duplicate ID R001/.test(e)), errors.join('\n'));
});

test('PT-010 no requirement or primary criterion is orphaned or duplicated', () => {
  const shared = [
    COMPLETE,
    '| R002 F01 | Second obligation. | AC-001: a reused criterion. | PT-002 F01 | J01 | — | P |',
  ];
  const errors = problems(contractDir(shared, { journeys: ['| J01 | one | R001,R002 | E2E-J01: f |'], packages: ['| **WP01 — one.** o. | R001,R002 | owner | PT-001,PT-002 |'] }));
  assert.ok(errors.some((e) => /R002 primary criterion is AC-001/.test(e)), errors.join('\n'));
  assert.ok(errors.some((e) => /AC-001 is claimed as primary by both R001 and R002/.test(e)), errors.join('\n'));
  assert.equal(problems(contractDir([COMPLETE])).length, 0, 'a complete graph has no findings');
});

test('PT-011 each criterion resolves to a unique runnable test obligation', () => {
  const noFixture = '| R001 F01 | An obligation. | AC-001: a result. | PT-001 | J01 | — | P |';
  assert.ok(problems(contractDir([noFixture])).some((e) => /PT-001 names no fixture/.test(e)));

  const unknownFixture = '| R001 F01 | An obligation. | AC-001: a result. | PT-001 F09 | J01 | — | P |';
  assert.ok(problems(contractDir([unknownFixture])).some((e) => /unknown fixture F09/.test(e)));

  const orphanFixture = contractDir([COMPLETE], { fixtures: ['| F01 | setup | `tests/x.test.js` |', '| F02 | unused | `tests/y.test.js` |'] });
  assert.ok(problems(orphanFixture).some((e) => /fixture F02 is orphaned/.test(e)));
});

test('PT-012 a journey without both mappings fails the contract audit', () => {
  const noRequirements = contractDir([COMPLETE], { journeys: ['| J01 | one | R001 | E2E-J01: f |', '| J02 | two |  | E2E-J02: f |'] });
  const errors = problems(noRequirements);
  assert.ok(errors.some((e) => /J02 maps no requirement/.test(e)), errors.join('\n'));

  const noE2e = contractDir([COMPLETE], { journeys: ['| J01 | one | R001 | no end-to-end check |'] });
  assert.ok(problems(noE2e).some((e) => /J01 has no end-to-end proving obligation/.test(e)));
});

test('PT-013 orphan work packages fail planning preflight', () => {
  const unknown = contractDir([COMPLETE], { packages: ['| **WP01 — one.** o. | R001 | owner | PT-001 |', '| **WP02 — two.** o. | R404 | owner | PT-404 |'] });
  const errors = problems(unknown);
  assert.ok(errors.some((e) => /WP02 references unknown requirement R404/.test(e)), errors.join('\n'));

  const uncovered = contractDir([COMPLETE, '| R002 F01 | Second. | AC-002: a result. | PT-002 F01 | J01 | — | P |'],
    { journeys: ['| J01 | one | R001,R002 | E2E-J01: f |'] });
  assert.ok(problems(uncovered).some((e) => /R002 is in no work package/.test(e)));
});

test('PT-014 changed requirement bytes invalidate the prior mapping result', () => {
  const dir = contractDir([COMPLETE]);
  const hashes = path.join(dir, 'protected.json');
  const sha = require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(dir, 'contract.md'))).digest('hex');
  fs.writeFileSync(hashes, JSON.stringify({ files: { 'contract.md': sha } }));
  assert.deepEqual(graph.hashCheck(dir, hashes), [], 'unchanged protected bytes verify');

  fs.appendFileSync(path.join(dir, 'contract.md'), '| R002 F01 | Added later. | AC-002: a result. | PT-002 F01 | J01 | — | P |\n');
  const errors = graph.hashCheck(dir, hashes);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /contract\.md changed.*approval is void until the owner amends/);
});
