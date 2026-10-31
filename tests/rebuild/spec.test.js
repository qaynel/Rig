'use strict';

const test = require('node:test');
const { assert, product } = require('./_harness');

const proposal = '## Why\n\nShoppers abandon carts because checkout asks for the same address twice, which costs sales every week.\n\n## What Changes\n\n- Reuse the saved address at checkout.\n';
const spec = (requirement, scenario = true) => [
  '## ADDED Requirements', '',
  '### Requirement: Saved address reuse', requirement, '',
  ...(scenario ? ['#### Scenario: Returning shopper', '- **WHEN** a signed-in shopper reaches checkout', '- **THEN** the saved address is pre-filled'] : []),
  '',
].join('\n');
const goodSpec = spec('The checkout SHALL pre-fill the saved shipping address for signed-in shoppers.');
const fullTrace = [{ requirement: 'Saved address reuse', criterion: 'AC-1', test: 'PT-1' }];

test('RB-SPEC-1 a requirement without SHALL or MUST fails the spec-format check', () => {
  const { checkSpec } = product('rig/lib/spec-check.js');
  const result = checkSpec({ proposal, specs: [{ path: 'specs/checkout/spec.md', text: spec('The checkout pre-fills the saved shipping address.') }], trace: fullTrace });
  assert.equal(result.stage, 'format');
  assert.ok(result.errors.some((error) => /SHALL|MUST/.test(error)), result.errors.join('\n'));
});

test('RB-SPEC-2 a requirement without an example scenario fails the spec-format check', () => {
  const { checkSpec } = product('rig/lib/spec-check.js');
  const result = checkSpec({ proposal, specs: [{ path: 'specs/checkout/spec.md', text: spec('The checkout SHALL pre-fill the saved shipping address.', false) }], trace: fullTrace });
  assert.equal(result.stage, 'format');
  assert.ok(result.errors.some((error) => /scenario/i.test(error)), result.errors.join('\n'));
});

test('RB-SPEC-3 a well-formed spec whose requirement has no proving test fails the traceability check', () => {
  const { checkSpec } = product('rig/lib/spec-check.js');
  const result = checkSpec({ proposal, specs: [{ path: 'specs/checkout/spec.md', text: goodSpec }], trace: [{ requirement: 'Saved address reuse', criterion: 'AC-1' }] });
  assert.equal(result.stage, 'traceability');
  assert.ok(result.errors.some((error) => error.includes('Saved address reuse')), result.errors.join('\n'));
  const clean = checkSpec({ proposal, specs: [{ path: 'specs/checkout/spec.md', text: goodSpec }], trace: fullTrace });
  assert.deepEqual(clean, { stage: null, errors: [] });
});

test('RB-SPEC-4 the format check runs before the traceability check and stops the run', () => {
  const { checkSpec } = product('rig/lib/spec-check.js');
  const result = checkSpec({ proposal, specs: [{ path: 'specs/checkout/spec.md', text: spec('The checkout pre-fills the saved address.', false) }], trace: [] });
  assert.equal(result.stage, 'format');
  assert.ok(result.errors.length >= 2, result.errors.join('\n'));
  assert.ok(result.errors.every((error) => !/proving test|criterion/i.test(error)), 'traceability findings must not be reported while the format check fails');
});
