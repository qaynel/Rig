'use strict';

require('./hermetic-git-env');

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { signApproval } = require('./path-b-approval');

const root = path.join(__dirname, '..', '..');

function api(file, name) {
  const absolute = path.join(root, 'rig', 'lib', file);
  assert.ok(fs.existsSync(absolute), `missing Path B module rig/lib/${file}`);
  const value = require(absolute)[name];
  assert.equal(typeof value, 'function', `missing Path B function ${file}:${name}`);
  return value;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function withRepo(run, { hosts = ['codex'], install = false } = {}) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-path-b-'));
  try {
    const git = spawnSync('git', ['init', '-q'], { cwd: target, encoding: 'utf8' });
    assert.equal(git.status, 0, git.stderr);
    fs.writeFileSync(path.join(target, 'AGENTS.md'), '# Existing agent workflow\n\nKeep repository-owned guidance.\n');
    fs.writeFileSync(path.join(target, 'README.md'), '# Fixture repository\n');
    writeJson(path.join(target, 'package.json'), { name: 'path-b-fixture', private: true });
    if (install) installRuntime(target, hosts);
    return await run(target);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function installRuntime(target, hosts = ['codex']) {
  const { runPayload } = require(path.join(root, 'rig', 'lib', 'payload.js'));
  return runPayload(target, hosts, { activeDelivery: true, releaseTag: 'v5.0.0' });
}

function handle(request) {
  return api('onboarding.js', 'handleOnboarding')(request);
}

function summary(overrides = {}) {
  const sections = {
    'Existing state': 'The repository already has an agent instruction file.',
    'Rig interpretation': 'Testing support is relevant to this fixture.',
    Reuse: 'The existing instruction file remains authoritative.',
    'Grafts and improvements': 'Add one marked web-quality guarantee.',
    'New capabilities': 'Project the optional qa skill for Codex.',
    'Important decisions': 'No unresolved consequential decision remains.',
    'Resulting pipeline': 'Grilling → business specification → acceptance → tests → technical specification → lock → TDD → verification.',
    'Expected user experience': 'The existing workflow gains one reviewable quality check.',
    ...overrides,
  };
  return `# Rig onboarding summary\n${Object.entries(sections).map(([heading, body]) => `## ${heading}\n${body}`).join('\n')}\n`;
}

function proposal(target, state, overrides = {}) {
  const graftContent = overrides.graftContent || 'Run the selected web-quality checks through the approved Rig pipeline.';
  const targetPath = overrides.path || 'AGENTS.md';
  const targetFile = path.join(target, targetPath);
  const preimage = fs.existsSync(targetFile) ? sha256(fs.readFileSync(targetFile)) : null;
  return {
    inventory_digest: state.inventory.digest,
    catalog_digest: state.release.catalog_digest,
    capabilities: [{
      capability: 'testing.web-quality-assurance',
      family: 'testing',
      disposition: 'graft',
      existing_paths: [targetPath],
      rig_skills: ['qa'],
      reason: 'The repository has instructions but no web-quality execution playbook.',
    }],
    selected_skills: ['qa'],
    grafts: [{
      capability: 'testing.web-quality-assurance',
      path: targetPath,
      version: 1,
      content: graftContent,
      content_digest: sha256(graftContent),
      preimage_digest: preimage,
    }],
    owned_files: [],
    critical_decisions: [],
    ...overrides,
  };
}

function prepareAndPropose(target, overrides = {}) {
  const prepared = handle({ schema_version: 1, action: 'prepare', target });
  const state = readJson(path.join(target, '.rig', 'state.json'));
  const proposed = handle({
    schema_version: 1,
    action: 'propose',
    target,
    expected_revision: prepared.revision,
    proposal: proposal(target, state, overrides.proposal || {}),
    summary_markdown: overrides.summary || summary(),
  });
  return { prepared, proposed };
}

// An unsigned, self-asserted receipt. `apply` refuses it: it is kept only so
// negative cases can hand `apply` a structurally plausible fake. Positive paths
// use signApproval, which produces a real SSHSIG receipt.
function approval(planDigest, overrides = {}) {
  return {
    schema_version: 1,
    kind: 'plan-approval',
    plan_digest: planDigest,
    approval: { method: 'external-sshsig', verified: true },
    ...overrides,
  };
}

function applyAndCheck(target, overrides = {}) {
  const { prepared, proposed } = prepareAndPropose(target, overrides);
  const approvalReceipt = signApproval(target, proposed.proposal_digest);
  const applied = handle({
    schema_version: 1,
    action: 'apply',
    target,
    expected_revision: proposed.revision,
    approval: approvalReceipt,
  });
  const checked = handle({
    schema_version: 1,
    action: 'check',
    target,
    expected_revision: applied.revision,
  });
  return { prepared, proposed, approvalReceipt, applied, checked };
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute, out);
    else out.push(absolute);
  }
  return out;
}

module.exports = {
  api,
  applyAndCheck,
  approval,
  canonical,
  handle,
  installRuntime,
  prepareAndPropose,
  proposal,
  readJson,
  root,
  sha256,
  summary,
  walk,
  withRepo,
  writeJson,
};
