#!/usr/bin/env node
// Leaf-only rig.json validation + baseline-not-selectable (impl-design AD-2, §4).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createRepoFixture,
  writeSelection,
  plan,
  allowedReview,
  root,
} = require('./helpers/advanced');

function loadValidator() {
  const configPath = path.join(root, 'rig', 'lib', 'config.js');
  assert.ok(fs.existsSync(configPath));
  // Advanced leaf validation is expected on catalogue manifests (schema_version).
  const mod = require(configPath);
  return mod.validateCatalogueManifest || mod.validateRigJson || mod.validate;
}

test('leaf-only rig.json accepts known service grades', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const manifestPath = writeSelection(target, {
      'testing.unit.test-case-generation': 'minimal',
      'development.documentation.adrs': 'mid',
    });
    const validate = loadValidator();
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.doesNotThrow(() => validate(manifest));
  });
});

test('rig.json rejects unknown service, grade, and group-level selections', () => {
  const validate = loadValidator();
  assert.throws(
    () =>
      validate({
        schema_version: 1,
        services: { 'testing.unit.not-a-real-service': 'minimal' },
      }),
    /unknown|invalid|service/i,
  );
  assert.throws(
    () =>
      validate({
        schema_version: 1,
        services: { 'testing.unit.test-case-generation': 'ultra' },
      }),
    /grade|invalid/i,
  );
  assert.throws(
    () =>
      validate({
        schema_version: 1,
        services: { testing: 'maximal' },
      }),
    /leaf|service|invalid/i,
  );
});

test('baseline is not selectable or disableable in rig.json', () => {
  const validate = loadValidator();
  for (const bad of [
    { schema_version: 1, services: {}, baseline: false },
    { schema_version: 1, services: { 'baseline.sanitation': 'minimal' } },
    { schema_version: 1, services: {}, disable_baseline: true },
  ]) {
    assert.throws(() => validate(bad), /baseline|unknown|invalid/i);
  }
});

test('empty selection plans still include mandatory baseline components', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const result = plan(target, { review: reviewPath });
    assert.equal(result.status, 0, `plan must succeed: ${result.stderr}`);
    const body = JSON.parse(fs.readFileSync(result.outPath, 'utf8'));
    const ops = body.operations || body.ops || [];
    const serialized = JSON.stringify(body);
    assert.ok(
      ops.length > 0 || /baseline|drift-rule|check-copies|secret-guard|check\.js/i.test(serialized),
      'empty selection must still plan baseline installs',
    );
  });
});
