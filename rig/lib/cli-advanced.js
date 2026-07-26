// Advanced subcommand orchestration (impl-design §5.1). Keep materialize.js thin.
'use strict';

const fs = require('node:fs');
const { inspectTarget } = require('./inspect');
const { recommend } = require('./profile');
const { createPlan } = require('./plan');
const { applyPlan, remediate } = require('./apply');
const { runChecks } = require('./checks');
const { loadCatalog, validateReview } = require('./catalog');

const ADVANCED = new Set(['inspect', 'recommend', 'plan', 'apply', 'remediate', 'check']);

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
  const target = parseFlag(argv, '--target');
  if (!target || !fs.existsSync(target)) {
    throw new Error('rig: --target <dir> is required and must exist');
  }

  if (subcommand === 'inspect') {
    const host = parseFlag(argv, '--host');
    const out = parseFlag(argv, '--out');
    if (!host) throw new Error('rig: --host is required for inspect');
    if (!out) throw new Error('rig: --out is required for inspect');
    writeOut(out, inspectTarget(target, { host }));
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
    if (!manifestPath || !reviewPath || !planPath) {
      throw new Error('rig: apply requires --manifest --review --plan');
    }
    const result = applyPlan(target, readJson(manifestPath), readJson(reviewPath), readJson(planPath));
    if (result.historyScanNote) console.log(result.historyScanNote);
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
    const result = runChecks(target, { scope, service });
    if (result.status !== 0) {
      if (result.stderr) process.stderr.write(result.stderr);
      process.exit(result.status || 1);
    }
  }
}

module.exports = { ADVANCED, runAdvanced };
