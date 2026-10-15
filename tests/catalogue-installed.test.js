'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/path-b');
const { loadCatalog } = require('../rig/lib/catalog');
const { definition, detectService, runNativeService } = require('../rig/lib/service-catalogue');
const { runBinding } = require('../rig/lib/check-runner');

test('present malformed JSON service input stays discovered and repairable', async () => {
  const service = loadCatalog().services.find(row => row.id === 'development.documentation.api-reference');
  await h.withRepo(target => {
    const input = 'rig-services/development.documentation.api-reference.json';
    fs.mkdirSync(path.dirname(path.join(target, input)), { recursive: true });
    fs.writeFileSync(path.join(target, input), '{ malformed');
    const found = detectService(target, service);
    assert.equal(found.present, true);
    assert.match(found.invalid, /JSON|position|property/i);
    assert.equal(found.repairable, true);
    assert.deepEqual(found.evidence_paths, [input]);
  });
});

test('present empty text service input stays discovered and repairable', async () => {
  const service = loadCatalog().services.find(row => row.id === 'development.documentation.onboarding-docs');
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), ' \n\t');
    const found = detectService(target, service);
    assert.equal(found.present, true);
    assert.match(found.invalid, /empty/i);
    assert.equal(found.repairable, true);
    assert.deepEqual(found.evidence_paths, ['README.md']);
  });
});

test('missing external service tool returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    const result = runBinding('development.documentation.onboarding-docs', {
      checks: { 'onboarding-docs-source-code-boundary': { repo: ['rig-missing-tool-t48'] } },
    }, 'repo', target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'missing_tool');
    assert.match(result.reason, /rig-missing-tool-t48|not found/i);
    assert.match(result.setup_guidance, /install|repository-owned adapter/i);
  });
});

test('unsupported native input returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'value.txt'), 'not a number');
    const result = runNativeService({
      input: 'value.txt', format: 'text',
      rule: { op: 'minimum', value: 1, reason: 'numeric value must meet the minimum' },
    }, target);
    assert.equal(result.status, 1);
    assert.equal(result.kind, 'unsupported_input');
    assert.match(result.reason, /numeric|input type/i);
    assert.match(result.setup_guidance, /JSON|repository-owned adapter/i);
  });
});

test('runner failure returns a named non-pass with setup guidance', async () => {
  await h.withRepo(target => {
    const result = runBinding('development.documentation.onboarding-docs', {
      checks: { 'onboarding-docs-source-code-boundary': { repo: [process.execPath, '-e', 'process.exit(17)'] } },
    }, 'repo', target);
    assert.equal(result.status, 17);
    assert.equal(result.kind, 'runner_error');
    assert.match(result.reason, /status 17/i);
    assert.match(result.setup_guidance, /inspect|correct|replace/i);
  });
});

test('configuration-only infrastructure service keeps an honest assurance ceiling', () => {
  for (const service of loadCatalog().services) {
    const { value } = definition(service);
    assert.doesNotMatch(value.ceiling, /live infrastructure (?:behavior|assurance)/i, service.id);
  }
  const kubernetes = loadCatalog().services.find(row => row.id === 'infrastructure.container.k8s-helm');
  assert.match(definition(kubernetes).value.ceiling, /configuration validation only|does not prove running/i);
});

test('signed onboarding binds and executes a selected documentation service', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n\n## Setup\nRun npm install.\n\n## Run\nRun npm start.\n\n## Check\nRun npm test.\n');
    const result = h.applyAndCheck(target, { proposal: {
      selected_skills: [], capabilities: [], grafts: [],
      selected_services: { 'development.documentation.onboarding-docs': 'minimal' },
    }});
    assert.equal(result.checked.phase, 'checked');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.ok(state.proposal.service_bindings['development.documentation.onboarding-docs']);
    assert.ok(state.checks.service_checks.executed_count > 0);
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n');
    const bad = h.handle({ schema_version: 1, action: 'check', target, expected_revision: result.checked.revision });
    assert.equal(bad.phase, 'failed');
  }, { install: true });
});

test('repository-owned service commands are approved and actually discriminate behavior', async () => {
  await h.withRepo(target => {
    fs.writeFileSync(path.join(target, 'README.md'), '# Project\n## Setup\nnpm install\n');
    fs.writeFileSync(path.join(target, 'behavior.cjs'), 'module.exports = x => { if (!Number.isInteger(x) || x < 0) throw new Error("invalid"); return x * 2; };\n');
    fs.writeFileSync(path.join(target, 'verify.cjs'), 'const assert = require("node:assert/strict"); const double = require("./behavior.cjs"); assert.equal(double(3), 6); assert.throws(() => double(-1), /invalid/);\n');
    h.writeJson(path.join(target, 'rig-service-adapters.json'), {
      schema_version: 1,
      services: { 'development.documentation.onboarding-docs': {
        ceiling: 'Runs the repository numeric boundary regression; approval maps this command to the selected service.',
        checks: { 'onboarding-docs-source-code-boundary': {
          repo: [process.execPath, 'verify.cjs'], network: 'none', required_paths: ['verify.cjs', 'behavior.cjs'],
        }},
      }},
    });
    const result = h.applyAndCheck(target, { proposal: { selected_skills: [], capabilities: [], grafts: [], selected_services: { 'development.documentation.onboarding-docs': 'minimal' } } });
    assert.equal(result.checked.phase, 'checked');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.deepEqual(state.proposal.service_bindings['development.documentation.onboarding-docs'].checks['onboarding-docs-source-code-boundary'].repo, [process.execPath, 'verify.cjs']);
    assert.ok(state.checks.service_checks.executed_count > 0);
    fs.writeFileSync(path.join(target, 'behavior.cjs'), 'module.exports = x => x * 2;\n');
    const bad = h.handle({ schema_version: 1, action: 'check', target, expected_revision: result.checked.revision });
    assert.equal(bad.phase, 'failed');
  }, { install: true });
});
