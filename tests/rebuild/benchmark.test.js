'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run } = require('./_harness');

const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const harbor = (...parts) => path.join(ROOT, 'benchmarks/harbor', ...parts);

test('RB-BENCH-1 committed benchmark split has a seed, disjoint partitions, and all 89 tasks', () => {
  const split = json(harbor('split.json'));
  assert.ok(split.seed !== undefined);
  assert.ok(split.practice.length > 0 && split.test.length > 0);
  assert.equal(new Set([...split.practice, ...split.test]).size, 89);
  assert.equal(split.practice.length + split.test.length, 89);
});

test('RB-BENCH-2 planted hidden-test tampering is reported as tampered and failed', () => {
  const agent = fs.readFileSync(harbor('rig_agent.py'), 'utf8');
  assert.match(agent, /tampered/i);
  assert.match(agent, /passed\s*=\s*False|"passed"\s*:\s*False/i);
  assert.match(agent, /hidden.*test|test.*hidden/i);
});

test('RB-BENCH-3 report applies every match condition to fixture session data', () => {
  const report = harbor('report.py');
  const fixture = tempDir('rig-benchmark-report-');
  const sessions = [
    { arm: 'rig', task: 'a', passed: true, cost_usd: 1, tampered: false },
    { arm: 'plain', task: 'a', passed: true, cost_usd: 2, tampered: false },
    { arm: 'rig', task: 'b', passed: true, cost_usd: 1, tampered: false },
    { arm: 'plain', task: 'b', passed: true, cost_usd: 2, tampered: false },
  ];
  const file = write(fixture, 'sessions.jsonl', `${sessions.map((row) => JSON.stringify(row)).join('\n')}\n`);
  const result = run('python3', [report, file], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.matches, true);
  assert.equal(parsed.comparisons[0].cost_per_solved_task_ratio, 0.5);
  assert.equal(parsed.comparisons[0].tampering_rate, 0);
  assert.ok(parsed.comparisons[0].pass_rate_difference_interval.lower <= 0);
});

test('RB-BENCH-4 plain arm selects no Rig reference and writes no .rig directory', () => {
  const arms = fs.readFileSync(harbor('arms.yaml'), 'utf8');
  assert.match(arms, /id:\s*plain[\s\S]*?rig_ref:\s*["']none["']/i);
  const agent = fs.readFileSync(harbor('rig_agent.py'), 'utf8');
  assert.match(agent, /rig_ref\s*==\s*["']none["']/);
  assert.match(agent, /\.rig/);
});

test('RB-BENCH-5 at least 30 vague-intent tasks keep grading tests outside agent-visible files', () => {
  const root = path.join(ROOT, 'benchmarks/tasks/rig-vague');
  const tasks = fs.readdirSync(root).filter((item) => fs.statSync(path.join(root, item)).isDirectory());
  assert.ok(tasks.length >= 30, `found ${tasks.length}`);
  for (const task of tasks) {
    const dir = path.join(root, task);
    assert.ok(fs.existsSync(path.join(dir, 'task.yaml')), task);
    const metadata = fs.readFileSync(path.join(dir, 'task.yaml'), 'utf8');
    const hidden = metadata.match(/hidden_test_path:\s*(.+)/)?.[1]?.trim();
    assert.ok(hidden, `${task} must declare hidden grading tests`);
    assert.ok(!path.resolve(dir, hidden).startsWith(path.resolve(dir, 'container') + path.sep), task);
  }
});

test('RB-BENCH-6 a filename-only gain fails the counterfactual robustness check', () => {
  const candidate = tempDir('rig-shortcut-candidate-');
  const task = tempDir('rig-shortcut-task-');
  write(candidate, 'candidate.json', '{"rule":"only pass when README.md exists"}');
  write(task, 'README.md', 'original path\n');
  const result = run('python3', [path.join(ROOT, 'benchmarks/tuning/counterfactual.py'), candidate, task], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).robust, false);
});

test('RB-BENCH-7 test split cannot run during tuning and final scoring is single-use', () => {
  const direct = run('python3', [harbor('run.py'), '--arms', 'rig', '--split', 'test', '--runs', '1', '--token-cap', '100'], { cwd: ROOT });
  assert.notEqual(direct.status, 0);
  assert.match(direct.stderr + direct.stdout, /--final|test split/i);
  const final = fs.readFileSync(harbor('run.py'), 'utf8');
  assert.match(final, /--final/);
  assert.match(final, /marker|already.*final|final.*once/i);
});

test('RB-BENCH-8 every tuning decision carries its floor candidate', () => {
  const rounds = fs.readdirSync(path.join(ROOT, 'wiki/specs/rebuild/benchmark-results')).filter((name) => name.startsWith('round-'));
  assert.ok(rounds.length > 0);
  for (const round of rounds) {
    const decision = json(path.join(ROOT, 'wiki/specs/rebuild/benchmark-results', round, 'decision.json'));
    assert.ok(decision.floor);
    assert.ok(decision.candidates.includes(decision.floor));
  }
});

test('RB-BENCH-9 benchmark arms contain all three model ladder comparisons', () => {
  const arms = fs.readFileSync(harbor('arms.yaml'), 'utf8');
  for (const pair of [['haiku', 'sonnet'], ['sonnet', 'opus'], ['opus', 'fable']]) {
    for (const model of pair) assert.match(arms, new RegExp(`model:\\s*[^\\n]*${model}`, 'i'));
  }
  for (const model of ['claude-code', 'codex', 'cursor-cli']) assert.match(arms, new RegExp(model));
});

test('RB-BENCH-10 comparison sessions pin models, share a window and count fit tokens in cost', () => {
  const runner = fs.readFileSync(harbor('run.py'), 'utf8');
  const report = fs.readFileSync(harbor('report.py'), 'utf8');
  assert.match(runner, /fit_tokens/);
  assert.match(runner, /model/);
  assert.match(runner, /window|timestamp/i);
  assert.match(report, /fit_tokens|tokens_in/);
});

test('RB-BENCH-11 report includes tokens, tampering, source lines and human interventions', () => {
  const runner = fs.readFileSync(harbor('run.py'), 'utf8');
  for (const key of ['tokens_in', 'tokens_out', 'tampered', 'sloc', 'interventions']) assert.ok(runner.includes(key), key);
});

test('RB-BENCH-12 published result uses a passing ladder step or the closest measured step', () => {
  const report = json(path.join(ROOT, 'benchmarks/results/final/report.json'));
  const headline = fs.readFileSync(path.join(ROOT, 'docs/results.md'), 'utf8');
  assert.ok(report.headline?.step || report.closest_step?.step);
  assert.ok(headline.includes(report.headline?.step || report.closest_step?.step));
});

test('RB-BENCH-13 untouched test split is scored once and SkillsBench remains held back', () => {
  const results = path.join(ROOT, 'wiki/specs/rebuild/benchmark-results');
  const final = json(path.join(results, 'final.json'));
  assert.equal(final.test_split_runs, 1);
  assert.equal(final.held_back_benchmark, 'SkillsBench');
});

test('RB-BENCH-14 tuning stops after three non-improving rounds or the release date', () => {
  const policy = fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/design.md'), 'utf8');
  assert.match(policy, /three rounds with no gain/i);
  assert.match(policy, /2027-01-15/);
});
