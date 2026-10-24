'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F25 — the same defect twice and the same instruction twice, one positive and
// one negative historical case, a proposed check or skill, and an injected
// full-gate regression.
// F26 — improvement candidates targeting every protected class, one no-effect
// retry and one owner-approved change.
function historyRepo() {
  const repo = tempRepo('rig-learning-');
  write(repo, '.rig/history.json', {
    findings: [
      { id: 'f1', class: 'unchecked-null', where: 'src/a.js', round: 1 },
      { id: 'f2', class: 'unchecked-null', where: 'src/b.js', round: 7 },
      { id: 'f3', class: 'slow-query', where: 'src/c.js', round: 3 },
    ],
    instructions: [
      { id: 'i1', text: 'Always run the focused test before the full gate.', at: '2026-09-01' },
      { id: 'i2', text: 'Run the focused test first, then the full gate.', at: '2026-10-01' },
    ],
    cases: [{ id: 'pos', fails_before: true }, { id: 'neg', fails_before: false }],
  });
  return repo;
}

test('PT-059 duplicate class has two source links and one candidate', () => {
  const repo = historyRepo();
  const candidates = capability('learning').candidates(repo);

  const nulls = candidates.filter((c) => c.class === 'unchecked-null');
  assert.equal(nulls.length, 1, 'two occurrences create exactly one candidate');
  assert.deepEqual(nulls[0].sources.sort(), ['f1', 'f2']);
  assert.equal(candidates.some((c) => c.class === 'slow-query'), false, 'a single occurrence is not yet a candidate');
});

test('PT-060 before/after fixture and positive/negative replay are attached', () => {
  const repo = historyRepo();
  const learning = capability('learning');
  const [candidate] = learning.candidates(repo).filter((c) => c.class === 'unchecked-null');

  const gap = learning.evaluate(repo, candidate.id);
  assert.equal(gap.replay.pos.caught, null, 'a declared flag is not a caught failure');
  assert.match(gap.gap, /execution evidence/);
  assert.equal(gap.admits_learning, false);

  write(repo, '.rig/history.json', {
    findings: [
      { id: 'f1', class: 'unchecked-null', where: 'src/a.js', round: 1 },
      { id: 'f2', class: 'unchecked-null', where: 'src/b.js', round: 7 },
    ],
    cases: [{ id: 'pos', fails_before: true, input: null }, { id: 'neg', fails_before: false, input: 1 }],
  });
  write(repo, 'before.js', 'module.exports = () => false;\n');
  write(repo, 'check.js', 'module.exports = (value) => value === null;\n');
  const evaluation = learning.evaluate(repo, candidate.id, { before: 'before.js', check: 'check.js' });

  assert.equal(evaluation.evidence_kind, 'executed');
  assert.equal(evaluation.replay.pos.caught, true, 'the previously failing case is caught by running the check');
  assert.equal(evaluation.replay.neg.caught, false, 'a known-good case is not newly flagged');
  assert.equal(evaluation.outcome, 'helped');
  assert.equal(evaluation.admits_learning, true);
});

test('PT-061 promotion fails on regression or missing proof', () => {
  const repo = historyRepo();
  const learning = capability('learning');
  const [candidate] = learning.candidates(repo).filter((c) => c.class === 'unchecked-null');

  const regressed = learning.promote(repo, candidate.id, { full_gate: { passed: false, failures: ['tests/x.test.js'] } });
  assert.equal(regressed.promoted, false);
  assert.match(regressed.reason, /regress|gate/i);

  const unproven = learning.promote(repo, candidate.id, { full_gate: { passed: true }, evaluation: null });
  assert.equal(unproven.promoted, false);
  assert.match(unproven.reason, /proof|evaluation/i);
});

test('PT-075 two occurrences create one scoped candidate without automatic protected promotion', () => {
  const repo = historyRepo();
  const learning = capability('learning');

  const repeated = learning.candidates(repo).filter((c) => c.kind === 'instruction');
  assert.equal(repeated.length, 1, 'a repeated instruction yields one candidate');
  assert.deepEqual(repeated[0].sources.sort(), ['i1', 'i2']);
  assert.ok(repeated[0].scope, 'the candidate is scoped');
  assert.equal(repeated[0].auto_promote, false, 'it is considered, never promoted into protected territory automatically');
});

test('PT-062 improvement cannot alter oracle, policy, trust, security, evaluator or release authority', () => {
  const repo = historyRepo();
  const learning = capability('learning');

  for (const target of ['oracle', 'policy', 'trust', 'security', 'evaluator', 'release-authority']) {
    const attempt = learning.apply(repo, { target, change: 'relax the check' });
    assert.equal(attempt.applied, false, `${target} must reject an automatic write`);
    assert.match(attempt.reason, /protected|owner/i);
  }
});

test('PT-063 second identical proposal abstains and cites prior failure', () => {
  const repo = historyRepo();
  const learning = capability('learning');
  const [candidate] = learning.candidates(repo).filter((c) => c.class === 'unchecked-null');
  learning.record(repo, { candidate: candidate.id, outcome: 'no observed effect' });

  const again = learning.propose(repo, candidate.id);

  assert.equal(again.proposed, false);
  assert.match(again.reason, /prior|no observed effect/i);
  assert.ok(again.cites, 'the abstention cites the earlier trial');
  assert.equal(learning.propose(repo, candidate.id, { new_evidence: { case: 'f4' } }).proposed, true, 'new evidence reopens it');
});

test('PT-064 the agent cannot self-approve protected candidate bytes', () => {
  const repo = historyRepo();
  const learning = capability('learning');

  const proposal = learning.apply(repo, { target: 'policy', change: 'add a check', owner_approved: false });
  assert.equal(proposal.applied, false);
  assert.equal(proposal.awaiting, 'owner-key');
  assert.ok(proposal.proposal_path, 'the change is left as a proposal the owner can sign');

  const forged = learning.apply(repo, { target: 'policy', change: 'add a check', owner_approved: true, signed_by: 'agent' });
  assert.equal(forged.applied, false, 'only the owner key authorises a protected change');
});
