'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, product, tempDir, write, run } = require('./_harness');

const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = file => fs.readFileSync(file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
const open = { paths: ['rig/old.js'], replacedBy: 'rig/new.js', deleteIn: 'S4', reason: 'a reader remains' };
const closed = { ...open, paths: ['rig/gone.js'], closed: true };

function repo(t, ledger = [], files = {}, merged = []) {
  const root = tempDir('rig-retirements-');
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  write(root, 'rig/retirements.json', JSON.stringify({ merged, rows: ledger }));
  write(root, 'rig/manifest.json', JSON.stringify({ corpus: 'rig/corpus', payload: [{ op: 'copy', from: 'rig/used.js', to: '.rig/used.js', host: 'neutral' }] }));
  write(root, 'rig/used.js', "require('./helper.js');\n");
  write(root, 'rig/helper.js', 'module.exports = {};\n');
  for (const [file, content] of Object.entries(files)) write(root, file, content);
  run('git', ['init', '-q'], { cwd: root });
  run('git', ['add', '-A'], { cwd: root });
  return root;
}
function findings(root, kind, options = { release: true }) {
  const { checkRetirements } = product('scripts/check-retirements.js');
  return checkRetirements(root, options).errors.filter(error => error.startsWith(`${kind}:`));
}
function benchRun(t) {
  const task = tempDir('rig-cleanup-bench-');
  t.after(() => fs.rmSync(task, { recursive: true, force: true }));
  write(task, 'starter.txt', 'keep\nreplace me\n');
  const inner = write(task, 'inner.py', "import json\nfrom pathlib import Path\nPath('starter.txt').write_text('keep\\nnew one\\nnew two\\n')\nprint(json.dumps({'passed':True,'tokens_in':10,'tokens_out':5,'fit_tokens':0,'cost_usd':0.01,'tampered':False,'sloc':1,'interventions':0}))\n");
  const output = path.join(task, 'sessions.jsonl');
  const env = { ...process.env, RIG_BENCH_FIXTURE_TASK: task, RIG_BENCH_FIXTURE_INNER: inner,
    RIG_BENCH_FIXTURE_OUTPUT: output, RIG_BENCH_FINAL_MARKER: path.join(task, 'final.marker') };
  const result = run('python3', [path.join(ROOT, 'benchmarks/harbor/run.py'), '--arms', 'plain', '--split', 'practice', '--runs', '1', '--token-cap', '100'], { cwd: task, env });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return rows(output);
}

test('RB-CLEAN-1 at release an open retirement row without a later release and an owner reason fails the check', t => {
  const reason = 'existing installs keep working for one release';
  assert.equal(findings(repo(t, [open]), 'open-row').length, 1);
  assert.equal(findings(repo(t, [{ ...open, laterRelease: '7.1.0' }]), 'open-row').length, 1);
  assert.equal(findings(repo(t, [{ ...open, ownerReason: reason }]), 'open-row').length, 1);
  assert.deepEqual(findings(repo(t, [{ ...open, laterRelease: '7.1.0', ownerReason: reason }]), 'open-row'), []);
  assert.deepEqual(findings(repo(t, [closed]), 'open-row'), []);
  assert.deepEqual(findings(ROOT, 'open-row'), []);
});

test('RB-CLEAN-2 a release payload holding a closed retirement path fails the check', t => {
  const file = repo(t, [{ ...closed, paths: ['rig/used.js'] }]);
  assert.ok(findings(file, 'closed-path-shipped').some(error => error.includes('rig/used.js')));
  const folder = repo(t, [{ ...closed, paths: ['rig/old-pack'] }], {
    'rig/manifest.json': JSON.stringify({ payload: [{ op: 'copy', from: 'rig/old-pack/a.md', to: '.rig/a.md', host: 'neutral' }] }),
    'rig/old-pack/a.md': 'old\n',
  });
  assert.ok(findings(folder, 'closed-path-shipped').some(error => error.includes('rig/old-pack')));
  assert.deepEqual(findings(repo(t, [closed]), 'closed-path-shipped'), []);
  const ledger = json(path.join(ROOT, 'rig/retirements.json'));
  assert.ok(ledger.rows.some(row => row.closed), 'the rebuild ledger must hold closed rows');
  for (const old of ['rig/lib/upstream-fetch.js', 'rig/catalog/skills', 'rig/catalog/plumbing']) {
    assert.ok(!fs.existsSync(path.join(ROOT, old)), `${old} must be gone`);
  }
  assert.deepEqual(findings(ROOT, 'closed-path-shipped'), []);
});

test('RB-CLEAN-3 a code, test or manifest reference to a closed retirement path fails the check', t => {
  const root = repo(t, [closed], {
    'scripts/caller.js': "require('../rig/gone.js');\n",
    'tests/old.test.js': "const file = 'rig/gone.js';\n",
    'package.json': '{"files":["rig/gone.js"]}\n',
    'tests/rebuild/gone.test.js': "assert.ok(!exists('rig/gone.js'));\n",
  });
  const found = findings(root, 'closed-path-referenced').join('\n');
  for (const file of ['scripts/caller.js', 'tests/old.test.js', 'package.json']) assert.ok(found.includes(file), found);
  assert.ok(!found.includes('tests/rebuild/gone.test.js'), 'a locked test may name what must stay gone');
  assert.deepEqual(findings(repo(t, [closed]), 'closed-path-referenced'), [], 'the ledger may name its own rows');
  assert.deepEqual(findings(ROOT, 'closed-path-referenced'), []);
});

test('RB-CLEAN-4 a shipped file that nothing reaches fails the check', t => {
  const found = findings(repo(t, [], { 'rig/orphan.js': 'module.exports = 1;\n' }), 'unreachable');
  assert.equal(found.length, 1, found.join('\n'));
  assert.ok(found[0].includes('rig/orphan.js'));
  assert.deepEqual(findings(repo(t), 'unreachable'), [], 'a file required by a reached file is reached');
  assert.deepEqual(findings(ROOT, 'unreachable'), []);
});

test('RB-CLEAN-5 a current wiki page describing a removed part fails the check', t => {
  const row = { ...closed, wikiPhrases: ['fetched at setup'] };
  const text = 'Skills are fetched at setup.\n';
  const pages = { 'wiki/specs/live.md': text, 'wiki/archive/old.md': text, 'wiki/reasoning/2026-01-01-old.md': text };
  const found = findings(repo(t, [row], pages), 'stale-wiki');
  assert.equal(found.length, 1, found.join('\n'));
  assert.ok(found[0].includes('wiki/specs/live.md'));
  assert.deepEqual(findings(repo(t, [{ ...row, closed: false }], pages), 'stale-wiki'), [], 'an open row is still present');
  assert.deepEqual(findings(ROOT, 'stale-wiki'), []);
});

test('RB-CLEAN-6 an overdue retirement row fails the check', t => {
  const old = { 'rig/old.js': 'old\n' };
  const options = { release: false };
  const overdue = repo(t, [open], old, ['S4']);
  assert.equal(findings(overdue, 'overdue', options).length, 1);
  assert.deepEqual(findings(repo(t, [open], old, ['S1']), 'overdue', options), [], 'its stage has not merged');
  assert.deepEqual(findings(repo(t, [open], {}, ['S4']), 'overdue', options), [], 'its paths are gone');
  const { deleteIn, ...undated } = open;
  assert.equal(findings(repo(t, [undated], old), 'overdue', options).length, 1, `a row needs a stage, not only ${deleteIn}`);
  const script = path.join(ROOT, 'scripts/check-retirements.js');
  const failed = run(process.execPath, [script, '--root', overdue]);
  assert.notEqual(failed.status, 0);
  assert.match(failed.stdout + failed.stderr, /rig\/old\.js/);
  assert.equal(run(process.execPath, [script, '--root', repo(t)]).status, 0);
});

test('RB-CLEAN-7 the retirement check runs in the ordinary test gate', () => {
  // The signed 6.0.0 oracle pins test:code, so the check arrives as a test file the chain already runs.
  const scripts = json(path.join(ROOT, 'package.json')).scripts;
  assert.match(scripts.test, /npm run test:code/);
  assert.match(scripts['test:code'], /tests\/\*\.test\.js/);
  assert.match(fs.readFileSync(path.join(ROOT, 'tests/retirements.test.js'), 'utf8'), /check-retirements/);
  assert.equal(run('git', ['ls-files', '--error-unmatch', 'rig/retirements.json'], { cwd: ROOT }).status, 0);
  const result = run(process.execPath, ['--test', 'tests/retirements.test.js'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stdout || result.stderr);
});

test('RB-CLEAN-8 startup lists cleanup after building and before verification', () => {
  const { startup } = product('rig/lib/coordinator.js');
  const steps = startup();
  const isCleanup = step => /clean\s*-?up/i.test(step);
  const cleanup = steps.findIndex(isCleanup);
  const build = steps.findIndex(step => /\bbuild/i.test(step) && !isCleanup(step));
  const verify = steps.findIndex(step => /verif/i.test(step) && !isCleanup(step));
  assert.ok(cleanup >= 0, JSON.stringify(steps));
  assert.ok(build >= 0 && build < cleanup, JSON.stringify(steps));
  assert.ok(verify > cleanup, JSON.stringify(steps));
});

test('RB-CLEAN-9 done building routes to the least-code role', () => {
  const { route } = product('rig/lib/coordinator.js');
  const roles = json(path.join(ROOT, 'rig/corpus/catalogue.json')).roles.filter(role => role.default === 'active');
  const result = route('done building', roles);
  assert.equal(result.fallback, null);
  assert.equal(result.role?.id, 'least-code');
});

test('RB-CLEAN-10 every benchmark session records its four cleanup measures', t => {
  const [fresh] = benchRun(t);
  assert.equal(fresh.lines_added, 2);
  assert.equal(fresh.lines_removed, 1);
  const sessions = rows(path.join(ROOT, 'benchmarks/results/final/sessions.jsonl'));
  assert.ok(sessions.length > 0);
  for (const row of [fresh, ...sessions]) {
    assert.ok(Number.isInteger(row.lines_added) && Number.isInteger(row.lines_removed), JSON.stringify(row));
    for (const measure of ['dead_left', 'dup_left']) {
      // A task image without the tool records a named gap, never a silent zero.
      assert.ok(Number.isInteger(row[measure]) || (row[measure] === null && row.cleanup_gap), JSON.stringify(row));
    }
  }
});

test('RB-CLEAN-11 every benchmark session records the harness size', t => {
  const [plain] = benchRun(t);
  assert.equal(plain.harness_bytes, 0, 'the plain arm installs nothing');
  const sessions = rows(path.join(ROOT, 'benchmarks/results/final/sessions.jsonl'));
  assert.ok(sessions.every(row => Number.isInteger(row.harness_bytes) && row.harness_bytes >= 0));
  assert.ok(sessions.some(row => row.harness_bytes > 0), 'at least one arm installs a harness');
});

test('RB-CLEAN-12 every tuning decision holds a removal candidate', () => {
  const directory = path.join(ROOT, 'wiki/specs/rebuild/benchmark-results');
  const rounds = fs.readdirSync(directory).filter(name => /^round-\d+$/.test(name));
  assert.ok(rounds.length > 0);
  for (const round of rounds) {
    const decision = json(path.join(directory, round, 'decision.json'));
    assert.ok(Array.isArray(decision.removals) && decision.removals.length > 0, `${round} tried no removal`);
    for (const removal of decision.removals) {
      assert.ok(decision.candidates.includes(removal.candidate), `${round}: ${removal.candidate}`);
      assert.notEqual(removal.candidate, decision.floor);
      assert.ok(typeof removal.removed === 'string' && removal.removed.trim(), `${round} must name what was taken out`);
    }
  }
});
