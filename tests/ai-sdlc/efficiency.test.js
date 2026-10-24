'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F30 — an instrumented task run with stubbed model calls of every class, two
// runs delivering identical accepted evidence with differing retries, a
// benchmark replay of the named scenarios offline, a ratio-improving candidate
// that fails a guardrail check, and a repeated identical file read.
// Until `rig/catalog/baseline/efficiency.js` ships, capability() throws the
// exact gap: this is the preimplementation red for R080–R084.
function taskRepo(calls, reads = []) {
  const repo = tempRepo('rig-efficiency-');
  write(repo, '.rig/run.json', {
    task: 't1',
    accepted_evidence: ['AC-001'],
    calls, // {class, logical_tokens, billable_tokens, cached}
    file_reads: reads,
  });
  return repo;
}

const CALLS = [
  { class: 'retrieval', logical_tokens: 100, billable_tokens: 10, cached: true },
  { class: 'reviewer', logical_tokens: 200, billable_tokens: 200, cached: false },
  { class: 'compaction', logical_tokens: 50, billable_tokens: 50, cached: false },
  { class: 'failed_attempt', logical_tokens: 80, billable_tokens: 80, cached: false },
  { class: 'delegation', logical_tokens: 120, billable_tokens: 120, cached: false },
  { class: 'recovery', logical_tokens: 40, billable_tokens: 40, cached: false },
];

test('PT-080 a completed task reports token/cost/time accounting with no uncounted call class', () => {
  const repo = taskRepo(CALLS);
  const ledger = capability('efficiency').account(repo, 't1');

  const classes = ledger.calls.map((c) => c.class).sort();
  assert.deepEqual(classes, ['compaction', 'delegation', 'failed_attempt', 'recovery', 'retrieval', 'reviewer'],
    'every call class is counted, including failed attempts and recovery');
  assert.equal(ledger.logical_tokens, 590, 'logical token total sums all classes');
  assert.ok(ledger.billable_tokens < ledger.logical_tokens, 'cache effect makes billable below logical');
  assert.ok(typeof ledger.wall_ms === 'number', 'wall time is recorded');
});

test('PT-081 same accepted evidence ranks by tokens, so more retries lower the ratio', () => {
  const lean = taskRepo(CALLS);
  const wasteful = taskRepo([...CALLS, { class: 'failed_attempt', logical_tokens: 300, billable_tokens: 300, cached: false }]);
  const eff = capability('efficiency');

  const a = eff.ratio(lean, 't1');
  const b = eff.ratio(wasteful, 't1');
  assert.equal(a.accepted_work, b.accepted_work, 'both deliver the same accepted evidence');
  assert.ok(a.ratio > b.ratio, 'the run with an extra retry has a lower efficiency ratio');
});

test('PT-082 a benchmark emits a recorded baseline and a target without one is rejected', () => {
  const repo = tempRepo('rig-efficiency-bench-');
  const eff = capability('efficiency');

  const baseline = eff.benchmark(repo, { offline: true });
  assert.ok(Array.isArray(baseline.scenarios) && baseline.scenarios.length === 10,
    'the ten named scenarios are replayed');
  assert.ok(baseline.scenarios.every((s) => typeof s.ratio === 'number'), 'each scenario records a measured ratio');
  assert.throws(() => eff.assertTarget(repo, { ratio: 2.0 }),
    /baseline/i, 'an efficiency target with no recorded baseline is rejected');
});

test('PT-083 a ratio-improving candidate that fails a guardrail does not promote', () => {
  const repo = taskRepo(CALLS);
  const eff = capability('efficiency');

  const verdict = eff.evaluateCandidate(repo, {
    ratio_delta: +0.5,
    checks: { acceptance: 'pass', coverage: 'fail', security: 'pass' },
  });
  assert.equal(verdict.promoted, false, 'a dropped coverage check blocks promotion');
  assert.match(verdict.reason, /coverage/i, 'the failing guardrail is named');
});

test('PT-084 a repeated identical read surfaces a counted redundancy signal', () => {
  const repo = taskRepo(CALLS, ['src/a.js', 'src/b.js', 'src/a.js']);
  const signal = capability('efficiency').redundancy(repo, 't1');

  assert.equal(signal.repeated_reads['src/a.js'], 2, 'the duplicate read is counted');
  assert.ok(!('src/b.js' in signal.repeated_reads), 'a single read is not flagged');
});
