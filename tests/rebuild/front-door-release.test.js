'use strict';

const test = require('node:test');
const { assert, fs, path, ROOT, tempDir, write, run, sha256, networkBlockerSource } = require('./_harness');

test('RB-DOOR-1 proposing a first-session fit writes nothing to host install targets', () => {
  const onboarding = require(path.join(ROOT, 'rig/catalog/baseline/onboarding.js'));
  const repo = tempDir('rig-first-session-');
  write(repo, 'package.json', '{"name":"fixture"}');
  const before = fs.readdirSync(repo).sort();
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  const proposal = onboarding.propose(repo, { fit: { active: ['code-review'], dormant: [] } });
  onboarding.questionRound(proposal, roles);
  const after = fs.readdirSync(repo).sort();
  assert.deepEqual(after, before);
  assert.equal(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'), '{"name":"fixture"}');
});

test('RB-DOOR-2 generated first-session questions recommend outcomes and accept the proposed answer', () => {
  const onboarding = require(path.join(ROOT, 'rig/catalog/baseline/onboarding.js'));
  const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/rebuild/role-map.json'), 'utf8')).roles;
  const repo = tempDir('rig-first-session-round-');
  const proposal = onboarding.propose(repo, { fit: { active: ['code-review'], dormant: [] } });
  const round = onboarding.questionRound(proposal, roles);
  assert.ok(round.questions.length > 0);
  for (const question of round.questions) {
    assert.ok(question.outcome?.trim(), `${question.id}: missing outcome`);
    assert.ok(question.recommendation?.trim(), `${question.id}: missing recommendation`);
    const answer = onboarding.answerQuestion(round, question.id, 'accept as proposed');
    assert.equal(answer.accepted, true);
  }
  assert.equal(fs.existsSync(path.join(repo, '.agents/skills')), false);
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

test('RB-DOOR-4 marketplace and shell routes produce the same installed tree for one fit', () => {
  const { buildArchive } = require(path.join(ROOT, 'scripts/build-public-archive.js'));
  const archive = buildArchive(ROOT, tempDir('rig-door-dist-')).file;
  const installer = path.join(ROOT, 'scripts/clean-install-e2e.js');
  const shellTree = path.join(tempDir('rig-door-shell-'), 'tree.json');
  const marketplaceTree = path.join(tempDir('rig-door-marketplace-'), 'tree.json');
  const args = ['--artifact', archive, '--fixture-output'];
  const shell = run(process.execPath, [installer, ...args, shellTree, '--route', 'shell'], { cwd: ROOT });
  assert.equal(shell.status, 0, shell.stderr || shell.stdout);
  const marketplace = run(process.execPath, [installer, ...args, marketplaceTree, '--route', 'marketplace'], { cwd: ROOT });
  assert.equal(marketplace.status, 0, marketplace.stderr || marketplace.stdout);
  assert.deepEqual(JSON.parse(fs.readFileSync(shellTree, 'utf8')), JSON.parse(fs.readFileSync(marketplaceTree, 'utf8')));
});

test('RB-LAUNCH-1 results page includes every arm and agrees with the final report values', () => {
  const page = fs.readFileSync(path.join(ROOT, 'docs/results.md'), 'utf8');
  const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/report.json'), 'utf8'));
  for (const arm of report.arms) {
    assert.ok(page.includes(arm.id), `missing arm ${arm.id}`);
    assert.ok(page.includes(String(arm.pass_rate)), `missing result for ${arm.id}`);
  }
  for (const arm of report.arms.filter((row) => row.pass_rate < report.baseline.pass_rate)) {
    assert.ok(page.includes(arm.id), `measured loss ${arm.id} must be represented`);
    assert.ok(page.includes(String(arm.pass_rate)), `measured loss ${arm.id} must include its value`);
  }
});

test('RB-REL-1 archive snapshot bytes equal the selected S15 winner commit', () => {
  const { buildArchive } = require(path.join(ROOT, 'scripts/build-public-archive.js'));
  const winner = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/winner.json'), 'utf8'));
  assert.match(winner.commit, /^[a-f0-9]{40}$/i);
  const work = tempDir('rig-release-archive-');
  const sourceTar = path.join(work, 'winner.tar');
  const sourceDir = path.join(work, 'winner-tree');
  const extracted = path.join(work, 'published-tree');
  fs.mkdirSync(sourceDir);
  fs.mkdirSync(extracted);
  const archived = run('git', ['archive', '--format=tar', '--prefix=winner/', '-o', sourceTar, winner.commit], { cwd: ROOT });
  assert.equal(archived.status, 0, archived.stderr);
  const unpackSource = run('tar', ['-xf', sourceTar, '-C', sourceDir]);
  assert.equal(unpackSource.status, 0, unpackSource.stderr);
  const sourceRoot = path.join(sourceDir, 'winner');
  const archive = buildArchive(sourceRoot, path.join(work, 'dist'));
  const unpackArchive = run('tar', ['-xzf', archive.file, '-C', extracted]);
  assert.equal(unpackArchive.status, 0, unpackArchive.stderr);
  const publishedRoot = fs.readdirSync(extracted).map((name) => path.join(extracted, name)).find((name) => fs.statSync(name).isDirectory());
  const tree = (root) => {
    const output = {};
    const walk = (relative) => {
      const absolute = path.join(root, relative);
      const stat = fs.lstatSync(absolute);
      const key = relative.split(path.sep).join('/');
      if (stat.isDirectory()) {
        output[key] = { type: 'directory', mode: stat.mode & 0o777 };
        for (const name of fs.readdirSync(absolute).sort()) walk(path.join(relative, name));
      } else {
        const target = stat.isSymbolicLink() ? fs.realpathSync(absolute) : absolute;
        assert.ok(target === root || target.startsWith(`${fs.realpathSync(root)}${path.sep}`), `${key} escapes the source tree`);
        const targetStat = fs.statSync(target);
        assert.ok(targetStat.isFile(), `${key} is not a regular archive payload`);
        output[key] = { type: 'file', mode: targetStat.mode & 0o777, sha256: sha256(fs.readFileSync(target)) };
      }
    };
    for (const item of ['rig', 'skills/rig', 'package.json', 'LICENSE']) {
      assert.ok(fs.existsSync(path.join(root, item)), `release is missing ${item}`);
      walk(item);
    }
    return output;
  };
  const sourceTree = tree(sourceRoot);
  const publishedTree = tree(publishedRoot);
  assert.ok(Object.keys(sourceTree).length > 0, 'selected commit did not contain a release payload');
  assert.deepEqual(sourceTree, publishedTree);
});

test('RB-REL-2 installing the published archive makes no outbound setup request', () => {
  const work = tempDir('rig-rel-offline-');
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  const archive = path.join(work, `rig-public-${version}.tar.gz`);
  const snapshot = run('git', ['archive', '--format=tar.gz', `--prefix=rig-public-${version}/`, '-o', archive, 'HEAD'], { cwd: ROOT });
  assert.equal(snapshot.status, 0, snapshot.stderr);
  const commit = run('git', ['rev-parse', 'HEAD'], { cwd: ROOT });
  assert.equal(commit.status, 0, commit.stderr);
  const blockRoot = tempDir('rig-rel-block-network-');
  const calls = path.join(blockRoot, 'network-attempts.log');
  const blocker = write(blockRoot, 'block.cjs', networkBlockerSource(calls));
  const target = tempDir('rig-rel-install-target-');
  const result = run('sh', [path.join(ROOT, 'install.sh'), '--candidate-artifact', archive, '--candidate-sha', commit.stdout.trim(), '--candidate-digest', sha256(fs.readFileSync(archive)), '--target', target, '--hosts', 'codex'], {
    cwd: ROOT,
    env: { ...process.env, NODE_OPTIONS: `--require=${blocker}` },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(calls), false, fs.existsSync(calls) ? fs.readFileSync(calls, 'utf8') : '');
});

test('RB-REL-3 published archive plus local search assets fits the cap or names its overrun', () => {
  const archiveDir = path.join(ROOT, 'benchmarks/results/final/archive');
  const archive = fs.readdirSync(archiveDir).map((name) => path.join(archiveDir, name)).find((file) => file.endsWith('.tar.gz'));
  assert.ok(archive, 'published archive file is missing');
  const searchAssets = path.join(ROOT, 'rig/catalog/baseline/assets/potion-base-2m');
  assert.ok(fs.existsSync(searchAssets), 'local search assets are missing');
  const bytesUnder = (dir) => {
    if (!fs.existsSync(dir)) return 0;
    const stat = fs.statSync(dir);
    if (stat.isFile()) return stat.size;
    return fs.readdirSync(dir).reduce((sum, name) => sum + bytesUnder(path.join(dir, name)), 0);
  };
  const total = fs.statSync(archive).size + bytesUnder(searchAssets);
  if (total > 250 * 1024 * 1024) {
    const notes = fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/release-notes.md'), 'utf8');
    assert.match(notes, /size overrun/i);
    assert.match(notes, new RegExp(String(total - 250 * 1024 * 1024)));
  } else assert.ok(total <= 250 * 1024 * 1024);
});

test('RB-REL-4 release archive passes the executable and content safety scan', () => {
  const { checkUpstreams } = require(path.join(ROOT, 'scripts/check-upstreams.js'));
  const archiveDir = path.join(ROOT, 'benchmarks/results/final/archive');
  const archive = fs.readdirSync(archiveDir).map((name) => path.join(archiveDir, name)).find((file) => file.endsWith('.tar.gz'));
  assert.ok(archive, 'release archive missing');
  const unpacked = tempDir('rig-release-scan-');
  const extract = run('tar', ['-xzf', archive, '-C', unpacked]);
  assert.equal(extract.status, 0, extract.stderr);
  const contents = fs.readdirSync(unpacked).map((name) => path.join(unpacked, name)).find((file) => fs.statSync(file).isDirectory());
  const result = checkUpstreams(contents);
  assert.equal(result.ok, true, JSON.stringify(result.failures));
});

test('RB-REL-5 release beats the same-window v6.0.0 baseline beyond the interval', () => {
  const winner = JSON.parse(fs.readFileSync(path.join(ROOT, 'benchmarks/results/final/winner.json'), 'utf8'));
  const sessionsFile = path.join(ROOT, 'benchmarks/results/final/sessions.jsonl');
  const result = run('python3', [path.join(ROOT, 'benchmarks/harbor/report.py'), sessionsFile], { cwd: ROOT });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const comparison = report.comparisons.find((row) => row.arms?.includes(winner.arm) && row.arms?.includes('v6.0.0'));
  assert.ok(comparison, 'test-split report must compare the selected release arm with v6.0.0');
  assert.ok(comparison.pass_rate_difference_interval.lower > 0);
  const rows = fs.readFileSync(sessionsFile, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line));
  const comparedRows = rows.filter((row) => row.arm === winner.arm || row.arm === 'v6.0.0');
  assert.ok(comparedRows.some((row) => row.arm === winner.arm), 'raw rows are missing the selected release arm');
  assert.ok(comparedRows.some((row) => row.arm === 'v6.0.0'), 'raw rows are missing the baseline arm');
  const windows = new Set(comparedRows.map((row) => row.window));
  assert.equal(windows.size, 1, 'release and baseline sessions must share a run window');
});

test('RB-REL-6 every rebuild requirement maps to one passing proving test', () => {
  const result = run(process.execPath, [path.join(ROOT, 'scripts/rebuild/check-contract.js'), '--json', '--root', ROOT]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const graph = JSON.parse(result.stdout);
  assert.deepEqual(graph.errors, []);
  assert.equal(graph.counts.requirements, graph.counts.criteria);
  assert.equal(graph.counts.requirements, graph.counts.tests);
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/gate1/rebuild/test-manifest.json'), 'utf8'));
  const evidence = JSON.parse(fs.readFileSync(path.join(ROOT, '.context/rebuild/lane-results.json'), 'utf8'));
  const checker = require(path.join(ROOT, 'scripts/rebuild/check-contract.js'));
  assert.equal(evidence.contract_manifest_sha256, sha256(fs.readFileSync(path.join(ROOT, 'wiki/gate1/rebuild/contract.manifest'))));
  assert.equal(evidence.git_head, checker.currentGitHead(ROOT));
  assert.equal(evidence.source_tree_sha256, checker.sourceTreeDigest(ROOT));
  assert.deepEqual(evidence.tests.map((row) => row.id).sort(), rows.map((row) => row.id).sort());
  for (const row of evidence.tests) assert.equal(row.status, 'pass', `${row.id} has ${row.status} lane evidence`);
});

// Owner rulings 2026-10-31 (design 5.4): every ruled default is the user's choice at onboarding; expansions are opt-in.
const onboardingModule = () => require(path.join(ROOT, 'rig/catalog/baseline/onboarding.js'));
const REQUIRED_SETTINGS = ['memory', 'plan-review-lenses', 'fix-loop-runs', 'expansions'];

test('RB-DOOR-5 the onboarding interview offers every configurable setting with its default and a question', () => {
  const settings = onboardingModule().configurableSettings();
  assert.ok(Array.isArray(settings));
  for (const id of REQUIRED_SETTINGS) {
    const row = settings.find((setting) => setting.id === id);
    assert.ok(row, `missing configurable setting ${id}`);
    assert.ok(Object.hasOwn(row, 'default'), `${id} has no default`);
    assert.ok(row.question?.trim(), `${id} has no interview question`);
  }
  assert.equal(settings.find((setting) => setting.id === 'fix-loop-runs').default, 3);
});

test('RB-DOOR-6 a recorded onboarding choice overrides the ruled default and unchosen settings keep it', () => {
  const onboarding = onboardingModule();
  const repo = tempDir('rig-onboarding-choice-');
  const proposal = onboarding.propose(repo, { fit: { active: ['code-review'], dormant: [] }, choices: { 'fix-loop-runs': 5 } });
  assert.equal(proposal.settings['fix-loop-runs'], 5);
  const defaults = Object.fromEntries(onboarding.configurableSettings().map((row) => [row.id, row.default]));
  for (const id of REQUIRED_SETTINGS.filter((name) => name !== 'fix-loop-runs')) assert.deepEqual(proposal.settings[id], defaults[id], id);
  const other = onboarding.propose(tempDir('rig-onboarding-default-'), { fit: { active: ['code-review'], dormant: [] } });
  assert.equal(other.settings['fix-loop-runs'], 3);
});

test('RB-DOOR-7 declining every expansion completes onboarding with no network attempt and no expansion files', () => {
  const onboarding = onboardingModule();
  const repo = tempDir('rig-onboarding-decline-');
  const net = require('node:net'); const http = require('node:http'); const https = require('node:https');
  const saved = { connect: net.Socket.prototype.connect, http: http.request, https: https.request, fetch: global.fetch };
  let attempts = 0;
  const deny = () => { attempts += 1; throw new Error('network denied'); };
  net.Socket.prototype.connect = deny; http.request = deny; https.request = deny; global.fetch = deny;
  try {
    const proposal = onboarding.propose(repo, { fit: { active: ['code-review'], dormant: [] }, choices: { expansions: [] } });
    onboarding.apply(repo, proposal, { approved_digest: proposal.digest });
  } finally {
    net.Socket.prototype.connect = saved.connect; http.request = saved.http; https.request = saved.https; global.fetch = saved.fetch;
  }
  assert.equal(attempts, 0);
  assert.equal(fs.existsSync(path.join(repo, '.rig/expansions')), false);
  assert.ok(onboarding.expansions().length >= 2, 'heavy memory and the larger search model must be offered as expansions');
});

test('RB-DOOR-8 an expansion downloads only after the user enables it by name', () => {
  const onboarding = onboardingModule();
  const repo = tempDir('rig-onboarding-enable-');
  const downloads = [];
  const download = (id) => { downloads.push(id); return { ok: true }; };
  assert.throws(() => onboarding.enableExpansion(repo, 'heavy-memory', { confirm: false, download, show: () => {} }), /confirm|enable|consent/i);
  assert.deepEqual(downloads, []);
  onboarding.enableExpansion(repo, 'heavy-memory', { confirm: true, download, show: () => {} });
  assert.deepEqual(downloads, ['heavy-memory']);
});

test('RB-DOOR-9 enabling the larger search model shows its licence terms before any download', () => {
  const onboarding = onboardingModule();
  const repo = tempDir('rig-onboarding-licence-');
  const events = [];
  onboarding.enableExpansion(repo, 'multilingual-search-model', {
    confirm: true,
    show: (text) => events.push(['show', text]),
    download: (id) => { events.push(['download', id]); return { ok: true }; },
  });
  const shown = events.findIndex(([kind, text]) => kind === 'show' && /gemma/i.test(text) && /terms|licen[cs]e/i.test(text));
  const downloaded = events.findIndex(([kind]) => kind === 'download');
  assert.ok(shown >= 0, 'licence terms were not shown');
  assert.ok(downloaded > shown, 'download happened before the licence terms were shown');
});

test('RB-DOOR-10 every expansion is offered with the question "Enable this for better performance?"', () => {
  const offered = onboardingModule().expansions();
  assert.ok(offered.length > 0);
  for (const row of offered) {
    assert.ok(row.id?.trim());
    assert.equal(row.prompt, 'Enable this for better performance?', row.id);
  }
});
