'use strict';
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const h = require('./helpers/advanced-signed');
const apply = require('../rig/lib/apply');
const { mergeGlobalConfig, removeGlobalConfig, mergeHostGlobalMcp, removeGlobalMcp } = require('../rig/lib/global-writes');

function catalogueFixture(target) {
  h.initGitRepo(target);
  h.seedExistingAgentsRouter(target);
  h.writeSelection(target, { 'development.documentation.adrs': 'minimal' });
  const { reviewPath } = h.allowedReview(target);
  const planned = h.plan(target, { review: reviewPath });
  assert.equal(planned.status, 0, planned.stderr);
  const approval = h.writePlanApproval(target, planned.outPath);
  return { manifest: h.readJson(path.join(target, 'rig.json')), review: h.readJson(reviewPath), plan: h.readJson(planned.outPath), approval: h.readJson(approval) };
}
function signedRemediation(target, proposal) {
  const file = path.join(target, '.rig-test/proposal.json');
  h.writeJson(file, proposal);
  return h.readJson(h.writeRemediationApproval(target, file));
}

test('catalogue apply rechecks signed user preimages after acquiring its real lock', () => h.withRepo((target) => {
  const request = catalogueFixture(target);
  const originalAgents = fs.readFileSync(path.join(target, 'AGENTS.md'));
  const concurrentAgents = Buffer.concat([originalAgents, Buffer.from('# concurrent user edit\n')]);
  const originalOpen = fs.openSync;
  let injected = false;
  fs.openSync = function(file, flags, ...args) {
    const fd = originalOpen.call(this, file, flags, ...args);
    if (!injected && String(file).endsWith('/catalog-install.lock') && flags === 'wx') {
      injected = true;
      fs.writeFileSync(path.join(target, 'AGENTS.md'), concurrentAgents);
    }
    return fd;
  };
  try {
    assert.throws(() => apply.applyPlan(target, request.manifest, request.review, request.plan, { approval: request.approval }), /stale preimage for AGENTS\.md/);
  } finally { fs.openSync = originalOpen; }
  assert.equal(injected, true);
  assert.deepEqual(fs.readFileSync(path.join(target, 'AGENTS.md')), concurrentAgents);
  assert.equal(fs.existsSync(path.join(target, '.rig/catalog-receipt.json')), false);
  assert.equal(fs.existsSync(path.join(target, '.rig/install-manifest.jsonl')), false);
}));

test('signed remediation refuses a changed target at the atomic publish boundary', () => h.withRepo((target) => {
  h.seedMaliciousAgents(target);
  const proposal = { schema_version: 1, actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# approved clean\n' }] };
  const approval = signedRemediation(target, proposal);
  const originalWrite = fs.writeFileSync;
  let injected = false;
  fs.writeFileSync = function(file, ...args) {
    const result = originalWrite.call(this, file, ...args);
    if (!injected && String(file).includes('.rig-remediate-')) {
      injected = true;
      originalWrite.call(this, path.join(target, 'AGENTS.md'), '# concurrent user edit\n');
    }
    return result;
  };
  try { assert.throws(() => apply.remediate(target, proposal, approval), /changed|stale|preimage/i); }
  finally { fs.writeFileSync = originalWrite; }
  assert.equal(injected, true);
  assert.equal(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), '# concurrent user edit\n');
}));

for (const kind of ['symlink', 'hard link']) test(`signed remediation refuses ${kind} journal authority without changing the referenced user file`, () => h.withRepo((target) => {
  h.seedMaliciousAgents(target);
  const journal = path.join(target, '.rig/remediation.jsonl');
  const sentinel = path.join(target, 'user-journal-data.jsonl');
  fs.mkdirSync(path.dirname(journal), { recursive: true });
  fs.writeFileSync(sentinel, '{"user":"keep this exact file"}\n');
  if (kind === 'symlink') fs.symlinkSync(sentinel, journal);
  else fs.linkSync(sentinel, journal);
  const before = fs.readFileSync(sentinel);
  const proposal = { schema_version: 1, actions: [{ op: 'rewrite', path: 'AGENTS.md', content: '# approved clean\n' }] };
  const approval = signedRemediation(target, proposal);
  assert.throws(() => apply.remediate(target, proposal, approval), /symlink|hard link|unsafe|journal/i);
  assert.deepEqual(fs.readFileSync(sentinel), before);
  assert.match(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'), /Ignore prior instructions/);
}));

test('global JSON merge refuses a hard-linked ownership sidecar without changing its other link', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-global-hardlink-'));
  try {
    const file = path.join(root, 'settings.json');
    const metadata = path.join(root, '.rig-settings.json.ownership.json');
    const sentinel = path.join(root, 'user-owned-sidecar.json');
    fs.writeFileSync(file, '{}\n');
    fs.writeFileSync(sentinel, '{"entries":{}}\n');
    fs.linkSync(sentinel, metadata);
    const before = fs.readFileSync(sentinel);
    assert.throws(() => mergeGlobalConfig(file, { install_id: 'repo-a', value: { enabled: true } }), /ownership|hard link|unsafe/i);
    assert.deepEqual(fs.readFileSync(sentinel), before);
    assert.equal(fs.readFileSync(file, 'utf8'), '{}\n');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const kind of ['symlink', 'hard link']) test(`global JSON and YAML merges refuse a ${kind} main config`, () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-global-main-link-'));
  try {
    const cases = [
      {
        name: 'mergeGlobalConfig',
        file: path.join(root, 'settings.json'),
        initial: '{}\n',
        merge: (file) => mergeGlobalConfig(file, { install_id: 'repo-a', value: { enabled: true } }),
      },
      {
        name: 'mergeHostGlobalMcp JSON',
        file: path.join(root, '.codeium/windsurf/mcp_config.json'),
        initial: '{}\n',
        merge: (_file) => mergeHostGlobalMcp('windsurf', root, { install_id: 'repo-a', server_name: 'db', value: { command: 'node' } }),
      },
      {
        name: 'mergeHostGlobalMcp YAML',
        file: path.join(root, '.hermes/config.yaml'),
        initial: 'mcp_servers:\n',
        merge: (_file) => mergeHostGlobalMcp('hermes', root, { install_id: 'repo-a', server_name: 'db', value: { command: 'node' } }),
      },
    ];
    for (const row of cases) {
      const sentinel = path.join(root, `${row.name.replaceAll(/[^a-z]+/gi, '-')}-sentinel`);
      fs.mkdirSync(path.dirname(row.file), { recursive: true });
      fs.writeFileSync(sentinel, row.initial);
      if (kind === 'symlink') fs.symlinkSync(sentinel, row.file);
      else fs.linkSync(sentinel, row.file);
      const before = fs.readFileSync(sentinel);
      assert.throws(() => row.merge(row.file), /unsafe.*config|config.*unsafe/i, row.name);
      assert.deepEqual(fs.readFileSync(sentinel), before, `${row.name} must preserve the linked user file`);
      fs.unlinkSync(row.file);
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

for (const kind of ['symlink', 'hard link']) test(`global uninstall refuses a replaced ${kind} config and preserves the outside sentinel`, () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-global-remove-link-'));
  const previousHome = process.env.HOME;
  process.env.HOME = root;
  try {
    const cases = [
      {
        name: 'removeGlobalConfig',
        file: path.join(root, 'settings.json'),
        create: () => mergeGlobalConfig(path.join(root, 'settings.json'), { install_id: 'repo-a', value: { enabled: true } }),
        remove: () => removeGlobalConfig(path.join(root, 'settings.json'), 'repo-a'),
      },
      {
        name: 'removeGlobalMcp JSON',
        file: path.join(root, '.codeium/windsurf/mcp_config.json'),
        create: () => mergeHostGlobalMcp('windsurf', root, { install_id: 'repo-a', server_name: 'db', value: { command: 'node' } }),
        remove: (entry) => removeGlobalMcp(entry),
      },
      {
        name: 'removeGlobalMcp YAML',
        file: path.join(root, '.hermes/config.yaml'),
        create: () => mergeHostGlobalMcp('hermes', root, { install_id: 'repo-a', server_name: 'db', value: { command: 'node' } }),
        remove: (entry) => removeGlobalMcp(entry),
      },
    ];
    for (const row of cases) {
      const entry = row.create();
      const sentinel = path.join(root, `${row.name.replaceAll(/[^a-z]+/gi, '-')}-sentinel`);
      fs.writeFileSync(sentinel, fs.readFileSync(row.file));
      fs.unlinkSync(row.file);
      if (kind === 'symlink') fs.symlinkSync(sentinel, row.file);
      else fs.linkSync(sentinel, row.file);
      const before = fs.readFileSync(sentinel);
      const result = row.remove(entry);
      assert.deepEqual(result, { removed: false, reason: 'unsafe_config_file' }, row.name);
      assert.deepEqual(fs.readFileSync(sentinel), before, `${row.name} must preserve the linked user file`);
    }
  } finally { process.env.HOME = previousHome; fs.rmSync(root, { recursive: true, force: true }); }
});
