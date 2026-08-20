#!/usr/bin/env node
// Apply: lock, CAS, manifest-and-resume, idempotence (impl-design §6.6/§7.6, Slice 6, AT-INSTALL-1).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
      fs.existsSync(path.join(target, '.rig', 'hooks', 'semantic-review.hint.md')),
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
