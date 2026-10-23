'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { loadCatalog } = require('../rig/lib/catalog');
const { definition, runNativeService } = require('../rig/lib/service-catalogue');

const group = loadCatalog().services.filter((service) =>
  service.family === 'infrastructure' && service.group === 'networking');

test('networking service guidance matches declared predicates and fixture ceilings', () => {
  assert.equal(group.length, 3);
  for (const service of group) {
    const { value } = definition(service);
    const id = service.id;
    const dir = path.join(__dirname, 'fixtures/services', service.id);
    const good = path.join(dir, 'good');
    const bad = path.join(dir, 'bad');
    const fragments = [
      ...Object.entries(service.fragments).map(([part, rel]) => [part, rel]),
      ...Object.entries(service.slices).map(([part, slice]) => [`slice:${part}`, slice.fragment]),
    ];
    const text = Object.fromEntries(fragments.map(([part, rel]) => [
      part,
      fs.readFileSync(path.join(__dirname, '..', 'rig', rel), 'utf8'),
    ]));

    assert.match(text.identity, new RegExp(service.id.replaceAll('.', '\\.')));
    assert.match(text.identity, new RegExp(value.input.replaceAll('.', '\\.')));
    assert.match(text.identity, /configuration validation only/i);
    for (const [part, body] of Object.entries(text)) {
      assert.doesNotMatch(body, /\.\.|concrete repository contract|Choose a repository-owned check|Binding checks:/i, `${service.id} ${part}`);
    }
    for (const grade of ['minimal', 'mid', 'maximal']) {
      assert.match(text[grade], new RegExp(service.checks[grade][0]));
      for (const rule of value.checks[grade]) {
        const passed = runNativeService({ input: value.input, format: value.format, rule }, good);
        assert.equal(passed.status, 0, `${service.id} ${grade} good fixture`);
      }
    }
    const floor = value.slices.floor;
    assert.match(text['slice:floor'], new RegExp(floor.check_id));
    assert.match(text['slice:behavior-oracle'], /does not|not a .*oracle/i);
    assert.match(text.maximal, /does not produce a replayable evidence receipt/i);

    const minimalRule = value.checks.minimal[0];
    const rejected = runNativeService({ input: value.input, format: value.format, rule: minimalRule }, bad);
    assert.equal(rejected.status, 1, `${service.id} bad fixture fails its floor predicate`);

    for (const grade of ['mid', 'maximal']) {
      const evidence = service.acceptance_evidence[grade];
      assert.match(evidence.target, new RegExp(`^policy:${id.replaceAll('.', '\\.')}:${grade}:`));
      assert.ok(evidence.given.includes(value.input));
      assert.match(evidence.given, /cumulative native checks/i);
      assert.match(evidence.fail, /predicate is false/i);
      for (const rule of ['minimal', 'mid', ...(grade === 'maximal' ? ['maximal'] : [])].flatMap((level) => value.checks[level])) {
        assert.ok(evidence.pass.includes(rule.field), `${id} ${grade} evidence names ${rule.field}`);
        if (rule.value !== undefined) assert.ok(evidence.pass.includes(String(rule.value)), `${id} ${grade} evidence names ${rule.field} value`);
      }
      assert.doesNotMatch(`${evidence.target} ${evidence.pass}`, /repository-context|evidence-replay|runtime observation|replayable receipt/i);
    }
  }
});
