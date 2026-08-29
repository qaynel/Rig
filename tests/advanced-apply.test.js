#!/usr/bin/env node
// Apply: lock, CAS, manifest-and-resume, idempotence (impl-design §6.6/§7.6, Slice 6, AT-INSTALL-1).
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const {
  withRepo,
  createRepoFixture,
  allowedReview,
  writeSelection,
  plan,
  apply,
  writePlanApproval,
  readJson,
} = require('./helpers/advanced');
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
    fs.writeFileSync(path.join(target, 'azure-pipelines.yml'), 'trigger: none\n');
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
    fs.writeFileSync(path.join(target, 'azure-pipelines.yaml'), 'trigger: none\n# unsigned\n');
    const approvalPath = writePlanApproval(target, planned.outPath);
    const result = apply(target, { review: reviewPath, plan: planned.outPath, approval: approvalPath });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      fs.readFileSync(path.join(target, 'azure-pipelines.yaml'), 'utf8'),
      'trigger: none\n# unsigned\n',
      'apply must not write a CI file the signed plan never listed',
    );
    assert.equal(
      fs.readFileSync(path.join(target, 'azure-pipelines.yml'), 'utf8'),
      'trigger: none\n',
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
    const digest = crypto.createHash('sha256').update(JSON.stringify(proposal)).digest('hex');

    const result = require('./helpers/advanced').remediate(target, {
      proposal: proposalPath,
      approve: digest,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# cleaned\n');
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
