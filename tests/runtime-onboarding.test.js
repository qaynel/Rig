#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { writePlanApproval } = require('./helpers/advanced');

const root = path.join(__dirname, '..');
const bootstrap = path.join(root, 'rig', 'bootstrap.sh');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-runtime-onboarding-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function installRuntime(target, hosts = []) {
  return spawnSync('sh', [bootstrap, '--tier', '1', '--target', target, '--with-runtime', ...(hosts.length ? ['--hosts', hosts.join(',')] : [])], {
    encoding: 'utf8',
  });
}

function runRig(rig, args, options = {}) {
  return spawnSync(rig, args, { encoding: 'utf8', ...options });
}

test('runtime bootstrap prints a runnable staged sequence', () => withTarget((target) => {
  const result = spawnSync('sh', [bootstrap, '--tier', '1', '--target', target, '--with-runtime'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /inspect[\s\S]*--hosts auto/);
  assert.match(result.stdout, /host-review/);
  assert.match(result.stdout, /recommend/);
  assert.match(result.stdout, /select/);
  assert.match(result.stdout, /plan/);
  assert.match(result.stdout, /apply/);
  assert.match(result.stdout, /check/);
  assert.doesNotMatch(result.stdout, /<host-id>/);
}));

test('the staged sequence produces review selection plan and a green check', () => withTarget((target) => {
  fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify({
    name: 'onboarding-fixture', private: true, scripts: { 'format:check': 'git diff --check' },
  }) + '\n');
  fs.writeFileSync(path.join(target, 'index.js'), 'module.exports = 1;\n');
  const installed = spawnSync('sh', [bootstrap, '--tier', '1', '--target', target, '--with-runtime'], {
    encoding: 'utf8',
  });
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const inspection = path.join(target, 'inspection.json');
  const review = path.join(target, 'review.json');
  const menu = path.join(target, 'menu.json');
  const selection = path.join(target, 'rig.json');
  const plan = path.join(target, 'plan.json');
  const run = (args) => {
    const result = spawnSync(rig, args, { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  };
  run(['inspect', '--target', target, '--hosts', 'auto', '--out', inspection]);
  run(['host-review', '--target', target, '--inspection', inspection, '--out', review]);
  run(['recommend', '--target', target, '--review', review, '--out', menu]);
  run(['select', '--menu', menu, '--service', 'development.code-quality.lint-format=minimal', '--out', selection]);
  run(['plan', '--target', target, '--manifest', selection, '--review', review, '--out', plan]);
  const planned = JSON.parse(fs.readFileSync(plan, 'utf8'));
  const approval = path.join(target, 'approval.json');
  fs.writeFileSync(approval, JSON.stringify({
    schema_version: 1,
    kind: 'plan-approval',
    plan_digest: planned.plan_digest,
    approval: { method: 'external-sshsig', verified: true },
  }) + '\n');
  run(['apply', '--target', target, '--manifest', selection, '--review', review, '--plan', plan, '--approval', approval]);
  const check = runRig(rig, ['check', '--target', target, '--service', 'development.code-quality.lint-format']);
  assert.equal(check.status, 0, check.stderr || check.stdout);
  assert.match(check.stdout, /check.*(?:passed|succeeded|complete)/i);
}));

test('the installed runtime exposes the staged producer commands', () => withTarget((target) => {
  const installed = spawnSync('sh', [bootstrap, '--tier', '1', '--target', target, '--hosts', 'codex', '--with-runtime'], {
    encoding: 'utf8',
  });
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  for (const command of ['host-review', 'select']) {
    const result = spawnSync(rig, [command, '--target', target], { encoding: 'utf8' });
    assert.doesNotMatch(result.stderr + result.stdout, /unknown argument|unknown subcommand/i, command);
  }
}));

test('host review preserves inspection identity and blocks unsafe findings', () => withTarget((target) => {
  const installed = installRuntime(target, ['codex']);
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const inspection = path.join(target, 'inspection.json');
  const review = path.join(target, 'review.json');
  fs.writeFileSync(inspection, JSON.stringify({
    schema_version: 1,
    host: 'codex',
    harness_digest: 'fixture-digest',
    findings: [],
    unverifiable: [],
  }) + '\n');
  let result = runRig(rig, ['host-review', '--target', target, '--inspection', inspection, '--out', review]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const allowed = JSON.parse(fs.readFileSync(review, 'utf8'));
  assert.equal(allowed.harness_digest, 'fixture-digest');
  assert.equal(allowed.verdict, 'ALLOW');

  fs.writeFileSync(inspection, JSON.stringify({
    schema_version: 1,
    host: 'codex',
    harness_digest: 'fixture-digest',
    findings: [{ severity: 'blocker', id: 'unsafe-harness' }],
    unverifiable: [],
  }) + '\n');
  result = runRig(rig, ['host-review', '--target', target, '--inspection', inspection, '--out', review]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const blocked = JSON.parse(fs.readFileSync(review, 'utf8'));
  assert.equal(blocked.verdict, 'BLOCK');
  result = runRig(rig, ['recommend', '--target', target, '--review', review, '--out', path.join(target, 'menu.json')]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr + result.stdout, /BLOCK|refuses/i);
}));

test('selection is explicit and never runs repository code', () => withTarget((target) => {
  const installed = installRuntime(target, ['codex']);
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const menu = path.join(target, 'menu.json');
  const selection = path.join(target, 'rig.json');
  const service = 'development.code-quality.lint-format';
  fs.writeFileSync(menu, JSON.stringify({
    schema_version: 1,
    services: [{ service_id: service, recommendation: 'applicable', recommended_grade: 'minimal' }],
  }) + '\n');
  const result = runRig(rig, ['select', '--menu', menu, '--service', `${service}=minimal`, '--out', selection]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.deepEqual(JSON.parse(fs.readFileSync(selection, 'utf8')).services, { [service]: 'minimal' });
  assert.equal(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')), false);
  const unknown = runRig(rig, ['select', '--menu', menu, '--service', 'unknown.service.leaf=minimal', '--out', selection]);
  assert.notEqual(unknown.status, 0);
  const invalidGrade = runRig(rig, ['select', '--menu', menu, '--service', `${service}=invalid`, '--out', selection]);
  assert.notEqual(invalidGrade.status, 0);
}));

test('staged antigravity onboarding renders the same manual entry it verifies', () => withTarget((target) => {
  const installed = installRuntime(target, ['antigravity']);
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const review = path.join(target, 'review.json');
  const selection = path.join(target, 'rig.json');
  const plan = path.join(target, 'plan.json');
  const server = { command: 'node', args: ['warehouse-mcp.js'] };
  fs.writeFileSync(review, JSON.stringify({
    schema_version: 1,
    host: 'antigravity',
    harness_digest: 'antigravity-fixture',
    verdict: 'ALLOW',
    findings: [],
    restrictions: [],
    unverifiable: [],
    manualEntries: { antigravity: { warehouse: server } },
  }) + '\n');
  fs.writeFileSync(selection, JSON.stringify({
    schema_version: 1,
    services: { 'development.code-quality.lint-format': 'minimal' },
  }) + '\n');
  let result = runRig(rig, ['plan', '--target', target, '--manifest', selection, '--review', review, '--out', plan]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const approval = writePlanApproval(target, plan);
  result = runRig(rig, ['apply', '--target', target, '--manifest', selection, '--review', review, '--plan', plan, '--approval', approval]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const setup = fs.readFileSync(path.join(target, '.rig', 'mcp-setup.md'), 'utf8');
  assert.match(setup, /warehouse/);
  assert.match(setup, /warehouse-mcp\.js/);

  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-antigravity-stage-home-'));
  try {
    const config = path.join(home, '.gemini', 'config', 'mcp_config.json');
    fs.mkdirSync(path.dirname(config), { recursive: true });
    fs.writeFileSync(config, JSON.stringify({ mcpServers: { warehouse: server } }) + '\n');
    result = runRig(rig, ['check', '--target', target, '--host', 'antigravity'], { env: { ...process.env, HOME: home } });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    fs.writeFileSync(config, JSON.stringify({ mcpServers: { rig: server } }) + '\n');
    result = runRig(rig, ['check', '--target', target, '--host', 'antigravity'], { env: { ...process.env, HOME: home } });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /warehouse|does not match/i);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
}));

test('a clean staged check confirms success', () => withTarget((target) => {
  const installed = installRuntime(target, ['codex']);
  assert.equal(installed.status, 0, installed.stderr);
  const rig = path.join(target, '.rig', 'bin', 'rig');
  const result = runRig(rig, ['check', '--target', target]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /check.*(?:passed|succeeded|complete)/i);
}));
