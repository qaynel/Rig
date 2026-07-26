#!/usr/bin/env node
// Phase 2 expectations for the target-repo CI floor skeleton + adapter registry.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { root } = require('./helpers/advanced');
const {
  PROVIDERS,
  REPORTS_UPLOAD,
  planCiIntegration,
  githubActionsStandalone,
} = require('../rig/lib/ci-adapters');

test('check.js skeleton exists with --scope repo contract', () => {
  const checkPath = path.join(root, 'rig', 'catalog', 'baseline', 'check.js');
  assert.ok(fs.existsSync(checkPath));
  const source = fs.readFileSync(checkPath, 'utf8');
  assert.match(source, /--scope/);
  assert.match(source, /shell:\s*false/);
  assert.match(source, /service-bindings\.json/);
});

test('every emitted adapter has doc/first-wire evidence; unverified degrade', () => {
  for (const provider of Object.values(PROVIDERS)) {
    if (provider.status === 'verified') {
      assert.ok(provider.evidence, `${provider.id} verified without evidence`);
      assert.ok(
        provider.evidence.kind === 'official_doc' ||
          provider.evidence.kind === 'first_wire_test',
      );
      assert.ok(provider.evidence.citation || provider.evidence.test);
    } else {
      assert.equal(provider.status, 'degraded');
      assert.ok(provider.reason);
    }
  }
  const gha = planCiIntegration;
  assert.equal(typeof gha, 'function');
  const artifact = githubActionsStandalone();
  assert.equal(artifact.relativePath, '.github/workflows/rig-check.yml');
  assert.match(artifact.contents, /node \.rig\/bin\/check\.js --scope repo/);
  assert.match(artifact.contents, /reports\/rig\//);
  assert.ok(REPORTS_UPLOAD.github_actions.evidence.citation);
});

test('unverified provider plan does not fabricate CI config', () => {
  const result = planCiIntegration;
  // Simulate a gitlab target via resolve path indirectly: no workflows dir.
  const os = require('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-ci-'));
  try {
    fs.writeFileSync(path.join(tmp, '.gitlab-ci.yml'), 'image: node\n');
    const plan = planCiIntegration(tmp);
    assert.equal(plan.status, 'degraded');
    assert.equal(plan.artifact, null);
    assert.equal(plan.always_install_check_command, true);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
