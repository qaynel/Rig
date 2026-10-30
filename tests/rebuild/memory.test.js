'use strict';

const test = require('node:test');
const { assert, fs, path, tempDir, product } = require('./_harness');

test('RB-MEM-1 memory recall finds a meaning match with networking disabled and no model download', () => {
  const memory = product('rig/catalog/baseline/memory.js');
  const embedding = product('rig/catalog/baseline/embedding.js');
  const repo = tempDir('rig-memory-offline-');
  const saved = { fetch: globalThis.fetch, connect: require('node:net').Socket.prototype.connect };
  const fail = () => { throw new Error('network access is forbidden in this test'); };
  globalThis.fetch = fail;
  require('node:net').Socket.prototype.connect = fail;
  try {
    memory.put(repo, { value: 'The checkout flow must reject expired payment cards.' });
    const hits = memory.recall(repo, 'decline stale credit card payments');
    assert.ok(hits.length > 0);
    assert.match(JSON.stringify(hits), /checkout|payment|card/i);
    assert.equal(embedding.available(), true);
  } finally {
    globalThis.fetch = saved.fetch;
    require('node:net').Socket.prototype.connect = saved.connect;
  }
});

test('RB-MEM-2 active view stays within 8 KB after 1,000 writes', () => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = tempDir('rig-memory-cap-');
  for (let i = 0; i < 1000; i += 1) memory.put(repo, { value: `ordinary note ${i} records a preference` });
  const view = memory.activeView(repo);
  assert.ok(Buffer.byteLength(JSON.stringify(view)) <= 8 * 1024);
});

test('RB-MEM-3 memory benchmark report compares pass rate and solved-task cost with intervals', () => {
  const runner = path.join(process.cwd(), 'benchmarks/harbor/report.py');
  assert.equal(fs.existsSync(runner), true);
  const result = require('node:child_process').spawnSync('python3', [runner, path.join(process.cwd(), 'tests/rebuild/fixtures/memory-results.jsonl')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.ok(report.pass_rate_interval);
  assert.ok(report.cost_per_solved_task_interval);
});

test('RB-MEM-4 memory role changes only when its full result interval beats the incumbent', () => {
  const report = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'wiki/specs/rebuild/benchmark-results/memory/decision.json'), 'utf8'));
  assert.equal(typeof report.owner_changed, 'boolean');
  if (report.owner_changed) assert.equal(report.winner_interval_entirely_better, true);
});
