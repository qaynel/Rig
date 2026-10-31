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

// Owner rulings 2026-10-31 (register C8, C13): one memory system; old sessions summarised by the user's own model.
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-10-31T12:00:00Z');
const memoryRepo = (t) => {
  const repo = tempDir('rig-memory-sessions-');
  const saved = process.env.RIG_HOME;
  process.env.RIG_HOME = path.join(repo, 'isolated-home');
  t.after(() => { if (saved === undefined) delete process.env.RIG_HOME; else process.env.RIG_HOME = saved; fs.rmSync(repo, { recursive: true, force: true }); });
  return repo;
};
const withNetworkCounter = (fn) => {
  const net = require('node:net'); const http = require('node:http'); const https = require('node:https');
  const saved = { connect: net.Socket.prototype.connect, http: http.request, https: https.request, fetch: global.fetch };
  let attempts = 0;
  const deny = () => { attempts += 1; throw new Error('network denied'); };
  net.Socket.prototype.connect = deny; http.request = deny; https.request = deny; global.fetch = deny;
  try { return { value: fn(), attempts: () => attempts }; } finally {
    net.Socket.prototype.connect = saved.connect; http.request = saved.http; https.request = saved.https; global.fetch = saved.fetch;
  }
};

test('RB-MEM-5 a compaction request lists only sessions older than the verbatim window and names the shipped summary instruction without any network call', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = memoryRepo(t);
  memory.putSession(repo, { id: 'old-a', at: new Date(NOW - 40 * DAY).toISOString(), text: 'We chose Postgres for the order history because of reporting joins.' });
  memory.putSession(repo, { id: 'old-b', at: new Date(NOW - 20 * DAY).toISOString(), text: 'The checkout retries card payments once before showing an error.' });
  memory.putSession(repo, { id: 'recent', at: new Date(NOW - 2 * DAY).toISOString(), text: 'Today we renamed the cart service.' });
  const { value: request, attempts } = withNetworkCounter(() => memory.compactionRequest(repo, { now: NOW, verbatimDays: 14 }));
  assert.equal(attempts(), 0);
  assert.deepEqual(request.sessions.map((row) => row.id).sort(), ['old-a', 'old-b']);
  assert.match(request.instruction, /\.md$/);
  assert.ok(fs.existsSync(path.join(ROOT, request.instruction)), `missing shipped instruction ${request.instruction}`);
});

test('RB-MEM-6 sessions inside the verbatim window are recalled word for word and never offered for summarising', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = memoryRepo(t);
  const text = 'Today we renamed the cart service to basket and kept the old route as a redirect.';
  memory.putSession(repo, { id: 'recent', at: new Date(NOW - 1 * DAY).toISOString(), text });
  const request = memory.compactionRequest(repo, { now: NOW, verbatimDays: 14 });
  assert.equal(request.sessions.some((row) => row.id === 'recent'), false);
  const hit = memory.recallDetailed(repo, 'what did we rename the cart service to', { now: NOW }).hits.find((row) => row.id === 'recent');
  assert.ok(hit, 'recent session must be recallable');
  assert.equal(hit.kind, 'verbatim');
  assert.equal(hit.value, text);
});

test('RB-MEM-7 an applied summary is recalled in place of its old session and links to the retained original', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = memoryRepo(t);
  const original = 'Long discussion: we compared Postgres and Mongo, measured reporting joins, and chose Postgres for order history.';
  memory.putSession(repo, { id: 'old-a', at: new Date(NOW - 40 * DAY).toISOString(), text: original });
  memory.applySummary(repo, { sessionId: 'old-a', summary: 'Chose Postgres for order history (reporting joins).', model: 'the user agent model' });
  const hits = memory.recallDetailed(repo, 'which database did we choose for order history', { now: NOW }).hits;
  const top = hits.find((row) => row.original === 'old-a');
  assert.ok(top, 'summary must be recallable');
  assert.equal(top.kind, 'summary');
  assert.equal(hits.filter((row) => row.id === 'old-a' && row.kind === 'verbatim').length, 0, 'the summarised session must not also be returned verbatim');
  assert.equal(memory.getSession(repo, 'old-a').text, original, 'the original must be retained as evidence');
});

test('RB-MEM-8 the memory engine and its summary instruction name no model provider or remote endpoint', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = memoryRepo(t);
  memory.putSession(repo, { id: 'old', at: new Date(NOW - 40 * DAY).toISOString(), text: 'old note' });
  const { instruction } = memory.compactionRequest(repo, { now: NOW, verbatimDays: 14 });
  const provider = /\b(openai|anthropic|voyage|cohere|gemini|openrouter|mistral|bedrock|vertex)\b|@anthropic-ai|api[_-]?key|https?:\/\//i;
  for (const file of ['rig/catalog/baseline/memory.js', 'rig/catalog/baseline/embedding.js', instruction]) {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.equal(provider.test(text), false, `${file} names a provider or endpoint: ${text.match(provider)?.[0]}`);
  }
});

test('RB-MEM-9 one recall over the light store and an added heavy store returns each record once', t => {
  const memory = product('rig/catalog/baseline/memory.js');
  const repo = memoryRepo(t);
  memory.put(repo, { id: 'garage', value: 'Keep the car inside the garage.', source: 'fixture:light' });
  memory.registerStore(repo, 'heavy', { search: () => [
    { id: 'garage', value: 'Keep the car inside the garage.', source: 'fixture:heavy-copy', score: 0.9 },
    { id: 'driveway', value: 'Visitors park on the driveway.', source: 'fixture:heavy', score: 0.8 },
  ] });
  const ids = memory.recallDetailed(repo, 'where should the car be parked').hits.map((row) => row.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate records: ${ids.join(', ')}`);
  assert.ok(ids.includes('garage') && ids.includes('driveway'), ids.join(', '));
});
