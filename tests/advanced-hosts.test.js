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

test('host fixtures cover the §10 matrix', () => {
  assert.deepEqual(
    Object.keys(HOST_FIXTURES).sort(),
    [
      'generic-git',
      'native-skill-project-rule',
      'non-hook-advisory',
      'project-rule-only',
      'verified-live-hook',
    ].sort(),
  );
});

test('capability registry degrades unverified live hooks; never fabricates config', () => {
  const registryPath = path.join(root, 'rig', 'lib', 'host-capabilities.js');
  assert.ok(fs.existsSync(registryPath));
  const { getCapabilities, materializeHostAdapters } = require(registryPath);

  withRepo((target) => {
    createHostFixture('non-hook-advisory', target);
    const caps = getCapabilities('generic');
    assert.equal(caps.live_hook, 'unverified');
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
      'unverified hosts must not emit speculative live-hook config',
    );
    assert.ok(fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')));
  });
});

test('verified live-hook host may receive additive hook adapter', () => {
  withRepo((target) => {
    createHostFixture('verified-live-hook', target);
    const { reviewPath } = allowedReview(target, { host: 'claude' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'bin', 'check.js')));
  });
});

const { REGISTRY, getCapabilities, materializeHostAdapters } = require('../rig/lib/host-capabilities');

test('every verified capability axis carries evidence (AD-13)', () => {
  for (const [host, caps] of Object.entries(REGISTRY)) {
    const isVerified =
      caps.native_skill === 'verified' || caps.live_hook === 'verified' || caps.mcp === 'repo';
    if (!isVerified) continue;
    assert.ok(caps.evidence && typeof caps.evidence.citation === 'string' && caps.evidence.citation.length > 0,
      `${host} has a verified axis without evidence.citation`);
  }
});

test('mcp disposition is one of the three degradation states', () => {
  for (const [host, caps] of Object.entries(REGISTRY)) {
    assert.ok(['repo', 'user_global', 'unsupported'].includes(caps.mcp), `${host} mcp="${caps.mcp}"`);
  }
});

test('researched dispositions and reversals are recorded', () => {
  // Reversals from the 2026-07-25 report.
  assert.equal(getCapabilities('pi').native_skill, 'verified');
  assert.equal(getCapabilities('cursor').native_skill, 'verified');
  assert.equal(getCapabilities('cursor').live_hook, 'verified');
  // MCP degradation states.
  assert.equal(getCapabilities('pi').mcp, 'unsupported');
  assert.equal(getCapabilities('windsurf').mcp, 'user_global');
  assert.equal(getCapabilities('devin').mcp, 'repo'); // Devin CLI
  assert.equal(getCapabilities('codewhale').mcp, 'user_global');
  // Newly verified hooks.
  assert.equal(getCapabilities('gemini').live_hook, 'verified');
  assert.equal(getCapabilities('codewhale').live_hook, 'verified');
  // Unknown host degrades to the safe default.
  assert.equal(getCapabilities('nope-not-a-host').instruction, 'advisory');
  assert.equal(getCapabilities('nope-not-a-host').mcp, 'unsupported');
});

test('verified-hook hosts emit an additive marker; others emit none', () => {
  withRepo((target) => {
    const emitted = materializeHostAdapters(target, 'gemini').emitted_live_hooks;
    assert.equal(emitted.length, 1);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'hooks', 'semantic-review.hint.md')));
  });
  withRepo((target) => {
    // hermes live_hook is unverified (user-global only) -> no speculative config.
    assert.equal(materializeHostAdapters(target, 'hermes').emitted_live_hooks.length, 0);
  });
});
