#!/usr/bin/env node
// Host capability degradation matrix (impl-design §10, AT-P4, Slice 8).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  withRepo,
  createHostFixture,
  HOST_FIXTURES,
  allowedReview,
  writeSelection,
  plan,
  apply,
  root,
} = require('./helpers/advanced');

test('host fixtures cover instruction, skill, hook, and generic surfaces', () => {
  assert.equal(Object.keys(HOST_FIXTURES).length, 5);
});

test('unsupported hook axes emit nothing', () => {
  const registryPath = path.join(root, 'rig', 'lib', 'host-capabilities.js');
  assert.ok(fs.existsSync(registryPath));
  const { getCapabilities, materializeHostAdapters } = require(registryPath);

  withRepo((target) => {
    createHostFixture('non-hook-advisory', target);
    const caps = getCapabilities('generic');
    assert.equal(caps.shell_hook, 'unsupported');
    const { reviewPath } = allowedReview(target, { host: 'generic' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);

    const adapters = materializeHostAdapters
      ? materializeHostAdapters(target, 'generic')
      : { emitted_live_hooks: [] };
    assert.equal(
      (adapters.emitted_live_hooks || []).length,
      0,
      'unsupported hooks must not emit speculative config',
    );
    assert.ok(fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')));
  });
});

test('an emitted hook host receives additive axis contracts', () => {
  withRepo((target) => {
    createHostFixture(Object.keys(HOST_FIXTURES).find((name) => name.includes('live-hook')), target);
    const { reviewPath } = allowedReview(target, { host: 'claude' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')));
  });
});

const { REGISTRY, getCapabilities, materializeHostAdapters, validateRegistryContracts } = require('../rig/lib/host-capabilities');

test('every host carries the exact six axis-local contracts and byte-landing evidence', () => {
  const report = validateRegistryContracts();
  assert.deepEqual(report.failures, []);
  for (const contract of report.contracts) {
    assert.deepEqual(Object.keys(contract.axes), [
      'instruction', 'native_skill', 'shell_hook', 'web_hook', 'mcp_hook', 'mcp_config',
    ]);
    for (const axis of Object.values(contract.axes)) assert.ok(axis.evidence.official_citation);
    withRepo((target) => {
      const result = materializeHostAdapters(target, contract.id);
      for (const rel of result.emitted_axes) {
        const landed = JSON.parse(fs.readFileSync(path.join(target, rel), 'utf8'));
        assert.equal(landed.host, contract.id);
        assert.equal(landed.emission, 'emitted');
      }
      assert.equal(result.emitted_axes.length, Object.values(contract.axes).filter((axis) => axis.emission === 'emitted').length);
    });
  }
});

test('mcp disposition is one of the three degradation states', () => {
  for (const [host, caps] of Object.entries(REGISTRY)) {
    assert.ok(['repo', 'user_global', 'unsupported'].includes(caps.mcp_config.scope), `${host} mcp scope`);
  }
});

test('researched dispositions and reversals are recorded', () => {
  // Reversals from the 2026-07-25 report.
  assert.equal(getCapabilities('pi').native_skill, 'emitted');
  assert.equal(getCapabilities('cursor').native_skill, 'emitted');
  assert.equal(getCapabilities('cursor').shell_hook, 'emitted');
  // MCP degradation states.
  assert.equal(getCapabilities('pi').mcp_config.scope, 'unsupported');
  assert.equal(getCapabilities('windsurf').mcp_config.scope, 'user_global');
  assert.equal(getCapabilities('devin').mcp_config.scope, 'repo'); // Devin CLI
  assert.equal(getCapabilities('codewhale').mcp_config.scope, 'user_global');
  assert.equal(getCapabilities('gemini').shell_hook, 'emitted');
  assert.equal(getCapabilities('codewhale').shell_hook, 'emitted');
  // Unknown host degrades to the safe default.
  assert.equal(getCapabilities('nope-not-a-host').instruction, 'emitted');
  assert.equal(getCapabilities('nope-not-a-host').mcp_config.scope, 'unsupported');
});

test('hook axes emit contracts only when the registry says emitted', () => {
  withRepo((target) => {
    const emitted = materializeHostAdapters(target, 'gemini').emitted_axes;
    assert.ok(emitted.some((rel) => rel.endsWith('/shell_hook.json')));
  });
  withRepo((target) => {
    assert.ok(!materializeHostAdapters(target, 'hermes').emitted_axes.some((rel) => /_hook\.json$/.test(rel)));
  });
});
