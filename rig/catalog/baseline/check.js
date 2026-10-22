#!/usr/bin/env node
// Target-repo CI/git floor — contract + skeleton (impl-design §7.5, §8).
// Materialized to `.rig/bin/check.js`. Phase 2 lands the argv contract and
// dependency-ordered dispatch shape; Phase 3 / Slice 7 fills baseline + binding
// execution. Invoked as: `node .rig/bin/check.js --scope <diff|repo> [--service <id>]`
'use strict';

const fs = require('node:fs');
const path = require('node:path');
// runArgv/runBinding are the canonical implementation, shared with the
// interactive `rig check` command (rig/lib/checks.js) — see GA-38. This file
// must not carry its own copy of that logic: a hand-duplicated copy is
// exactly the defect RIG-144 found (a containment fix landed in one copy and
// silently missed the other). `apply.js` materializes `check-runner.js`
// alongside this file's other `../lib/*` requires so the installed
// `.rig/bin/check.js` resolves the same module.
const { runArgv, runBinding, renderDiagnostic } = require('../lib/check-runner');
const { projectCiResult } = require('../lib/reports');
const { redact } = require('../lib/redaction');
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
    if (failedEarlier) { fail('not_run_due_to_dependency', `${serviceId}: not_run_due_to_dependency:${failedEarlier}\n`); continue; }
    const binding = bindings[serviceId];
    if (!binding) {
      fail('coverage_gap', `${serviceId}: coverage gap: binding is missing\n`);
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
      fail(result.checkId || result.kind || 'check_failed', result.reason || result.stderr || result.stdout || `${serviceId} failed`);
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

module.exports = { parseArgs, runArgv, runBinding };
