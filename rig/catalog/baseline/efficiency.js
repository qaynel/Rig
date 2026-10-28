'use strict';

// Efficiency ledger for an instrumented task run. Reads the run record the host
// writes to <repo>/.rig/run.json, reports tokens, cost and the accepted-work
// ratio, replays a fixed offline benchmark, and gates candidate promotion on a
// ratio gain plus passing guardrails. Deterministic: no model or network calls.

const fs = require('fs');
const path = require('path');
const os = require('node:os');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const release = require('./release-evidence');
const { containedPath } = require('../../lib/path-safety');

const fixture = (repo, rel, body) => {
  const abs = path.join(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
};
// Real local replays measure deterministic mechanisms, not hypothetical model
// savings. No model/executor is accepted here, so their observed token cost is 0.
const REPLAYS = {
  'file-count': (repo) => { fixture(repo, 'a.txt', 'a'); fixture(repo, 'b.txt', 'b');
    const files = fs.readdirSync(repo).filter((f) => f.endsWith('.txt')); return { verified: files.length === 2, files }; },
  'key-read': (repo) => { fixture(repo, 'config.json', '{"enabled":true}');
    const enabled = JSON.parse(fs.readFileSync(path.join(repo, 'config.json'), 'utf8')).enabled; return { verified: enabled === true, enabled }; },
  'manifest-build': (repo) => { const digest = release.sourceDigest(repo); return { verified: /^sha256:[a-f0-9]{64}$/.test(digest), digest }; },
  'diff-summary': (repo) => { const result = require('./review-loop').prepare(repo, { round: 1, diff: '+ added fixture line' });
    return { verified: result.diff === '+ added fixture line', diff: result.diff }; },
  review: (repo) => { const review = require('./review-loop'); fixture(repo, 'a.js', 'bug\n');
    review.record(repo, { round: 1, verdict: 'fail', reviewer: 'benchmark-reviewer', findings: [{ file: 'a.js', line: 1, problem: 'fixture defect' }] });
    const result = review.prepare(repo, { round: 2, diff: 'a.js' });
    return { verified: result.unresolved.length === 1, findings: result.unresolved.length }; },
  'security-judgement': (repo) => { fixture(repo, '.env', 'FIXTURE_SECRET=private'); let refused = false;
    try { require('./workers').brief(repo, { id: 'WP1', owns: ['a.js'], sources: ['.env'], criteria: [] }); } catch { refused = true; }
    return { verified: refused, private_source_refused: refused }; },
  'memory-recall': (repo) => { const memory = require('./memory');
    memory.put(repo, { id: 'rotation', source: 'policy.md', value: 'Rotate the deploy credential monthly.' });
    const result = memory.recallDetailed(repo, 'how frequently is the signing secret changed');
    return { verified: result.mode === 'semantic' && result.hits[0]?.source === 'policy.md', mode: result.mode, source: result.hits[0]?.source }; },
  'trace-compaction': (repo) => { const body = '---\ndate: 2026-10-24\n---\nFixture decision.\n';
    fixture(repo, 'wiki/reasoning/a.md', body); fixture(repo, 'wiki/reasoning/b.md', body);
    const result = require('./trace-retention').compact(repo); return { verified: result.applied && result.archived.length === 1, ...result }; },
  'package-reservation': (repo) => { const workers = require('./workers');
    const first = workers.reserve(repo, { package: 'WP1', owns: ['a.js'] });
    const second = workers.reserve(repo, { package: 'WP2', owns: ['a.js'] });
    return { verified: first.granted === true && second.granted === false, conflict: second.conflict }; },
  'release-readiness': (repo) => { const result = release.publicReadiness(repo, { commit: release.sourceDigest(repo) });
    return { verified: result.ready === false && result.missing.length === 5, missing: result.missing }; },
};

const sum = (calls, key) => calls.reduce((total, c) => total + c[key], 0);

// rig: deterministic work consumes no model tokens; report 0 rather than an
// infinite score, and forbid model-efficiency targets against that baseline.
const ratioOf = (accepted, tokens) => (tokens > 0 ? (accepted / tokens) * 1000 : 0);

const efficiencyFile = (repo, file) => containedPath(repo, `.rig/efficiency/${file}`);

function persist(repo, file, body) {
  const abs = efficiencyFile(repo, file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(body, null, 2));
  return body;
}

function load(repo, task) {
  if (typeof task !== 'string' || !/^[A-Za-z0-9._-]+$/.test(task)) throw new Error(`invalid task id: ${task}`);
  const record = JSON.parse(fs.readFileSync(containedPath(repo, '.rig/run.json'), 'utf8'));
  if (record.task !== task) throw new Error(`run record is for task "${record.task}", not "${task}"`);
  if (!Array.isArray(record.calls)) throw new Error('run record has no calls array');
  if (!Array.isArray(record.accepted_evidence)) throw new Error('run record has no accepted_evidence array');
  if (record.accepted_evidence.some((id) => typeof id !== 'string' || !id)) throw new Error('accepted evidence must contain nonempty source identifiers');
  if (record.calls.some((c) => !c || ['logical_tokens', 'billable_tokens'].some((k) => !Number.isFinite(c[k]) || c[k] < 0))) {
    throw new Error('run calls must record finite nonnegative logical and billable tokens');
  }
  return record;
}

function account(repo, task) {
  const started = performance.now();
  const record = load(repo, task);
  const ledger = {
    measurement: 'instrumented-task-accounting-v1',
    task,
    candidate_digest: release.sourceDigest(repo),
    accepted_evidence: [...new Set(record.accepted_evidence)].sort(),
    calls: record.calls,
    logical_tokens: sum(record.calls, 'logical_tokens'),
    billable_tokens: sum(record.calls, 'billable_tokens'),
    billable_cost: record.calls.every((c) => Number.isFinite(c.cost) && c.cost >= 0) ? sum(record.calls, 'cost') : 'unknown',
    wall_ms: Number.isFinite(record.wall_ms) && record.wall_ms >= 0 ? record.wall_ms : performance.now() - started,
    wall_ms_scope: Number.isFinite(record.wall_ms) && record.wall_ms >= 0 ? 'task' : 'accounting-only',
    task_wall_ms: Number.isFinite(record.wall_ms) && record.wall_ms >= 0 ? record.wall_ms : null,
    captured_at: new Date().toISOString(),
  };
  ledger.measurement_digest = crypto.createHash('sha256').update(JSON.stringify(ledger)).digest('hex');
  return persist(repo, `${task}.json`, ledger);
}

function measuredTask(repo, task) {
  if (typeof task !== 'string' || !/^[A-Za-z0-9._-]+$/.test(task)) throw new Error('before/after task identifiers are required');
  const row = JSON.parse(fs.readFileSync(efficiencyFile(repo, `${task}.json`), 'utf8'));
  const { measurement_digest, ...body } = row;
  if (row.measurement !== 'instrumented-task-accounting-v1' || row.task !== task
    || !Number.isFinite(Date.parse(row.captured_at)) || typeof row.candidate_digest !== 'string'
    || crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex') !== measurement_digest
    || !Array.isArray(row.calls) || !row.calls.length || !Array.isArray(row.accepted_evidence)
    || !row.accepted_evidence.length || row.accepted_evidence.some((id) => typeof id !== 'string' || !id)
    || row.calls.some((c) => !c || !Number.isFinite(c.logical_tokens) || c.logical_tokens < 0
      || !Number.isFinite(c.billable_tokens) || c.billable_tokens < 0)
    || !(sum(row.calls, 'logical_tokens') > 0)) throw new Error('record a valid instrumented model-token task run before comparing efficiency');
  return { ...row, ratio: ratioOf(new Set(row.accepted_evidence).size, sum(row.calls, 'logical_tokens')) };
}

function ratio(repo, task) {
  const record = load(repo, task);
  const accepted_work = new Set(record.accepted_evidence).size;
  const logical_tokens = sum(record.calls, 'logical_tokens');
  const billable_tokens = sum(record.calls, 'billable_tokens');
  return { accepted_work, logical_tokens, billable_tokens, ratio: ratioOf(accepted_work, logical_tokens) };
}

function benchmark(repo, opts) {
  if (!opts || opts.offline !== true) throw new Error('benchmark requires { offline: true }: no network or model calls');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-efficiency-'));
  const previousHome = process.env.RIG_HOME;
  process.env.RIG_HOME = path.join(root, 'developer');
  fs.mkdirSync(process.env.RIG_HOME);
  try {
    const scenarios = Object.entries(REPLAYS).map(([name, replay]) => {
      const dir = path.join(root, name); fs.mkdirSync(dir);
      const start = performance.now(); const evidence = replay(dir); const wall_ms = performance.now() - start;
      if (!evidence.verified) throw new Error(`benchmark replay failed: ${name}`);
      return { name, accepted_work: 1, logical_tokens: 0, billable_tokens: 0, billable_cost: 0,
        ratio: 0, wall_ms, verified: true, evidence };
    });
    return persist(repo, 'baseline.json', { measurement: 'deterministic-local-replay', scenarios, recorded_at: new Date().toISOString() });
  } finally {
    if (previousHome === undefined) delete process.env.RIG_HOME; else process.env.RIG_HOME = previousHome;
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// A target must name the baselined scenario it improves on; a bare ratio has no baseline to be measured against.
function assertTarget(repo, { scenario, ratio: target }) {
  const file = efficiencyFile(repo, 'baseline.json');
  if (!fs.existsSync(file)) throw new Error('no recorded baseline: run benchmark first');
  const { scenarios } = JSON.parse(fs.readFileSync(file, 'utf8'));
  const base = scenarios.find((s) => s.name === scenario);
  if (!base) throw new Error(`no recorded baseline for target scenario: ${scenario === undefined ? '(none named)' : scenario}`);
  if (!Number.isFinite(target) || target < 0) throw new Error('efficiency target must be finite and nonnegative');
  if (!base.logical_tokens) throw new Error('no model-token baseline: deterministic replay cannot establish a model-efficiency target');
  return { ok: true, scenario, baseline_ratio: base.ratio, target, delta: target - base.ratio };
}

function evaluateCandidate(repo, { before_task, after_task, package: pkg = after_task, checks }) {
  const names = checks && typeof checks === 'object' ? Object.keys(checks) : [];
  if (names.length === 0) return { promoted: false, reason: 'no guardrail checks' };
  const failing = names.filter((name) => checks[name] !== 'pass' && checks[name]?.status !== 'pass');
  if (failing.length > 0) return { promoted: false, reason: `guardrail failed: ${failing.join(', ')}` };
  const required = ['acceptance', 'coverage', 'security', 'delivery'];
  const missing = required.filter((name) => !Object.hasOwn(checks, name));
  if (missing.length) return { promoted: false, reason: `missing guardrail checks: ${missing.join(', ')}` };
  if (required.some((name) => !checks[name] || typeof checks[name] !== 'object' || checks[name].kind !== name
    || checks[name].status !== 'pass' || typeof checks[name].digest !== 'string'
    || !release.check(repo, checks[name]).valid)) return { promoted: false, reason: 'guardrails need current candidate receipts' };
  let before, after;
  try { before = measuredTask(repo, before_task); after = measuredTask(repo, after_task); }
  catch (error) { return { promoted: false, reason: `missing measured before/after task evidence: ${error.code === 'ENOENT' ? 'run account() for both task runs' : error.message}` }; }
  if (before_task === after_task || JSON.stringify(before.accepted_evidence) !== JSON.stringify(after.accepted_evidence)) {
    return { promoted: false, reason: 'before/after runs must deliver the same accepted evidence in distinct measured task runs' };
  }
  if (Date.parse(before.captured_at) > Date.parse(after.captured_at)) return { promoted: false, reason: 'baseline measurement must precede the candidate task run' };
  if (after.candidate_digest !== release.sourceDigest(repo)) return { promoted: false, reason: 'candidate task measurements are stale' };
  let verification;
  try { verification = require('./workers').verification(repo, pkg); }
  catch { return { promoted: false, reason: 'invalid verification package or receipt state' }; }
  if (!verification.valid) return { promoted: false, reason: verification.reason };
  const ratio_delta = after.ratio - before.ratio;
  if (!Number.isFinite(ratio_delta) || !(ratio_delta > 0)) return { promoted: false, reason: 'measured ratio did not improve', ratio_delta };
  return { promoted: true, ratio_delta, before_ratio: before.ratio, after_ratio: after.ratio };
}

function redundancy(repo, task) {
  const counts = new Map();
  for (const p of load(repo, task).file_reads || []) counts.set(p, (counts.get(p) || 0) + 1);
  return { repeated_reads: Object.fromEntries([...counts].filter(([, n]) => n > 1)) };
}

module.exports = { account, ratio, benchmark, assertTarget, evaluateCandidate, redundancy };
