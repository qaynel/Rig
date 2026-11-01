#!/usr/bin/env node
// Target-repo CI/git floor — contract + skeleton (impl-design §7.5, §8).
// Materialized to `.rig/bin/check.js`. Phase 2 lands the argv contract and
// dependency-ordered dispatch shape; Phase 3 / Slice 7 fills baseline + binding
// execution. Invoked as: `node .rig/bin/check.js --scope <diff|repo> [--service <id>]`
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { containedPath } = (() => {
  try { return require('../lib/path-safety'); } catch { return require('../../lib/path-safety'); }
})();
const installedLib = (name) => {
  try { return require(`../lib/${name}`); } catch { return require(`../../lib/${name}`); }
};
// runArgv/runBinding are the canonical implementation, shared with the
// interactive `rig check` command (rig/lib/checks.js) — see GA-38. This file
// must not carry its own copy of that logic: a hand-duplicated copy is
// exactly the defect RIG-144 found (a containment fix landed in one copy and
// silently missed the other). `apply.js` materializes `check-runner.js`
// alongside this file's other `../lib/*` requires so the installed
// `.rig/bin/check.js` resolves the same module.
const { runArgv, runBinding, renderDiagnostic } = (() => {
  try { return require('../lib/check-runner'); } catch { return require('../../lib/check-runner'); }
})();
const { projectCiResult } = installedLib('reports');
const { redact } = installedLib('redaction');
const inCi = () => process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

function parseArgs(argv) {
  const args = { scope: process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' ? 'repo' : 'diff', service: null, surface: process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' ? 'ci.repo' : 'local' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--scope') args.scope = argv[++i];
    else if (argv[i] === '--service') args.service = argv[++i];
    else if (argv[i] === '--surface') args.surface = argv[++i];
    else throw new Error(`rig check: unknown argument "${argv[i]}"`);
  }
  if (!['diff', 'repo'].includes(args.scope)) {
    throw new Error('rig check: --scope must be diff or repo');
  }
  if (!['local', 'git.pre_commit', 'ci.repo'].includes(args.surface)) throw new Error('rig check: invalid surface');
  return args;
}

function loadJson(rel) {
  const file = path.join(__dirname, '..', '..', rel);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeLocalFailureReport(target, serviceId, scope, status, reason, result = {}) {
  const { ALLOWED, writeReport } = installedLib('reports');
  writeReport(target, {
    service_id: serviceId,
    scope,
    status: ALLOWED.has(status) ? status : 'failed',
    summary: `${serviceId} failed`,
    reason,
    evidence: result.changed_paths || result.changes ? [{
      ...(result.changed_paths ? { changed_paths: result.changed_paths } : {}),
      ...(result.changes ? { changes: result.changes } : {}),
    }] : [],
    fix_context: result.checkId ? [`check ${result.checkId}`] : ['coverage_gap'],
  });
}

function checkLockedFiles(repoRoot) {
  const manifestFile = containedPath(repoRoot, '.rig/oracle/manifest.json');
  if (!fs.existsSync(manifestFile)) return [];
  const committedManifest = spawnSync('git', ['-C', repoRoot, 'show', 'HEAD:.rig/oracle/manifest.json'], { encoding: 'buffer' });
  const stagedManifest = spawnSync('git', ['-C', repoRoot, 'show', ':.rig/oracle/manifest.json'], { encoding: 'buffer' });
  const approvedBytes = committedManifest.status === 0 ? committedManifest.stdout
    : stagedManifest.status === 0 ? stagedManifest.stdout : fs.readFileSync(manifestFile);
  const errors = [];
  if (!fs.readFileSync(manifestFile).equals(approvedBytes)) errors.push('.rig/oracle/manifest.json: locked-test manifest changed after approval');
  if (stagedManifest.status === 0 && !stagedManifest.stdout.equals(approvedBytes)) errors.push('.rig/oracle/manifest.json: staged locked-test manifest changed after approval');
  let manifest;
  try { manifest = JSON.parse(approvedBytes.toString('utf8')); }
  catch { return [...errors, '.rig/oracle/manifest.json: locked-test manifest is invalid JSON']; }
  if (!manifest.files || typeof manifest.files !== 'object' || Array.isArray(manifest.files)) return [...errors, '.rig/oracle/manifest.json: locked-test manifest has no files map'];
  for (const [rel, expected] of Object.entries(manifest.files)) {
    try {
      const bytes = fs.readFileSync(containedPath(repoRoot, rel));
      const actual = crypto.createHash('sha256').update(bytes).digest('hex');
      if (actual !== expected) errors.push(`${rel}: locked test changed`);
      const staged = spawnSync('git', ['-C', repoRoot, 'show', `:${rel}`], { encoding: 'buffer' });
      if (staged.status === 0 && crypto.createHash('sha256').update(staged.stdout).digest('hex') !== expected) errors.push(`${rel}: staged locked test changed`);
    } catch { errors.push(`${rel}: locked test is missing or unreadable`); }
  }
  return errors;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');

  const surface = args.surface === 'local' ? 'git.pre_commit' : args.surface;
  if (surface === 'ci.repo') process.env.CI = 'true';
  const failures = [];
  const fail = (rule, message) => {
    failures.push({ rule });
    if (!inCi()) process.stderr.write(redact(message.endsWith('\n') ? message : message + '\n'));
  };
  const publish = (status) => {
    if (inCi()) process.stdout.write(JSON.stringify(projectCiResult({ status, findings: failures })) + '\n');
    if (status !== 0) process.exitCode = 1;
  };
  const locked = checkLockedFiles(repoRoot);
  for (const message of locked) fail('locked_test_changed', message);
  if (locked.length) return publish(1);
  const baseline = require('../lib/policy-baseline').runBaseline(repoRoot, { surface, scope: surface === 'ci.repo' ? 'repo' : args.scope });
  if (!inCi()) for (const diagnostic of baseline.diagnostics || []) process.stderr.write(redact(diagnostic) + '\n');
  for (const entry of baseline.results) {
    if (entry.status === 'failed') for (const finding of entry.findings) fail(`baseline.${entry.control}.${finding.kind}`, `baseline.${entry.control}: failed (${finding.reason || finding.kind}); detail stays local\n`);
  }
  if (baseline.status !== 0) return publish(1);
  // Disabled enforcement surfaces do not run selected repository commands.
  if (!baseline.surface_enabled) return publish(0);

  // Selected executable bindings in dependency order (filled by apply).
  const bindings = loadJson('.rig/service-bindings.json') || {};
  const order = (loadJson('.rig/catalog-receipt.json') || {}).order || Object.keys(bindings);
  const selected = args.service ? [args.service] : order;

  let failedEarlier = null;
  for (const serviceId of selected) {
    if (failedEarlier) {
      const reason = `${serviceId}: not_run_due_to_dependency:${failedEarlier}`;
      writeLocalFailureReport(repoRoot, serviceId, args.scope, 'not_run_due_to_dependency', reason);
      fail('not_run_due_to_dependency', `${reason}\n`);
      continue;
    }
    const binding = bindings[serviceId];
    if (!binding) {
      const reason = `${serviceId}: coverage gap: binding is missing`;
      writeLocalFailureReport(repoRoot, serviceId, args.scope, 'coverage_gap', reason);
      fail('coverage_gap', `${reason}\n`);
      failedEarlier = serviceId;
      continue;
    }
    if (surface === 'ci.repo' && serviceId === 'development.code-quality.lint-format' && binding.grade !== 'maximal') {
      if (!inCi()) process.stderr.write(`${serviceId}: not_run (CI requires Evidence grade)\n`);
      continue;
    }
    const result = runBinding(serviceId, binding, surface === 'ci.repo' ? 'repo' : args.scope, repoRoot);
    for (const diagnostic of result.diagnostics || (result.diagnostic ? [result.diagnostic] : [])) {
      if (!inCi()) process.stderr.write(redact(renderDiagnostic(serviceId, diagnostic)));
    }
    if (result.error || result.status !== 0) {
      const evidence = result.changed_paths || result.changes ? {
        service_id: serviceId,
        ...(result.checkId ? { check_id: result.checkId } : {}),
        ...(result.changed_paths ? { changed_paths: result.changed_paths } : {}),
        ...(result.changes ? { changes: result.changes } : {}),
      } : null;
      const message = [result.reason || result.stderr || result.stdout || `${serviceId} failed`, evidence && `evidence: ${JSON.stringify(evidence)}`].filter(Boolean).join('\n');
      writeLocalFailureReport(repoRoot, serviceId, args.scope, result.kind || 'failed', message, result);
      fail(result.checkId || result.kind || 'check_failed', message);
      failedEarlier = serviceId;
    }
  }
  publish(failedEarlier ? 1 : 0);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (inCi()) process.stdout.write(JSON.stringify(projectCiResult({ status: 1, findings: [{ rule: 'runner_error' }] })) + '\n');
    else console.error(redact(error.message));
    process.exit(1);
  }
}

module.exports = { checkLockedFiles, parseArgs, runArgv, runBinding };
