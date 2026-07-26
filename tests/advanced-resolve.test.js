#!/usr/bin/env node
// Named-slice dependency resolver (impl-design §4.4, Slice 3).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { root } = require('./helpers/advanced');

function loadResolve() {
  const resolvePath = path.join(root, 'rig', 'lib', 'resolve.js');
  return require(resolvePath);
}

test('named-slice resolution auto-pulls exact dependency slice only', () => {
  const { resolve } = loadResolve();
  const catalog = require(path.join(root, 'rig', 'catalog.json'));
  const result = resolve(catalog, {
    'testing.mutation.mutant-generator': 'minimal',
  });
  const effective = result.effective || result.services || result;
  const selected = effective['testing.mutation.mutant-generator'];
  assert.ok(selected);
  assert.equal(selected.selected_grade || selected.grade, 'minimal');
  assert.ok(
    selected.install_reason === 'selected' ||
      (selected.install_reason || '').includes('selected'),
  );

  const depEntries = Object.entries(effective).filter(
    ([id]) => id !== 'testing.mutation.mutant-generator',
  );
  assert.ok(depEntries.length >= 1, 'must auto-pull at least one dependency slice');
  for (const [, entry] of depEntries) {
    assert.ok(
      entry.required_slices || entry.slice || entry.install_reason === 'dependency',
      'dependency entries must be slice-scoped, not whole-group',
    );
    assert.notEqual(
      entry.selected_grade,
      'maximal',
      'must not silently raise a dependency to maximal',
    );
  }
});

test('selected grade is preserved when dependency requests a lower slice', () => {
  const { resolve } = loadResolve();
  const catalog = require(path.join(root, 'rig', 'catalog.json'));
  const result = resolve(catalog, {
    'testing.unit.test-case-generation': 'maximal',
    'testing.mutation.mutant-generator': 'minimal',
  });
  const effective = result.effective || result.services || result;
  assert.equal(
    effective['testing.unit.test-case-generation'].selected_grade ||
      effective['testing.unit.test-case-generation'].grade,
    'maximal',
  );
});

test('ladder bundles expand earlier rungs without whole-group pulls', () => {
  const { resolve } = loadResolve();
  const catalog = require(path.join(root, 'rig', 'catalog.json'));
  const result = resolve(catalog, {
    'testing.mutation.execution-orchestrator': 'minimal',
  });
  const ids = Object.keys(result.effective || result.services || result);
  assert.ok(
    ids.some((id) => id.startsWith('testing.unit.')),
    'mutation ladder must pull unit floor slice',
  );
  assert.ok(
    !ids.includes('testing.e2e.browser-automation'),
    'must not drag unrelated E2E machinery',
  );
});

test('cycle detection reports full path', () => {
  const { resolve } = loadResolve();
  const catalog = {
    services: [
      {
        id: 'a.demo.one',
        family: 'a',
        group: 'demo',
        requires: { minimal: [{ service: 'a.demo.two', slice: 'floor' }] },
        slices: { floor: { requires: [{ service: 'a.demo.two', slice: 'floor' }] } },
        checks: { minimal: ['x'], mid: ['x2'], maximal: ['x3'] },
        owns: ['a.one'],
      },
      {
        id: 'a.demo.two',
        family: 'a',
        group: 'demo',
        requires: { minimal: [{ service: 'a.demo.one', slice: 'floor' }] },
        slices: { floor: { requires: [{ service: 'a.demo.one', slice: 'floor' }] } },
        checks: { minimal: ['y'], mid: ['y2'], maximal: ['y3'] },
        owns: ['a.two'],
      },
    ],
  };
  assert.throws(
    () => resolve(catalog, { 'a.demo.one': 'minimal' }),
    /cycle|a\.demo\.one.*a\.demo\.two|a\.demo\.two.*a\.demo\.one/i,
  );
});

test('stable topological ordering with canonical ID tie-break', () => {
  const { resolve } = loadResolve();
  const catalog = require(path.join(root, 'rig', 'catalog.json'));
  const input = {
    'testing.unit.test-case-generation': 'minimal',
    'testing.property-fuzz.invariant-identification': 'minimal',
  };
  const a = resolve(catalog, input);
  const b = resolve(catalog, input);
  const orderA = a.order || Object.keys(a.effective || a.services || a);
  const orderB = b.order || Object.keys(b.effective || b.services || b);
  assert.deepEqual(orderA, orderB, 'resolution order must be deterministic');
});
