// Advanced subcommand orchestration (impl-design §5.1). Keep materialize.js thin.
'use strict';

const fs = require('node:fs');
const { inspectTarget, hostReview } = require('./inspect');
const { recommend } = require('./profile');
const { createPlan } = require('./plan');
const { applyPlan, remediate } = require('./apply');
const { runChecks } = require('./checks');
const { loadCatalog, validateReview, selectFromMenu } = require('./catalog');
const { activatePolicy, policyStatus, proposePolicy, proposeRecovery, recoverPolicy, grantApproval } = require('./policy');
const { uninstall } = require('./uninstall');
const { runPreCommit } = require('./git-dispatch');
const { verifyManualMcp } = require('./credentials');
const { handleOnboarding } = require('./onboarding');

const ADVANCED = new Set(['inspect', 'recommend', 'host-review', 'select', 'plan', 'apply', 'remediate', 'check', 'policy', 'uninstall', 'validate-commit', 'onboarding']);

function parseFlag(argv, name) {
  const idx = argv.indexOf(name);
  if (idx === -1) return null;
  return argv[idx + 1] || null;
}

function parseFlags(argv, name) {
  const values = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name) values.push(argv[++i] || '');
  }
  return values;
}

function parseHostsOption(hosts) {
  if (!hosts || hosts === 'auto') return undefined;
  const ids = hosts.split(',').map((h) => h.trim()).filter((h) => h && h !== 'auto');
  return ids.length ? ids : undefined;
}

function writeOut(outPath, value) {
  fs.mkdirSync(require('node:path').dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function runAdvanced(subcommand, argv) {
  if (subcommand === 'select') {
    const menuPath = parseFlag(argv, '--menu');
    const out = parseFlag(argv, '--out');
    if (!menuPath || !fs.existsSync(menuPath)) throw new Error('rig: --menu <menu.json> is required');
    if (!out) throw new Error('rig: --out is required for select');
    const target = parseFlag(argv, '--target');
    if (target && !fs.existsSync(target)) {
      throw new Error('rig: --target <dir> is required and must exist');
    }
    writeOut(out, selectFromMenu(readJson(menuPath), parseFlags(argv, '--service')));
    return;
  }

  const hostCheck = subcommand === 'check' && parseFlag(argv, '--host');
  const target = parseFlag(argv, '--target') || (hostCheck ? process.cwd() : null);
  if (!target || !fs.existsSync(target)) {
    throw new Error('rig: --target <dir> is required and must exist');
  }

  if (subcommand === 'uninstall') {
    const result = uninstall(target, {
      purge: argv.includes('--purge'),
      beforePurge: (paths) => process.stdout.write(`${JSON.stringify({ purge: paths })}\n`),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (result.status === 'best_effort') process.exitCode = 1;
    return;
  }

  if (subcommand === 'policy') {
    const action = argv[0];
    if (action === 'status') {
      process.stdout.write(`${JSON.stringify(policyStatus(target), null, 2)}\n`);
      return;
    }
    if (action === 'propose') {
      const policyPath = parseFlag(argv, '--policy');
      const out = parseFlag(argv, '--out');
      if (!policyPath || !fs.existsSync(policyPath) || !out) {
        throw new Error('rig: policy propose requires --policy and --out');
      }
      writeOut(out, proposePolicy(target, fs.readFileSync(policyPath), {
        explicit_request: true,
        session: process.env.RIG_AUTHOR_CONTEXT || null,
      }));
      return;
    }
    if (action === 'activate') {
      const proposalPath = parseFlag(argv, '--proposal');
      const approvalPath = parseFlag(argv, '--approval');
      if (!proposalPath || !approvalPath || !fs.existsSync(proposalPath) || !fs.existsSync(approvalPath)) {
        throw new Error('rig: policy activate requires --proposal and --approval');
      }
      const result = activatePolicy(target, readJson(proposalPath), { approval: readJson(approvalPath) });
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    if (action === 'recovery-challenge') {
      const replacementPath = parseFlag(argv, '--replacement');
      const identity = parseFlag(argv, '--identity');
      const out = parseFlag(argv, '--out');
      if (!replacementPath || !identity || !out || !fs.existsSync(replacementPath)) {
        throw new Error('rig: policy recovery-challenge requires --replacement --identity --out');
      }
      writeOut(out, proposeRecovery(target, readJson(replacementPath), identity));
      return;
    }
    if (action === 'recover') {
      const challengePath = parseFlag(argv, '--challenge');
      const approvalPath = parseFlag(argv, '--approval');
      if (!challengePath || !approvalPath || !fs.existsSync(challengePath) || !fs.existsSync(approvalPath)) {
        throw new Error('rig: policy recover requires --challenge and --approval');
      }
      process.stdout.write(`${JSON.stringify(recoverPolicy(target, readJson(challengePath), readJson(approvalPath)), null, 2)}\n`);
      return;
    }
    if (action === 'grant-approval') {
      const actionPath = parseFlag(argv, '--action');
      const out = parseFlag(argv, '--out');
      if (!actionPath || !fs.existsSync(actionPath) || !out) {
        throw new Error('rig: policy grant-approval requires --action <action.json> and --out');
      }
      writeOut(out, grantApproval(target, readJson(actionPath)));
      return;
    }
    throw new Error('rig: policy requires status, propose, activate, recovery-challenge, recover, or grant-approval');
  }

  if (subcommand === 'inspect') {
    const host = parseFlag(argv, '--host');
    const hosts = parseFlag(argv, '--hosts');
    const out = parseFlag(argv, '--out');
    if (!out) throw new Error('rig: --out is required for inspect');
    writeOut(out, inspectTarget(target, {
      host,
      hosts: parseHostsOption(hosts),
    }));
    return;
  }

  if (subcommand === 'host-review') {
    const inspectionPath = parseFlag(argv, '--inspection');
    const out = parseFlag(argv, '--out');
    if (!inspectionPath || !fs.existsSync(inspectionPath)) {
      throw new Error('rig: --inspection <inspection.json> is required');
    }
    if (!out) throw new Error('rig: --out is required for host-review');
    writeOut(out, hostReview(readJson(inspectionPath)));
    return;
  }

  if (subcommand === 'recommend') {
    const reviewPath = parseFlag(argv, '--review');
    const out = parseFlag(argv, '--out');
    if (!reviewPath || !fs.existsSync(reviewPath)) throw new Error('rig: --review <review.json> is required');
    if (!out) throw new Error('rig: --out is required for recommend');
    writeOut(out, recommend(target, validateReview(readJson(reviewPath)), loadCatalog()));
    return;
  }

  if (subcommand === 'plan') {
    const manifestPath = parseFlag(argv, '--manifest');
    const reviewPath = parseFlag(argv, '--review');
    const out = parseFlag(argv, '--out');
    if (!manifestPath || !fs.existsSync(manifestPath)) throw new Error('rig: --manifest is required for plan');
    if (!reviewPath || !fs.existsSync(reviewPath)) throw new Error('rig: --review is required for plan');
    if (!out) throw new Error('rig: --out is required for plan');
    writeOut(out, createPlan(target, readJson(manifestPath), readJson(reviewPath)));
    return;
  }

  if (subcommand === 'apply') {
    const manifestPath = parseFlag(argv, '--manifest');
    const reviewPath = parseFlag(argv, '--review');
    const planPath = parseFlag(argv, '--plan');
    const approvalPath = parseFlag(argv, '--approval');
    if (!manifestPath || !reviewPath || !planPath || !approvalPath) {
      throw new Error('rig: apply requires --manifest --review --plan --approval');
    }
    const result = applyPlan(target, readJson(manifestPath), readJson(reviewPath), readJson(planPath), {
      approval: readJson(approvalPath),
    });
    if (result.historyScanNote) console.log(result.historyScanNote);
    if (!result.ok) process.exit(1);
    return;
  }

  if (subcommand === 'remediate') {
    const proposalPath = parseFlag(argv, '--proposal');
    const approve = parseFlag(argv, '--approve');
    if (!proposalPath || !fs.existsSync(proposalPath)) throw new Error('rig: --proposal is required');
    remediate(target, readJson(proposalPath), approve);
    return;
  }

  if (subcommand === 'check') {
    const host = parseFlag(argv, '--host');
    if (host) {
      const result = verifyManualMcp(target, host);
      const output = `${JSON.stringify(result, null, 2)}\n`;
      if (result.status !== 0) {
        process.stderr.write(output);
        process.exit(result.status || 1);
      }
      process.stdout.write(output);
      return;
    }
    const scope = parseFlag(argv, '--scope') || 'repo';
    const service = parseFlag(argv, '--service');
    const result = runChecks(target, { scope, service });
    if (result.status !== 0) {
      if (result.stderr) process.stderr.write(result.stderr);
      if (result.stdout) process.stdout.write(result.stdout);
      process.exit(result.status || 1);
    }
    process.stdout.write('check passed\n');
  }

  // Thin JSON adapter over the shared onboarding domain handler: read the
  // request, hand it to handleOnboarding, print the response. No decision logic.
  if (subcommand === 'onboarding') {
    const inputPath = parseFlag(argv, '--input');
    if (!inputPath || !fs.existsSync(inputPath)) throw new Error('rig: --input <request.json> is required');
    const response = handleOnboarding(readJson(inputPath));
    process.stdout.write(`${JSON.stringify(response)}\n`);
    if (response.phase === 'failed') process.exit(1);
    return;
  }

  if (subcommand === 'validate-commit') {
    const policyPath = parseFlag(argv, '--policy');
    const policy = policyPath && fs.existsSync(policyPath) ? readJson(policyPath) : null;
    const result = runPreCommit(target, policy);
    if (!result.allowed) {
      process.stderr.write(`${JSON.stringify(result, null, 2)}\n`);
      process.exit(1);
    }
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

module.exports = { ADVANCED, runAdvanced };
