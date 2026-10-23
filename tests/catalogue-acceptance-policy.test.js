'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog } = require('../rig/lib/catalog');
const { definition } = require('../rig/lib/service-catalogue');
const { runNativeService } = require('../rig/lib/service-catalogue');
const h = require('./helpers/advanced');

const GRADES = ['minimal', 'mid', 'maximal'];

test('refactoring and design-review policies reject unresolved changes rather than accepting any nonnegative count', () => {
  for (const [id, grade, field] of [
    ['development.code-creation.refactoring', 'mid', 'public_api_changes'],
    ['development.architecture.design-review', 'maximal', 'unresolved_tradeoffs'],
  ]) {
    const service = loadCatalog().services.find(service => service.id === id);
    const { value } = definition(service);
    const rule = value.checks[grade].find(rule => rule.field === field);
    h.withRepo(target => {
      const file = path.join(target, value.input);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      for (const count of [0, 1, -1]) {
        fs.writeFileSync(file, JSON.stringify({ [field]: count }));
        const observed = runNativeService({ input: value.input, format: value.format, rule }, target);
        assert.equal(observed.status === 0, count === 0, `${id} must require zero ${field}, observed ${count}`);
      }
    });
  }
});

function predicate(id, rule) {
  const subject = rule.field ? `\`${rule.field}\`` : 'the input text';
  switch (rule.op) {
    case 'nonempty': return `${id}: ${subject} is nonempty${rule.field ? ' (a string or array)' : ''}`;
    case 'equals': return `${id}: ${subject} equals ${JSON.stringify(rule.value)}`;
    case 'minimum': return `${id}: ${subject} is numeric and at least ${JSON.stringify(rule.value)}`;
    case 'maximum': return `${id}: ${subject} is numeric and at most ${JSON.stringify(rule.value)}`;
    case 'includes': return `${id}: ${subject} array includes ${JSON.stringify(rule.value)}`;
    case 'matches': return `${id}: ${subject} matches pattern ${JSON.stringify(rule.value)}`;
    default: throw new Error(`unsupported native predicate ${rule.op} (${id})`);
  }
}

test('catalogue acceptance metadata describes native predicates without claiming Context or Evidence proof', () => {
  const catalog = loadCatalog();
  let checked = 0;
  for (const service of catalog.services) {
    if (service.id === 'development.code-quality.lint-format') {
      const ids = GRADES.flatMap(grade => service.checks[grade]);
      assert.deepEqual(service.acceptance_evidence.map(e => e.check_id), ids);
      assert.ok(service.acceptance_evidence.every(e => e.target === 'tests/advanced-lint-format.test.js'));
      assert.doesNotMatch(JSON.stringify(service.acceptance_evidence), /repository-context|evidence-replay|second run|input\/output digest|receipt is stale/i);
    } else {
      const { value } = definition(service);
      for (let index = 0; index < GRADES.length; index++) {
        const grade = GRADES[index];
        const checks = GRADES.slice(0, index + 1).flatMap(g =>
          service.checks[g].map((id, n) => ({ id, rule: value.checks[g][n] })));
        const evidence = service.acceptance_evidence[grade];
        const expectedIds = checks.map(check => check.id);
        assert.equal(evidence.target, `policy:${service.id}:${grade}:${expectedIds.join('+')}`);
        assert.equal(evidence.given,
          `${value.input} is present and valid ${value.format}, and the cumulative native checks for ${grade} are executed`);
        if (service.id.startsWith('product-security.red-team.')) {
          const check = value.checks[grade][0];
          assert.equal(evidence.pass, check.op === 'equals'
            ? `${check.field} equals ${JSON.stringify(check.value)}.`
            : `${check.field} is nonempty.`);
        } else if (service.id === 'development.documentation.onboarding-docs') {
          assert.match(evidence.pass, /^README\.md contains a heading matching the documented (setup|run|verification) section pattern\.$/);
        } else {
          assert.equal(evidence.pass,
            `All declared predicates hold: ${checks.map(check => predicate(check.id, check.rule)).join('; ')}.`);
        }
        if (service.id === 'development.documentation.onboarding-docs') {
          assert.match(evidence.fail, /^README\.md is missing, empty, or has no heading matching the documented (setup|run|verification) section pattern\.$/);
        } else {
          assert.equal(evidence.fail,
            'The input is missing or invalid, has an unsupported value type, or at least one declared predicate is false.');
        }
        assert.doesNotMatch(JSON.stringify(evidence), /repository-context|evidence-replay|second run|input\/output digest|receipt is stale/i,
          `${service.id} ${grade} acceptance must not claim unimplemented higher-grade proof`);
        checked++;
      }
    }
    for (const grade of GRADES) {
      const fragment = fs.readFileSync(path.join(__dirname, '..', 'rig', service.fragments[grade]), 'utf8');
      assert.doesNotMatch(fragment, /fixture:|repository-specific convention and evidence source|second run|input\/output digests|receipt that cannot replay|receipt is stale/i,
        `${service.id} ${grade} fragment must describe the implemented policy check`);
    }
  }
  assert.equal(checked, 114 * 3);
});
