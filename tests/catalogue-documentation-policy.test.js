'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog } = require('../rig/lib/catalog');
const { definition, runNativeService } = require('../rig/lib/service-catalogue');
const h = require('./helpers/path-b');

const ids = [
  'development.documentation.adrs',
  'development.documentation.api-reference',
  'development.documentation.docstrings',
  'development.documentation.onboarding-docs',
];

test('documentation catalogue evidence states only what native policy checks establish', async () => {
  const catalog = loadCatalog();
  for (const id of ids) {
    const service = catalog.services.find(row => row.id === id);
    const { value } = definition(service);
    await h.withRepo(target => {
      for (const grade of ['minimal', 'mid', 'maximal']) {
        const rule = value.checks[grade][0];
        const evidence = service.acceptance_evidence[grade];
        const checkId = service.checks[grade][0];
        assert.ok(evidence.pass && evidence.fail, `${id} ${grade} evidence text`);
        assert.ok(evidence.target.includes(id), `${id} ${grade} target identity`);
        assert.match(evidence.fail, /missing|empty|no heading|does not equal/i, `${id} ${grade} fail case`);
        assert.doesNotMatch(evidence.pass, /second run|replay|digest|repository-specific convention|matches the implementation/i,
          `${id} ${grade} does not claim unimplemented evidence`);

        const good = rule.op === 'matches'
          ? { text: grade === 'minimal' ? '## Setup' : grade === 'mid' ? '## Run' : '## Check' }
          : { [rule.field]: rule.op === 'equals' ? rule.value : 'configured value' };
        const bad = rule.op === 'matches' ? { text: 'No relevant section here' } : {};
        const input = value.input;
        const writeInput = data => {
          const file = path.join(target, input);
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, value.format === 'json' ? JSON.stringify(data) : data.text);
        };
        writeInput(good);
        const passes = runNativeService({ input, format: value.format, rule }, target);
        assert.equal(passes.status, 0, `${id} ${grade} ${checkId} accepts its declared policy condition`);
        writeInput(bad);
        const fails = runNativeService({ input, format: value.format, rule }, target);
        assert.notEqual(fails.status, 0, `${id} ${grade} ${checkId} rejects a missing policy condition`);

        if (rule.field) assert.match(evidence.pass, new RegExp(rule.field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        else assert.match(evidence.pass, /README\.md contains a heading matching/);
      }
    });
  }
});
