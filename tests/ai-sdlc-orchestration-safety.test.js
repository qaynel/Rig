'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const baseline = path.resolve(__dirname, '../rig/catalog/baseline');
const workers = require(`${baseline}/workers`);
const repo = (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-orchestration-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, '.rig'), { recursive: true });
  return dir;
};
const write = (dir, rel, value) => {
  const file = path.join(dir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
};
const gateFixture = (dir) => {
  write(dir, 'package.json', { scripts: { test: 'node gate.js' } });
  write(dir, 'gate.js', "require('node:assert/strict').equal(1+1,2);");
};
const verifyFixture = (dir, pkg) => {
  require(`${baseline}/run-journal`).recordGreen(dir, { package: pkg, command: 'node gate.js', gate: 'npm test' });
  const review = require(`${baseline}/review-loop`);
  review.prepare(dir, { round: 1, diff: 'gate.js' });
  review.record(dir, { round: 1, verdict: 'pass', reviewer: 'independent-reviewer' });
};

test('workers refuse failed, unknown and stale evidence and accept current independent proof', (t) => {
  const dir = repo(t);
  gateFixture(dir);
  write(dir, 'src/a.js', 'module.exports=1;');
  const digest = require(`${baseline}/release-evidence`).sourceDigest(dir);
  for (const evidence of [[{ source: 'reviewer', status: 'fail' }], [{ source: 'reviewer' }],
    [{ source: 'reviewer', status: 'pass', package: 'WP1', candidate_digest: 'stale' }]]) {
    assert.equal(workers.accept(dir, { package: 'WP1', evidence }).accepted, false);
  }
  const evidence = [
    { source: 'reviewer', status: 'pass', package: 'WP1', candidate_digest: digest },
  ];
  assert.equal(workers.accept(dir, { package: 'WP1', evidence }).accepted, false, 'labels alone are not verification');
  verifyFixture(dir, 'WP1');
  assert.equal(workers.accept(dir, { package: 'WP1', evidence }).accepted, true);
});

test('worker ownership covers directory descendants and canonical symlink aliases', (t) => {
  const dir = repo(t);
  write(dir, 'src/a.js', 'a');
  fs.symlinkSync('src', path.join(dir, 'alias'), 'dir');
  assert.equal(workers.reserve(dir, { package: 'WP1', owns: ['src'] }).granted, true);
  assert.equal(workers.reserve(dir, { package: 'WP2', owns: ['src/a.js'] }).granted, false);
  assert.equal(workers.reserve(dir, { package: 'WP3', owns: ['alias/a.js'] }).granted, false);
});

test('worker leases serialize actual processes', async (t) => {
  const dir = repo(t);
  const gate = path.join(dir, 'start');
  const script = `const fs=require('fs'); const [module,repo,gate,id]=process.argv.slice(1);
    while(!fs.existsSync(gate)) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,5);
    try { console.log(JSON.stringify(require(module).reserve(repo,{package:id,owns:['src/a.js']}))); }
    catch(e) { console.log(JSON.stringify({granted:false,error:e.message})); }`;
  const jobs = Array.from({ length: 8 }, (_, i) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', script, `${baseline}/workers`, dir, gate, `WP${i}`]);
    let out = ''; child.stdout.on('data', (b) => { out += b; });
    child.once('error', reject); child.once('close', () => resolve(JSON.parse(out)));
  }));
  write(dir, 'start', 'go');
  assert.equal((await Promise.all(jobs)).filter((r) => r.granted).length, 1);
});

test('stale worker recovery verifies dead PID, pending journal and unchanged owned bytes', async (t) => {
  const dir = repo(t);
  write(dir, 'src/a.js', 'original');
  const child = spawn(process.execPath, ['-e', "process.stdout.write('ready');setInterval(()=>{},1000);"]);
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill(); });
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); });
  workers.reserve(dir, { package: 'old', owner_pid: child.pid, owns: ['src/a.js'], lease_seconds: 0 });
  const request = { package: 'new', owns: ['src/a.js'], evidence: { owner_exited: true, no_pending_writes: true } };
  assert.equal(workers.reclaim(dir, request).granted, false, 'live owner cannot be declared dead by a flag');
  const closed = new Promise((resolve) => child.once('close', resolve)); child.kill(); await closed;
  write(dir, '.rig/journal.json', { pending: { unfinished: { at: new Date().toISOString() } }, done: {} });
  assert.equal(workers.reclaim(dir, request).granted, false, 'uncertain side effects must be reconciled');
  write(dir, '.rig/journal.json', { pending: {}, done: {} });
  write(dir, 'src/a.js', 'partial worker mutation');
  assert.equal(workers.reclaim(dir, request).granted, false, 'changed source needs explicit reconciliation');
  write(dir, 'src/a.js', 'original');
  write(dir, 'src/a.js.lock', 'pending external writer');
  assert.equal(workers.reclaim(dir, request).granted, false, 'an outstanding file lock must be reconciled');
  fs.unlinkSync(path.join(dir, 'src/a.js.lock'));
  const reclaimed = workers.reclaim(dir, request);
  assert.equal(reclaimed.granted, true);
  assert.equal(reclaimed.evidence_checked.owner_pid, child.pid);
});

test('worker context drops inherited and private state from explicit scoped context', (t) => {
  const dir = repo(t);
  const brief = workers.brief(dir, { id: 'WP1', owns: ['src/a.js'], sources: [], criteria: [],
    context: { language: 'js', messages: 'private conversation', todos: 'parent plan', rubric: 'private evaluation', secret: 'private' },
    private_state_keys: ['secret'] });
  assert.deepEqual(brief.context, { language: 'js' });
});

test('worker context recursively excludes nested secrets and private state and rejects non-JSON values', (t) => {
  const dir = repo(t);
  const scope = { id: 'WP1', owns: ['src/a.js'], sources: [], criteria: [], private_state_keys: ['salary'] };
  const result = workers.brief(dir, { ...scope, context: { settings: {
    api_key: 'SECRET', token: 'TOKEN', password: 'PASSWORD', language: 'js',
    rows: [{ salary: 'private', visible: 'yes', messages: 'private parent state' }],
  } } });
  assert.deepEqual(result.context, { settings: { language: 'js', rows: [{ visible: 'yes' }] } });
  const cyclic = {}; cyclic.self = cyclic;
  for (const invalid of [new Date(), { bad: undefined }, { bad: () => 1 }, { bad: NaN }, cyclic]) {
    assert.throws(() => workers.brief(dir, { ...scope, context: invalid }), /JSON|plain|cyclic|finite/i);
  }
});

test('worker artifacts cannot follow an outside .rig symlink', (t) => {
  const dir = repo(t), outside = repo(t);
  fs.rmdirSync(path.join(dir, '.rig'));
  fs.symlinkSync(outside, path.join(dir, '.rig'), 'dir');
  assert.throws(() => workers.publish(dir, { id: 'WP1', owns: ['src/a.js'], sources: [], criteria: [] }), /outside|symlink/);
  assert.equal(fs.existsSync(path.join(outside, 'workers/WP1/artifact.json')), false);
});

test('routing reserves every attempt and stops at the cap including failed attempts', (t) => {
  const dir = repo(t), routing = require(`${baseline}/model-routing`);
  write(dir, '.rig/model-inventory.json', { models: [
    { id: 'light', available: true, capability: 'mechanical', price_class: 'cheap' },
    { id: 'strong', available: true, capability: 'judgement', price_class: 'expensive' },
  ], budget: { max_spend_units: 1 } });
  let calls = 0;
  const provider = () => { calls++; throw new Error('provider failed after billing'); };
  const task = { task: 'one', kind: 'bounded', risk: 'high' };
  assert.equal(routing.run(dir, task, { provider }).blocked, true);
  assert.equal(routing.run(dir, task, { provider }).blocked, true);
  assert.equal(calls, 1);
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, '.rig/spend.json'))).used_units, 1);
  assert.ok(routing.log(dir).some((row) => row.attempt === 1 && row.cost === 'unknown'));
});

test('routing reports absent inventory and rejects unbounded numeric budgets', (t) => {
  const dir = repo(t), routing = require(`${baseline}/model-routing`);
  assert.match(routing.run(dir, { kind: 'bounded' }, { provider: () => assert.fail() }).reason, /inventory|budget/i);
  write(dir, '.rig/model-inventory.json', { models: [], budget: { max_spend_units: -1 } });
  assert.equal(routing.run(dir, { kind: 'bounded' }, { provider: () => assert.fail() }).blocked, true);
});

test('learning cannot manufacture proof from historical expected outcomes', (t) => {
  const dir = repo(t), learning = require(`${baseline}/learning`);
  write(dir, '.rig/history.json', { findings: [
    { id: 'a', class: 'null', where: 'a.js' }, { id: 'b', class: 'null', where: 'b.js' },
  ], cases: [{ id: 'positive', fails_before: true, input: null }, { id: 'negative', fails_before: false, input: 1 }] });
  const proof = learning.evaluate(dir, 'cand-null');
  assert.equal(proof.outcome, 'confounded');
  assert.equal(proof.replay.positive.caught, null);
  assert.equal(learning.promote(dir, 'cand-null', { full_gate: { passed: true }, evaluation: { outcome: 'helped' } }).promoted, false);
});

test('learning executes positive and negative replay and rejects stale promotion evidence', (t) => {
  const dir = repo(t), learning = require(`${baseline}/learning`);
  write(dir, '.rig/history.json', { findings: [
    { id: 'a', class: 'null', where: 'a.js' }, { id: 'b', class: 'null', where: 'b.js' },
  ], cases: [{ id: 'positive', fails_before: true, input: null }, { id: 'negative', fails_before: false, input: 1 }] });
  write(dir, 'before.js', 'module.exports=()=>false;');
  write(dir, 'check.js', 'module.exports=(value)=>value===null;');
  const proof = learning.evaluate(dir, 'cand-null', { before: 'before.js', check: 'check.js' });
  assert.equal(proof.outcome, 'helped');
  assert.equal(proof.replay.positive.caught, true);
  assert.equal(proof.replay.negative.caught, false);
  assert.equal(learning.promote(dir, 'cand-null', { full_gate: { passed: true } }).promoted, false);
  gateFixture(dir);
  write(dir, 'gate.js', "require('node:assert/strict').equal(require('./check')(null),true);");
  learning.evaluate(dir, 'cand-null', { before: 'before.js', check: 'check.js' });
  require(`${baseline}/run-journal`).recordGreen(dir, { package: 'cand-null', command: 'node gate.js', gate: 'npm test' });
  assert.equal(learning.promote(dir, 'cand-null', { full_gate: { passed: true } }).promoted, true);
  write(dir, 'check.js', 'module.exports=()=>true;');
  assert.equal(learning.promote(dir, 'cand-null', { full_gate: { passed: true } }).promoted, false);
});

test('upgrade removal preserves unowned and edited files and removes journal-owned files', (t) => {
  const dir = repo(t), upgrade = require(`${baseline}/upgrade`);
  assert.equal(spawnSync('git', ['init', '-q', dir]).status, 0);
  require('../rig/lib/payload').runPayload(dir, ['codex']);
  write(dir, '.rig/user-notes.md', 'precious');
  write(dir, '.rig/lint-format/user-notes.md', 'also precious');
  const edited = '.rig/rules/rig.md';
  fs.appendFileSync(path.join(dir, edited), '\nUser addition\n');
  const result = upgrade.remove(dir);
  assert.equal(fs.readFileSync(path.join(dir, '.rig/user-notes.md'), 'utf8'), 'precious');
  assert.equal(fs.readFileSync(path.join(dir, '.rig/lint-format/user-notes.md'), 'utf8'), 'also precious');
  assert.match(fs.readFileSync(path.join(dir, edited), 'utf8'), /User addition/);
  assert.equal(fs.existsSync(path.join(dir, '.rig/routing.md')), false);
  assert.ok(result.removed.includes('.rig/routing.md'));
  assert.ok(result.commands_run.every((cmd) => upgrade.documentation(dir).find((d) => d.stage === 'removal').commands.includes(cmd)));
});

test('efficiency ranks accepted work by logical tokens separately from cached billing', (t) => {
  const dir = repo(t), efficiency = require(`${baseline}/efficiency`);
  write(dir, '.rig/run.json', { task: 'one', accepted_evidence: ['AC1'],
    calls: [{ logical_tokens: 1000, billable_tokens: 1 }] });
  const wasteful = efficiency.ratio(dir, 'one');
  write(dir, '.rig/run.json', { task: 'one', accepted_evidence: ['AC1'],
    calls: [{ logical_tokens: 100, billable_tokens: 100 }] });
  assert.ok(efficiency.ratio(dir, 'one').ratio > wasteful.ratio);
  assert.equal(efficiency.account(dir, 'one').billable_cost, 'unknown');
});

test('efficiency benchmark runs real local mechanisms with measured outputs and zero model calls', (t) => {
  const dir = repo(t), efficiency = require(`${baseline}/efficiency`);
  const baselineRun = efficiency.benchmark(dir, { offline: true });
  assert.equal(baselineRun.scenarios.length, 10);
  for (const row of baselineRun.scenarios) {
    assert.equal(row.logical_tokens, 0);
    assert.equal(row.billable_tokens, 0);
    assert.equal(row.billable_cost, 0);
    assert.ok(row.wall_ms >= 0);
    assert.equal(row.verified, true);
    assert.ok(row.evidence);
  }
  assert.throws(() => efficiency.assertTarget(dir, { scenario: baselineRun.scenarios[0].name, ratio: 4 }), /model|token|baseline/i);
});

test('efficiency promotion requires every guardrail on current candidate bytes', (t) => {
  const dir = repo(t), efficiency = require(`${baseline}/efficiency`);
  gateFixture(dir);
  assert.equal(efficiency.evaluateCandidate(dir, { ratio_delta: 1, checks: { irrelevant: 'pass' } }).promoted, false);
  assert.equal(efficiency.evaluateCandidate(dir, { ratio_delta: 1,
    checks: { acceptance: 'pass', coverage: 'pass', security: 'pass', delivery: 'pass' } }).promoted, false);
  const release = require(`${baseline}/release-evidence`);
  const checks = Object.fromEntries(['acceptance', 'coverage', 'security', 'delivery']
    .map((kind) => [kind, release.record(dir, { kind, status: 'pass' })]));
  assert.equal(efficiency.evaluateCandidate(dir, { ratio_delta: 999, checks }).promoted, false, 'claimed gain without measurements is not evidence');
  write(dir, '.rig/run.json', { task: 'before', accepted_evidence: ['AC1'], calls: [{ logical_tokens: 1000, billable_tokens: 1000 }] });
  efficiency.account(dir, 'before');
  write(dir, '.rig/run.json', { task: 'after', accepted_evidence: ['AC1'], calls: [{ logical_tokens: 100, billable_tokens: 100 }] });
  efficiency.account(dir, 'after');
  const input = { before_task: 'before', after_task: 'after', package: 'WP1', checks, ratio_delta: 999 };
  assert.equal(efficiency.evaluateCandidate(dir, input).promoted, false, 'actual tool/review lineage required');
  verifyFixture(dir, 'WP1');
  const promoted = efficiency.evaluateCandidate(dir, input);
  assert.equal(promoted.promoted, true);
  assert.equal(promoted.ratio_delta, 9, 'measured delta replaces caller assertion');
  const measuredAfterPath = path.join(dir, '.rig/efficiency/after.json');
  const measuredAfter = fs.readFileSync(measuredAfterPath, 'utf8');
  const tampered = JSON.parse(measuredAfter); tampered.calls[0].logical_tokens = 1;
  fs.writeFileSync(measuredAfterPath, JSON.stringify(tampered));
  assert.equal(efficiency.evaluateCandidate(dir, input).promoted, false, 'altered measurement rows invalidate their digest');
  fs.writeFileSync(measuredAfterPath, measuredAfter);
  write(dir, '.rig/run.json', { task: 'slower', accepted_evidence: ['AC1'], calls: [{ logical_tokens: 2000, billable_tokens: 2000 }] });
  efficiency.account(dir, 'slower');
  assert.equal(efficiency.evaluateCandidate(dir, { ...input, after_task: 'slower' }).promoted, false);
  write(dir, 'changed.js', 'a');
  assert.equal(efficiency.evaluateCandidate(dir, input).promoted, false);
});
