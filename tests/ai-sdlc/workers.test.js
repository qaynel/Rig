'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, read, SECRET_FIXTURE } = require('./_harness');

// F13 — worker scope with allowed sources, an unrelated secret and a false
// self-verification. F14 — two writers with overlapping files plus one disjoint
// writer, with one owner crashed.
function workerRepo() {
  const repo = tempRepo('rig-worker-');
  write(repo, 'src/allowed.js', 'module.exports = 1;\n');
  write(repo, 'src/unrelated.js', 'module.exports = 2;\n');
  write(repo, '.env', `API_TOKEN=${SECRET_FIXTURE}\n`);
  write(repo, 'private/notes.md', 'Internal salary planning.\n');
  return repo;
}

const SCOPE = { id: 'WP01', owns: ['src/allowed.js'], sources: ['src/allowed.js'], criteria: ['AC-001'] };

test('PT-028 child context excludes unrelated project and private state', () => {
  const repo = workerRepo();
  const brief = capability('workers').brief(repo, SCOPE);
  const text = JSON.stringify(brief);

  assert.match(text, /src\/allowed\.js/);
  assert.doesNotMatch(text, /unrelated\.js/, 'unrelated project state must not reach the worker');
  assert.doesNotMatch(text, /salary/, 'private state must not reach the worker');
  assert.deepEqual(brief.criteria, ['AC-001'], 'the worker receives only its acceptance slice');
});

test('PT-067 secret fixture is absent from child payload and published artifacts', () => {
  const repo = workerRepo();
  const workers = capability('workers');
  const brief = workers.brief(repo, SCOPE);
  const artifact = workers.publish(repo, SCOPE);

  for (const [name, payload] of [['brief', JSON.stringify(brief)], ['artifact', read(repo, artifact)]]) {
    assert.doesNotMatch(payload, new RegExp(SECRET_FIXTURE), `${name} must not carry the secret`);
    assert.doesNotMatch(payload, /API_TOKEN/, `${name} must not carry the secret name`);
  }
});

test('PT-031 worker self-report alone cannot complete a package', () => {
  const repo = workerRepo();
  const workers = capability('workers');

  const result = workers.accept(repo, { package: 'WP01', self_report: { passed: true }, evidence: [] });

  assert.equal(result.accepted, false);
  assert.match(result.reason, /independent|evidence/i);
  assert.equal(workers.state(repo, 'WP01').status, 'open', 'the package stays open without independent evidence');
});

test('PT-029 concurrent writers with overlapping ownership stop before conflicting mutation', () => {
  const repo = workerRepo();
  const workers = capability('workers');

  const first = workers.reserve(repo, { package: 'WP01', owns: ['src/allowed.js'] });
  const overlapping = workers.reserve(repo, { package: 'WP02', owns: ['src/allowed.js'] });
  const disjoint = workers.reserve(repo, { package: 'WP03', owns: ['src/unrelated.js'] });

  assert.equal(first.granted, true);
  assert.equal(overlapping.granted, false);
  assert.match(overlapping.conflict, /src\/allowed\.js/);
  assert.equal(disjoint.granted, true, 'independent work continues');
  assert.equal(read(repo, 'src/allowed.js'), 'module.exports = 1;\n', 'no conflicting mutation occurred');
});

test('PT-030 an expired owner is reported and reclaimed only after evidence check', () => {
  const repo = workerRepo();
  const workers = capability('workers');
  workers.reserve(repo, { package: 'WP01', owns: ['src/allowed.js'], lease_seconds: 0 });

  const stale = workers.reserve(repo, { package: 'WP02', owns: ['src/allowed.js'] });
  assert.equal(stale.granted, false);
  assert.match(stale.conflict, /stale|expired/i, 'an expired owner is reported, not silently overwritten');

  const reclaimed = workers.reclaim(repo, { package: 'WP02', owns: ['src/allowed.js'], evidence: { owner_exited: true, no_pending_writes: true } });
  assert.equal(reclaimed.granted, true);
  assert.ok(reclaimed.evidence_checked, 'reclaim records the evidence it relied on');
  assert.equal(workers.reclaim(repo, { package: 'WP03', owns: ['src/allowed.js'], evidence: {} }).granted, false, 'no lock theft without evidence');
});
