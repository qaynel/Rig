'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run } = require('./_harness');

test('RB-DOOR-1 proposing a first-session fit writes nothing to host install targets', () => {
  const onboarding = require(path.join(ROOT, 'rig/catalog/baseline/onboarding.js'));
  const repo = tempDir('rig-first-session-');
  write(repo, 'package.json', '{"name":"fixture"}');
  const before = ['.claude', '.codex', '.cursor'].map((item) => fs.existsSync(path.join(repo, item)));
  onboarding.propose(repo);
  const after = ['.claude', '.codex', '.cursor'].map((item) => fs.existsSync(path.join(repo, item)));
  assert.deepEqual(after, before);
});

test('RB-DOOR-2 first-session questions show recommendations and accept the proposed answer', () => {
  const script = fs.readFileSync(path.join(ROOT, 'rig/corpus/onboarding/first-session.md'), 'utf8');
  assert.match(script, /recommend/i);
  assert.match(script, /accept as proposed/i);
});

test('RB-DOOR-3 sign-off interview requires an explicit selection before install', () => {
  const signoff = require(path.join(ROOT, 'rig/catalog/baseline/user-signoff.js'));
  const onboarding = require(path.join(ROOT, 'rig/catalog/baseline/onboarding.js'));
  const repo = tempDir('rig-signoff-choice-');
  const proposal = onboarding.propose(repo);
  assert.equal(signoff.interview(repo).required, true);
  assert.throws(() => signoff.select(repo), /mode|choice|select/i);
  assert.throws(() => onboarding.apply(repo, proposal), /approved|digest/i);
  assert.equal(fs.existsSync(path.join(repo, '.rig')), false);
});

test('RB-DOOR-4 clean marketplace and shell installs produce the same tree for one fit', () => {
  const script = path.join(ROOT, 'scripts/clean-install-e2e.js');
  const result = run(process.execPath, [script, '--routes', 'marketplace,install.sh', '--fit', 'fixture'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout.trim().split('\n').at(-1));
  assert.deepEqual(output.marketplace.tree, output.shell.tree);
});

test('RB-LAUNCH-1 results page includes every arm and agrees with the final report values', () => {
  const page = fs.readFileSync(path.join(ROOT, 'docs/results.md'), 'utf8');
  const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/report.json'), 'utf8'));
  for (const arm of report.arms) {
    assert.ok(page.includes(arm.id), `missing arm ${arm.id}`);
    assert.ok(page.includes(String(arm.pass_rate)), `missing result for ${arm.id}`);
  }
  assert.ok(report.arms.some((arm) => arm.pass_rate < report.baseline.pass_rate), 'losses must be represented');
});

test('RB-REL-1 archive snapshot bytes equal the selected S15 winner commit', () => {
  const { buildPublicArchive } = require(path.join(ROOT, 'scripts/build-public-archive.js'));
  const winner = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/winner.json'), 'utf8'));
  const result = buildPublicArchive({ commit: winner.commit, outDir: tempDir('rig-release-archive-') });
  assert.equal(result.snapshotDigest, winner.snapshotDigest);
});

test('RB-REL-2 installing the published archive makes no outbound setup request', () => {
  const result = run(process.execPath, [path.join(ROOT, 'scripts/clean-install-e2e.js'), '--source', 'published-archive', '--network', 'blocked'], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /network calls:\s*0/i);
});

test('RB-REL-3 published archive plus local search assets fits the cap or names its overrun', () => {
  const release = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/release-size.json'), 'utf8'));
  if (release.totalBytes > 250 * 1024 * 1024) assert.ok(release.releaseNote?.includes('overrun'));
  else assert.ok(release.totalBytes <= 250 * 1024 * 1024);
});

test('RB-REL-4 release archive passes the executable and content safety scan', () => {
  const { checkUpstreams } = require(path.join(ROOT, 'scripts/check-upstreams.js'));
  const archive = path.join(ROOT, 'benchmarks/results/final/archive');
  const result = checkUpstreams(archive);
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('RB-REL-5 release beats the same-window v6.0.0 baseline beyond the interval', () => {
  const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/report.json'), 'utf8'));
  assert.equal(report.release_gate.passed, true);
  assert.ok(report.release_gate.difference_interval.lower > 0);
  assert.equal(report.release_gate.baseline_tag, 'v6.0.0');
});

test('RB-REL-6 every rebuild requirement maps to one passing proving test', () => {
  const result = run(process.execPath, [path.join(ROOT, 'scripts/rebuild/check-contract.js'), '--json', '--root', ROOT]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const graph = JSON.parse(result.stdout);
  assert.equal(graph.counts.orphans, 0);
  assert.equal(graph.counts.requirements, graph.counts.criteria);
  assert.equal(graph.counts.requirements, graph.counts.tests);
});
