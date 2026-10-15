'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/path-b');
const { loadCatalog, effectiveChecks } = require('../rig/lib/catalog');
const { resolve } = require('../rig/lib/resolve');
const { definition, detectService } = require('../rig/lib/service-catalogue');
const catalog = loadCatalog();

for (const service of catalog.services) {
  test(`installed ${service.id} discriminates configuration across every grade`, async () => {
    for (const grade of ['minimal', 'mid', 'maximal']) for (const variant of ['good', 'bad']) {
      await h.withRepo(target => {
        const selection = { [service.id]: grade };
        for (const dep of resolve(catalog, selection)) {
          const fixture = path.join(h.root, 'tests/fixtures/services', dep.id, dep.id === service.id ? variant : 'good');
          fs.cpSync(fixture, target, { recursive: true });
        }
        const found = detectService(target, service);
        assert.equal(found.present, true);
        assert.ok(found.evidence_paths.length > 0);
        const result = h.applyAndCheck(target, { proposal: {
          selected_skills: [], capabilities: [], grafts: [], selected_services: selection,
        }});
        assert.equal(result.checked.phase, variant === 'good' ? 'checked' : 'failed', `${service.id} ${grade} ${variant}`);
        const state = h.readJson(path.join(target, '.rig/state.json'));
        const binding = state.proposal.service_bindings[service.id];
        assert.equal(state.proposal.selected_services[service.id], grade);
        assert.equal(binding.grade, grade);
        assert.deepEqual(Object.keys(binding.checks), effectiveChecks(service, grade));
        assert.ok(state.checks.service_checks.executed_count > 0);
        const own = state.checks.service_checks.results.find(row => row.service_id === service.id);
        assert.ok(own.executed_checks.length > 0);
        if (variant === 'good') assert.deepEqual(own.executed_checks, effectiveChecks(service, grade));
        for (const dep of resolve(catalog, selection).filter(row => row.reason === 'dependency')) {
          const resolvedBinding = state.proposal.service_bindings[dep.id];
          assert.equal(resolvedBinding.grade, null);
          assert.deepEqual(resolvedBinding.slices, dep.slices);
          const depDefinition = definition(catalog.services.find(row => row.id === dep.id)).value;
          assert.deepEqual(Object.keys(resolvedBinding.checks), dep.slices.map(slice => depDefinition.slices[slice].check_id));
        }
      }, { install: true });
    }
  });
}
