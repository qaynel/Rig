#!/usr/bin/env node
// Mandatory baseline on empty selection (impl-design §7, AT-BASE-2, Slice 7).
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
} = require('./helpers/advanced');

test('empty service selection installs complete mandatory baseline', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const required = [
      '.rig/baseline/drift-rule.md',
      '.rig/baseline/sanitation-review.json',
      '.rig/context-index.json',
      '.rig/sync-map.json',
      '.rig/bin/check.js',
      '.rig/bin/check-copies.js',
      '.rig/bin/secret-guard.sh',
      '.rig/catalog-receipt.json',
      '.rig/catalog-routing.md',
    ];
    for (const rel of required) {
      assert.ok(fs.existsSync(path.join(target, rel)), `missing baseline path ${rel}`);
    }
  });
});

test('policy network disable applies to legacy and current schemas with leaf reasons', () => {
  const { effectiveStatus } = require('../rig/lib/policy');
  const legacy = JSON.parse(fs.readFileSync(path.join(__dirname, '../rig/catalog/baseline/network-policy.json'), 'utf8'));
  const disabled = effectiveStatus({ ...legacy, network: { enabled: false } });
  assert.equal(disabled.protected, false);
  assert.deepEqual(disabled.reasons['network.enabled'], ['network.enabled=false']);
  for (const category of ['outbound_network', 'remote_content_execution', 'sensitive_environment_read', 'guardrail_bypass']) {
    assert.equal(disabled.network[category], 'disabled');
    assert.ok(disabled.reasons[`network.categories.${category}`].includes('network.enabled=false'));
  }
  assert.equal(effectiveStatus(legacy).protected, true, 'omitted legacy section retains compatibility');
});

test('malformed network categories are unprotected and rejected before policy proposal', () => {
  const { effectiveStatus, validatePolicy } = require('../rig/lib/policy');
  const policy = {
    enabled: true,
    controls: Object.fromEntries(['sanitation.harness', 'drift.exact_copy', 'drift.semantic', 'secrets.deterministic', 'network.action_policy'].map(key => [key, true])),
    enforcement: Object.fromEntries(['host.shell', 'host.web', 'host.mcp', 'git.pre_commit', 'ci.repo'].map(key => [key, true])),
    network: { enabled: true, categories: Object.fromEntries(['outbound_network', 'remote_content_execution', 'sensitive_environment_read', 'guardrail_bypass'].map(key => [key, 'deny'])) },
  };
  assert.equal(effectiveStatus(policy).protected, true);
  for (const value of ['nonsense', true, false, null, {}, []]) {
    const invalid = { ...policy, network: { ...policy.network, categories: { ...policy.network.categories, outbound_network: value } } };
    const result = effectiveStatus(invalid);
    assert.equal(result.protected, false, JSON.stringify(value));
    assert.equal(result.network.outbound_network, 'disabled');
    assert.deepEqual(result.reasons['network.categories.outbound_network'], ['network.categories.outbound_network=invalid']);
    assert.throws(() => validatePolicy(invalid), /network.*categor/i);
  }
  for (const categories of [null, [], 'deny']) {
    const invalid = { ...policy, network: { ...policy.network, categories } };
    assert.equal(effectiveStatus(invalid).protected, false);
    assert.throws(() => validatePolicy(invalid), /network.*categor/i);
  }
});
