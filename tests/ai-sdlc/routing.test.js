'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F12 — mechanical, bounded, risky, failed-cheap and provider-down tasks with
// stubbed provider calls and prices.
function routingRepo() {
  const repo = tempRepo('rig-route-');
  write(repo, '.rig/model-inventory.json', {
    models: [
      { id: 'light', capability: 'mechanical', price_class: 'cheap', available: true },
      { id: 'strong', capability: 'judgement', price_class: 'expensive', available: true },
      { id: 'offline', capability: 'judgement', price_class: 'cheap', available: false },
    ],
    budget: { max_spend_units: 10 },
  });
  return repo;
}

const stub = () => { const calls = []; return { calls, call: (model) => { calls.push(model); return { ok: true }; } }; };

test('PT-025 count, key and manifest tasks make zero model calls', () => {
  const repo = routingRepo();
  const provider = stub();
  const routing = capability('model-routing');

  for (const task of ['count-files', 'read-key', 'build-manifest']) {
    routing.run(repo, { task, kind: 'mechanical' }, { provider: provider.call });
  }

  assert.deepEqual(provider.calls, [], 'mechanical work must be done by a deterministic tool');
  const log = routing.log(repo);
  assert.equal(log.filter((e) => e.mechanism === 'deterministic').length, 3);
});

test('PT-026 routing records capability, price class and selection reason', () => {
  const repo = routingRepo();
  const routing = capability('model-routing');

  routing.run(repo, { task: 'summarise-diff', kind: 'bounded', risk: 'low' }, { provider: stub().call });

  const [entry] = routing.log(repo).slice(-1);
  assert.equal(entry.model, 'light', 'the least expensive model that meets the need is selected');
  assert.equal(entry.capability, 'mechanical');
  assert.equal(entry.price_class, 'cheap');
  assert.ok(entry.reason && entry.reason.length > 0, 'the selection reason is recorded, not implied');
});

test('PT-027 one failed cheap attempt escalates or stops with reason, never loops without bound', () => {
  const repo = routingRepo();
  const attempts = [];
  const provider = (model) => { attempts.push(model); if (model === 'light') throw new Error('weak evidence'); return { ok: true }; };
  const routing = capability('model-routing');

  const result = routing.run(repo, { task: 'judge-security-change', kind: 'bounded', risk: 'high' }, { provider });

  assert.ok(attempts.length <= 2, `a failed cheap attempt must not loop: ${attempts.join(',')}`);
  assert.ok(result.escalated || result.stopped, 'the attempt either escalates once or stops');
  assert.ok(result.reason, 'the escalation or stop carries its reason');
  const [entry] = routing.log(repo).slice(-1);
  assert.ok(entry.escalation_reason || entry.stop_reason);
});

test('PT-065 cap breach produces a blocked record and actual/unknown cost, never zero by default', () => {
  const repo = routingRepo();
  write(repo, '.rig/spend.json', { used_units: 10 });
  const provider = stub();
  const routing = capability('model-routing');

  const result = routing.run(repo, { task: 'long-analysis', kind: 'bounded', risk: 'low' }, { provider: provider.call });

  assert.equal(result.blocked, true);
  assert.deepEqual(provider.calls, [], 'an exhausted cap stops before the call');
  const [entry] = routing.log(repo).slice(-1);
  assert.equal(entry.blocked, true);
  assert.notEqual(entry.cost, 0, 'cost is the actual figure or unknown, never a default zero');
  assert.ok(entry.cost === 'unknown' || typeof entry.cost === 'number');
});
