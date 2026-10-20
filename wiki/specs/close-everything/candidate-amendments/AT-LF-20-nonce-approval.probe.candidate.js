'use strict';

// Independent owner-review probe for the nonce-bound approval contract.
// Run only after the owner accepts the amendment and the frozen oracle is
// re-signed. This file intentionally lives outside tests/ and CI discovery.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createPlanApprovalChallenge, executePlan, planExecution } = require('../../../../rig/lib/lint-format');

const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-lf20-nonce-probe-'));
const key = path.join(target, 'fixture-key');
const identity = 'rig-owner-review-probe';

function run(args, input) {
  const result = spawnSync(args[0], args.slice(1), { cwd: target, input, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

function approve(plan) {
  const challenge = createPlanApprovalChallenge(plan);
  const message = path.join(target, `challenge-${crypto.randomUUID()}`);
  fs.writeFileSync(message, challenge.message);
  run(['ssh-keygen', '-q', '-Y', 'sign', '-f', key, '-n', 'rig-plan-approval', message]);
  return {
    schema_version: 1,
    kind: 'plan-approval',
    plan_digest: plan.plan_digest,
    approval_id: challenge.approval_id,
    approval: {
      method: 'external-sshsig',
      identity,
      signature: fs.readFileSync(`${message}.sig`, 'utf8'),
    },
  };
}

try {
  run(['ssh-keygen', '-q', '-t', 'ed25519', '-N', '', '-f', key]);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
  fs.writeFileSync(path.join(target, '.rig/allowed-signers'), `${identity} namespaces="rig-plan-approval" ${publicKey}\n`);

  const plan = planExecution({ target, commands: [] });
  assert.throws(() => executePlan(plan, { plan_digest: plan.plan_digest }), /approval/i);
  const first = approve(plan);
  assert.equal(executePlan(plan, first).status, 'executed');
  assert.equal(executePlan(plan, { ...first, approval: { ...first.approval } }).status, 'not_authorized');

  const fresh = approve(plan);
  assert.notEqual(fresh.approval_id, first.approval_id);
  assert.equal(executePlan(plan, fresh).status, 'executed');

  const tampered = { ...approve(plan) };
  tampered.approval_id = '0'.repeat(64);
  assert.throws(() => executePlan(plan, tampered), /verification/i);
  process.stdout.write('AT-LF-20 nonce approval probe passed\n');
} finally {
  fs.rmSync(target, { recursive: true, force: true });
}
