'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const h = require('./helpers/advanced');
const { sign } = require('./helpers/task-approval');
const { createActionApprovalProposal, actionApprovalMessage, dispatchAction } = require('../rig/lib/enforcement');

test('shipping action grant command requires a real signature and issues a consumable one-use grant', () => h.withRepo(target => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-action-cli-'));
  try {
    sign(target, { plan_digest: 'a'.repeat(64) });
    const action = { surface: 'shell', category: 'outbound_network', argv: ['fixture-action'] };
    const actionFile = path.join(temp, 'action.json'); fs.writeFileSync(actionFile, JSON.stringify(action));
    const cli = path.resolve(__dirname, '../rig/bin/grant-approval');
    const unsigned = spawnSync(process.execPath, [cli, target, actionFile], { encoding: 'utf8' });
    assert.notEqual(unsigned.status, 0);
    assert.match(unsigned.stderr, /proposal|approval|signed/);
    const proposal = createActionApprovalProposal(target, action);
    const approval = sign(target, { plan_digest: 'a'.repeat(64) }, 'rig-action-approval', actionApprovalMessage(proposal)).approval;
    const proposalFile = path.join(temp, 'proposal.json'); fs.writeFileSync(proposalFile, JSON.stringify(proposal));
    const approvalFile = path.join(temp, 'approval.json'); fs.writeFileSync(approvalFile, JSON.stringify(approval));
    const issued = spawnSync(process.execPath, [cli, target, actionFile, proposalFile, approvalFile], { encoding: 'utf8' });
    assert.equal(issued.status, 0, issued.stderr);
    const grant = JSON.parse(issued.stdout);
    let launches = 0;
    assert.equal(dispatchAction(target, action, { approval: grant, execute() { launches++; } }).decision, 'allow_once');
    assert.throws(() => dispatchAction(target, action, { approval: grant, execute() { launches++; } }), /used|replay|consumed/);
    assert.equal(launches, 1);
    const next = createActionApprovalProposal(target, action);
    fs.writeFileSync(proposalFile, JSON.stringify(next));
    fs.writeFileSync(approvalFile, JSON.stringify(sign(target, { plan_digest: 'a'.repeat(64) }, 'rig-action-approval', actionApprovalMessage(next)).approval));
    const outFile = path.join(temp, 'grant.json');
    const materialize = path.resolve(__dirname, '../rig/materialize.js');
    const create = spawnSync(process.execPath, [materialize, 'policy', 'grant-approval', '--target', target, '--action', actionFile, '--proposal', proposalFile, '--approval', approvalFile, '--out', outFile], { encoding: 'utf8' });
    assert.equal(create.status, 0, create.stderr);
    const evaluate = () => spawnSync(process.execPath, [materialize, 'policy', 'evaluate', '--target', target, '--action', actionFile, '--approval', outFile], { encoding: 'utf8' });
    const first = evaluate();
    assert.equal(first.status, 0, first.stderr + first.stdout);
    assert.equal(JSON.parse(first.stdout).decision, 'allow_once');
    assert.equal(evaluate().status, 1);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}));
