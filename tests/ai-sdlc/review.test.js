'use strict';

const test = require('node:test');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { assert, capability, tempRepo, write } = require('./_harness');

function reviewEvidence(repo, rel, result) {
  return {
    path: rel,
    digest: crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, rel))).digest('hex'),
    check: { command: 'node --test tests/payment.test.js', result },
  };
}

// F16 — two review rounds with line drift, a malformed verdict, a timeout, an
// outage and a complete fail/pass.
function reviewRepo() {
  const repo = tempRepo('rig-review-');
  write(repo, 'src/pay.js', ['// header', 'function charge(cents) {', '  return cents;', '}', 'module.exports = { charge };'].join('\n'));
  return repo;
}

test('PT-034 remediation carries the exact batch, requires dispositions, and cannot certify itself', () => {
  const repo = reviewRepo();
  const review = capability('review-loop');
  review.record(repo, { round: 1, verdict: 'fail', findings: [{ file: 'src/pay.js', line: 3, problem: 'no currency validation' }] });

  const round2 = review.prepare(repo, { round: 2, diff: 'src/pay.js' });

  assert.equal(round2.phase, 'remediation');
  assert.equal(round2.unresolved.length, 1, 'the unresolved finding is carried into the next round');
  assert.equal(round2.unresolved[0].problem, 'no currency validation');
  assert.equal(round2.prior_batch[0].class, 'src/pay.js::no currency validation');
  assert.ok(round2.diff.includes('src/pay.js'), 'the reviewer receives the current diff');
  assert.throws(() => review.record(repo, { round: 2, verdict: 'pass', reviewer: round2.author }), /independent|self/i);
  assert.throws(() => review.record(repo, {
    round: 2, verdict: 'pass', reviewer: 'independent-reviewer', findings: [],
  }), /disposition every carried finding/);

  write(repo, 'src/pay.js', ['// header', 'function charge(cents) {', '  if (!Number.isInteger(cents)) throw new Error("invalid currency");', '  return cents;', '}', 'module.exports = { charge };'].join('\n'));
  const frozen = review.prepare(repo, { round: 2, diff: 'src/pay.js' });
  const resolved = review.record(repo, {
    round: 2, verdict: 'pass', reviewer: 'independent-reviewer', findings: [],
    dispositions: [{
      class: frozen.prior_batch[0].class,
      status: 'resolved',
      evidence: reviewEvidence(repo, 'src/pay.js', 'pass'),
    }],
  });
  assert.equal(resolved.unresolved.length, 0);
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
  review.prepare(repo, { round: 2, diff: 'src/pay.js' });
  review.record(repo, { round: 2, verdict: 'pass', reviewer: 'independent-reviewer', findings: [] });
  assert.equal(review.attempts(repo), before + 2, 'a pass never resets the cumulative attempt history');
  const ledger = JSON.parse(fs.readFileSync(path.join(repo, '.rig/review/ledger.json'), 'utf8'));
  assert.equal(ledger.rounds.length, 2, 'both complete rounds remain retrievable');
  assert.equal(ledger.rounds[0].verdict, 'fail');
});

test('PT-036 location drift preserves the same finding and requires evidence to keep it open', () => {
  const repo = reviewRepo();
  const review = capability('review-loop');
  review.record(repo, { round: 1, verdict: 'fail', findings: [{ file: 'src/pay.js', line: 3, problem: 'no currency validation' }] });

  write(repo, 'src/pay.js', ['// header', '// added comment', '// another', 'function charge(cents) {', '  return cents;', '}'].join('\n'));
  const round2 = review.prepare(repo, { round: 2, diff: 'src/pay.js' });

  assert.equal(round2.unresolved.length, 1, 'the same class survives a line move');
  assert.equal(round2.unresolved[0].line, 5, 'the finding is re-anchored to the moved line');
  assert.equal(round2.unresolved[0].problem, 'no currency validation');
  assert.equal(round2.phase, 'remediation');
  assert.throws(() => review.record(repo, {
    round: 2, verdict: 'fail', reviewer: 'reviewer-b', findings: [],
  }), /disposition every carried finding/);
  const keptOpen = review.record(repo, {
    round: 2, verdict: 'fail', reviewer: 'reviewer-b',
    findings: [{ file: 'src/pay.js', line: 5, problem: 'no currency validation' }],
    dispositions: [{
      class: round2.prior_batch[0].class,
      status: 'open',
      evidence: reviewEvidence(repo, 'src/pay.js', 'fail'),
    }],
  });
  assert.equal(keptOpen.unresolved.length, 1);
});
