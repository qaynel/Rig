// Advanced subcommand orchestration (impl-design §5.1). Keep materialize.js thin.
'use strict';

const fs = require('node:fs');
const { inspectTarget, hostReview } = require('./inspect');
const { recommend } = require('./profile');
const { createPlan } = require('./plan');
const { applyPlan, remediate } = require('./apply');
const { runChecks } = require('./checks');
const { loadCatalog, validateReview } = require('./catalog');
const { activatePolicy, policyStatus, proposePolicy, proposeRecovery, recoverPolicy } = require('./policy');
const { uninstall } = require('./lifecycle');
const { verifyManualMcp } = require('./credentials');

const ADVANCED = new Set(['inspect', 'recommend', 'plan', 'apply', 'remediate', 'check', 'policy', 'uninstall', 'host-review', 'select']);
const GRADES = new Set(['minimal', 'mid', 'maximal']);

function parseFlag(argv, name) {
  const idx = argv.indexOf(name);
  if (idx === -1) return null;
  return argv[idx + 1] || null;
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
    if (!menuPath || !fs.existsSync(menuPath) || !out) {
      throw new Error('rig: select requires --menu and --out');
    }
    const menu = readJson(menuPath);
    const allowed = new Set((menu.services || menu.menu || []).map((row) => row.service_id));
    const services = {};
    for (let i = 0; i < argv.length; i += 1) {
      if (argv[i] !== '--service') continue;
      const spec = argv[i + 1] || '';
      const cut = spec.lastIndexOf('=');
      if (cut < 1) throw new Error('rig: --service <id>=<grade> is required');
      const id = spec.slice(0, cut);
      const grade = spec.slice(cut + 1);
      if (!allowed.has(id)) throw new Error(`select: unknown service "${id}"`);
      if (!GRADES.has(grade)) throw new Error(`select: invalid grade "${grade}"`);
      services[id] = grade;
    }
    writeOut(out, { schema_version: 1, services });
    return;
  }

  const target = parseFlag(argv, '--target');
  if (!target || !fs.existsSync(target)) {
    throw new Error('rig: --target <dir> is required and must exist');
  }

  if (subcommand === 'uninstall') {
    const result = uninstall(target, {
      purge: argv.includes('--purge'),
      beforePurge: (paths) => process.stdout.write(`${JSON.stringify({ purge: paths })}\n`),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
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
    throw new Error('rig: policy requires status, propose, activate, recovery-challenge, or recover');
  }

  if (subcommand === 'inspect') {
    const host = parseFlag(argv, '--host');
    const hostsFlag = parseFlag(argv, '--hosts');
    const out = parseFlag(argv, '--out');
    if (!out) throw new Error('rig: --out is required for inspect');
    const hosts = !hostsFlag || hostsFlag === 'auto' ? undefined : hostsFlag.split(',').filter(Boolean);
    writeOut(out, inspectTarget(target, {
      host: host && host !== 'auto' ? host : undefined,
      hosts,
    }));
    return;
  }

  if (subcommand === 'host-review') {
    const inspectionPath = parseFlag(argv, '--inspection');
    const out = parseFlag(argv, '--out');
    if (!inspectionPath || !fs.existsSync(inspectionPath)) throw new Error('rig: --inspection is required for host-review');
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
    const scope = parseFlag(argv, '--scope') || 'repo';
    const service = parseFlag(argv, '--service');
    const host = parseFlag(argv, '--host');
    if (host) {
      const verified = verifyManualMcp(target, host, process.env.HOME);
      if (verified.status !== 0) {
        process.stderr.write(`${verified.reason || 'manual MCP check failed'}\n`);
        process.exit(verified.status || 1);
      }
      process.stdout.write(`Rig check passed: ${host} manual MCP verified\n`);
      return;
    }
    const result = runChecks(target, { scope, service });
    if (result.stdout) process.stdout.write(result.stdout.endsWith('\n') ? result.stdout : `${result.stdout}\n`);
    if (result.status !== 0) {
      if (result.stderr) process.stderr.write(result.stderr);
      process.exit(result.status || 1);
    }
  }
}

module.exports = { ADVANCED, runAdvanced };
