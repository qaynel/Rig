#!/usr/bin/env node
// Separate evaluation lane. Explicit file arguments work with Windows Node 22
// as well as POSIX shells; directory discovery never silently runs one test.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const lane = process.argv[2] || 'ai-sdlc';
if (!['ai-sdlc', 'rebuild'].includes(lane) || process.argv.length > 3) throw new Error('usage: node scripts/run-ai-sdlc.js [ai-sdlc|rebuild]');
const output = path.join(root, '.context', lane);
fs.mkdirSync(output, { recursive: true });
const tests = fs.readdirSync(path.join(root, 'tests', lane))
  .filter((file) => file.endsWith('.test.js')).sort().map((file) => path.join('tests', lane, file));
if (!tests.length) throw new Error(`${lane} lane has no proving-test files`);
let rebuildManifest;
let evidenceSource;
if (lane === 'rebuild') {
  rebuildManifest = JSON.parse(fs.readFileSync(path.join(root, 'wiki/gate1/rebuild/test-manifest.json'), 'utf8'));
  if (!Array.isArray(rebuildManifest) || !rebuildManifest.length) throw new Error('rebuild test manifest is empty or invalid');
  evidenceSource = require('./rebuild/check-contract');
}

// CI supplies a sidecar verified against the independently configured release digest.
const archive = process.env.RIG_PUBLIC_ARCHIVE;
if (archive && process.env.GITHUB_ACTIONS === 'true') {
  const expected = fs.readFileSync(`${archive}.sha256`, 'utf8').split(/\s+/)[0];
  const actual = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  if (!/^[0-9a-f]{64}$/.test(expected) || expected !== actual) throw new Error('downloaded archive SHA256 differs from verified release digest');
}
const rebuildEvidenceBase = lane === 'rebuild' ? {
  contract_manifest_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'wiki/gate1/rebuild/contract.manifest'))).digest('hex'),
  git_head: evidenceSource.currentGitHead(root),
  source_tree_sha256: evidenceSource.sourceTreeDigest(root),
} : null;
const testEnv = { ...process.env };
delete testEnv.NODE_TEST_CONTEXT;
const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], {
  cwd: root, env: testEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
});
const log = `${result.stdout || ''}${result.stderr || ''}${result.error ? `\n${result.error.message}\n` : ''}`;
process.stdout.write(log);
fs.writeFileSync(path.join(output, 'acceptance.tap'), log);
const counts = Object.fromEntries([...log.matchAll(/^# (tests|pass|fail|cancelled|skipped|todo) (\d+)$/gm)]
  .map((match) => [match[1], Number(match[2])]));
const failures = [...log.matchAll(/^\s*not ok \d+ - (.+)$/gm)].map((match) => match[1]);
let evidenceErrors = [];
if (lane === 'rebuild') {
  const expected = new Map(rebuildManifest.map(row => [row.title, row]));
  const observed = new Map();
  for (const match of log.matchAll(/^\s*(ok|not ok) \d+ - (.+?)(?: # (SKIP|TODO)(?: .*)?)?$/gm)) {
    const [, outcome, title, directive] = match;
    const row = expected.get(title);
    if (!row) {
      if (/^RB-[A-Z]+-\d+ /.test(title)) evidenceErrors.push(`unexpected proving test result: ${title}`);
      continue;
    }
    if (observed.has(row.id)) { evidenceErrors.push(`duplicate proving test result: ${row.id}`); continue; }
    observed.set(row.id, directive === 'SKIP' ? 'skipped' : directive === 'TODO' ? 'todo' : outcome === 'ok' ? 'pass' : 'fail');
  }
  const statuses = rebuildManifest.map(row => ({ id: row.id, status: observed.get(row.id) || 'missing' }));
  for (const row of statuses) if (row.status === 'missing' || row.status === 'skipped' || row.status === 'todo') evidenceErrors.push(`proving test ${row.id} did not execute normally (${row.status})`);
  if (!counts.tests) evidenceErrors.push('rebuild lane executed zero tests');
  if (rebuildEvidenceBase.git_head !== evidenceSource.currentGitHead(root)
    || rebuildEvidenceBase.source_tree_sha256 !== evidenceSource.sourceTreeDigest(root)
    || rebuildEvidenceBase.contract_manifest_sha256 !== crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'wiki/gate1/rebuild/contract.manifest'))).digest('hex')) {
    evidenceErrors.push('rebuild sources changed while the lane was running');
  }
  const laneResults = {
    ...rebuildEvidenceBase,
    tests: statuses,
  };
  fs.writeFileSync(path.join(output, 'lane-results.json'), `${JSON.stringify(laneResults, null, 2)}\n`);
}
// rig: this lane has top-level TAP subtests. Unknown diagnostic shapes remain
// regressions; missing evidence never changes the original failing exit code.
const environment_gaps = log.split(/(?=^# Subtest: )/m).flatMap(block => {
  const name = /^not ok \d+ - (.+)$/m.exec(block)?.[1];
  const reason = /^  error: ['"]?environment-bound criterion: (.+)$/m.exec(block)?.[1];
  return name && reason ? [{ test: name, reason: reason.replace(/['"]$/, '') }] : [];
});
const gapNames = new Set(environment_gaps.map(gap => gap.test));
const regressions = failures.filter(name => !gapNames.has(name));
const exitCode = result.status === 0 && !evidenceErrors.length ? 0 : result.status || 1;
const summary = { platform: process.platform, commit: process.env.GITHUB_SHA || null, archive: archive || null,
  exit_code: exitCode, signal: result.signal, counts, failures, regressions, environment_gaps, evidence_errors: evidenceErrors };
fs.writeFileSync(path.join(output, 'result.json'), `${JSON.stringify(summary, null, 2)}\n`);
const report = `### ${lane === 'ai-sdlc' ? 'AI-SDLC' : 'Rebuild'} acceptance: ${process.platform}\n\nExit: ${exitCode}; counts: ${JSON.stringify(counts)}\n\n`
  + (regressions.length ? regressions.map((name) => `- Regression: ${name}`).join('\n') : (evidenceErrors.length ? evidenceErrors.map(error => `- Evidence gap: ${error}`).join('\n') : 'No regressions reported.'))
  + (environment_gaps.length ? '\n' + environment_gaps.map(gap => `- Missing environment evidence: ${gap.test}: ${gap.reason}`).join('\n') : '')
  + (lane === 'rebuild'
    ? '\n\nThis separate draft evaluation lane is expected to fail before implementation. It does not grant owner approval or alter the repository gate.\n'
    : '\n\nThe complete lane runs unchanged. Hosted PT-017 uses a throwaway key only to test sign/verify mechanics; it does not represent owner approval. Real owner-key and public-archive evidence still require their respective owner and release environments. This advisory workflow is separate from the repository gate.\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
process.exitCode = exitCode;
