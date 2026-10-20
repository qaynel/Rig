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
const { loadCorpus } = require('../rig/lib/corpus');
const { project } = require('../rig/lib/project');

test('host contracts distinguish real emissions, named integration gaps, and unsupported surfaces', () => {
  const report = validateRegistryContracts();
  assert.deepEqual(report.failures, []);
  for (const [host, caps] of Object.entries(REGISTRY)) {
    for (const axis of ['shell_hook', 'web_hook', 'mcp_hook']) {
      assert.notEqual(caps[axis], 'emitted', `${host} ${axis} has no Rig-written host artifact`);
    }
  }
  for (const contract of report.contracts) {
    assert.deepEqual(Object.keys(contract.axes), [
      'instruction', 'native_skill', 'shell_hook', 'web_hook', 'mcp_hook', 'mcp_config',
    ]);
    for (const axis of Object.values(contract.axes)) {
      if (axis.emission === 'not_integrated') {
        assert.equal(typeof axis.gap, 'string');
        assert.match(axis.gap, /available but not integrated/i);
        assert.equal(axis.output, undefined);
        assert.equal(axis.input, undefined);
        assert.equal(axis.evidence, undefined);
      } else assert.ok(axis.evidence.official_citation);
    }
    const selection = { hosts: [contract.id], delivery: 'default' };
    const projected = project(loadCorpus(selection), contract.id, selection);
    for (const axis of ['instruction', 'native_skill']) {
      const descriptor = contract.axes[axis];
      if (descriptor.emission !== 'emitted') continue;
      const declaredPath = descriptor.output.path.replace(/\/+$/, '');
      assert.ok(
        projected.some((entry) => entry.path === declaredPath || entry.path.startsWith(`${declaredPath}/`)),
        `${contract.id} ${axis} declared path must be written by its real projector`,
      );
    }
    withRepo((target) => {
      const result = materializeHostAdapters(target, contract.id);
      for (const rel of result.emitted_axes) {
        const landed = JSON.parse(fs.readFileSync(path.join(target, rel), 'utf8'));
        assert.equal(landed.host, contract.id);
        assert.equal(landed.emission, 'emitted');
      }
      for (const axis of ['shell_hook', 'web_hook', 'mcp_hook']) {
        const axisContract = contract.axes[axis];
        const rel = `.rig/host-contracts/${contract.id}/${axis}.json`;
        if (axisContract.emission === 'not_integrated') {
          assert.ok(!result.emitted_axes.includes(rel));
          const landed = JSON.parse(fs.readFileSync(path.join(target, rel), 'utf8'));
          assert.equal(landed.emission, 'not_integrated');
          assert.ok(landed.gap);
          assert.equal(landed.output, undefined);
          assert.equal(landed.evidence, undefined);
        }
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

test('mcp catalogue contracts expose the governing key for non-default shapes', () => {
  const { MCP_HOSTS } = require('../rig/lib/mcp-hosts');
  const expected = {
    copilot: 'servers',
    opencode: 'mcp',
    openclaw: 'mcp.servers',
    codex: '[mcp_servers]',
    claude: 'mcpServers',
  };
  for (const [host, key] of Object.entries(expected)) {
    const contract = validateRegistryContracts().contracts.find((entry) => entry.id === host);
    assert.equal(contract.axes.mcp_config.output.key, key, `${host} host contract mcp key`);
    assert.equal(MCP_HOSTS[host].key, key, `${host} write-table mcp key`);
  }
});

test('researched dispositions and reversals are recorded', () => {
  // Reversals from the 2026-07-25 report.
  assert.equal(getCapabilities('pi').native_skill, 'not_integrated');
  assert.equal(getCapabilities('cursor').native_skill, 'not_integrated');
  assert.equal(getCapabilities('cursor').shell_hook, 'not_integrated');
  assert.equal(getCapabilities('antigravity').native_skill, 'emitted');
  assert.equal(getCapabilities('swival').shell_hook, 'not_integrated');
  assert.equal(getCapabilities('swival').web_hook, 'unsupported');
  assert.equal(getCapabilities('hermes').shell_hook, 'not_integrated');
  assert.equal(getCapabilities('hermes').native_skill, 'not_integrated');
  assert.equal(getCapabilities('codewhale').native_skill, 'not_integrated');
  // MCP degradation states.
  assert.equal(getCapabilities('pi').mcp_config.scope, 'unsupported');
  assert.equal(getCapabilities('windsurf').mcp_config.scope, 'user_global');
  assert.equal(getCapabilities('devin').mcp_config.scope, 'repo'); // Devin CLI
  assert.equal(getCapabilities('codewhale').mcp_config.scope, 'user_global');
  assert.equal(getCapabilities('gemini').shell_hook, 'not_integrated');
  assert.equal(getCapabilities('codewhale').shell_hook, 'not_integrated');
  // Unknown host degrades to the safe default.
  assert.equal(getCapabilities('nope-not-a-host').instruction, 'unsupported');
  assert.equal(getCapabilities('nope-not-a-host').mcp_config.scope, 'unsupported');
});

test('supported but unintegrated hooks record a gap without emitting hook artifacts', () => {
  withRepo((target) => {
    const result = materializeHostAdapters(target, 'gemini');
    assert.equal(getCapabilities('gemini').shell_hook, 'not_integrated');
    assert.ok(!result.emitted_axes.some((rel) => /_hook\.json$/.test(rel)));
    const descriptor = JSON.parse(fs.readFileSync(path.join(target, '.rig/host-contracts/gemini/shell_hook.json'), 'utf8'));
    assert.equal(descriptor.emission, 'not_integrated');
    assert.match(descriptor.gap, /does not write/i);
    assert.equal(descriptor.output, undefined);
    assert.equal(descriptor.evidence, undefined);
  });
  withRepo((target) => {
    const result = materializeHostAdapters(target, 'hermes');
    assert.equal(getCapabilities('hermes').shell_hook, 'not_integrated');
    assert.ok(!result.emitted_axes.some((rel) => /_hook\.json$/.test(rel)));
    const descriptor = JSON.parse(fs.readFileSync(path.join(target, '.rig/host-contracts/hermes/shell_hook.json'), 'utf8'));
    assert.equal(descriptor.emission, 'not_integrated');
    assert.ok(descriptor.gap);
    assert.equal(descriptor.output, undefined);
  });
});
