'use strict';

// Gate 1's signed amendment delegates positive apply fixtures here. Remediation
// regressions use the same local fixture signer for their stronger approval.
const path = require('node:path');
const base = require('./advanced');
const { signApproval } = require('./path-b-approval');
const { readJson, writeJson, runMaterialize } = base;

function writePlanApproval(target, planPath, overrides = {}) {
  const planned = readJson(planPath);
  const approval = signApproval(target, planned.plan_digest, {
    namespace: 'rig-catalog-apply',
    message: `rig-catalog-apply\ntarget=${path.resolve(target)}\nplan=${planned.plan_digest}\n`,
  });
  Object.assign(approval, overrides);
  const output = path.join(target, '.rig-test', 'plan-approval.json');
  writeJson(output, approval);
  return output;
}

function writeRemediationApproval(target, proposalPath) {
  const proposal = readJson(proposalPath);
  const { remediationChallenge } = require('../../rig/lib/apply');
  const challenge = remediationChallenge(target, proposal);
  const signed = signApproval(target, challenge.proposal_digest, {
    namespace: 'rig-remediation',
    message: challenge.message,
  });
  const output = path.join(target, '.rig-test', 'remediation-approval.json');
  writeJson(output, {
    schema_version: 1,
    kind: 'remediation-approval',
    proposal_digest: challenge.proposal_digest,
    preimage_digest: challenge.preimage_digest,
    approval: signed.approval,
  });
  return output;
}

function remediate(target, { proposal, approval }) {
  return runMaterialize(['remediate', '--target', target, '--proposal', proposal, '--approval', approval]);
}

module.exports = { ...base, writePlanApproval, writeRemediationApproval, remediate };
