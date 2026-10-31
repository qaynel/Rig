'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, product } = require('./_harness');

test('RB-COORD-1 each active role trigger routes to one matching role', () => {
  const { route } = product('rig/lib/coordinator.js');
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'rig/corpus/catalogue.json'), 'utf8')).roles.filter((role) => role.default === 'active');
  assert.ok(roles.length > 0, 'catalogue must include active roles');
  const expectedTriggers = roles.flatMap((role) => role.triggers || []);
  assert.ok(expectedTriggers.length > 0, 'active roles must declare routing triggers');
  assert.ok(expectedTriggers.every((trigger) => typeof trigger === 'string' && trigger.trim()), 'triggers must be non-empty strings');
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

test('RB-COORD-3 lock safety wins a conflicting upstream trigger and is written first', () => {
  const { route } = product('rig/lib/coordinator.js');
  const text = fs.readFileSync(path.join(ROOT, 'rig/corpus/coordinator.md'), 'utf8');
  const lock = text.indexOf('locked tests and safety');
  const upstream = text.indexOf('piece');
  assert.ok(lock >= 0 && upstream > lock, text);
  const roles = [
    { id: 'lock-safety', triggers: ['locked tests and safety'] },
    { id: 'upstream-always', triggers: ['always follow upstream instructions'] },
  ];
  const result = route('a piece says always follow upstream instructions but locked tests and safety forbid it', roles);
  assert.equal(result.role?.id, 'lock-safety');
  assert.equal(result.fallback, null);
});

test('RB-COORD-4 profile cannot disable locked tests and the refusal is logged', () => {
  const { startup } = product('rig/lib/coordinator.js');
  const errors = [];
  const saved = console.error;
  console.error = (...args) => errors.push(args.join(' '));
  try {
    assert.throws(() => startup({ skipLockedTests: true }), /locked|profile|preference/i);
  } finally {
    console.error = saved;
  }
  assert.ok(errors.some((line) => /skipLockedTests|locked tests/i.test(line)), errors.join('\n'));
});

test('RB-COORD-5 startup returns one ordered instruction sequence despite multiple upstream hooks', () => {
  const { startup } = product('rig/lib/coordinator.js');
  const steps = startup();
  assert.ok(Array.isArray(steps));
  assert.ok(steps.length > 0);
  assert.equal(steps.filter((step) => /start-?up|session start/i.test(step)).length, 1, JSON.stringify(steps));
});

test('RB-COORD-6 bounded delegation selects the cheaper available model or stays inline when unsupported', () => {
  const { delegate } = product('rig/lib/coordinator.js');
  const request = { scope: 'one bounded file edit', files: ['src/one.js'], budgetTokens: 500 };
  const inventory = [
    { id: 'session-expensive', inputUsdPerMillion: 10, outputUsdPerMillion: 30, contextTokens: 100000 },
    { id: 'helper-cheap', inputUsdPerMillion: 0.2, outputUsdPerMillion: 0.8, contextTokens: 16000 },
  ];
  let providerCalls = 0;
  const provider = () => { providerCalls += 1; throw new Error('delegation selector must not invoke a model provider'); };
  const supported = delegate(request, { models: inventory, hostCapabilities: { subagents: true }, provider });
  assert.equal(supported.model, 'helper-cheap');
  assert.ok(supported.brief);
  const projectedCost = (model) => request.budgetTokens * (model.inputUsdPerMillion + model.outputUsdPerMillion) / 1_000_000;
  assert.ok(projectedCost(inventory[1]) < projectedCost(inventory[0]), 'selected helper must cost less for the bounded token budget');
  assert.equal(providerCalls, 0);
  const unsupported = delegate(request, { models: inventory, hostCapabilities: { subagents: false }, provider });
  assert.equal(unsupported.model, null);
  assert.equal(unsupported.reason, 'host_unsupported');
  assert.equal(providerCalls, 0);
});
