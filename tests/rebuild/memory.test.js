'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run, sha256, networkBlockerSource, product } = require('./_harness');

test('RB-MEM-1 memory recall finds a meaning match with networking disabled and no model download', t => {
  const repo = tempDir('rig-memory-offline-');
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  const calls = path.join(repo, 'network-attempts.log');
  const blocker = write(repo, 'deny-network.cjs', networkBlockerSource(calls));
  const installed = run('sh', [path.join(ROOT, 'rig/bootstrap.sh'), '--target', repo, '--hosts', 'codex'], {
    cwd: ROOT,
    env: { ...process.env, NODE_OPTIONS: `--require=${blocker}` },
  });
  assert.equal(installed.status, 0, installed.stderr || installed.stdout);
  const baseline = path.join(repo, '.rig/kit/rig/catalog/baseline');
  const memoryFile = path.join(baseline, 'memory.js');
  const embeddingFile = path.join(baseline, 'embedding.js');
  assert.ok(fs.existsSync(memoryFile), 'fresh install is missing the memory interface');
  assert.ok(fs.existsSync(embeddingFile), 'fresh install is missing the offline embedding interface');
  const modelDir = path.join(baseline, 'assets/potion-base-2m');
  const modelInventory = () => {
    const files = [];
    const walk = (dir) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else files.push([path.relative(modelDir, file), sha256(fs.readFileSync(file))]); } };
    walk(modelDir);
    return files.sort(([a], [b]) => a.localeCompare(b));
  };
  assert.ok(fs.existsSync(modelDir), 'fresh install is missing the local embedding model');
  const before = modelInventory();
  assert.ok(before.length > 0, 'offline model must include actual local bytes');
  const script = write(repo, 'check-memory.cjs', `
const assert=require('node:assert/strict');
const memory=require(${JSON.stringify(memoryFile)});
const embedding=require(${JSON.stringify(embeddingFile)});
const repo=${JSON.stringify(repo)};
memory.put(repo,{id:'pipeline',value:'Overnight data pipelines should finish before dawn.',source:'fixture:pipeline'});
memory.put(repo,{id:'vehicle-storage',value:'Keep the car inside the garage.',source:'fixture:parking'});
const result=memory.recallDetailed(repo,'Where should the automobile be parked overnight?');
assert.equal(result.semantic.ok,true,result.semantic.failure);
assert.equal(result.mode,'semantic');
assert.equal(result.hits[0]?.id,'vehicle-storage','meaning must outrank the unrelated shared-word note');
assert.equal(result.hits[0]?.source,'fixture:parking');
assert.equal(embedding.failure(),null);
process.stdout.write(JSON.stringify({mode:result.mode,top:result.hits[0].id}));
`);
  const sandbox = product('rig/lib/sandbox.js');
  const availability = sandbox.detectSandboxSync();
  assert.equal(availability.available, true, `environment-bound criterion: ${availability.reason || availability.code}`);
  const searched = sandbox.runSandboxed(availability.kind, { script, outDir: repo, readDirs: [repo], timeoutMs: 30000,
    env: { NODE_OPTIONS: `--require=${blocker}`, RIG_HOME: path.join(repo, 'isolated-home') } });
  assert.equal(searched.status, 0, searched.stderr || searched.stdout);
  assert.deepEqual(JSON.parse(searched.stdout), { mode: 'semantic', top: 'vehicle-storage' });
  assert.deepEqual(modelInventory(), before, 'search must use the installed local model without downloading model files');
  assert.equal(fs.existsSync(calls), false, fs.existsSync(calls) ? fs.readFileSync(calls, 'utf8') : '');
});

test('RB-MEM-2 active view stays within 8 KB after 1,000 writes', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = tempDir('rig-memory-cap-');
  const saved = process.env.RIG_HOME;
  process.env.RIG_HOME = path.join(repo, 'isolated-home');
  t.after(() => {
    if (saved === undefined) delete process.env.RIG_HOME; else process.env.RIG_HOME = saved;
    fs.rmSync(repo, { recursive: true, force: true });
  });
  for (let i = 0; i < 1000; i += 1) memory.put(repo, { id: `note-${i}`, source: `fixture-${i}`, value: `ordinary note ${i} records a preference` });
  const view = memory.activeView(repo);
  assert.equal(Buffer.byteLength(view, 'utf8') <= 8 * 1024, true, 'active view must fit the actual UTF-8 byte cap');
  for (let i = 0; i < 1000; i += 1) assert.equal(memory.get(repo, `note-${i}`)?.source, `fixture-${i}`, `note-${i} must remain retrievable`);
});

test('RB-MEM-3 memory benchmark report compares pass rate and solved-task cost with intervals', () => {
  const runner = path.join(ROOT, 'benchmarks/harbor/report.py');
  const fixture = tempDir('rig-memory-report-');
  const sessions = [];
  for (const arm of ['rig-memory', 'candidate-memory']) {
    for (const task of ['a', 'b', 'c', 'd']) {
      for (let run = 1; run <= 3; run += 1) {
        sessions.push({ arm, task, model: 'fixture-model', seed: run, run, passed: arm === 'rig-memory' || task !== 'd',
          tokens_in: 100, tokens_out: 50, cost_usd: arm === 'rig-memory' ? 1 : 1.5, tampered: false, sloc: 10, interventions: 0, fit_tokens: 5 });
      }
    }
  }
  const file = write(fixture, 'sessions.jsonl', `${sessions.map((row) => JSON.stringify(row)).join('\n')}\n`);
  const result = run('python3', [runner, file], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const comparison = report.comparisons.find((row) => JSON.stringify(row).includes('candidate-memory'));
  assert.ok(comparison, 'report must compare the candidate memory arm with the shipped memory arm');
  assert.ok(comparison.pass_rate_difference_interval);
  assert.ok(comparison.cost_per_solved_task_ratio_interval);
});

test('RB-MEM-4 memory role changes only when its full result interval beats the incumbent', () => {
  const root = path.join(ROOT, 'wiki/specs/rebuild/benchmark-results/memory');
  const file = path.join(root, 'sessions.jsonl');
  const result = run('python3', [path.join(ROOT, 'benchmarks/harbor/report.py'), file], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  const decision = JSON.parse(fs.readFileSync(path.join(root, 'decision.json'), 'utf8'));
  assert.equal(typeof decision.owner_changed, 'boolean');
  assert.equal(decision.shipped_owner, 'rig-offline');
  assert.ok(decision.owner_before && decision.owner_after);
  assert.equal(decision.owner_changed, decision.owner_before !== decision.owner_after);
  if (decision.owner_changed) {
    assert.equal(decision.owner_before, decision.shipped_owner, 'a candidate may replace only the shipped offline incumbent');
    const comparison = report.comparisons.find((row) => JSON.stringify(row).includes(decision.owner_after));
    assert.ok(comparison, `no measured comparison for selected owner ${decision.owner_after}`);
    assert.ok(comparison.arms?.includes(decision.shipped_owner), 'comparison must include the shipped incumbent');
    assert.ok(comparison.arms?.includes(decision.owner_after), 'comparison must include the selected owner');
    const passInterval = comparison.pass_rate_difference_interval;
    const costInterval = comparison.cost_per_solved_task_ratio_interval;
    assert.ok(passInterval && passInterval.lower > 0, 'candidate pass-rate interval must be entirely better');
    assert.ok(costInterval && costInterval.upper < 1, 'candidate solved-task cost interval must be entirely better');
  } else {
    assert.equal(decision.owner_before, decision.shipped_owner);
    assert.equal(decision.owner_after, decision.shipped_owner, 'without a measured win the shipped offline memory remains active');
  }
});
