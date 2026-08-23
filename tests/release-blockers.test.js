#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const { remediate } = require('../rig/lib/apply');
const { resumeInstall, uninstall } = require('../rig/lib/lifecycle');
const { applyCoverage } = require('../rig/lib/lint-format');
const { runGrade } = require('../rig/lib/lint-format');
const { projectForAgent } = require('../rig/lib/reports');
const { runPayload } = require('../rig/lib/payload');
const { listVendoredSkills } = require('../rig/lib/skills');
const {
  activatePolicy, activationMessage, policyStatus, proposePolicy,
  proposeRecovery, recoverPolicy, recoveryMessage,
} = require('../rig/lib/policy');
const { actionDigest, consumeOneUseApproval } = require('../rig/lib/enforcement');
const { mergeGlobalConfig } = require('../rig/lib/global-writes');

function withTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-blocker-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-release-outside-'));
  try {
    return fn(target, outside);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function signPolicyProposal(target, proposal) {
  const key = path.join(target, 'policy-test-key');
  const message = path.join(target, 'policy-approval-message');
  const policyDir = path.join(target, '.rig/policy');
  fs.mkdirSync(policyDir, { recursive: true });
  const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim();
  fs.writeFileSync(path.join(policyDir, 'allowed-signers'), `owner namespaces="rig-policy-activation" ${publicKey}\n`);
  fs.writeFileSync(message, activationMessage(proposal));
  const signed = spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-policy-activation', message], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  return {
    schema_version: 1,
    kind: 'policy-approval',
    proposal_digest: proposal.digest,
    approval: {
      method: 'external-sshsig',
      identity: 'owner',
      signature: fs.readFileSync(`${message}.sig`, 'utf8'),
    },
    confirmed_disclosures: [],
  };
}

test('one-use approvals mutate their durable state and reject replay', () => {
  const action = { surface: 'shell', category: 'credential_read', argv: ['printenv', 'TOKEN'] };
  const approval = { action_digest: actionDigest(action), used: false };
  assert.equal(consumeOneUseApproval(approval, action).consumed, true);
  assert.equal(approval.used, true);
  assert.throws(() => consumeOneUseApproval(approval, action), /used|replay/i);
});

test('lint grade evidence comes from spawned argv and cannot fake a clean exit', () => {
  const result = runGrade({
    grade: 'maximal',
    changed: ['a.js'],
    commands: [{ role: 'lint', argv: [process.execPath, '-e', 'process.stdout.write("real-output")'], result: { exit_code: 99 } }],
    context: { findings: [] },
  });
  assert.equal(result.verdict, 'pass');
  assert.equal(result.commands[0].result.source, undefined);
  assert.equal(result.commands[0].result.exit_code, 0);
  assert.equal(result.evidence.output_digest, sha256('real-output\n'));
});

test('all repository mutation paths refuse ancestor symlinks that leave the target', () => {
  for (const exercise of [
    (target) => resumeInstall(target, { operations: [{ path: 'escape/victim', content: 'changed' }] }),
    (target) => {
      fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
      fs.writeFileSync(path.join(target, '.rig/install-manifest.json'), JSON.stringify({
        records: [{ seq: 1, path: 'escape/victim', ownership: 'create_owned' }],
      }));
      return uninstall(target);
    },
    (target) => applyCoverage(target, { writes: [{ path: 'escape/victim', content: 'changed' }] }),
    (target) => {
      const proposal = { actions: [{ op: 'rewrite', path: 'escape/victim', content: 'changed' }] };
      return remediate(target, proposal, sha256(JSON.stringify(proposal)));
    },
  ]) {
    withTarget((target, outside) => {
      fs.writeFileSync(path.join(outside, 'victim'), 'outside\n');
      fs.symlinkSync(outside, path.join(target, 'escape'));
      assert.throws(() => exercise(target), /outside|escape|symlink|unsafe/i);
      assert.equal(fs.readFileSync(path.join(outside, 'victim'), 'utf8'), 'outside\n');
    });
  }
});

test('the lifecycle uninstaller consumes the shipping JSONL journal', () => {
  withTarget((target) => {
    runPayload(target, []);
    assert.ok(fs.existsSync(path.join(target, '.rig/routing.md')));

    const result = uninstall(target);

    assert.equal(result.status, 'removed');
    assert.equal(fs.existsSync(path.join(target, '.rig/routing.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), false);
  });
});

test('the shipping CLI restores chained hooks and removes only attributed global entries', () => {
  withTarget((target, outside) => {
    const originalHook = '#!/bin/sh\necho user-hook\n';
    const shim = '#!/bin/sh\necho rig-hook\n';
    fs.mkdirSync(path.join(target, '.git/hooks'), { recursive: true });
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.git/hooks/pre-commit'), shim);
    fs.writeFileSync(path.join(target, '.git/hooks/pre-commit.rig-chained'), originalHook);
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), [
      { seq: 1, path: '.git/hooks/pre-commit.rig-chained', state: 'applied', transaction_kind: 'install', digest: sha256(originalHook) },
      { seq: 2, path: '.git/hooks/pre-commit', state: 'applied', transaction_kind: 'install', digest: sha256(shim) },
    ].map(JSON.stringify).join('\n') + '\n');
    const global = path.join(outside, 'host.json');
    fs.writeFileSync(global, '{"user":true}\n');
    mergeGlobalConfig(global, { install_id: 'repo-a', value: { enabled: true } });
    mergeGlobalConfig(global, { install_id: 'repo-b', value: { enabled: true } });
    fs.writeFileSync(path.join(target, '.rig/global-writes.json'), `${JSON.stringify({
      entries: [{ path: global, install_id: 'repo-a' }],
    })}\n`);

    const run = spawnSync(process.execPath, [
      path.join(__dirname, '..', 'rig/materialize.js'), 'uninstall', '--target', target,
    ], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(fs.readFileSync(path.join(target, '.git/hooks/pre-commit'), 'utf8'), originalHook);
    const remaining = JSON.parse(fs.readFileSync(global, 'utf8'));
    assert.equal(remaining.user, true);
    assert.equal(remaining.rig['repo-a'], undefined);
    assert.deepEqual(remaining.rig['repo-b'], { enabled: true });
  });
});

test('purge lists usage artifacts first and preserves user-owned policy', () => {
  withTarget((target) => {
    fs.mkdirSync(path.join(target, '.rig/run-history'), { recursive: true });
    fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/network-policy.json'), '{"user":true}\n');
    fs.writeFileSync(path.join(target, '.rig/run-history/a'), 'history\n');
    fs.writeFileSync(path.join(target, 'reports/rig/a'), 'report\n');
    const observed = [];
    const result = uninstall(target, {
      purge: true,
      beforePurge: (paths) => observed.push({ paths, policy: fs.existsSync(path.join(target, '.rig/network-policy.json')) }),
    });
    assert.deepEqual(observed, [{ paths: ['reports/rig', '.rig/run-history'], policy: true }]);
    assert.deepEqual(result.purge_list, ['reports/rig', '.rig/run-history']);
    assert.equal(fs.readFileSync(path.join(target, '.rig/network-policy.json'), 'utf8'), '{"user":true}\n');
  });
});

test('resume reconciles a write that landed after its pending journal record', () => {
  withTarget((target) => {
    const contents = 'landed-before-crash\n';
    fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
    fs.writeFileSync(path.join(target, '.rig/recovered'), contents);
    fs.writeFileSync(path.join(target, '.rig/install-manifest.jsonl'), `${JSON.stringify({
      seq: 1,
      path: '.rig/recovered',
      ownership: 'create_owned',
      operation: 'create_owned',
      transaction_kind: 'install',
      state: 'pending',
      preimage_digest: null,
      desired_digest: sha256(contents),
    })}\n`);

    const result = resumeInstall(target, {
      operations: [{ path: '.rig/recovered', content: contents }],
    });

    assert.equal(result.complete, true);
    const records = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
      .trim().split('\n').map((line) => JSON.parse(line));
    assert.ok(records.some((record) => record.seq === 1 && record.state === 'applied'));
    assert.ok(records.some((record) => record.kind === 'install_state' && record.complete === true));
  });
});

test('a bare repository receives the neutral skills, catalogue, and safety runtime', () => {
  withTarget((target) => {
    const result = runPayload(target, undefined, { activeDelivery: true });

    assert.deepEqual(result.hosts, []);
    for (const skill of listVendoredSkills()) {
      assert.ok(fs.existsSync(path.join(target, '.rig/skills', skill.name, 'SKILL.md')), skill.name);
    }
    for (const rel of [
      '.rig/runtime/rig/materialize.js',
      '.rig/runtime/rig/catalog.json',
      '.rig/runtime/rig/catalog/baseline/check.js',
      '.rig/runtime/rig/catalog/services/development/code-quality/lint-format/minimal.md',
      '.rig/runtime/rig/lib/policy.js',
      '.rig/runtime/rig/lib/enforcement.js',
      '.rig/runtime/rig/lib/lifecycle.js',
    ]) {
      assert.ok(fs.existsSync(path.join(target, rel)), rel);
    }
  });
});

test('catalogue packs contain service-specific policy and check contracts', () => {
  const root = path.join(__dirname, '..');
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'rig/catalog.json'), 'utf8'));
  const bodiesSeen = new Map();

  for (const service of catalog.services) {
    if (service.id !== 'development.code-quality.lint-format') {
      assert.ok(service.acceptance_evidence, `${service.id} acceptance evidence`);
      for (const grade of ['minimal', 'mid', 'maximal']) {
        assert.match(service.acceptance_evidence[grade].target, new RegExp(service.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.ok(service.acceptance_evidence[grade].given && service.acceptance_evidence[grade].pass && service.acceptance_evidence[grade].fail);
      }
    }
    const bodies = Object.entries(service.fragments).map(([part, rel]) => {
      const body = fs.readFileSync(path.join(root, 'rig', rel), 'utf8');
      if (part === 'identity') {
        for (const scope of service.owns) assert.match(body, new RegExp(scope.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} owns ${scope}`);
        for (const signal of service.applicability.any || []) assert.match(body, new RegExp(signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} applicability ${signal}`);
        assert.match(body, /Disposition:/, `${service.id} disposition`);
      } else {
        for (const checkId of service.checks[part] || []) {
          assert.doesNotMatch(checkId, /-(?:core|extended|thorough)$/);
          assert.match(body, new RegExp(checkId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${service.id} ${part} check ${checkId}`);
        }
      }
      assert.doesNotMatch(body, /describes the .* service\. This authoring|enforces the Policy-grade checks declared in the catalogue|carries the shared invariant the parent service depends on/i);
      return [part, body];
    });

    for (const [part, body] of bodies) {
      const key = `${part}:${body.replace(/\s+/g, ' ').trim()}`;
      const duplicate = bodiesSeen.get(key);
      assert.equal(duplicate, undefined, `${service.id} repeats ${part} content from ${duplicate}`);
      bodiesSeen.set(key, service.id);
    }
  }
});

test('all six CI providers render and apply a working additive adapter', () => {
  const { PROVIDERS, planCiIntegration, applyCiPlan, renderPipeline } = require('../rig/lib/ci-adapters');
  const fixtures = {
    'github-actions': ['.github/workflows/ci.yml', 'name: user-ci\njobs:\n  user:\n    runs-on: ubuntu-latest\n'],
    gitlab_ci: ['.gitlab-ci.yml', 'stages:\n  - test\n# user-ci\n'],
    circleci: ['.circleci/config.yml', 'version: 2.1\n# user-ci\n'],
    jenkins: ['Jenkinsfile', '// user-ci\n'],
    buildkite: ['.buildkite/pipeline.yml', '# user-ci\nsteps:\n'],
    azure_pipelines: ['azure-pipelines.yml', '# user-ci\njobs:\n'],
  };

  assert.equal(Object.keys(PROVIDERS).length, 6);
  for (const [provider, [rel, initial]] of Object.entries(fixtures)) {
    withTarget((target) => {
      const file = path.join(target, rel);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, initial);

      const plan = planCiIntegration(target, { provider, approved: true });
      assert.equal(plan.status, 'integrated', provider);
      assert.equal(plan.evidence, 'verified', provider);
      assert.ok(plan.artifact, provider);
      applyCiPlan(target, plan);
      const first = fs.readFileSync(file, 'utf8');
      applyCiPlan(target, planCiIntegration(target, { provider, approved: true }));
      assert.equal(fs.readFileSync(file, 'utf8'), first, `${provider} must be idempotent`);
      assert.match(first, /user-ci/, `${provider} must preserve existing config`);

      const installed = [first];
      if (provider === 'github-actions') installed.push(fs.readFileSync(path.join(target, '.github/workflows/rig.yml'), 'utf8'));
      assert.match(installed.join('\n'), /\.rig\/bin\/check\.js --scope repo/, provider);
      assert.match(renderPipeline(provider, { services: [], controls: [] }), /\.rig\/bin\/check\.js --scope repo/, provider);
    });
  }
});

test('release review validation rejects unresolved, failing, and incomplete case coverage', () => {
  const { validateReviewReceipt } = require('../rig/lib/release-evidence');
  const expected = {
    technical_spec_digest: 'a'.repeat(64),
    catalogue_digest: 'b'.repeat(64),
    implementation_digest: 'c'.repeat(64),
    implementation_base: 'origin/implement-advanced-a-la-carte-catalogue',
    acceptance_ids: ['AT-A-1', 'AT-A-2'],
  };
  const receipt = {
    schema_version: 1,
    kind: 'report-only',
    author_context: 'implementation-1',
    reviewer_context: 'review-1',
    technical_spec_digest: expected.technical_spec_digest,
    catalogue_digest: expected.catalogue_digest,
    implementation_digest: expected.implementation_digest,
    implementation_base: expected.implementation_base,
    verdict: 'pass',
    verdicts: expected.acceptance_ids.map((id) => ({ id, verdict: 'pass' })),
    findings: [],
    unresolved: [],
  };

  assert.equal(validateReviewReceipt(receipt, expected), true);
  assert.throws(() => validateReviewReceipt({ ...receipt, unresolved: ['AT-A-2'] }, expected), /unresolved/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdict: 'fail' }, expected), /verdict/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, findings: [{ severity: 'blocker' }] }, expected), /block/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, findings: [{ severity: 'major' }] }, expected), /blocking/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: receipt.verdicts.slice(0, 1) }, expected), /missing|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [...receipt.verdicts, { id: 'AT-X-1', verdict: 'pass' }] }, expected), /extra|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [{ id: 'AT-A-1', verdict: 'pass' }, { id: 'AT-A-1', verdict: 'pass' }] }, expected), /duplicate|coverage/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, verdicts: [{ id: 'AT-A-1', verdict: 'pass' }, { id: 'AT-A-2', verdict: 'fail' }] }, expected), /case verdict/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, implementation_digest: 'd'.repeat(64) }, expected), /implementation_digest/i);
  assert.throws(() => validateReviewReceipt({ ...receipt, implementation_base: 'origin/qa-prod' }, expected), /implementation_base/i);
});

test('model-assisted secret triage requires disclosure-bound plan approval', () => {
  withTarget((target) => {
    const candidate = {
      schema_version: 1,
      controls: {},
      enforcement: {},
      allow: [],
      secrets: { model_assisted_triage: true },
    };
    const proposal = proposePolicy(target, candidate, { explicit_request: true, session: 'author-context' });
    assert.equal(proposal.disclosures.length, 1);
    assert.match(proposal.disclosures[0].text, /third.party/i);
    assert.match(proposal.disclosures[0].text, /cannot be unsent/i);

    const approval = signPolicyProposal(target, proposal);
    assert.throws(() => activatePolicy(target, proposal, { approval }), /disclosure/i);

    approval.confirmed_disclosures = [proposal.disclosures[0].digest];
    activatePolicy(target, proposal, { approval });
    const status = policyStatus(target);
    assert.equal(status.model_assisted_triage.enabled, true);
    assert.equal(status.model_assisted_triage.disclosure, proposal.disclosures[0].text);
  });
});

test('policy activation signs and preserves exact validated candidate bytes', () => {
  withTarget((target) => {
    const bytes = Buffer.from('{\n  "schema_version": 1, "controls": {}, "enforcement": {}, "allow": []\n}\n');
    const proposal = proposePolicy(target, bytes, { explicit_request: true });
    const approval = signPolicyProposal(target, proposal);
    activatePolicy(target, proposal, { approval });
    assert.deepEqual(fs.readFileSync(path.join(target, '.rig/policy/active.json')), bytes);
    assert.equal(proposal.candidate_digest, sha256(bytes));
    assert.throws(() => proposePolicy(target, '{"schema_version":1,"allow":[],"allow":[]} ', { explicit_request: true }), /duplicate/i);
  });
});

test('matched content reaches the agent only through the active signed triage policy', () => {
  withTarget((target) => {
    const matched = ['ghp_', 'fixtureValue12345678901234567890'].join('');
    const report = { findings: [{ rule: 'credential', path: 'a.txt', matched }] };
    assert.doesNotMatch(JSON.stringify(projectForAgent(report, { model_assisted_triage: true })), new RegExp(matched));
    const proposal = proposePolicy(target, Buffer.from(JSON.stringify({
      schema_version: 1, controls: {}, enforcement: {}, allow: [],
      secrets: { model_assisted_triage: true },
    })), { explicit_request: true });
    const approval = signPolicyProposal(target, proposal);
    approval.confirmed_disclosures = [proposal.disclosures[0].digest];
    activatePolicy(target, proposal, { approval });
    assert.match(JSON.stringify(projectForAgent(report, { target })), new RegExp(matched));
    fs.appendFileSync(path.join(target, '.rig/policy/active.json'), ' ');
    assert.doesNotMatch(JSON.stringify(projectForAgent(report, { target })), new RegExp(matched));
  });
});

test('policy CLI shows disclosure before activating model-assisted triage', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const materializer = path.join(root, 'rig/materialize.js');
    const policy = path.join(target, 'policy.json');
    const proposal = path.join(target, 'proposal.json');
    const approval = path.join(target, 'approval.json');
    fs.writeFileSync(policy, `${JSON.stringify({
      schema_version: 1,
      controls: {},
      enforcement: {},
      allow: [],
      secrets: { model_assisted_triage: true },
    }, null, 2)}\n`);

    const proposed = spawnSync(process.execPath, [
      materializer, 'policy', 'propose', '--target', target, '--policy', policy, '--out', proposal,
    ], { encoding: 'utf8' });
    assert.equal(proposed.status, 0, proposed.stderr);
    const planned = JSON.parse(fs.readFileSync(proposal, 'utf8'));
    assert.match(planned.disclosures[0].text, /cannot be unsent/i);

    const signedApproval = signPolicyProposal(target, planned);
    signedApproval.confirmed_disclosures = [planned.disclosures[0].digest];
    fs.writeFileSync(approval, `${JSON.stringify(signedApproval, null, 2)}\n`);
    const activated = spawnSync(process.execPath, [
      materializer, 'policy', 'activate', '--target', target, '--proposal', proposal, '--approval', approval,
    ], { encoding: 'utf8' });
    assert.equal(activated.status, 0, activated.stderr);

    const status = spawnSync(process.execPath, [
      materializer, 'policy', 'status', '--target', target,
    ], { encoding: 'utf8' });
    assert.equal(status.status, 0, status.stderr);
    assert.equal(JSON.parse(status.stdout).model_assisted_triage.enabled, true);
  });
});

test('shipping recovery verifies a pre-registered SSHSIG before committing consequences', () => {
  withTarget((target) => {
    const policyDir = path.join(target, '.rig/policy');
    const key = path.join(target, 'recovery-key');
    const message = path.join(target, 'recovery-message');
    fs.mkdirSync(policyDir, { recursive: true });
    assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
    const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim();
    fs.writeFileSync(path.join(policyDir, 'recovery.allowed-signers'), `recovery-one namespaces="rig-policy-recovery" ${publicKey}\n`);
    const fingerprintOutput = spawnSync('ssh-keygen', ['-lf', `${key}.pub`], { encoding: 'utf8' });
    const fingerprint = fingerprintOutput.stdout.match(/\bSHA256:[A-Za-z0-9+/=]+/)[0];
    fs.writeFileSync(path.join(policyDir, 'trust.json'), `${JSON.stringify({
      schema_version: 1,
      signer: { fingerprint: 'SHA256:ordinary' },
      recovery: [{
        identity: 'recovery-one', fingerprint,
        declared_class: 'ssh-ed25519', registration_receipt: { signed_before_loss: true },
      }],
      approvals: ['stale'],
      evidence_epoch: 3,
      recovery_sequence: 0,
      previous_recovery_receipt_digest: null,
    }, null, 2)}\n`);
    const challenge = proposeRecovery(target, { fingerprint: 'SHA256:replacement', identity: 'new-owner' }, 'recovery-one');
    fs.writeFileSync(message, recoveryMessage(challenge));
    assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-policy-recovery', message]).status, 0);
    const result = recoverPolicy(target, challenge, {
      challenge_digest: challenge.digest,
      identity: 'recovery-one',
      signature: fs.readFileSync(`${message}.sig`, 'utf8'),
    });
    assert.equal(result.trust.signer.fingerprint, 'SHA256:replacement');
    assert.deepEqual(result.trust.approvals, []);
    assert.equal(result.trust.evidence_epoch, 4);
    assert.equal(result.receipt.recovery_credential_fingerprint, fingerprint);
    assert.ok(fs.existsSync(path.join(policyDir, 'recovery-receipt-1.json')));
    assert.throws(() => recoverPolicy(target, challenge, {}), /stale|foreign|challenge/i);
  });
});

test('implementation digest covers publishable worktree bytes but excludes review receipts', () => {
  const { implementationDigest } = require('../rig/lib/release-evidence');
  withTarget((target) => {
    spawnSync('git', ['init', '-q'], { cwd: target });
    fs.writeFileSync(path.join(target, 'tracked.txt'), 'one\n');
    spawnSync('git', ['add', 'tracked.txt'], { cwd: target });
    fs.writeFileSync(path.join(target, 'untracked.txt'), 'two\n');
    const first = implementationDigest(target);

    fs.writeFileSync(path.join(target, 'untracked.txt'), 'changed\n');
    const changed = implementationDigest(target);
    assert.notEqual(changed.digest, first.digest);

    const reviews = path.join(target, 'wiki/sources/reviews');
    fs.mkdirSync(reviews, { recursive: true });
    fs.writeFileSync(path.join(reviews, 'current.review.json'), '{}\n');
    assert.equal(implementationDigest(target).digest, changed.digest);
  });
});

test('review wrapper output validates without schema translation', () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const bin = path.join(target, 'bin');
    const out = path.join(target, 'receipt.json');
    fs.mkdirSync(bin);
    const acceptance = fs.readFileSync(path.join(root, 'wiki/gate1/acceptance.md'), 'utf8');
    const ids = [...new Set([...acceptance.matchAll(/^- \*\*(AT-[A-Z]+-?\d+)/gm)].map((match) => match[1]))].sort();
    const reported = JSON.stringify({
      verdict: 'pass',
      verdicts: ids.map((id) => ({ id, verdict: 'pass', note: 'covered' })),
      findings: [],
      unresolved: [],
    });
    const fake = path.join(bin, 'claude');
    fs.writeFileSync(fake, `#!/bin/sh\ncat >/dev/null\nprintf '%s\\n' '${'```json'}' '${reported}' '${'```'}'\n`, { mode: 0o755 });

    const run = spawnSync(process.execPath, [
      path.join(root, 'scripts/review-receipt.js'),
      '--target', path.join(root, 'wiki/gate2/technical-spec.md'),
      '--catalogue', path.join(root, 'rig/catalog.json'),
      '--implementation-root', root,
      '--base', 'origin/implement-advanced-a-la-carte-catalogue',
      '--gate1', path.join(root, 'wiki/gate1/business-spec.md') + ',' + path.join(root, 'wiki/gate1/acceptance.md'),
      '--author-context', 'implementation-1',
      '--model', 'fake-reviewer',
      '--out', out,
    ], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` } });
    assert.equal(run.status, 0, run.stderr);

    const receipt = JSON.parse(fs.readFileSync(out, 'utf8'));
    const { catalogueDigest, implementationDigest, validateReviewReceipt } = require('../rig/lib/release-evidence');
    assert.equal(validateReviewReceipt(receipt, {
      technical_spec_digest: sha256(fs.readFileSync(path.join(root, 'wiki/gate2/technical-spec.md'))),
      catalogue_digest: catalogueDigest(path.join(root, 'rig/catalog.json')),
      implementation_digest: implementationDigest(root).digest,
      implementation_base: 'origin/implement-advanced-a-la-carte-catalogue',
      acceptance_ids: ids,
    }), true);
  });
});

test('the POSIX installer downloads and executes a named tagged archive', { timeout: 30000 }, () => {
  withTarget((target) => {
    const root = path.join(__dirname, '..');
    const source = fs.readFileSync(path.join(root, 'install.sh'), 'utf8');
    assert.match(source, /^#!\/bin\/sh\n/);
    assert.doesNotMatch(source, /pipefail|\$\{[^}]+:[0-9]+(?::[0-9]+)?\}|^\s*\[\[/m);

    const staging = path.join(target, 'staging', 'Rig-v5.0.0');
    fs.mkdirSync(staging, { recursive: true });
    for (const rel of ['rig', '.agents', '.claude', 'skills']) {
      fs.cpSync(path.join(root, rel), path.join(staging, rel), { recursive: true });
    }
    const archive = path.join(target, 'rig-v5.0.0.tar.gz');
    const packed = spawnSync('tar', ['-czf', archive, '-C', path.dirname(staging), path.basename(staging)], { encoding: 'utf8' });
    assert.equal(packed.status, 0, packed.stderr);

    const bin = path.join(target, 'bin');
    const downloadLog = path.join(target, 'download.log');
    const installTarget = path.join(target, 'repository');
    fs.mkdirSync(bin);
    fs.mkdirSync(installTarget);
    fs.writeFileSync(path.join(bin, 'curl'), [
      '#!/bin/sh',
      'printf "%s\\n" "$*" >> "$RIG_TEST_DOWNLOAD_LOG"',
      'while [ "$#" -gt 0 ]; do',
      '  if [ "$1" = "-o" ]; then cp "$RIG_TEST_ARCHIVE" "$2"; exit 0; fi',
      '  shift',
      'done',
      'exit 1',
      '',
    ].join('\n'), { mode: 0o755 });

    const installed = spawnSync('/bin/dash', [
      path.join(root, 'install.sh'), '--version', 'v5.0.0', '--target', installTarget,
    ], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        RIG_TEST_ARCHIVE: archive,
        RIG_TEST_DOWNLOAD_LOG: downloadLog,
      },
    });
    assert.equal(installed.status, 0, installed.stderr);
    assert.match(fs.readFileSync(downloadLog, 'utf8'), /refs\/tags\/v5\.0\.0\.tar\.gz/);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(installTarget, '.rig/release.json'), 'utf8')), { tag: 'v5.0.0' });
    assert.equal(fs.readdirSync(path.join(installTarget, '.rig/skills'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(installTarget, '.rig/skills', entry.name, 'SKILL.md'))).length, 55);
    assert.ok(fs.existsSync(path.join(installTarget, '.rig/runtime/rig/lib/policy.js')));
    const inspection = path.join(installTarget, 'inspection.json');
    const runtime = spawnSync(process.execPath, [
      path.join(installTarget, '.rig/runtime/rig/materialize.js'),
      'inspect', '--target', installTarget, '--host', 'generic', '--out', inspection,
    ], { encoding: 'utf8' });
    assert.equal(runtime.status, 0, runtime.stderr);
    assert.ok(fs.existsSync(inspection));
  });
});
