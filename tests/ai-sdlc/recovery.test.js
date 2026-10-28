'use strict';

const test = require('node:test');
const { assert, fs, path, capability, tempRepo, write } = require('./_harness');

// F19 — kill and restart every phase before and after its side effect, then
// corrupt one record.
function runRepo() {
  const repo = tempRepo('rig-recovery-');
  write(repo, '.rig/run.json', { phase: 'verification', attempt: 2, stopped: 'review returned fail' });
  return repo;
}

test('PT-040 cold reader recovers these four facts from repo state alone', () => {
  const repo = runRepo();
  const record = capability('run-journal').read(repo);

  assert.equal(record.phase, 'verification');
  assert.equal(record.last_attempt, 2);
  assert.equal(record.stop_reason, 'review returned fail');
  assert.ok(record.next_action && typeof record.next_action === 'string', 'exactly one next action is stated');
  assert.equal(record.next_action.split('\n').length, 1);
});

test('PT-041 restart preserves idempotency and exact evidence pointer', () => {
  const repo = runRepo();
  const journal = capability('run-journal');
  let applied = 0;
  const effect = () => { applied += 1; return { receipt: 'receipt-001' }; };

  journal.once(repo, 'publish-receipt', effect);
  journal.once(repo, 'publish-receipt', effect);   // simulated restart after the side effect

  assert.equal(applied, 1, 'a completed side effect is never repeated');
  assert.equal(journal.read(repo).evidence['publish-receipt'], 'receipt-001', 'the exact evidence pointer survives restart');
});

test('PT-042 no pass is fabricated from missing records', () => {
  const repo = runRepo();
  const journal = capability('run-journal');
  write(repo, '.rig/evidence/full-gate.json', '{ truncated');

  const result = journal.complete(repo, { phase: 'verification' });

  assert.equal(result.completed, false);
  assert.match(result.gap, /full-gate/, 'the corrupt record is named');
  assert.equal(fs.existsSync(path.join(repo, '.rig/complete')), false, 'nothing is marked complete');
});
