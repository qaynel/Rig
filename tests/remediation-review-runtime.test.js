'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-runtime-'));
  try { fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

test('semantic review reads the supplied staged index and requires every relevant harness', () => fixture(target => {
  const { semanticDrift } = require('../rig/lib/checks');
  fs.writeFileSync(path.join(target, 'AGENTS.md'), 'Use reviewed project instructions.\n');
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/context-index.json'), JSON.stringify({
    documents: [{ path: 'AGENTS.md' }],
    review: { schema_version: 1, reviewer: { kind: 'host-agent', identity: 'reviewer' }, status: 'pass',
      inputs: [{ path: 'AGENTS.md', digest: '0'.repeat(64) }], relationships: [] },
  }));

  const stagedIndex = Buffer.from(JSON.stringify({ documents: [] }));
  const findings = semanticDrift(target, { readFile: rel => rel === '.rig/context-index.json' ? stagedIndex : fs.readFileSync(path.join(target, rel)), requiredPaths: ['AGENTS.md'] });
  assert.ok(findings.some(finding => finding.status === 'coverage_gap'), JSON.stringify(findings));
}));

test('semantic review still permits repositories with no context harnesses', () => fixture(target => {
  const { semanticDrift } = require('../rig/lib/checks');
  assert.deepEqual(semanticDrift(target, { requiredPaths: [] }), []);
}));

test('diff baseline digest binds ignored context metadata and staged deletion cannot fall back', () => fixture(target => {
  const git = (...args) => spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: target, encoding: 'utf8' });
  const { baselineSnapshot } = require('../rig/lib/policy-baseline');
  git('init', '-q');
  fs.writeFileSync(path.join(target, 'AGENTS.md'), 'Reviewed fixture instructions.\n');
  git('add', 'AGENTS.md');
  const firstCommit = git('commit', '-q', '-m', 'fixture');
  assert.equal(firstCommit.status, 0, firstCommit.stderr);

  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  const metadataPath = path.join(target, '.rig/context-index.json');
  fs.writeFileSync(metadataPath, '{"review":"first"}\n');
  const fallbackDigest = baselineSnapshot(target, 'diff').inputDigest;
  fs.writeFileSync(metadataPath, '{"review":"second"}\n');
  const updatedFallbackDigest = baselineSnapshot(target, 'diff').inputDigest;
  assert.notEqual(updatedFallbackDigest, fallbackDigest);

  git('add', '-f', '.rig/context-index.json');
  assert.equal(git('commit', '-q', '-m', 'track context index').status, 0);
  git('rm', '--cached', '-q', '--', '.rig/context-index.json');
  const trackedBytesDigest = baselineSnapshot(target, 'diff').inputDigest;
  assert.notEqual(trackedBytesDigest, updatedFallbackDigest);
}));

test('GITHUB_ACTIONS alone selects the CI baseline and repo scope', () => fixture(target => {
  const checks = require('../rig/lib/checks');
  const baseline = require('../rig/lib/policy-baseline');
  const originalRunBaseline = baseline.runBaseline;
  const originalCi = process.env.CI;
  const originalGithubActions = process.env.GITHUB_ACTIONS;
  let observed;
  try {
    delete process.env.CI;
    process.env.GITHUB_ACTIONS = 'true';
    baseline.runBaseline = (_target, options) => {
      observed = options;
      return { status: 1, results: [{ status: 'failed', control: 'probe', findings: [] }], surface_enabled: false };
    };
    checks.runChecks(target);
  } finally {
    baseline.runBaseline = originalRunBaseline;
    if (originalCi === undefined) delete process.env.CI; else process.env.CI = originalCi;
    if (originalGithubActions === undefined) delete process.env.GITHUB_ACTIONS; else process.env.GITHUB_ACTIONS = originalGithubActions;
  }
  assert.deepEqual(observed, { surface: 'ci.repo', scope: 'repo' });
}));

test('directory ignore patterns exclude descendants from scoped argv', () => {
  const { scopedCommand } = require('../rig/lib/lint-discovery');
  const result = scopedCommand({ argv: ['formatter', '{files}'] },
    { root: '.', include: ['**'], ignores: ['dist/'] },
    ['dist/generated.odd', 'src/dist/generated.odd', 'src/clean.odd'], 'diff');
  assert.deepEqual(result.scoped_files, ['src/clean.odd']);
  assert.deepEqual(result.argv, ['formatter', 'src/clean.odd']);
});
