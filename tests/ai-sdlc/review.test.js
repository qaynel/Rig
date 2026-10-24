'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F16 — two review rounds with line drift, a malformed verdict, a timeout, an
// outage and a complete fail/pass.
function reviewRepo() {
  const repo = tempRepo('rig-review-');
  write(repo, 'src/pay.js', ['// header', 'function charge(cents) {', '  return cents;', '}', 'module.exports = { charge };'].join('\n'));
  return repo;
}

test('PT-034 repeat review includes carried findings and cannot certify itself', () => {
  const repo = reviewRepo();
  const review = capability('review-loop');
  review.record(repo, { round: 1, verdict: 'fail', findings: [{ file: 'src/pay.js', line: 3, problem: 'no currency validation' }] });

  const round2 = review.prepare(repo, { round: 2, diff: 'src/pay.js' });

  assert.equal(round2.unresolved.length, 1, 'the unresolved finding is carried into the next round');
  assert.equal(round2.unresolved[0].problem, 'no currency validation');
  assert.ok(round2.diff.includes('src/pay.js'), 'the reviewer receives the current diff');
  assert.throws(() => review.record(repo, { round: 2, verdict: 'pass', reviewer: round2.author }), /independent|self/i);
});

test('PT-035 outage, malformed output and timeout leave authorization unconsumed', () => {
  const repo = reviewRepo();
  const review = capability('review-loop');
  const before = review.attempts(repo);

  for (const failure of [{ error: 'provider outage' }, { verdict: '???' }, { error: 'timeout' }]) {
    try { review.record(repo, { round: 1, ...failure }); } catch { /* refusal is expected */ }
  }

  assert.equal(review.attempts(repo), before, 'no attempt is consumed without a completed verdict');
  review.record(repo, { round: 1, verdict: 'fail', findings: [] });
  assert.equal(review.attempts(repo), before + 1, 'a completed verdict consumes exactly one attempt');
});

test('PT-036 location drift does not erase the same unresolved class', () => {
  const repo = reviewRepo();
  const review = capability('review-loop');
  review.record(repo, { round: 1, verdict: 'fail', findings: [{ file: 'src/pay.js', line: 3, problem: 'no currency validation' }] });

  write(repo, 'src/pay.js', ['// header', '// added comment', '// another', 'function charge(cents) {', '  return cents;', '}'].join('\n'));
  const round2 = review.prepare(repo, { round: 2, diff: 'src/pay.js' });

  assert.equal(round2.unresolved.length, 1, 'the same class survives a line move');
  assert.equal(round2.unresolved[0].line, 5, 'the finding is re-anchored to the moved line');
  assert.equal(round2.unresolved[0].problem, 'no currency validation');
});
