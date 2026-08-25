#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const bootstrap = path.join(root, 'rig', 'bootstrap.sh');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-runtime-onboarding-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
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
  run(['check', '--target', target, '--service', 'development.code-quality.lint-format']);
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
