#!/usr/bin/env node
// Apply: lock, CAS, manifest-and-resume, idempotence (impl-design §6.6/§7.6, Slice 6, AT-INSTALL-1).
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  writePlanApproval,
  writeRemediationApproval,
  readJson,
} = require('./helpers/advanced-signed');
const { signApproval, TRUST_ROOT_REL } = require('./helpers/path-b-approval');
const { applyPlan } = require('../rig/lib/apply');
const { uninstall } = require('../rig/lib/lifecycle');

test('apply is compare-and-swap on preimages and writes receipt last', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')));
  });
});

test('apply requires exact plan approval before writing', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);

    const missing = apply(target, { review: reviewPath, plan: planned.outPath, approval: null });
    assert.notEqual(missing.status, 0, 'missing approval must fail closed');
    assert.equal(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')), false);

    const approvalPath = writePlanApproval(target, planned.outPath, { plan_digest: '0'.repeat(64) });
    const wrong = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(wrong.status, 0, 'wrong approval digest must fail closed');
    assert.equal(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')), false);

    const forgedPath = path.join(target, '.rig-test', 'forged-approval.json');
    fs.mkdirSync(path.dirname(forgedPath), { recursive: true });
    fs.writeFileSync(forgedPath, `${JSON.stringify({
      schema_version: 1,
      kind: 'plan-approval',
      plan_digest: readJson(planned.outPath).plan_digest,
      approval: { method: 'host-native', verified: true },
    })}\n`);
    const forged = apply(target, { review: reviewPath, plan: planned.outPath, approval: forgedPath });
    assert.notEqual(forged.status, 0, 'caller-asserted verification must not grant approval');
    assert.equal(fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')), false);
  });
});

test('apply trust root rejects a different signing key and a valid signature replayed across repositories', () => {
  withRepo((targetA) => {
    createRepoFixture('existing-agents-router', targetA);
    const reviewA = allowedReview(targetA, { harness_digest: 'a'.repeat(64) });
    writeSelection(targetA, { 'development.documentation.adrs': 'minimal' });
    const plannedA = plan(targetA, { review: reviewA.reviewPath });
    assert.equal(plannedA.status, 0, plannedA.stderr);

    const approvalAPath = writePlanApproval(targetA, plannedA.outPath);
    const approvalA = readJson(approvalAPath);
    const planA = readJson(plannedA.outPath);
    const wrongKey = signApproval(targetA, planA.plan_digest, {
      namespace: 'rig-catalog-apply',
      identity: 'wrong-key@rig.test',
      trustIdentity: false,
      message: `rig-catalog-apply\ntarget=${path.resolve(targetA)}\nplan=${planA.plan_digest}\n`,
    });
    const wrongKeyPath = path.join(targetA, '.rig-test', 'wrong-key-approval.json');
    fs.writeFileSync(wrongKeyPath, `${JSON.stringify(wrongKey)}\n`);
    const beforeA = fs.readFileSync(path.join(targetA, 'AGENTS.md'));
    const wrongKeyResult = apply(targetA, {
      review: reviewA.reviewPath,
      plan: plannedA.outPath,
      approval: wrongKeyPath,
    });
    assert.notEqual(wrongKeyResult.status, 0);
    assert.deepEqual(fs.readFileSync(path.join(targetA, 'AGENTS.md')), beforeA);
    assert.equal(fs.existsSync(path.join(targetA, '.rig', 'catalog-receipt.json')), false);

    withRepo((targetB) => {
      createRepoFixture('existing-agents-router', targetB);
      const reviewB = allowedReview(targetB, { harness_digest: 'a'.repeat(64) });
      writeSelection(targetB, { 'development.documentation.adrs': 'minimal' });
      const plannedB = plan(targetB, { review: reviewB.reviewPath });
      assert.equal(plannedB.status, 0, plannedB.stderr);
      const planB = readJson(plannedB.outPath);
      assert.equal(planB.plan_digest, planA.plan_digest, 'the two fixture proposals are otherwise identical');

      fs.mkdirSync(path.dirname(path.join(targetB, TRUST_ROOT_REL)), { recursive: true });
      fs.copyFileSync(path.join(targetA, TRUST_ROOT_REL), path.join(targetB, TRUST_ROOT_REL));
      const beforeB = fs.readFileSync(path.join(targetB, 'AGENTS.md'));
      assert.throws(
        () => applyPlan(targetB, readJson(path.join(targetB, 'rig.json')), readJson(reviewB.reviewPath), planB, { approval: approvalA }),
        /signature|approval/i,
        'a trusted approval signed for repository A cannot authorize repository B',
      );
      assert.deepEqual(fs.readFileSync(path.join(targetB, 'AGENTS.md')), beforeB);
      assert.equal(fs.existsSync(path.join(targetB, '.rig', 'catalog-receipt.json')), false);
    });
  });
});

test('apply rejects a tampered plan snapshot', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);

    const body = readJson(planned.outPath);
    body.catalog_digest = 'corrupt';
    body.harness_digest = 'corrupt';
    body.effective_services.push({
      service_id: 'testing.e2e.browser-automation',
      selected_grade: 'maximal',
      required_slices: [],
    });
    body.plan_digest = '0'.repeat(64);
    fs.writeFileSync(planned.outPath, `${JSON.stringify(body, null, 2)}\n`);

    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(result.status, 0, 'tampered plan must fail closed');
    assert.equal(
      fs.existsSync(path.join(target, '.rig', 'services', 'testing.e2e.browser-automation.md')),
      false,
      'apply must not install services from a tampered plan',
    );
  });
});

test('apply refuses stale preimages (CAS)', () => {
  withRepo((target) => {
    createRepoFixture('existing-agents-router', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.documentation.adrs': 'minimal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    fs.writeFileSync(path.join(target, 'AGENTS.md'), '# changed after plan\n');
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(result.status, 0, 'stale preimage must fail closed');
    assert.equal(
      fs.existsSync(path.join(target, '.rig', 'catalog-receipt.json')),
      false,
      'failed apply must not write a new receipt',
    );
  });
});

test('apply keeps host adapter and git hook writes in place on failure and resumes (AT-INSTALL-1)', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const userHook = path.join(target, '.git', 'hooks', 'pre-commit');
    const originalHook = '#!/bin/sh\necho user hook\n';
    fs.writeFileSync(userHook, originalHook, { mode: 0o755 });

    const { reviewPath } = allowedReview(target, { host: 'codex' });
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);

    const approvalPath = writePlanApproval(target, planned.outPath);
    const receipt = path.join(target, '.rig', 'catalog-receipt.json');
    fs.mkdirSync(receipt, { recursive: true });
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(result.status, 0, 'receipt path collision must fail');

    const chainedBackup = path.join(target, '.git', 'hooks', 'pre-commit.rig-chained');
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'host-contracts', 'codex', 'instruction.json')),
      'writes already applied before the failure point must stay, not roll back',
    );
    assert.match(
      fs.readFileSync(userHook, 'utf8'),
      /Rig secret guard shim/,
      'the git hook write already applied before the failure point must stay, not roll back',
    );
    assert.equal(fs.readFileSync(chainedBackup, 'utf8'), originalHook, 'the original hook must be preserved as a chained backup');
    assert.equal(fs.existsSync(receipt), true, 'the directory collision itself is untouched by apply');

    // Clear the obstruction and resume: already-applied writes must not be
    // redone or re-chained a second time.
    fs.rmSync(receipt, { recursive: true, force: true });
    const resumed = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(resumed.status, 0, resumed.stderr);
    assert.equal(fs.readFileSync(chainedBackup, 'utf8'), originalHook, 'resume must not re-chain the already-chained backup');
  });
});

test('apply writes CI for the provider recorded in the approved plan, not one that appears afterward', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    // No CI marker exists at plan time, so the digested plan records no
    // provider (`plan.ci.provider === null`). A maximal-grade service still
    // makes CI relevant, so this selection alone would trigger a write if
    // apply re-detected a provider on its own instead of trusting the plan.
    writeSelection(target, { 'development.code-creation.feature-implementation': 'maximal' });
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    assert.equal(readJson(planned.outPath).ci.provider, null, 'no CI marker exists yet at plan time');

    // Simulate the target drifting after the plan was signed: a CI config
    // appears that was never seen or approved by the plan's signer.
    fs.mkdirSync(path.join(target, '.circleci'), { recursive: true });
    fs.writeFileSync(path.join(target, '.circleci', 'config.yml'), 'version: 2.1\n');

    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      fs.readFileSync(path.join(target, '.circleci', 'config.yml'), 'utf8'),
      'version: 2.1\n',
      'apply must not rewrite CI for a provider the approved plan never recorded',
    );
    assert.equal(
      fs.existsSync(path.join(target, '.github', 'workflows', 'rig.yml')),
      false,
      'apply must not fabricate a CI artifact for a provider outside the signed plan',
    );
  });
});

test('a CI file the approved plan recorded is CAS-protected like every other owned path', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    fs.mkdirSync(path.join(target, '.circleci'), { recursive: true });
    fs.writeFileSync(path.join(target, '.circleci', 'config.yml'), 'version: 2.1\n');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.code-creation.feature-implementation': 'maximal' });

    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const planBody = readJson(planned.outPath);
    assert.equal(planBody.ci.provider, 'circleci', 'the provider present at plan time must be recorded');
    assert.ok(
      Object.prototype.hasOwnProperty.call(planBody.preimages, '.circleci/config.yml'),
      'the CI path must be part of the signed plan preimages, not written unaccounted-for',
    );

    const approvalPath = writePlanApproval(target, planned.outPath);
    // The file changes after the plan was signed but before apply runs.
    fs.writeFileSync(path.join(target, '.circleci', 'config.yml'), 'version: 2.1\nchanged: true\n');

    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(result.status, 0, 'apply must refuse to overwrite a CI file that drifted since the plan was signed');
    assert.match(result.stderr + result.stdout, /stale preimage/i);
    assert.equal(
      fs.readFileSync(path.join(target, '.circleci', 'config.yml'), 'utf8'),
      'version: 2.1\nchanged: true\n',
      'the drifted file must be left exactly as found, not merged over',
    );
  });
});

test('apply does not write a CI path the signed plan never listed', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    fs.writeFileSync(path.join(target, 'azure-pipelines.yml'), 'trigger: none\njobs:\n');
    const { reviewPath } = allowedReview(target);
    writeSelection(target, { 'development.code-creation.feature-implementation': 'maximal' });

    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const planBody = readJson(planned.outPath);
    assert.equal(planBody.ci.provider, 'azure_pipelines');
    assert.ok(Object.prototype.hasOwnProperty.call(planBody.preimages, 'azure-pipelines.yml'));
    assert.equal(Object.prototype.hasOwnProperty.call(planBody.preimages, 'azure-pipelines.yaml'), false);

    // After signing, a YAML twin appears. Re-resolving at apply time would
    // pick that unsigned path and overwrite it without CAS. Apply must not.
    fs.writeFileSync(path.join(target, 'azure-pipelines.yaml'), 'trigger: none\njobs:\n# unsigned\n');
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      fs.readFileSync(path.join(target, 'azure-pipelines.yaml'), 'utf8'),
      'trigger: none\njobs:\n# unsigned\n',
      'apply must not write a CI file the signed plan never listed',
    );
    assert.equal(
      fs.readFileSync(path.join(target, 'azure-pipelines.yml'), 'utf8'),
      'trigger: none\njobs:\n',
      'the signed yml must not be silently skipped in favor of an unsigned yaml twin',
    );
  });
});

test('approved remediation applies a bounded rewrite', () => {
  withRepo((target) => {
    createRepoFixture('malicious-agents', target);
    const proposal = {
      schema_version: 1,
      actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# cleaned\n' }],
    };
    const proposalPath = path.join(target, '.rig-test', 'proposal.json');
    fs.mkdirSync(path.dirname(proposalPath), { recursive: true });
    fs.writeFileSync(proposalPath, `${JSON.stringify(proposal, null, 2)}\n`);
    const approval = writeRemediationApproval(target, proposalPath);

    const result = require('./helpers/advanced-signed').remediate(target, {
      proposal: proposalPath,
      approval,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');
  });
});

test('remediation rejects digest-only consent and stale preimages without overwriting current bytes', () => {
  withRepo((target) => {
    createRepoFixture('malicious-agents', target);
    const proposal = { schema_version: 1, actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# cleaned\n' }] };
    const proposalPath = path.join(target, '.rig-test', 'proposal.json');
    fs.mkdirSync(path.dirname(proposalPath), { recursive: true });
    fs.writeFileSync(proposalPath, `${JSON.stringify(proposal)}\n`);
    const digestOnly = path.join(target, '.rig-test', 'digest-only.json');
    fs.writeFileSync(digestOnly, `${JSON.stringify({ schema_version: 1, kind: 'remediation-approval', proposal_digest: crypto.createHash('sha256').update(JSON.stringify(proposal)).digest('hex'), preimage_digest: '0'.repeat(64) })}\n`);
    const forged = require('./helpers/advanced-signed').remediate(target, { proposal: proposalPath, approval: digestOnly });
    assert.notEqual(forged.status, 0);
    assert.notEqual(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');

    const approval = writeRemediationApproval(target, proposalPath);
    const edited = '# concurrent user edit\n';
    fs.writeFileSync(path.join(target, 'AGENTS.md'), edited);
    const stale = require('./helpers/advanced-signed').remediate(target, { proposal: proposalPath, approval });
    assert.notEqual(stale.status, 0);
    assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), edited);
  });
});

test('remediation recovers a process killed after a write from its durable preimage journal', () => {
  withRepo((target) => {
    createRepoFixture('malicious-agents', target);
    const proposal = { schema_version: 1, actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# cleaned\n' }] };
    const proposalPath = path.join(target, '.rig-test', 'proposal.json');
    fs.mkdirSync(path.dirname(proposalPath), { recursive: true });
    fs.writeFileSync(proposalPath, `${JSON.stringify(proposal)}\n`);
    const approvalPath = writeRemediationApproval(target, proposalPath);
    const child = spawnSync(process.execPath, ['-e', `
      const fs = require('node:fs');
      const rename = fs.renameSync;
      fs.renameSync = (from, to) => { rename(from, to); process.kill(process.pid, 'SIGKILL'); };
      const [target, proposal, approval] = process.argv.slice(1);
      require(${JSON.stringify(path.join(__dirname, '..', 'rig/lib/apply.js'))}).remediate(target, JSON.parse(fs.readFileSync(proposal)), JSON.parse(fs.readFileSync(approval)));
    `, target, proposalPath, approvalPath], { encoding: 'utf8' });
    assert.equal(child.signal, 'SIGKILL', `${child.status}: ${child.stderr}`);
    assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');
    const retried = require('./helpers/advanced-signed').remediate(target, { proposal: proposalPath, approval: approvalPath });
    assert.equal(retried.status, 0, retried.stderr);
    assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');
    const journal = fs.readFileSync(path.join(target, '.rig/remediation.jsonl'), 'utf8');
    assert.match(journal, /recovered interrupted transaction/);
    assert.match(journal, /"state":"complete"/);
  });
});

test('remediation rolls back earlier writes when a later replacement fails', () => {
  withRepo((target) => {
    createRepoFixture('malicious-agents', target);
    fs.writeFileSync(path.join(target, 'README.md'), 'old readme\n');
    const proposal = { schema_version: 1, actions: [
      { op: 'rewrite', path: 'AGENTS.md', content: '# cleaned\n' },
      { op: 'rewrite', path: 'README.md', content: 'new readme\n' },
    ] };
    const proposalPath = path.join(target, '.rig-test', 'proposal.json');
    fs.mkdirSync(path.dirname(proposalPath), { recursive: true });
    fs.writeFileSync(proposalPath, `${JSON.stringify(proposal)}\n`);
    const approvalPath = writeRemediationApproval(target, proposalPath);
    const originalRename = fs.renameSync;
    fs.renameSync = (from, to) => {
      if (to === path.join(fs.realpathSync(target), 'README.md')) throw new Error('injected second-write failure');
      return originalRename(from, to);
    };
    try {
      assert.throws(() => require('../rig/lib/apply').remediate(target, proposal, readJson(approvalPath)), /injected second-write failure/);
    } finally {
      fs.renameSync = originalRename;
    }
    assert.notEqual(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');
    assert.equal(fs.readFileSync(path.join(target, 'README.md'), 'utf8'), 'old readme\n');
    assert.match(fs.readFileSync(path.join(target, '.rig/remediation.jsonl'), 'utf8'), /"state":"rolled_back"/);
  });
});

test('apply is idempotent when re-run with identical inputs', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const approvalPath = writePlanApproval(target, planned.outPath);
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath }).status, 0);
    const receipt1 = fs.readFileSync(
      path.join(target, '.rig', 'catalog-receipt.json'),
      'utf8',
    );
    assert.equal(apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath }).status, 0);
    const receipt2 = fs.readFileSync(
      path.join(target, '.rig', 'catalog-receipt.json'),
      'utf8',
    );
    assert.equal(receipt1, receipt2);
  });
});

test('apply succeeds in a non-git directory and leaves no stray lock', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      fs.existsSync(path.join(target, '.rig', 'catalog-install.lock')),
      false,
      'a failed install-identity lookup must not leave the lock behind',
    );
    assert.ok(
      fs.existsSync(path.join(target, '.rig', 'install-id')),
      'a non-git target falls back to a repo-local install id instead of crashing',
    );
  }, { initGit: false });
});

test('apply installs the secret-guard hook at the shared location in a linked worktree', () => {
  withRepo((mainTarget) => {
    createRepoFixture('generic-git', mainTarget);
    execFileSync('git', ['add', '-A'], { cwd: mainTarget, stdio: 'pipe' });
    execFileSync('git', ['commit', '-m', 'init'], { cwd: mainTarget, stdio: 'pipe' });

    const worktreeTarget = path.join(path.dirname(mainTarget), `${path.basename(mainTarget)}-wt`);
    execFileSync('git', ['worktree', 'add', '-b', 'rig-test-worktree', worktreeTarget], {
      cwd: mainTarget,
      stdio: 'pipe',
    });
    try {
      assert.ok(
        fs.statSync(path.join(worktreeTarget, '.git')).isFile(),
        'a linked worktree must have a `.git` file, not a directory, for this test to be meaningful',
      );

      const { reviewPath } = allowedReview(worktreeTarget);
      writeSelection(worktreeTarget, {});
      const planned = plan(worktreeTarget, { review: reviewPath });
      assert.equal(planned.status, 0, planned.stderr);
      const approvalPath = writePlanApproval(worktreeTarget, planned.outPath);
      const result = apply(worktreeTarget, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
      assert.equal(result.status, 0, result.stderr);

      // Hooks are shared across worktrees, so the hook is not written inside
      // the worktree itself but at the main clone's (shared) hooks dir.
      const sharedHook = path.join(mainTarget, '.git', 'hooks', 'pre-commit');
      assert.ok(
        fs.existsSync(sharedHook),
        'the shared hooks directory must receive the secret-guard shim, not be skipped',
      );
      assert.match(fs.readFileSync(sharedHook, 'utf8'), /Rig secret guard shim/);

      assert.doesNotThrow(() => uninstall(worktreeTarget));
    } finally {
      fs.rmSync(worktreeTarget, { recursive: true, force: true });
      execFileSync('git', ['worktree', 'prune'], { cwd: mainTarget, stdio: 'pipe' });
    }
  });
});

test('exclusive lock is acquired; stale lock is not auto-broken', () => {
  withRepo((target) => {
    createRepoFixture('generic-git', target);
    const lockPath = path.join(target, '.rig', 'catalog-install.lock');
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    fs.writeFileSync(lockPath, JSON.stringify({ pid: 1, started_at: '1970-01-01T00:00:00Z' }));
    const { reviewPath } = allowedReview(target);
    writeSelection(target, {});
    const planned = plan(target, { review: reviewPath });
    assert.equal(planned.status, 0, planned.stderr);
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.notEqual(result.status, 0, 'must not auto-break install lock');
    assert.match(result.stderr + result.stdout, /lock/i);
  });
});
