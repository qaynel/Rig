'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const signers = new Map();
process.once('exit', () => { for (const dir of signers.values()) fs.rmSync(dir, { recursive: true, force: true }); });
const { execFileSync } = require('node:child_process');
const { planExecution, createPlanApprovalChallenge } = require('../../rig/lib/lint-format');
function sign(target, plan, namespace = 'rig-plan-approval', message) {
  const real = fs.realpathSync(target);
  if (!signers.has(real)) signers.set(real, fs.mkdtempSync(path.join(os.tmpdir(), 'rig-fixture-signer-')));
  const key = path.join(signers.get(real), 'task-key');
  if (!fs.existsSync(key)) execFileSync(fs.existsSync('/usr/bin/ssh-keygen') ? '/usr/bin/ssh-keygen' : 'ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]);
  const identity = 'fixture-owner';
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/trust/gate1.allowed-signers'), `${identity} ${publicKey}\n`);
  const challenge = createPlanApprovalChallenge(plan);
  const file = path.join(signers.get(real), 'task-message');
  fs.writeFileSync(file, message || challenge.message);
  fs.rmSync(`${file}.sig`, { force: true });
  execFileSync(fs.existsSync('/usr/bin/ssh-keygen') ? '/usr/bin/ssh-keygen' : 'ssh-keygen', ['-q', '-Y', 'sign', '-f', key, '-n', namespace, file]);
  return { schema_version: 1, kind: 'plan-approval', plan_digest: plan.plan_digest, approval_id: challenge.approval_id, approval: { method: 'external-sshsig', identity, signature: fs.readFileSync(`${file}.sig`, 'utf8') } };
}
function approved(target, commands, repeats = 1) {
  const plan = planExecution({ target, selected: true, commands: Array.from({ length: repeats }, () => commands).flat() });
  return { plan, approval: sign(target, plan) };
}
module.exports = { sign, approved };
