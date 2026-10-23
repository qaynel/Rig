'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog } = require('../rig/lib/catalog');
const { definition, runNativeService } = require('../rig/lib/service-catalogue');
const h = require('./helpers/path-b');

const ids = [
  'product-security.red-team.abuse-resistance',
  'product-security.red-team.adversarial-simulation',
  'product-security.red-team.auth-session-probe',
  'product-security.red-team.blast-radius',
  'product-security.red-team.dast',
];

test('red-team evidence contracts and authored guidance match native policy checks', async () => {
  const catalog = loadCatalog();
  for (const id of ids) {
    const service = catalog.services.find(row => row.id === id);
    const { value } = definition(service);
    const dir = path.join(h.root, 'rig/corpus/services', id.replaceAll('.', '/'));
    const identity = fs.readFileSync(path.join(dir, 'identity.md'), 'utf8');
    assert.match(identity, /^Disposition: executable\./m, `${id} declares disposition`);
    for (const grade of ['minimal', 'mid', 'maximal']) {
      const rule = value.checks[grade][0];
      const evidence = service.acceptance_evidence[grade];
      assert.equal(evidence.pass, rule.op === 'equals'
        ? `${rule.field} equals ${JSON.stringify(rule.value)}.`
        : `${rule.field} is nonempty.`);
      assert.match(evidence.fail, /missing|empty/i);
      assert.doesNotMatch(evidence.pass, /second run|replay|digest|live service|enforcement/i);
      assert.ok(evidence.target.includes(id));

      const good = { [rule.field]: rule.op === 'equals' ? rule.value : 'configured policy value' };
      const bad = {};
      await h.withRepo(target => {
        const input = value.input;
        const file = path.join(target, input);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const run = data => {
          fs.writeFileSync(file, JSON.stringify(data));
          return runNativeService({ input, format: value.format, rule }, target);
        };
        assert.equal(run(good).status, 0, `${id} ${grade} accepts the declared condition`);
        assert.notEqual(run(bad).status, 0, `${id} ${grade} rejects a missing condition`);
      });
    }
  }
});
