'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run } = require('./_harness');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const harbor = file => path.join(ROOT, 'benchmarks/harbor', file);
const rows = file => fs.readFileSync(file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
function py(source, args = []) {
  const result = run('python3', ['-c', source, ...args], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
const load = file => `import importlib.util\nspec=importlib.util.spec_from_file_location('subject', ${JSON.stringify(file)})\nsubject=importlib.util.module_from_spec(spec)\nspec.loader.exec_module(subject)\n`;
function sessions() {
  return Array.from({ length: 10 }, (_, i) => ['rig', 'plain'].map(arm => ({
    arm, task: `task-${i}`, model: arm === 'rig' ? 'haiku-pinned' : 'sonnet-pinned',
    seed: 42, run: 1, passed: true, cost_usd: arm === 'rig' ? 1 : 2,
    tokens_in: 100, tokens_out: 100, fit_tokens: 0, tampered: false, sloc: 1, interventions: 0,
  }))).flat();
}
function report(t, input) {
  const fixture = tempDir('rig-report-');
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const file = write(fixture, 'sessions.jsonl', input.map(row => JSON.stringify(row)).join('\n') + '\n');
  const result = run('python3', [harbor('report.py'), file], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
function readArms() {
  return py('import json,yaml,sys\nwith open(sys.argv[1]) as f: data=yaml.safe_load(f)\nprint(json.dumps(data if isinstance(data,list) else data["arms"]))', [harbor('arms.yaml')]);
}
function fixtureRun(t, split = 'practice', arms = 'plain', repeats = 1, fitTokens = 0) {
  const repo = tempDir('rig-benchmark-fixture-');
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  write(repo, 'starter.txt', 'untouched starter\n');
  const inner = write(repo, 'inner.py', `import json\nprint(json.dumps({'passed':True,'tokens_in':10,'tokens_out':5,'fit_tokens':${fitTokens},'cost_usd':0.01,'tampered':False,'sloc':1,'interventions':0}))\n`);
  const output = path.join(repo, 'sessions.jsonl');
  const marker = path.join(repo, 'final.marker');
  const env = { ...process.env, RIG_BENCH_FIXTURE_TASK: repo, RIG_BENCH_FIXTURE_INNER: inner,
    RIG_BENCH_FIXTURE_OUTPUT: output, RIG_BENCH_FINAL_MARKER: marker };
  const invoke = args => run('python3', [harbor('run.py'), '--arms', arms, '--split', split, '--runs', String(repeats), '--token-cap', '100', ...args], { cwd: repo, env });
  return { repo, output, marker, invoke };
}

test('RB-BENCH-1 committed benchmark split has a seed, disjoint partitions, and all 89 tasks', () => {
  const split = json(harbor('split.json'));
  const tasks = json(harbor('task-ids.json'));
  assert.equal(tasks.length, 89);
  const actual = py(load(harbor('split.py')) + 'import json,sys\ntasks=json.loads(sys.argv[1]); seed=json.loads(sys.argv[2])\na=subject.generate_split(tasks,seed)\nb=subject.generate_split(tasks,seed)\nassert a==b\nprint(json.dumps(a))', [JSON.stringify(tasks), JSON.stringify(split.seed)]);
  assert.deepEqual(actual, split);
  assert.ok(split.practice.length > 0 && split.test.length > 0);
  assert.equal(new Set([...split.practice, ...split.test]).size, 89);
  assert.equal(split.practice.length + split.test.length, 89);
  assert.deepEqual([...split.practice, ...split.test].sort(), [...tasks].sort());
});

test('RB-BENCH-2 planted hidden-test tampering is reported as tampered and failed', () => {
  py(load(harbor('rig_agent.py')) + `
import tempfile,pathlib,hashlib,json
with tempfile.TemporaryDirectory() as directory:
    test=pathlib.Path(directory)/'hidden.py'
    test.write_text('assert expected == actual')
    before={'hidden.py':hashlib.sha256(test.read_bytes()).hexdigest()}
    clean=subject.guard_session_result({'passed':True},before,before)
    assert clean['passed'] is True and clean['tampered'] is False
    test.write_text('assert True')
    after={'hidden.py':hashlib.sha256(test.read_bytes()).hexdigest()}
    for changed in (after,{},dict(before,extra='0'*64)):
        result=subject.guard_session_result({'passed':True},before,changed)
        assert result['tampered'] is True and result['passed'] is False
print(json.dumps({'checked':4}))
`);
});

test('RB-BENCH-3 report applies every match condition to fixture session data', t => {
  const good = report(t, sessions());
  assert.equal(good.matches, true);
  assert.equal(good.comparisons[0].cost_per_solved_task_ratio, 0.5);
  assert.equal(good.comparisons[0].tampering_rate, 0);
  assert.deepEqual(good.comparisons[0].pass_rate_difference_interval, { lower: 0, upper: 0 });
  assert.equal(report(t, sessions().map(row => ({ ...row, cost_usd: row.arm === 'rig' ? 1.01 : 2 }))).matches, false);
  const tampered = sessions(); tampered[0].tampered = true;
  assert.equal(report(t, tampered).matches, false);
  const worse = report(t, sessions().map(row => ({ ...row, passed: row.arm === 'plain' })));
  assert.equal(worse.matches, false);
  assert.deepEqual(worse.comparisons[0].pass_rate_difference_interval, { lower: -1, upper: -1 });
});

test('RB-BENCH-4 plain arm selects no Rig reference and writes no .rig directory', t => {
  const { repo, output, invoke } = fixtureRun(t);
  const result = invoke([]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(rows(output).length > 0);
  assert.equal(fs.existsSync(path.join(repo, '.rig')), false);
  assert.equal(fs.readFileSync(path.join(repo, 'starter.txt'), 'utf8'), 'untouched starter\n');
});

test('RB-BENCH-5 at least 30 vague-intent tasks keep grading tests outside agent-visible files', t => {
  const directory = path.join(ROOT, 'benchmarks/tasks/rig-vague');
  const tasks = fs.readdirSync(directory).filter(item => fs.statSync(path.join(directory, item)).isDirectory());
  assert.ok(tasks.length >= 30, `found ${tasks.length}`);
  const out = tempDir('rig-hidden-test-verification-');
  t.after(() => fs.rmSync(out, { recursive: true, force: true }));
  const file = path.join(out, 'verification.json');
  const result = run('python3', [harbor('run.py'), '--verify-tasks', directory, '--output', file], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const checked = json(file);
  assert.deepEqual(checked.map(row => row.task).sort(), tasks.sort());
  for (const row of checked) {
    assert.equal(row.agent_can_read_hidden_tests, false, row.task);
    assert.equal(row.starter_passed, false, row.task);
    assert.equal(row.reference_passed, true, row.task);
  }
  assert.deepEqual([...new Set(checked.map(row => row.category))].sort(), ['api', 'cli', 'data', 'full-stack', 'web']);
});

test('RB-BENCH-6 a filename-only gain fails the counterfactual robustness check', t => {
  const fixture = tempDir('rig-shortcut-fixture-');
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const task = path.join(fixture, 'task'), candidate = path.join(fixture, 'candidate');
  write(task, 'README.md', 'task content\n');
  const invoke = () => run('python3', [path.join(ROOT, 'benchmarks/tuning/counterfactual.py'), candidate, task], { cwd: ROOT, env: { ...process.env, RIG_BENCH_FIXTURE_MODE: '1' } });
  write(candidate, 'candidate.json', '{"fixture_rule":"original-filename-only"}');
  const result = invoke();
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const rejected = JSON.parse(result.stdout);
  assert.equal(rejected.robust, false);
  assert.equal(rejected.kept, false);
  assert.ok(rejected.perturbations.some(row => row.kind === 'renamed-paths' && row.delta < 0));
  write(candidate, 'candidate.json', '{"fixture_rule":"content-based"}');
  const stable = invoke();
  assert.equal(stable.status, 0, stable.stderr);
  assert.equal(JSON.parse(stable.stdout).robust, true);
});

test('RB-BENCH-7 test split cannot run during tuning and final scoring is single-use', t => {
  const { marker, invoke } = fixtureRun(t, 'test');
  const blocked = invoke([]);
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr + blocked.stdout, /--final|test split/i);
  assert.equal(fs.existsSync(marker), false);
  const first = invoke(['--final']);
  assert.equal(first.status, 0, first.stderr || first.stdout);
  assert.equal(fs.existsSync(marker), true);
  const second = invoke(['--final']);
  assert.notEqual(second.status, 0);
  assert.match(second.stderr + second.stdout, /already|once|final.*used/i);
});

test('RB-BENCH-8 every tuning decision carries its floor candidate', () => {
  const directory = path.join(ROOT, 'wiki/specs/rebuild/benchmark-results');
  const rounds = fs.readdirSync(directory).filter(name => /^round-\d+$/.test(name)).sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)));
  assert.ok(rounds.length > 0);
  let previous = 'v6.0.0';
  for (const round of rounds) {
    const decision = json(path.join(directory, round, 'decision.json'));
    assert.equal(decision.floor, previous);
    assert.ok(decision.candidates.includes(decision.floor));
    assert.ok(decision.candidates.includes(decision.best));
    if (decision.kept) previous = decision.best;
  }
});

test('RB-BENCH-9 benchmark arms contain all three model ladder comparisons', () => {
  const arms = readArms();
  for (const [small, strong] of [['haiku', 'sonnet'], ['sonnet', 'opus'], ['opus', 'fable']]) {
    assert.ok(arms.some(arm => arm.rig_ref !== 'none' && arm.model.toLowerCase().includes(small)));
    assert.ok(arms.some(arm => arm.rig_ref === 'none' && arm.model.toLowerCase().includes(strong)));
  }
  assert.ok(arms.some(arm => arm.rig_ref === 'v6.0.0'));
  assert.ok(arms.some(arm => arm.pack === 'ecc'));
  assert.ok(arms.some(arm => arm.pack === 'hand-stacked'));
});

test('RB-BENCH-10 fit input tokens contribute to measured session cost', t => {
  const rig = readArms().find(arm => arm.rig_ref !== 'none' && arm.model.toLowerCase().includes('haiku'));
  assert.ok(rig, 'Haiku with Rig arm missing');
  const { output, invoke } = fixtureRun(t, 'practice', rig.id, 1, 7);
  const result = invoke([]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const row of rows(output)) {
    assert.equal(row.fit_tokens, 7);
    assert.ok(row.prices.input > 0);
    assert.equal(row.cost_usd, ((row.tokens_in + row.fit_tokens) * row.prices.input + row.tokens_out * row.prices.output) / 1_000_000);
  }
});

test('RB-BENCH-11 report includes tokens, tampering, source lines and human interventions', t => {
  const input = sessions();
  input[0].sloc = 7; input[0].interventions = 2; input[0].tokens_in = 123;
  const rig = report(t, input).arms.find(arm => arm.id === 'rig');
  assert.equal(rig.tokens_in, 1023);
  assert.equal(rig.tokens_out, 1000);
  assert.equal(rig.sloc, 16);
  assert.equal(rig.interventions, 2);
  assert.equal(rig.tampering_rate, 0);
});

test('RB-BENCH-12 published result uses a passing ladder step or the closest measured step', t => {
  const final = json(path.join(ROOT, 'benchmarks/results/final/report.json'));
  const measured = report(t, rows(path.join(ROOT, 'benchmarks/results/final/sessions.jsonl')));
  assert.deepEqual(final.comparisons, measured.comparisons, 'published comparisons must be recomputed from raw sessions');
  const headline = fs.readFileSync(path.join(ROOT, 'docs/results.md'), 'utf8');
  const eligible = final.comparisons.filter(row => row.matches === true);
  const chosen = final.headline || final.closest_step;
  assert.ok(chosen && typeof chosen.step === 'string');
  if (eligible.length) assert.ok(eligible.some(row => row.step === chosen.step));
  else assert.equal(final.headline, null);
  assert.ok(final.comparisons.some(row => row.step === chosen.step));
  assert.ok(headline.includes(chosen.step));
  for (const arm of measured.arms) {
    assert.ok(headline.includes(arm.id), arm.id);
    assert.ok(headline.includes(String(arm.pass_rate)), arm.id);
    assert.ok(headline.includes(String(arm.cost_per_solved_task)), arm.id);
  }
});

test('RB-BENCH-13 untouched test split is scored once and SkillsBench remains held back', () => {
  const evidence = rows(path.join(ROOT, 'wiki/specs/rebuild/benchmark-results/session-index.jsonl'));
  const finals = evidence.filter(row => row.phase === 'final');
  assert.ok(finals.length > 0);
  assert.equal(new Set(finals.map(row => row.release_run)).size, 1);
  assert.ok(evidence.filter(row => row.phase === 'tuning').every(row => row.split === 'practice'));
  assert.ok(evidence.every(row => row.benchmark !== 'SkillsBench'));
});

test('RB-BENCH-14 tuning stops after three non-improving rounds or the release date', () => {
  const result = py(load(path.join(ROOT, 'benchmarks/tuning/stop.py')) + `
import json
quiet=[{'difference_interval':{'lower':-0.1,'upper':0.1}}]*3
assert subject.should_stop(quiet,'2026-12-01') is True
assert subject.should_stop(quiet[:2],'2026-12-01') is False
assert subject.should_stop([],'2027-01-15') is True
assert subject.should_stop([{'difference_interval':{'lower':0.1,'upper':0.2}}]*3,'2026-12-01') is False
print(json.dumps({'checked':4}))
`);
  assert.equal(result.checked, 4);
});

test('RB-BENCH-15 benchmark runner completes three paired runs per task and arm', t => {
  const arms = readArms();
  const selected = [arms.find(arm => arm.rig_ref !== 'none' && /haiku/i.test(arm.model)), arms.find(arm => arm.rig_ref === 'none' && /sonnet/i.test(arm.model))];
  assert.ok(selected.every(Boolean), 'fixture needs both arms of a real comparison');
  const { output, invoke } = fixtureRun(t, 'practice', selected.map(arm => arm.id).join(','), 3);
  const result = invoke([]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const evidence = rows(output);
  const taskSets = selected.map(arm => new Set(evidence.filter(row => row.arm === arm.id).map(row => row.task)));
  assert.ok(taskSets[0].size > 0);
  assert.deepEqual(taskSets[0], taskSets[1]);
  for (const arm of selected) for (const task of taskSets[0]) {
    const matched = evidence.filter(row => row.arm === arm.id && row.task === task);
    assert.equal(matched.length, 3);
    assert.deepEqual(matched.map(row => row.run).sort(), [1, 2, 3]);
    assert.ok(matched.every(row => row.token_cap === 100));
  }
});

test('RB-BENCH-16 comparison raw sessions use pinned models and one common window', () => {
  const arms = readArms();
  const evidence = rows(path.join(ROOT, 'benchmarks/results/final/sessions.jsonl'));
  for (const [small, strong] of [['haiku', 'sonnet'], ['sonnet', 'opus'], ['opus', 'fable']]) {
    const pair = [arms.find(arm => arm.rig_ref !== 'none' && arm.model.toLowerCase().includes(small)), arms.find(arm => arm.rig_ref === 'none' && arm.model.toLowerCase().includes(strong))];
    assert.ok(pair.every(Boolean));
    const byArm = pair.map(arm => evidence.filter(row => row.arm === arm.id));
    assert.ok(byArm.every(group => group.length > 0));
    assert.deepEqual(new Set(byArm[0].map(row => `${row.task}:${row.run}`)), new Set(byArm[1].map(row => `${row.task}:${row.run}`)));
    const windows = new Set();
    const caps = new Set();
    for (let i = 0; i < pair.length; i += 1) for (const row of byArm[i]) {
      assert.equal(row.model, pair[i].model);
      assert.doesNotMatch(row.model, /latest|default/i);
      assert.ok(row.comparison_window?.start && row.comparison_window?.end && row.started_at);
      assert.ok(row.started_at >= row.comparison_window.start && row.started_at <= row.comparison_window.end);
      windows.add(JSON.stringify(row.comparison_window));
      caps.add(row.token_cap);
    }
    assert.equal(windows.size, 1);
    assert.equal(caps.size, 1);
    assert.ok([...caps][0] > 0);
  }
});

test('RB-BENCH-17 Sonnet benchmark includes one ablation arm per mapped role', () => {
  const arms = readArms();
  const roles = json(path.join(ROOT, 'wiki/specs/rebuild/role-map.json')).roles;
  assert.ok(roles.length > 0);
  for (const role of roles) {
    const ablations = arms.filter(arm => arm.ablate_role === role.id);
    assert.equal(ablations.length, 1, role.id);
    assert.match(ablations[0].model, /sonnet/i);
    assert.notEqual(ablations[0].rig_ref, 'none');
  }
});
