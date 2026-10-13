#!/usr/bin/env node
'use strict';

// Subplan 03 acceptance 6: a host name no projector knows. Onboarding accepts
// an agent-written projection script in a proposal slot, refuses to apply
// without approval, refuses to execute without a verified filesystem+network
// sandbox, and applies only approved, validated artifacts through the journal.
// The adversarial cases run real scripts under the real sandbox; where the
// machine has none, they are reported as skipped and the refusal cases still run.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const h = require('./helpers/path-b');
const { signApproval } = require('./helpers/path-b-approval');
const { detectSandboxSync, resetSandboxCache } = require('../rig/lib/sandbox');
const { validateScriptSlot } = require('../rig/lib/projection-script');

const sandbox = detectSandboxSync();
const real = sandbox.available ? false : `no verifiable sandbox here (${sandbox.code}): ${sandbox.reason}`;
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');

const GOOD = `
const fs = require('node:fs');
const path = require('node:path');
const routing = fs.readFileSync(path.join(process.env.RIG_CORPUS_DIR, 'routing.md'), 'utf8');
fs.mkdirSync(path.join(process.env.RIG_OUT_DIR, '.zed'), { recursive: true });
fs.writeFileSync(path.join(process.env.RIG_OUT_DIR, '.zed/rig-rules.md'), '# Rig for Zed\\n' + routing.split('\\n')[0] + '\\n');
`;

function slotFor(overrides = {}) {
  return {
    host: 'zed',
    source: GOOD,
    approved_outputs: [{ path: '.zed/rig-rules.md', max_bytes: 4096, preimage_digest: null }],
    ...overrides,
  };
}

function propose(target, slot) {
  const prepared = h.handle({ schema_version: 1, action: 'prepare', target });
  const state = h.readJson(path.join(target, '.rig/state.json'));
  const proposed = h.handle({
    schema_version: 1,
    action: 'propose',
    target,
    expected_revision: prepared.revision,
    proposal: h.proposal(target, state, {
      capabilities: [], selected_skills: [], grafts: [], owned_files: [], projection_script: slot,
    }),
    summary_markdown: h.summary(),
  });
  return proposed;
}

function apply(target, proposed, receipt = signApproval(target, proposed.proposal_digest)) {
  return h.handle({
    schema_version: 1, action: 'apply', target, expected_revision: proposed.revision, approval: receipt,
  });
}

function snapshot(target) {
  return h.walk(target)
    .filter((file) => !file.includes(`${path.sep}.git${path.sep}`) && !file.includes(`${path.sep}.rig${path.sep}`))
    .map((file) => `${path.relative(target, file)}:${sha(fs.readFileSync(file))}`)
    .sort();
}

function withDisabledSandbox(fn) {
  const prior = process.env.RIG_SANDBOX_DISABLE;
  process.env.RIG_SANDBOX_DISABLE = '1';
  resetSandboxCache();
  try { return fn(); } finally {
    if (prior === undefined) delete process.env.RIG_SANDBOX_DISABLE; else process.env.RIG_SANDBOX_DISABLE = prior;
    resetSandboxCache();
  }
}

// ---------------------------------------------------------------- the slot

test('the slot is validated: paths, sizes, reserved targets and digests', () => {
  const ok = validateScriptSlot(slotFor());
  assert.equal(ok.script_digest, sha(GOOD), 'the engine computes the script digest');
  assert.deepEqual(ok.limits, { timeout_ms: 20000 });
  const bad = (overrides, pattern) => assert.throws(() => validateScriptSlot(slotFor(overrides)), pattern);
  bad({ host: 'Zed Editor' }, /host must be a short lowercase name/);
  bad({ source: '   ' }, /script source is required/);
  bad({ script_digest: 'a'.repeat(64) }, /script-digest-mismatch/);
  bad({ approved_outputs: [] }, /approved_outputs must list/);
  bad({ approved_outputs: [{ path: '../escape.md', max_bytes: 10, preimage_digest: null }] }, /clean relative path/);
  bad({ approved_outputs: [{ path: '/etc/passwd', max_bytes: 10, preimage_digest: null }] }, /approved output path is invalid/);
  bad({ approved_outputs: [{ path: '.rig/allowed-signers', max_bytes: 10, preimage_digest: null }] }, /reserved/);
  bad({ approved_outputs: [{ path: '.git/hooks/pre-commit', max_bytes: 10, preimage_digest: null }] }, /reserved/);
  bad({ approved_outputs: [{ path: '.env.local', max_bytes: 10, preimage_digest: null }] }, /reserved/);
  bad({ approved_outputs: [{ path: 'a.md', max_bytes: 10 * 1024 * 1024, preimage_digest: null }] }, /max_bytes/);
  bad({ approved_outputs: [{ path: 'a.md', max_bytes: 10, preimage_digest: 'nope' }] }, /SHA-256/);
  bad({ approved_outputs: [{ path: 'A.md', max_bytes: 10, preimage_digest: null }, { path: 'a.md', max_bytes: 10, preimage_digest: null }] }, /listed twice/);
  bad({ approved_outputs: [{ path: 'a.md', max_bytes: 10, preimage_digest: null, extra: 1 }] }, /unknown key/);
  bad({ limits: { timeout_ms: 1 } }, /timeout_ms/);
  bad({ surprise: true }, /unknown key/);
});

test('a host with no projector gets a proposal with an agent-script slot, recorded with its digest', async () => {
  await h.withRepo((target) => {
    const proposed = propose(target, slotFor());
    assert.equal(proposed.phase, 'proposed');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.proposal.projection_script.host, 'zed');
    assert.equal(state.proposal.projection_script.script_digest, sha(GOOD));
    assert.equal(fs.existsSync(path.join(target, '.zed')), false, 'proposing writes nothing');
    const changed = propose(target, slotFor({ source: `${GOOD}\n// tweaked` }));
    assert.notEqual(changed.proposal_digest, proposed.proposal_digest, 'approval is bound to the script bytes');
  }, { install: true });
});

test('proposals without a script keep their v5 body: no projection_script key', async () => {
  await h.withRepo((target) => {
    h.prepareAndPropose(target);
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(Object.hasOwn(state.proposal, 'projection_script'), false);
  }, { install: true });
});

// ----------------------------------------------------------------- refusal

test('apply without a valid approval never executes the script', async () => {
  await h.withRepo((target) => {
    const proposed = propose(target, slotFor({
      source: `require('node:fs').writeFileSync(${JSON.stringify(path.join(os.tmpdir(), 'rig-ran-unapproved'))}, 'ran');`,
      approved_outputs: [{ path: 'x.md', max_bytes: 10, preimage_digest: null }],
    }));
    fs.rmSync(path.join(os.tmpdir(), 'rig-ran-unapproved'), { force: true });
    assert.throws(() => apply(target, proposed, h.approval(proposed.proposal_digest)), /approval|verifier/i);
    assert.equal(fs.existsSync(path.join(os.tmpdir(), 'rig-ran-unapproved')), false);
  }, { install: true });
});

test('with no verified sandbox, apply refuses before executing anything and names the reason', async () => {
  await h.withRepo((target) => {
    const marker = path.join(os.tmpdir(), `rig-sandbox-refusal-${process.pid}`);
    fs.rmSync(marker, { force: true });
    const proposed = propose(target, slotFor({
      source: `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');`,
      approved_outputs: [{ path: 'x.md', max_bytes: 10, preimage_digest: null }],
    }));
    const before = snapshot(target);
    withDisabledSandbox(() => {
      assert.throws(() => apply(target, proposed), /projection script refused \(sandbox-unavailable\): sandbox-disabled/);
    });
    assert.equal(fs.existsSync(marker), false, 'the script never ran');
    assert.deepEqual(snapshot(target), before, 'the repository is untouched');
    assert.equal(h.readJson(path.join(target, '.rig/state.json')).phase, 'proposed');
  }, { install: true });
});

test('every platform without an enforcing mechanism is a named refusal', () => {
  const { detectSandboxSync: detect } = require('../rig/lib/sandbox');
  const refused = detect({ platform: 'win32', env: {} });
  assert.equal(refused.available, false);
  assert.equal(refused.code, 'sandbox-unsupported-platform');
  assert.match(refused.reason, /win32/);
});

// ---------------------------------------------------- real execution paths

test('an approved script applies its approved artifacts through the journal and passes check', { skip: real }, async () => {
  await h.withRepo((target) => {
    const proposed = propose(target, slotFor());
    const applied = apply(target, proposed);
    assert.equal(applied.phase, 'applied');
    const output = fs.readFileSync(path.join(target, '.zed/rig-rules.md'), 'utf8');
    assert.match(output, /^# Rig for Zed\n/);
    assert.match(output, /Rig Router/, 'the script read the installed corpus');
    assert.equal(fs.readFileSync(path.join(target, '.rig/projections/zed.js'), 'utf8'), GOOD, 'the approved script is kept for review and re-use');
    const state = h.readJson(path.join(target, '.rig/state.json'));
    assert.equal(state.applied.projection_script.script_digest, sha(GOOD));
    assert.deepEqual(state.applied.projection_script.outputs.map((row) => row.path), ['.zed/rig-rules.md']);
    const journal = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const record = journal.filter((row) => row.path === '.zed/rig-rules.md' && row.state === 'applied').at(-1);
    assert.equal(record.operation, 'create_owned');
    assert.equal(record.digest, sha(output));
    const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
    assert.deepEqual(checked.hard_failures, []);
    assert.equal(checked.phase, 'checked');
    // A later edit to an applied artifact is a hard failure, not silence.
    fs.appendFileSync(path.join(target, '.zed/rig-rules.md'), 'tampered\n');
    const failed = h.handle({ schema_version: 1, action: 'check', target, expected_revision: checked.revision });
    assert.equal(failed.hard_failures.some((f) => f.path === '.zed/rig-rules.md'), true);
  }, { install: true });
});

test('an adversarial script cannot write outside the output directory, read secrets, spawn out, or reach the network', { skip: real }, async () => {
  const canary = path.join(os.homedir(), `.rig-sandbox-canary-${process.pid}`);
  const evilTmp = path.join(os.tmpdir(), `rig-evil-${process.pid}.txt`);
  fs.writeFileSync(canary, 'top secret');
  let connections = 0;
  const server = net.createServer((socket) => { connections += 1; socket.destroy(); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    await h.withRepo(async (target) => {
      const evilRepo = path.join(target, 'EVIL.txt');
      const source = `
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const result = {};
const attempt = (name, fn) => { try { fn(); result[name] = 'ALLOWED'; } catch (error) { result[name] = 'denied:' + error.code; } };
attempt('write-repo', () => fs.writeFileSync(${JSON.stringify(evilRepo)}, 'x'));
attempt('edit-repo', () => fs.appendFileSync(path.join(process.env.RIG_REPO_DIR, 'README.md'), 'x'));
attempt('write-tmp', () => fs.writeFileSync(${JSON.stringify(evilTmp)}, 'x'));
attempt('write-state', () => fs.writeFileSync(path.join(process.env.RIG_REPO_DIR, '.rig/state.json'), '{}'));
attempt('read-secret', () => { result.secret = fs.readFileSync(${JSON.stringify(canary)}, 'utf8'); });
attempt('spawn', () => require('node:child_process').execSync('touch ' + ${JSON.stringify(evilTmp)}));
const finish = () => {
  fs.writeFileSync(path.join(process.env.RIG_OUT_DIR, 'report.json'), JSON.stringify(result, null, 2));
};
const socket = net.connect(${server.address().port}, '127.0.0.1');
socket.setTimeout(1500, () => { result.net = 'denied:timeout'; socket.destroy(); finish(); });
socket.on('connect', () => { result.net = 'ALLOWED'; socket.destroy(); finish(); });
socket.on('error', (error) => { result.net = 'denied:' + error.code; finish(); });
`;
      const proposed = propose(target, slotFor({
        source, approved_outputs: [{ path: 'report.json', max_bytes: 4096, preimage_digest: null }],
      }));
      const beforeFiles = snapshot(target);
      const applied = apply(target, proposed);
      assert.equal(applied.phase, 'applied');
      const report = JSON.parse(fs.readFileSync(path.join(target, 'report.json'), 'utf8'));
      assert.match(report['write-repo'], /^denied/);
      assert.match(report['edit-repo'], /^denied/);
      assert.match(report['write-tmp'], /^denied/);
      assert.match(report['write-state'], /^denied/);
      assert.match(report['read-secret'], /^denied/);
      assert.equal(report.secret, undefined, 'no secret reached the script');
      assert.match(report.spawn, /^denied/);
      assert.match(report.net, /^denied/);
      assert.equal(fs.existsSync(evilRepo), false);
      assert.equal(fs.existsSync(evilTmp), false);
      assert.deepEqual(snapshot(target).filter((line) => !line.startsWith('report.json')), beforeFiles);
      await new Promise((resolve) => setTimeout(resolve, 300));
      assert.equal(connections, 0, 'nothing connected to the loopback listener');
    }, { install: true });
  } finally {
    server.close();
    fs.rmSync(canary, { force: true });
    fs.rmSync(evilTmp, { force: true });
  }
});

const REFUSALS = [
  ['an unapproved extra file', 'artifact-unapproved-path',
    `const fs=require('node:fs'),p=require('node:path');fs.writeFileSync(p.join(process.env.RIG_OUT_DIR,'ok.md'),'x');fs.writeFileSync(p.join(process.env.RIG_OUT_DIR,'surprise.md'),'x');`],
  ['an unapproved path outside the approved list', 'artifact-unapproved-path',
    `const fs=require('node:fs'),p=require('node:path');fs.mkdirSync(p.join(process.env.RIG_OUT_DIR,'.cursor'));fs.writeFileSync(p.join(process.env.RIG_OUT_DIR,'.cursor/other.md'),'x');fs.writeFileSync(p.join(process.env.RIG_OUT_DIR,'ok.md'),'x');`],
  ['a symlink escaping the output directory', 'artifact-not-regular',
    `const fs=require('node:fs'),p=require('node:path');fs.symlinkSync('/etc/hosts',p.join(process.env.RIG_OUT_DIR,'ok.md'));`],
  ['a symlinked directory', 'artifact-not-regular',
    `const fs=require('node:fs'),p=require('node:path');fs.symlinkSync(process.env.RIG_REPO_DIR,p.join(process.env.RIG_OUT_DIR,'ok.md'));`],
  ['an oversize artifact', 'artifact-too-large',
    `require('node:fs').writeFileSync(require('node:path').join(process.env.RIG_OUT_DIR,'ok.md'),'x'.repeat(5000));`],
  ['a missing approved artifact', 'artifact-missing', `/* produces nothing */`],
  ['a script that fails', 'script-failed', `process.exit(3);`],
  ['a script that never finishes', 'script-timeout', `while (true) {}`],
];

for (const [label, code, source] of REFUSALS) {
  test(`${label} refuses the whole apply (${code}) and leaves the repository untouched`, { skip: real }, async () => {
    await h.withRepo((target) => {
      const proposed = propose(target, slotFor({
        source,
        approved_outputs: [{ path: 'ok.md', max_bytes: 100, preimage_digest: null }],
        limits: { timeout_ms: 700 },
      }));
      const before = snapshot(target);
      assert.throws(() => apply(target, proposed), new RegExp(`projection script refused \\(${code}\\)`));
      assert.deepEqual(snapshot(target), before);
      assert.equal(h.readJson(path.join(target, '.rig/state.json')).phase, 'proposed');
    }, { install: true });
  });
}

test('an approved content digest rejects output that differs from what was approved', { skip: real }, async () => {
  await h.withRepo((target) => {
    const proposed = propose(target, slotFor({
      approved_outputs: [{ path: '.zed/rig-rules.md', max_bytes: 4096, preimage_digest: null, content_digest: sha('something else') }],
    }));
    assert.throws(() => apply(target, proposed), /artifact-digest-mismatch/);
    assert.equal(fs.existsSync(path.join(target, '.zed')), false);
  }, { install: true });
});

test('a pre-existing target file that changed since approval is a stale preimage, not an overwrite', { skip: real }, async () => {
  await h.withRepo((target) => {
    fs.mkdirSync(path.join(target, '.zed'));
    fs.writeFileSync(path.join(target, '.zed/rig-rules.md'), 'user wrote this\n');
    const proposed = propose(target, slotFor());
    assert.throws(() => apply(target, proposed), /stale preimage/);
    assert.equal(fs.readFileSync(path.join(target, '.zed/rig-rules.md'), 'utf8'), 'user wrote this\n');
  }, { install: true });
});

test('substituting the approved script bytes fails before anything runs', { skip: real }, async () => {
  await h.withRepo((target) => {
    const proposed = propose(target, slotFor());
    const receipt = signApproval(target, proposed.proposal_digest);
    const stateFile = path.join(target, '.rig/state.json');
    const state = h.readJson(stateFile);
    state.proposal.projection_script.source = `${GOOD}\nrequire('node:fs').writeFileSync('/tmp/rig-substituted','x');`;
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    assert.throws(() => apply(target, proposed, receipt), /tampered|digest/);
    // Even a forger who recomputes the stored proposal digest cannot reuse the
    // signature, which is bound to the approved digest.
    const { proposalBodyDigest } = require('../rig/lib/onboarding-state');
    state.proposal.digest = proposalBodyDigest(state.proposal);
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    assert.throws(() => apply(target, proposed, receipt), /not bound to the current proposal digest/);
    assert.equal(fs.existsSync(path.join(target, '.zed')), false);
  }, { install: true });
});

test('a slot that targets Rig-owned or git paths is rejected at propose time', async () => {
  await h.withRepo((target) => {
    assert.throws(() => propose(target, slotFor({
      approved_outputs: [{ path: '.rig/allowed-signers', max_bytes: 100, preimage_digest: null }],
    })), /reserved/);
  }, { install: true });
});

// ----------------------------------------------------------- instructions

test('the agent instructions ship in the corpus, install with it, and name every refusal', async () => {
  const root = path.join(__dirname, '..');
  const readme = fs.readFileSync(path.join(root, 'rig/corpus/onboarding/README.md'), 'utf8');
  const unpack = fs.readFileSync(path.join(root, 'rig/corpus/onboarding/unpack.md'), 'utf8');
  for (const step of ['Inspect', 'Select', 'Project', 'Graft', 'Propose, approve, apply, check']) {
    assert.match(readme, new RegExp(`^## \\d\\. ${step}`, 'm'), `README step ${step}`);
  }
  for (const action of ['prepare', 'propose', 'apply', 'check']) assert.match(readme, new RegExp(`\\b${action}\\b`), `README names ${action}`);
  const source = fs.readFileSync(path.join(root, 'rig/lib/projection-script.js'), 'utf8')
    + fs.readFileSync(path.join(root, 'rig/lib/sandbox.js'), 'utf8');
  const codes = new Set([...source.matchAll(/(?:refuse|unavailable)\('([a-z-]+)'/g)].map((match) => match[1]));
  codes.delete('slot-invalid');
  codes.delete('artifact-escapes-output');
  for (const code of codes) assert.match(unpack, new RegExp(code), `unpack.md names ${code}`);
  await h.withRepo((target) => {
    for (const file of ['README.md', 'unpack.md']) {
      assert.equal(fs.readFileSync(path.join(target, '.rig/onboarding', file), 'utf8'), fs.readFileSync(path.join(root, 'rig/corpus/onboarding', file), 'utf8'));
    }
  }, { install: true });
});

test('an interrupted apply is journaled and a retry resumes it without overwriting anything else', { skip: real }, async () => {
  await h.withRepo((target) => {
    const source = `
const fs = require('node:fs'), path = require('node:path');
fs.mkdirSync(path.join(process.env.RIG_OUT_DIR, 'blocked'), { recursive: true });
fs.writeFileSync(path.join(process.env.RIG_OUT_DIR, 'a.md'), 'first\\n');
fs.writeFileSync(path.join(process.env.RIG_OUT_DIR, 'blocked/b.md'), 'second\\n');
`;
    const proposed = propose(target, slotFor({
      source,
      approved_outputs: [
        { path: 'a.md', max_bytes: 100, preimage_digest: null },
        { path: 'blocked/b.md', max_bytes: 100, preimage_digest: null },
      ],
    }));
    fs.writeFileSync(path.join(target, 'blocked'), 'a file where a directory is needed\n');
    assert.throws(() => apply(target, proposed), /ENOTDIR|EEXIST|not a directory/i);
    assert.equal(h.readJson(path.join(target, '.rig/state.json')).phase, 'proposed', 'state does not advance on a failed apply');
    const journal = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
    assert.equal(journal.filter((row) => row.kind === 'install_state').at(-1).complete, false, 'the open transaction is the resume evidence');
    fs.rmSync(path.join(target, 'blocked'));
    const applied = apply(target, proposed);
    assert.equal(applied.phase, 'applied');
    assert.equal(fs.readFileSync(path.join(target, 'a.md'), 'utf8'), 'first\n');
    assert.equal(fs.readFileSync(path.join(target, 'blocked/b.md'), 'utf8'), 'second\n');
    const checked = h.handle({ schema_version: 1, action: 'check', target, expected_revision: applied.revision });
    assert.deepEqual(checked.hard_failures, []);
  }, { install: true });
});

// ---------------------------------------- case/alias bypass of the reserved guard

test('reserved paths are matched case-insensitively and trailing dot/space aliases are rejected', () => {
  const reject = (rel, pattern = /reserved|clean relative path|dot or space/) => assert.throws(
    () => validateScriptSlot(slotFor({ approved_outputs: [{ path: rel, max_bytes: 10, preimage_digest: null }] })), pattern, rel);
  for (const rel of ['.GIT/config', '.Git/hooks/pre-commit', '.Rig/x', '.RIG/allowed-signers', '.ENV', '.Env.local', 'Node_Modules/x', 'sub/NODE_MODULES/x',
    'sub/.ENV', '.git./config', '.git /config', '.rig./x', 'ok./x', 'a/b /c', 'trail.', 'trail ']) {
    reject(rel);
  }
  validateScriptSlot(slotFor({ approved_outputs: [{ path: '.zed/rig-rules.md', max_bytes: 10, preimage_digest: null }] }));
  validateScriptSlot(slotFor({ approved_outputs: [{ path: '.github/rig.md', max_bytes: 10, preimage_digest: null }] }));
});

test('apply refuses an output whose parent resolves into .rig or .git even through an alias or symlink', async () => {
  const { assertOutputOutsideProtected } = require('../rig/lib/projection-script');
  await h.withRepo((target) => {
    fs.mkdirSync(path.join(target, '.git/hooks'), { recursive: true });
    fs.symlinkSync(path.join(target, '.git'), path.join(target, 'alias'));
    fs.symlinkSync(path.join(target, '.rig'), path.join(target, 'rigalias'));
    for (const rel of ['alias/hooks/pre-commit', 'rigalias/allowed-signers', '.GIT/hooks/pre-commit', '.RIG/state.json', 'alias/new/dir/file']) {
      assert.throws(() => assertOutputOutsideProtected(target, rel), /protected|escapes/i, rel);
    }
    assert.doesNotThrow(() => assertOutputOutsideProtected(target, '.zed/rig-rules.md'));
    assert.doesNotThrow(() => assertOutputOutsideProtected(target, 'docs/new/file.md'));
  }, { install: true });
});

test('a symlinked approved parent into .git is refused at apply before any write', { skip: real }, async () => {
  await h.withRepo((target) => {
    fs.symlinkSync(path.join(target, '.git'), path.join(target, 'alias'));
    const proposed = propose(target, slotFor({
      source: `require('node:fs').mkdirSync(require('node:path').join(process.env.RIG_OUT_DIR, 'alias'));require('node:fs').writeFileSync(require('node:path').join(process.env.RIG_OUT_DIR, 'alias/hooks-x'), 'x');`,
      approved_outputs: [{ path: 'alias/hooks-x', max_bytes: 10, preimage_digest: null }],
    }));
    assert.throws(() => apply(target, proposed), /protected|escapes/i);
    assert.equal(fs.existsSync(path.join(target, '.git/hooks-x')), false);
  }, { install: true });
});
