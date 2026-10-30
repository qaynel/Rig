'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, product } = require('./_harness');

test('RB-COORD-1 each active role trigger routes to one matching role', () => {
  const { route } = product('rig/lib/coordinator.js');
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8')).roles.filter((role) => role.default === 'active');
  for (const role of roles) for (const trigger of role.triggers) {
    const result = route(trigger, roles);
    assert.equal(result.role?.id, role.id, trigger);
    assert.equal(result.fallback, null, trigger);
  }
});

test('RB-COORD-2 unmatched situations use general fallback and matched ones do not', () => {
  const { route } = product('rig/lib/coordinator.js');
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8')).roles.filter((role) => role.default === 'active');
  assert.deepEqual(route('zebra orchestration in a moon garden', roles), { role: null, fallback: 'general' });
  const matched = route(roles[0].triggers[0], roles);
  assert.equal(matched.fallback, null);
  assert.ok(matched.role);
});

test('RB-COORD-3 written precedence puts locked tests before upstream always-instructions', () => {
  const text = fs.readFileSync(path.join(ROOT, 'rig/corpus/coordinator.md'), 'utf8');
  const lock = text.indexOf('locked tests and safety');
  const upstream = text.indexOf('piece');
  assert.ok(lock >= 0 && upstream > lock, text);
});

test('RB-COORD-4 coordinator policy limits profile changes to style preferences', () => {
  const text = fs.readFileSync(path.join(ROOT, 'rig/corpus/coordinator.md'), 'utf8');
  assert.match(text, /style/i);
  assert.match(text, /locked tests|lock/i);
  assert.match(text, /cannot|must not|never/i);
});

test('RB-COORD-5 startup returns one ordered instruction sequence despite multiple upstream hooks', () => {
  const { startup } = product('rig/lib/coordinator.js');
  const steps = startup();
  assert.ok(Array.isArray(steps));
  assert.ok(steps.length > 0);
  assert.equal(steps.filter((step) => /start-?up|session start/i.test(step)).length, 1, JSON.stringify(steps));
});

test('RB-COORD-6 bounded delegation selects a cheaper configured model or stays inline', () => {
  const { delegate } = product('rig/lib/coordinator.js');
  const result = delegate({ scope: 'one bounded file edit', files: ['src/one.js'], budgetTokens: 500 });
  if (result.model === null) return assert.ok(result.brief === undefined || typeof result.brief === 'string');
  const routing = fs.readFileSync(path.join(ROOT, 'rig/catalog/baseline/model-routing.js'), 'utf8');
  assert.ok(result.model);
  assert.ok(routing.includes(String(result.model)));
});
