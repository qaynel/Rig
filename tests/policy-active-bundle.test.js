'use strict';

// One evaluator, one source: every security decision reads the activated bundle
// through the shared status seam (policy.effectiveStatus), in either schema.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');
const policy = require('../rig/lib/policy');
const { evaluateAction } = require('../rig/lib/enforcement');
const { TRUST_ROOT_REL } = require('../rig/lib/trust-root');

const CATEGORIES = ['outbound_network', 'remote_content_execution', 'sensitive_environment_read', 'guardrail_bypass'];
const shipped = () => JSON.parse(fs.readFileSync(path.join(root, 'rig/catalog/baseline/network-policy.json'), 'utf8'));
const current = (over = {}) => ({
  schema_version: 1, enabled: true,
  controls: { 'sanitation.harness': true, 'drift.exact_copy': true, 'drift.semantic': true, 'secrets.deterministic': true, 'network.action_policy': true, ...(over.controls || {}) },
  enforcement: { 'host.shell': true, 'host.web': true, 'host.mcp': true, 'git.pre_commit': true, 'ci.repo': true, ...(over.enforcement || {}) },
  network: { enabled: true, categories: Object.fromEntries(CATEGORIES.map((key) => [key, 'deny'])), ...(over.network || {}) },
  allow: [], ...(over.top || {}),
});
const decide = (doc, surface, category) => evaluateAction(doc, { surface, category }).decision;

function withDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-active-bundle-'));
  try { return fn(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function owner(dir) {
  const key = path.join(dir, 'owner-key');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  const publicKey = fs.readFileSync(`${key}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2).join(' ');
  return {
    publicKey,
    sign(message) {
      const file = path.join(dir, 'msg');
      fs.writeFileSync(file, message);
      fs.rmSync(`${file}.sig`, { force: true });
      assert.equal(spawnSync('ssh-keygen', ['-q', '-Y', 'sign', '-f', key, '-n', 'rig-policy-activation', file]).status, 0);
      return fs.readFileSync(`${file}.sig`, 'utf8');
    },
  };
}

function repo(dir, fn) {
  const target = path.join(dir, 'repo');
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  const signer = owner(dir);
  fs.writeFileSync(path.join(target, TRUST_ROOT_REL), `gate1-owner ${signer.publicKey}\n`);
  const activate = (doc) => {
    const proposal = policy.proposePolicy(target, Buffer.from(`${JSON.stringify(doc, null, 2)}\n`), { explicit_request: true });
    return policy.activatePolicy(target, proposal, {
      approval: { schema_version: 1, kind: 'policy-approval', proposal_digest: proposal.digest, approval: { method: 'external-sshsig', identity: 'gate1-owner', signature: signer.sign(policy.activationMessage(proposal)) } },
    });
  };
  return fn(target, activate);
}

test('the shipped default and a valid current-schema document both deny all four protected categories on every surface', () => {
  for (const doc of [shipped(), current()]) {
    assert.doesNotThrow(() => policy.validatePolicy(doc));
    assert.equal(policy.effectiveStatus(doc).protected, true);
    for (const surface of ['shell', 'web', 'mcp']) for (const category of CATEGORIES) assert.equal(decide(doc, surface, category), 'deny', `${surface}/${category}`);
  }
});

test('switches at every level change the action result and the protection status together', () => {
  const cases = [
    ['global enabled=false', { ...shipped(), enabled: false }, { ...current(), enabled: false }],
    ['enforcement section off', { ...shipped(), enforcement: { enabled: false, shell: true, web: true, mcp: true } }, current({ enforcement: { enabled: false } })],
    ['network off', { ...shipped(), network: { ...shipped().network, enabled: false } }, current({ network: { enabled: false, categories: current().network.categories } })],
  ];
  for (const [name, legacy, modern] of cases) {
    for (const doc of [legacy, modern]) {
      assert.equal(policy.effectiveStatus(doc).protected, false, `${name}: status`);
      assert.equal(decide(doc, 'shell', 'outbound_network'), 'disabled', `${name}: action`);
    }
  }
  // Individual leaves: only their own surface or category is released.
  const noShell = shipped(); noShell.enforcement.shell = false;
  const noShellModern = current({ enforcement: { 'host.shell': false } });
  for (const doc of [noShell, noShellModern]) {
    assert.equal(policy.effectiveStatus(doc).protected, false);
    assert.equal(decide(doc, 'shell', 'outbound_network'), 'disabled');
    assert.equal(decide(doc, 'web', 'outbound_network'), 'deny');
    assert.equal(decide(doc, 'mcp', 'outbound_network'), 'deny');
  }
  const gate = current({ controls: { 'network.action_policy': false } });
  assert.equal(decide(gate, 'shell', 'guardrail_bypass'), 'disabled');
  // A missing leaf is not an enabled leaf.
  const missing = current(); delete missing.enforcement['host.web'];
  assert.equal(policy.effectiveStatus(missing).protected, false);
  assert.equal(decide(missing, 'web', 'outbound_network'), 'disabled');
});

test('a category set to allow permits only that category, and the allow list stays an explicit exception', () => {
  const doc = current({ network: { enabled: true, categories: { ...current().network.categories, sensitive_environment_read: 'allow' } } });
  assert.equal(decide(doc, 'shell', 'sensitive_environment_read'), 'allow');
  assert.equal(decide(doc, 'shell', 'outbound_network'), 'deny');
  assert.equal(decide({ ...shipped(), allow: ['outbound_network'] }, 'web', 'outbound_network'), 'allow');
  assert.equal(decide(shipped(), 'web', 'unlisted_category'), 'deny', 'default deny');
});

test('malformed and unknown policy input is rejected at the boundary with a named diagnostic', () => {
  const bad = (doc, pattern) => assert.throws(() => policy.validatePolicy(doc), pattern);
  bad({ ...shipped(), self_authorize: true }, /unknown field "self_authorize"/);
  bad({ ...shipped(), network: { enabled: true, categories: { made_up: 'deny' } } }, /known categories/);
  bad({ ...shipped(), network: { enabled: true, categories: { outbound_network: 'maybe' } } }, /deny or allow/);
  bad({ ...shipped(), network: { enabled: 'yes' } }, /network\.enabled must be boolean/);
  bad({ ...shipped(), network: [] }, /network must be an object/);
  bad(null, /object required/);
  assert.throws(() => policy.parsePolicyBytes('{"enabled":true,"enabled":false}'), /duplicate key/);
  assert.equal(evaluateAction(null, { surface: 'shell', category: 'outbound_network' }).reason, 'policy_invalid');
  assert.equal(evaluateAction(shipped(), { surface: 'telepathy', category: 'outbound_network' }).reason, 'unknown_surface');
});

test('activate A, edit the candidate to B: A stays authoritative until B is approved and activated', () => withDir((dir) => repo(dir, (target, activate) => {
  const A = current();
  const B = current({ network: { enabled: true, categories: { ...A.network.categories, outbound_network: 'allow' } } });
  assert.equal(policy.loadActivePolicy(target).source, 'shipped_default');
  activate(A);
  const candidate = path.join(target, '.rig/network-policy.json');
  fs.writeFileSync(candidate, JSON.stringify(B));
  const active = policy.loadActivePolicy(target);
  assert.equal(active.source, 'activated');
  assert.equal(decide(active.policy, 'shell', 'outbound_network'), 'deny', 'the unapproved candidate changed nothing');
  fs.writeFileSync(candidate, '{ corrupt');
  assert.equal(decide(policy.loadActivePolicy(target).policy, 'shell', 'outbound_network'), 'deny', 'a corrupt candidate is irrelevant');
  activate(B);
  assert.equal(decide(policy.loadActivePolicy(target).policy, 'shell', 'outbound_network'), 'allow', 'the approved revision takes effect');
})));

test('missing, corrupt, stale, or unsigned active evidence refuses with a named reason and never falls back', () => withDir((dir) => repo(dir, (target, activate) => {
  activate(current());
  const active = path.join(target, '.rig/policy/active.json');
  const receipt = path.join(target, '.rig/policy/activation-receipt.json');
  const good = { active: fs.readFileSync(active), receipt: fs.readFileSync(receipt) };
  const reset = () => { fs.writeFileSync(active, good.active); fs.writeFileSync(receipt, good.receipt); };
  const refused = (pattern) => assert.throws(() => policy.loadActivePolicy(target), pattern);

  fs.rmSync(active); refused(/policy_active_missing/); reset();
  fs.rmSync(receipt); refused(/policy_active_unreceipted/); reset();
  fs.writeFileSync(active, '{ corrupt'); refused(/policy_active_invalid/); reset();
  fs.writeFileSync(receipt, '{ corrupt'); refused(/policy_active_receipt_invalid/); reset();
  fs.writeFileSync(active, JSON.stringify({ ...current(), allow: ['outbound_network'] })); refused(/policy_active_stale/); reset();
  const forged = JSON.parse(good.receipt); forged.signer.method = 'host-native';
  fs.writeFileSync(receipt, JSON.stringify(forged)); refused(/policy_active_unverifiable/); reset();
  const resigned = JSON.parse(good.receipt); resigned.approval.signature = resigned.approval.signature.replace(/[A-Za-z0-9+/]{4}\n/, 'AAAA\n');
  fs.writeFileSync(receipt, JSON.stringify(resigned)); refused(/policy_active_unsigned/); reset();
  assert.equal(policy.loadActivePolicy(target).source, 'activated');
})));

test('the MCP renderer and validate-commit read only the active bundle and refuse when its evidence is bad', () => withDir((dir) => repo(dir, (target, activate) => {
  spawnSync('git', ['init', '-q'], { cwd: target });
  activate(current());
  fs.writeFileSync(path.join(target, '.rig/policy/active.json'), '{ corrupt');
  const refused = spawnSync(process.execPath, [path.join(root, 'rig/materialize.js'), 'validate-commit', '--target', target], { encoding: 'utf8' });
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /validate-commit refused: policy_active_invalid/);
  const { materialize, exampleServer } = require('./helpers/basic-install');
  materialize(target, { hosts: ['claude'], mcp_servers: [{ ...exampleServer, variants: [exampleServer.variants.find((v) => v.transport === 'http')] }] });
  const entry = JSON.parse(fs.readFileSync(path.join(target, '.rig/basic-receipt.json'), 'utf8')).networkPolicy[0];
  assert.deepEqual([entry.decision, entry.rule, entry.advisory], ['deny', 'policy_unavailable', true]);
  assert.match(entry.reason, /policy_active_invalid/);
})));

test('policy evaluate is the real entrypoint: deny by default, permit after an approved activation, refuse bad evidence', () => withDir((dir) => repo(dir, (target, activate) => {
  const cli = path.join(root, 'rig/materialize.js');
  const actionFile = path.join(dir, 'action.json');
  const evaluate = (category) => {
    fs.writeFileSync(actionFile, JSON.stringify({ surface: 'shell', category, target: 'https://example.invalid/' }));
    const out = spawnSync(process.execPath, [cli, 'policy', 'evaluate', '--target', target, '--action', actionFile], { encoding: 'utf8' });
    return { status: out.status, body: JSON.parse(out.stdout) };
  };
  assert.deepEqual([evaluate('outbound_network').status, evaluate('outbound_network').body.decision], [1, 'deny'], 'shipped default denies');
  const allowOutbound = current({ network: { enabled: true, categories: { ...current().network.categories, outbound_network: 'allow' } } });
  fs.writeFileSync(path.join(target, '.rig/network-policy.json'), JSON.stringify(allowOutbound));
  assert.equal(evaluate('outbound_network').status, 1, 'an unapproved candidate edit still denies');
  activate(allowOutbound);
  assert.deepEqual([evaluate('outbound_network').status, evaluate('outbound_network').body.decision], [0, 'allow'], 'the approved activation permits');
  assert.equal(evaluate('remote_content_execution').status, 1, 'other categories stay denied');
  fs.writeFileSync(path.join(target, '.rig/policy/active.json'), '{ corrupt');
  const bad = evaluate('outbound_network');
  assert.equal(bad.status, 1);
  assert.match(bad.body.reason, /policy_active_invalid/);
})));

test('policy status names which surfaces block and which are an available-but-not-integrated gap', () => withDir((dir) => repo(dir, (target) => {
  const { surfaces } = policy.policyStatus(target);
  assert.equal(surfaces.git_pre_commit.state, 'integrated');
  for (const surface of ['shell', 'web', 'mcp']) {
    assert.equal(surfaces[surface].state, 'available_not_integrated');
    assert.match(surfaces[surface].claim, /nothing is blocked automatically/);
    assert.match(surfaces[surface].setup, /policy evaluate/);
  }
})));

test('the integrated Git pre-commit surface blocks a staged secret and permits a clean commit through the real hook', () => withDir((dir) => {
  const target = path.join(dir, 'guarded');
  fs.mkdirSync(target);
  const git = (...args) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...args], { cwd: target, encoding: 'utf8' });
  git('init', '-q');
  require('../rig/lib/guard').installGuard(target);
  fs.writeFileSync(path.join(target, 'leak.txt'), `token=${['ghp_', 'a'.repeat(36)].join('')}\n`);
  git('add', 'leak.txt');
  const blocked = git('commit', '-m', 'leak');
  assert.notEqual(blocked.status, 0, blocked.stdout + blocked.stderr);
  git('reset', '-q');
  fs.writeFileSync(path.join(target, 'clean.txt'), 'nothing to see\n');
  git('add', 'clean.txt');
  const allowed = git('commit', '-m', 'clean');
  assert.equal(allowed.status, 0, allowed.stdout + allowed.stderr);
}));
