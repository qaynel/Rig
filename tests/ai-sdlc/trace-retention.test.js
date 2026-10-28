'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, read } = require('./_harness');

// F24 — long active run with timed traces, a duplicated old trace, a missing
// source map and a valid cold archive, counting external-provider calls.
function traceRepo() {
  const repo = tempRepo('rig-trace-');
  const start = Date.parse('2026-10-24T09:00:00Z');
  for (const [i, minutes] of [0, 2, 4, 11, 13].entries()) {
    write(repo, `wiki/reasoning/trace-${i}.md`, `---\nat: ${new Date(start + minutes * 60000).toISOString()}\n---\n\nStep ${i}.\n`);
  }
  return { repo, start };
}

test('PT-056 a long run has no untraced interval over the cadence', () => {
  const { repo, start } = traceRepo();
  const retention = capability('trace-retention');

  const audit = retention.cadence(repo, { started: new Date(start).toISOString(), cadence_minutes: 3 });

  assert.equal(audit.within_cadence, false, 'the 4-to-11 minute gap must be found');
  assert.equal(audit.gaps.length, 1);
  assert.equal(audit.gaps[0].minutes, 7);
  assert.match(audit.gaps[0].after, /trace-2\.md/);
});

test('PT-057 compaction preserves immutable trace bodies, decisions and protected evidence', () => {
  const { repo } = traceRepo();
  write(repo, 'wiki/reasoning/trace-dup.md', '---\nat: 2026-10-24T09:02:00Z\n---\n\nStep 1.\n');
  const retention = capability('trace-retention');
  const before = retention.sourceMap(repo);

  const result = retention.compact(repo);

  for (const [fact, source] of Object.entries(before.facts)) {
    assert.ok(retention.lookup(repo, fact), `${fact} must remain findable after compaction`);
    assert.equal(retention.lookup(repo, fact).origin, source, `${fact} keeps its original source`);
  }
  assert.ok(read(repo, 'wiki/reasoning/trace-0.md').includes('Step 0.'), 'an immutable body is never rewritten');
  assert.ok(result.archived.length > 0, 'compaction does move cold material');
});

test('PT-058 injected omission blocks move/delete and reports missing source', () => {
  const { repo } = traceRepo();
  const retention = capability('trace-retention');

  const result = retention.compact(repo, { inject_omission: 'trace-3.md' });

  assert.equal(result.applied, false);
  assert.match(result.missing_source, /trace-3\.md/);
  assert.ok(read(repo, 'wiki/reasoning/trace-3.md').includes('Step 3.'), 'the original record is intact after a failed fidelity check');
  assert.deepEqual(result.archived, []);
});

test('PT-076 ordinary memory upkeep makes zero external-provider calls', () => {
  const { repo } = traceRepo();
  const retention = capability('trace-retention');
  const calls = [];

  retention.upkeep(repo, { provider: (...args) => { calls.push(args); return {}; } });

  assert.deepEqual(calls, [], 'indexing, projection and compaction are local deterministic work');
  assert.equal(retention.lastUpkeep(repo).paid_calls, 0);
});
