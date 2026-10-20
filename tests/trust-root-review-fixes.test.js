#!/usr/bin/env node
'use strict';

// 2026-10-20 trust-root binding review: regressions for the findings the signed
// oracle cannot carry yet. Each test drives the shipping seam, not a test lever.
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const h = require('./helpers/advanced');
const { validateDisposition } = require('../rig/lib/checks');
const { genericSuccessBinding, runBinding } = require('../rig/lib/check-runner');
const { conventionReasonGap } = require('../rig/lib/catalog');
const { resumeInstall, installState, uninstall } = require('../rig/lib/lifecycle');
const { policyStatus, proposePolicy, activatePolicy } = require('../rig/lib/policy');
const { PROVIDERS, planCiIntegration, applyCiPlan } = require('../rig/lib/ci-adapters');
const { networkIsolationPrefix, deniesConnection } = require('../rig/lib/spawn-guarded');
const { mergeHostGlobalMcp, GLOBAL_MCP_CONTRACTS } = require('../rig/lib/global-writes');

const root = path.join(__dirname, '..');
const materializer = path.join(root, 'rig', 'materialize.js');

test('finding 1 (AT-SHAPE-5, AD-15): generic-success bindings are coverage gaps, real commands are not', () => {
  const stubs = [
    ['true'], ['/usr/bin/true'], [':'], ['echo', 'ok'], ['printf', ''], [''], ['env', 'true'], ['nice', '-n', '5', 'echo', 'x'],
    ['sh', '-c', 'true'], ['bash', '-lc', 'exit 0'], ['sh', '-c', 'true && true'],
    ['node', '-e', 'process.exit(0)'], ['node', '-e', ''], [process.execPath, '-e', 'process.exit(0)'],
    ['python3', '-c', 'pass'], ['python3', '-c', 'sys.exit(0)'],
  ];
  for (const argv of stubs) {
    assert.match(genericSuccessBinding(argv) || '', /generic-success|empty command/, JSON.stringify(argv));
    assert.throws(() => validateDisposition({ kind: 'executable', argv }), /coverage gap/, JSON.stringify(argv));
  }
  const real = [
    ['node', '--version'], ['node', '.rig/bin/check.js', '--service', 'x'], ['npm', 'run', 'lint'],
    ['sh', '-c', 'npm test && npm run lint'], ['node', '-e', "require('fs').readdirSync('.')"], ['python3', '-m', 'pytest'],
    ['env', 'FOO=1', 'npm', 'run', 'echo'],
  ];
  for (const argv of real) {
    assert.equal(genericSuccessBinding(argv), null, JSON.stringify(argv));
    assert.deepEqual(validateDisposition({ kind: 'executable', argv }), { kind: 'executable' });
  }
});

test('finding 1 (AT-SHAPE-5): a convention reason must say something about the service', () => {
  for (const reason of [
    'generic convention', 'service-specific', '',
    'service-specific service-specific service-specific service-specific service-specific service-specific',
    'Carries the shared invariant the parent service depends on and is generic baseline practice here.',
  ]) assert.throws(() => validateDisposition({ kind: 'convention', reason }), /service-specific/, reason);
  const reason = 'Repository convention: dependency-hygiene is enforced by the lockfile review the team already runs in pull requests, not by Rig.';
  assert.deepEqual(validateDisposition({ kind: 'convention', reason }), { kind: 'convention' });
  assert.equal(conventionReasonGap(reason, 'development.code-quality.dependency-hygiene'), null);
  assert.match(conventionReasonGap(reason, 'security.secrets.secret-scanning'), /does not mention/);
});

test('finding 1 (AT-SHAPE-5): the check runner reports a stub binding as a coverage gap on every binding shape', () => {
  h.withRepo((target) => {
    const bare = runBinding('x.y.stub', { repo: ['true'] }, 'repo', target);
    assert.equal(bare.kind, 'coverage_gap');
    assert.notEqual(bare.status, 0);
    const checks = runBinding('x.y.stub', { checks: { only: { repo: ['sh', '-c', 'exit 0'] } } }, 'repo', target);
    assert.equal(checks.kind, 'coverage_gap');
    const component = runBinding('x.y.stub', { checks: { only: { commands: [{ argv: ['echo', 'done'] }] } } }, 'repo', target);
    assert.equal(component.kind, 'coverage_gap');
    const real = runBinding('x.y.real', { repo: [process.execPath, '-e', "require('fs').readdirSync('.')"] }, 'repo', target);
    assert.equal(real.status, 0);
  });
});

const crashScript = (lifecycle, operations) => `
const fs = require('node:fs');
const real = fs.writeFileSync;
fs.writeFileSync = function (file, ...rest) {
  if (/[\\\\/]\\.rig[\\\\/]b$/.test(String(file))) process.kill(process.pid, 'SIGKILL');
  return real.call(this, file, ...rest);
};
require(${JSON.stringify(lifecycle)}).resumeInstall(process.argv[1], { operations: ${JSON.stringify(operations)} });
`;

const OPERATIONS = [{ path: '.rig/a', content: 'a' }, { path: '.rig/b', content: 'b' }, { path: '.rig/c', content: 'c' }];

test('finding 2 (AT-INSTALL-1): a process killed mid-install withholds claims and resumes without clobbering user data', () => {
  h.withRepo((target) => {
    const unrelated = path.join(target, 'notes.txt');
    fs.writeFileSync(unrelated, 'user data\n');
    const crashed = spawnSync(process.execPath, ['-e', crashScript(path.join(root, 'rig/lib/lifecycle.js'), OPERATIONS), target], { encoding: 'utf8' });
    assert.notEqual(crashed.status, 0, 'the child really died mid-install');
    const state = installState(target);
    assert.equal(state.complete, false);
    assert.deepEqual(state.pending_paths, ['.rig/b']);
    assert.equal(fs.readFileSync(path.join(target, '.rig/a'), 'utf8'), 'a');
    const status = policyStatus(target);
    assert.equal(status.protection, 'withheld');
    assert.ok(Object.values(status.surfaces).every((surface) => surface.state === 'withheld_install_incomplete'));

    const done = resumeInstall(target, { operations: OPERATIONS });
    assert.equal(done.complete, true);
    assert.equal(done.records.length, 3);
    assert.deepEqual(OPERATIONS.map((op) => fs.readFileSync(path.join(target, op.path), 'utf8')), ['a', 'b', 'c']);
    assert.equal(fs.readFileSync(unrelated, 'utf8'), 'user data\n');
    assert.equal(installState(target).complete, true);
    assert.equal(policyStatus(target).protection, 'per_surface');
  });
});

test('finding 2 (AT-INSTALL-1): a permission-denied write interrupts the install, and resume finishes once it is allowed', (t) => {
  if (process.platform === 'win32' || process.getuid?.() === 0) return t.skip('POSIX directory permissions are not enforced here');
  h.withRepo((target) => {
    const locked = path.join(target, '.rig', 'locked');
    fs.mkdirSync(locked, { recursive: true });
    const operations = [{ path: '.rig/a', content: 'a' }, { path: '.rig/locked/b', content: 'b' }];
    fs.chmodSync(locked, 0o500);
    try {
      assert.throws(() => resumeInstall(target, { operations }), /EACCES|permission/i);
      assert.equal(installState(target).complete, false);
      assert.equal(policyStatus(target).protection, 'withheld');
    } finally {
      fs.chmodSync(locked, 0o700);
    }
    assert.equal(resumeInstall(target, { operations }).complete, true);
    assert.equal(installState(target).complete, true);
  });
});

test('finding 2 (AT-INSTALL-1): no caller-supplied flag can truncate an install', () => {
  h.withRepo((target) => {
    const result = resumeInstall(target, { interrupt_after: 1, operations: OPERATIONS });
    assert.equal(result.complete, true, 'interrupt_after is not a production control');
    assert.equal(installState(target).complete, true);
  });
});

const CI_SEEDS = {
  'github-actions': ['.github/workflows/ci.yml', 'name: user-ci\non: push\njobs:\n  user:\n    runs-on: ubuntu-latest\n    steps:\n      - run: make test\n'],
  gitlab_ci: ['.gitlab-ci.yml', 'stages:\n  - build\nbuild:\n  script:\n    - make\n'],
  circleci: ['.circleci/config.yml', 'version: 2.1\njobs:\n  build:\n    docker:\n      - image: cimg/base:stable\n    steps:\n      - checkout\nworkflows:\n  main:\n    jobs:\n      - build\n'],
  jenkins: ['Jenkinsfile', "pipeline {\n  agent any\n  stages {\n    stage('Build') {\n      steps { sh 'make' }\n    }\n  }\n}\n"],
  buildkite: ['.buildkite/pipeline.yml', 'steps:\n  - label: "build"\n    command: "make"\n'],
  azure_pipelines: ['azure-pipelines.yml', 'trigger:\n  - main\njobs:\n  - job: build\n    steps:\n      - script: make\n'],
};

test('finding 3 (AT-CI-1): all six providers integrate additively and the inserted job is removable byte-for-byte', () => {
  assert.deepEqual(Object.keys(CI_SEEDS).sort(), Object.keys(PROVIDERS).sort());
  for (const [provider, [rel, seed]] of Object.entries(CI_SEEDS)) h.withRepo((target) => {
    const file = path.join(target, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, seed, { mode: 0o640 });
    applyCiPlan(target, planCiIntegration(target, { provider, approved: true }));

    const merged = fs.readFileSync(file, 'utf8');
    const rigFile = path.join(target, PROVIDERS[provider].file);
    const integrated = provider === 'github-actions' ? fs.readFileSync(rigFile, 'utf8') : merged;
    assert.match(integrated, /node \.rig\/bin\/check\.js --scope repo/, `${provider} carries the Rig gate`);
    assert.doesNotMatch(integrated, /reports\/rig|upload-artifact/, provider);
    const lines = merged.split('\n');
    let cursor = 0;
    for (const line of seed.split('\n')) {
      const at = lines.indexOf(line, cursor);
      assert.notEqual(at, -1, `${provider}: user line survives in order: ${line}`);
      cursor = at + 1;
    }

    const result = uninstall(target);
    assert.equal(result.status, 'removed', `${provider}: ${JSON.stringify(result.best_effort)}`);
    assert.equal(result.verification.status, 'verified_clean', provider);
    assert.equal(fs.readFileSync(file, 'utf8'), seed, `${provider}: user config is byte-identical after uninstall`);
    if (process.platform !== 'win32') assert.equal(fs.statSync(file).mode & 0o777, 0o640, `${provider}: mode survives`);
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /rig-check/, provider);
    if (provider === 'github-actions') assert.equal(fs.existsSync(rigFile), false, 'the dedicated Rig workflow is gone');
  });
});

test('finding 3 (AT-CI-1): a user edit to the merged region is never deleted, and uninstall says so', () => {
  h.withRepo((target) => {
    const [rel, seed] = CI_SEEDS.gitlab_ci;
    const file = path.join(target, rel);
    fs.writeFileSync(file, seed);
    applyCiPlan(target, planCiIntegration(target, { provider: 'gitlab_ci', approved: true }));
    const edited = fs.readFileSync(file, 'utf8').replace('stage: test', 'stage: user-changed');
    fs.writeFileSync(file, edited);
    const result = uninstall(target);
    assert.equal(result.status, 'best_effort');
    assert.ok(result.best_effort.includes(rel));
    assert.equal(fs.readFileSync(file, 'utf8'), edited, 'the edited file is untouched');
  });
});

// Installs every surface the AT-UNINSTALL-1 trace row names into a repository that already holds user bytes.
function installEverySurface(target, home) {
  h.createRepoFixture('generic-git', target);
  const hook = path.join(execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: target, encoding: 'utf8' }).trim(), 'hooks', 'pre-commit');
  const user = {
    'AGENTS.md': '# User agents file\r\nKeep final byte',
    '.gitlab-ci.yml': CI_SEEDS.gitlab_ci[1],
    [path.relative(target, hook)]: '#!/bin/sh\necho user-hook\n',
  };
  fs.mkdirSync(path.dirname(hook), { recursive: true });
  for (const [rel, body] of Object.entries(user)) fs.writeFileSync(path.join(target, rel), body, { mode: rel.endsWith('pre-commit') ? 0o755 : 0o644 });

  const { reviewPath } = h.allowedReview(target, { host: 'codex' });
  h.writeSelection(target, {});
  const planned = h.plan(target, { review: reviewPath });
  assert.equal(planned.status, 0, planned.stderr);
  const applied = h.apply(target, { review: reviewPath, plan: planned.outPath });
  assert.equal(applied.status, 0, applied.stderr);
  applyCiPlan(target, planCiIntegration(target, { provider: 'gitlab_ci', approved: true }));
  const host = GLOBAL_MCP_CONTRACTS.claude ? 'claude' : Object.keys(GLOBAL_MCP_CONTRACTS)[0];
  const contract = GLOBAL_MCP_CONTRACTS[host];
  const globalFile = path.join(home, contract.relative_path);
  fs.mkdirSync(path.dirname(globalFile), { recursive: true });
  const globalSeed = `${JSON.stringify({ userSetting: true, [contract.server_key]: { keep: { command: 'keep' } } }, null, 2)}\n`;
  fs.writeFileSync(globalFile, globalSeed);
  const owned = mergeHostGlobalMcp(host, home, { install_id: 'repo-a', server_name: 'example-db', value: { command: 'node', args: ['/tmp/rig-mcp.js'] } });
  fs.writeFileSync(path.join(target, '.rig', 'global-writes.json'), `${JSON.stringify({ schema_version: 1, entries: [owned] }, null, 2)}\n`);

  assert.match(fs.readFileSync(hook, 'utf8'), /Rig secret guard shim/, 'the hook surface is installed');
  assert.match(fs.readFileSync(path.join(target, '.gitlab-ci.yml'), 'utf8'), /rig-check/, 'the CI surface is installed');
  assert.notEqual(fs.readFileSync(globalFile, 'utf8'), globalSeed, 'the user-global surface is installed');
  assert.ok(fs.existsSync(path.join(target, '.rig')), 'Rig-owned files exist');
  return { hook, user, globalFile, globalSeed };
}

function withHome(fn) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-uninstall-home-'));
  const savedHome = process.env.HOME;
  process.env.HOME = home;
  try { return fn(home); } finally {
    if (savedHome === undefined) delete process.env.HOME; else process.env.HOME = savedHome;
    fs.rmSync(home, { recursive: true, force: true });
  }
}

test('finding 3 (AT-UNINSTALL-1): one install across every surface is removed exactly, and user bytes survive', () => {
  h.withRepo((target) => withHome((home) => {
    const { hook, user, globalFile, globalSeed } = installEverySurface(target, home);
    const result = spawnSync(process.execPath, [materializer, '--target', target, '--uninstall'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    for (const [rel, body] of Object.entries(user)) assert.equal(fs.readFileSync(path.join(target, rel), 'utf8'), body, `${rel} is byte-identical`);
    assert.equal(fs.readFileSync(globalFile, 'utf8'), globalSeed, 'the user-global file is restored exactly');
    assert.equal(fs.existsSync(path.join(path.dirname(hook), 'pre-commit.rig-chained')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), false, 'a clean removal retires its own journal');
    // Left on purpose: the two seeded policies are user-owned, and the ledger owns the uninstall report below.
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.relative(target, path.join(dir, entry.name))]));
    assert.deepEqual(walk(path.join(target, '.rig')).sort(), ['.rig/evidence-artifacts.json', '.rig/execution-policy.json', '.rig/network-policy.json']);
    const report = JSON.parse(fs.readFileSync(path.join(target, 'reports/rig/last-uninstall.json'), 'utf8'));
    assert.deepEqual(report.best_effort, []);
    for (const rel of ['AGENTS.md', '.gitlab-ci.yml', '.git/hooks/pre-commit', '.rig/catalog-receipt.json']) assert.ok(report.removed.includes(rel), `the report names ${rel}`);
    assert.equal(report.verification.status, 'verified_clean');
  }));
});

test('finding 3 (AT-UNINSTALL-1): an uninstall killed mid-run never leaves a hook pointing at a removed Rig file', () => {
  h.withRepo((target) => withHome((home) => {
    const { hook } = installEverySurface(target, home);
    const killer = `
      const fs = require('node:fs');
      for (const name of ['rmSync', 'unlinkSync']) {
        const real = fs[name];
        fs[name] = function (file, ...rest) {
          if (/[\\\\/]\\.rig[\\\\/](?!preimages|install-manifest)/.test(String(file)) && !/\\.tmp$/.test(String(file))) process.kill(process.pid, 'SIGKILL');
          return real.call(this, file, ...rest);
        };
      }
      require(${JSON.stringify(path.join(root, 'rig/lib/lifecycle.js'))}).uninstall(process.argv[1]);
    `;
    const crashed = spawnSync(process.execPath, ['-e', killer, target], { encoding: 'utf8' });
    assert.notEqual(crashed.status, 0, 'the uninstall really died partway');
    const body = fs.readFileSync(hook, 'utf8');
    const referencesRig = /\.rig\//.test(body) && /Rig secret guard shim/.test(body);
    if (referencesRig) {
      const target_ = /\.rig\/[\w./-]+/.exec(body)[0];
      assert.ok(fs.existsSync(path.join(target, target_)), `the surviving hook still has ${target_} to run`);
    }
    assert.ok(fs.existsSync(path.join(target, '.rig', 'install-manifest.jsonl')), 'the journal survives so uninstall can be re-run');
    const rerun = uninstall(target);
    assert.equal(rerun.status, 'removed', JSON.stringify([rerun.best_effort, rerun.best_effort_details, fs.readFileSync(path.join(home, '.codeium/windsurf/mcp_config.json'), 'utf8')]));
  }));
});

test('finding 3 (AT-UNINSTALL-1): deleting .rig/ does not let uninstall declare the repository clean', () => {
  h.withRepo((target) => {
    h.createRepoFixture('generic-git', target);
    const { reviewPath } = h.allowedReview(target, { host: 'codex' });
    h.writeSelection(target, {});
    const planned = h.plan(target, { review: reviewPath });
    assert.equal(h.apply(target, { review: reviewPath, plan: planned.outPath }).status, 0);
    fs.rmSync(path.join(target, '.rig'), { recursive: true, force: true });
    const result = uninstall(target);
    assert.notEqual(result.verification.status, 'verified_clean', 'no journal means no clean claim');
    assert.equal(result.verification.differences[0].reason, 'manifest-unavailable');
  });
});

test('finding 7 (AT-PRESENCE-1): a host-native approval is refused as unavailable even when a verifier says yes', () => {
  h.withRepo((target) => {
    const proposal = proposePolicy(target, Buffer.from('{"schema_version":1,"controls":{},"enforcement":{},"allow":[]}\n'), { explicit_request: true });
    const native = { schema_version: 1, kind: 'policy-approval', proposal_digest: proposal.digest, approval: { method: 'host-native', attestation: { challenge: 'x' } } };
    assert.throws(() => activatePolicy(target, proposal, { approval: native, verifyHostAttestation: () => true }), /unavailable/);
    assert.equal(fs.existsSync(path.join(target, '.rig/policy/active.json')), false, 'nothing was activated');
    assert.equal(fs.existsSync(path.join(target, '.rig/policy/activation-receipt.json')), false, 'no receipt the loader cannot verify was minted');
  });
});

test('finding 8 (AT-LF-22): network isolation is claimed only after the wrapper denies a connection', () => {
  assert.equal(deniesConnection(['env', '--']), false, 'a wrapper that changes nothing is not isolation');
  assert.equal(deniesConnection([process.execPath, '-e', '']), false, 'an empty child exiting 0 is not isolation');
  const prefix = networkIsolationPrefix();
  if (prefix) assert.equal(deniesConnection(prefix), true);
  const { runReadOnly } = require('../rig/lib/lint-format');
  h.withRepo((target) => {
    const observed = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-denied-'));
    try {
      const probe = "const s=require('net').connect({host:'127.0.0.1',port:1});s.on('connect',()=>{require('fs').writeFileSync(process.argv[1],'connected');process.exit(0)});s.on('error',e=>{require('fs').writeFileSync(process.argv[1],e.code);process.exit(0)});";
      const outcome = runReadOnly(target, [{ argv: [process.execPath, '-e', probe, path.join(observed, 'result')], timeout_ms: 5000 }]);
      if (prefix) {
        assert.equal(outcome.status, 'clean');
        assert.match(fs.readFileSync(path.join(observed, 'result'), 'utf8'), /^(?:EPERM|EACCES|ENETUNREACH|ENETDOWN|EADDRNOTAVAIL)$/, 'the child saw a denied connection');
      } else {
        assert.equal(outcome.status, 'network_isolation_unavailable', 'no proven isolation is reported by name, not assumed');
        assert.equal(fs.existsSync(path.join(observed, 'result')), false, 'the ungranted command never ran');
      }
    } finally {
      fs.rmSync(observed, { recursive: true, force: true });
    }
  });
});

test('finding 6: every test file the technical design names exists, so a slice command cannot print green over nothing', () => {
  const design = fs.readFileSync(path.join(root, 'wiki/gate2/technical-spec.md'), 'utf8');
  const named = [...new Set(design.match(/tests\/[\w./-]+\.test\.js/g) || [])];
  assert.ok(named.length > 20, 'the design names its verification files');
  assert.deepEqual(named.filter((rel) => !fs.existsSync(path.join(root, rel))), []);
});
