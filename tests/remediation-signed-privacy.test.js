'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const h = require('./helpers/advanced');

const root = path.join(__dirname, '..');
const checker = path.join(root, 'rig/catalog/baseline/check-copies.js');
const materializer = path.join(root, 'rig/materialize.js');
const marker = '/Users/private-owner/' + 'ghp_' + 'privacyFixture123456789012345/sample@example.test/source.txt';

function installBaseline(target) {
  for (const entry of require('../rig/lib/baseline-payload').entries) {
    const dest = path.join(target, entry.to);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, 'rig', entry.from), dest);
  }
}

function makeOutOfRootMap(target, copy = marker) {
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, 'canonical.txt'), 'same\n');
  fs.writeFileSync(path.join(target, '.rig/sync-map.json'), JSON.stringify({
    groups: [{ canonical: 'canonical.txt', copies: [copy] }],
  }));
}

function runChecker(target, env = {}) {
  return spawnSync(process.execPath, [path.join(target, '.rig/bin/check-copies.js')], {
    cwd: target, encoding: 'utf8', env: { ...process.env, CI: '', GITHUB_ACTIONS: '', ...env },
  });
}

test('installed exact-copy diagnostics keep useful failure kinds and redact user paths', () => h.withRepo(target => {
  installBaseline(target);
  makeOutOfRootMap(target);
  const escaped = runChecker(target);
  assert.equal(escaped.status, 1);
  assert.match(escaped.stderr, /out-of-root copy path/);
  assert.equal(escaped.stdout, '');
  assert.doesNotMatch(`${escaped.stdout}${escaped.stderr}`, /private-owner|privacyFixture|sample@example|source\.txt/);

  const outside = `${target}-outside-private-owner`;
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(target, 'escape-link'));
  fs.writeFileSync(path.join(target, '.rig/sync-map.json'), JSON.stringify({
    groups: [{ canonical: 'canonical.txt', copies: ['escape-link/' + 'ghp_' + 'privacyFixture123456789012345/sample@example.test/source.txt'] }],
  }));
  const linked = runChecker(target);
  assert.equal(linked.status, 1);
  assert.match(linked.stderr, /out-of-root copy path/);
  assert.doesNotMatch(`${linked.stdout}${linked.stderr}`, /private-owner|privacyFixture|sample@example|escape-link\/ghp_/);
  fs.rmSync(outside, { recursive: true, force: true });
}));

test('installed exact-copy malformed-map exceptions have a fixed diagnostic without a stack or input bytes', () => h.withRepo(target => {
  installBaseline(target);
  fs.mkdirSync(path.join(target, '.rig'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/sync-map.json'), `not-json ${marker}`);
  const result = runChecker(target);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'exact-copy check failed\n');
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /private-owner|privacyFixture|sample@example|source\.txt|SyntaxError|check-copies\.js/);
}));

test('installed exact-copy CI failures publish one safe aggregate and no stderr detail', () => h.withRepo(target => {
  installBaseline(target);
  makeOutOfRootMap(target);
  for (const env of [{ CI: 'true' }, { GITHUB_ACTIONS: 'true' }]) {
    const result = runChecker(target, env);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, '');
    assert.deepEqual(JSON.parse(result.stdout), {
      verdict: 'fail', counts: { out_of_root_copy_path: 1 }, rules: ['out_of_root_copy_path'],
    });
    assert.doesNotMatch(`${result.stdout}${result.stderr}`, /private-owner|privacyFixture|sample@example|source\.txt/);
  }
}));

test('public check CLI and local report keep exact-copy path details private', () => h.withRepo(target => {
  installBaseline(target);
  makeOutOfRootMap(target);
  const result = spawnSync(process.execPath, [materializer, 'check', '--target', target, '--scope', 'repo'], {
    cwd: target, encoding: 'utf8', env: { ...process.env, CI: '', GITHUB_ACTIONS: '' },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /baseline failed:.*exact-copy/);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /private-owner|privacyFixture|sample@example|source\.txt/);
  const reports = fs.readdirSync(path.join(target, 'reports/rig')).map(name => fs.readFileSync(path.join(target, 'reports/rig', name), 'utf8'));
  assert.ok(reports.some(report => report.includes('baseline.exact-copy') && report.includes('exact_copy_failed')));
  assert.doesNotMatch(reports.join('\n'), /private-owner|privacyFixture|sample@example|source\.txt/);
}));

function signPolicy(target, proposal, keyFile, confirmedDisclosures = []) {
  const message = path.join(target, '.rig-test-policy-message');
  fs.writeFileSync(message, require('../rig/lib/policy').activationMessage(proposal));
  fs.rmSync(`${message}.sig`, { force: true });
  const signed = spawnSync('ssh-keygen', ['-q', '-Y', 'sign', '-f', keyFile, '-n', 'rig-policy-activation', message], { encoding: 'utf8' });
  assert.equal(signed.status, 0, signed.stderr);
  return {
    schema_version: 1,
    kind: 'policy-approval',
    proposal_digest: proposal.digest,
    approval: {
      method: 'external-sshsig',
      identity: 'fixture-owner',
      signature: fs.readFileSync(`${message}.sig`, 'utf8'),
    },
    confirmed_disclosures: confirmedDisclosures,
  };
}

test('only disclosure-confirmed signed active triage enables matched content, and signed disable redacts it again', () => h.withRepo(target => {
  const { activatePolicy, activationMessage, policyStatus, proposePolicy } = require('../rig/lib/policy');
  const { projectForAgent, TRIAGE_DISCLOSURE } = require('../rig/lib/reports');
  const matched = 'ghp_' + 'privacyTriageFixture123456789012345';
  const report = { findings: [{ rule: 'credential', path: '/Users/private-owner/source.txt', matched }] };
  const output = value => JSON.stringify(projectForAgent(value, { target }));
  assert.doesNotMatch(output(report), new RegExp(matched));
  assert.doesNotMatch(JSON.stringify(projectForAgent(report, { target, model_assisted_triage: true })), new RegExp(matched));

  const keyFile = path.join(target, '.rig-test-policy-key');
  const generated = spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-C', 'fixture-owner', '-f', keyFile], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const identityAndKey = fs.readFileSync(`${keyFile}.pub`, 'utf8').trim().split(/\s+/).slice(0, 2);
  fs.mkdirSync(path.join(target, '.rig/trust'), { recursive: true });
  fs.writeFileSync(path.join(target, '.rig/trust/gate1.allowed-signers'), `fixture-owner ${identityAndKey.join(' ')}\n`);

  const candidate = { schema_version: 1, controls: {}, enforcement: {}, allow: [], secrets: { model_assisted_triage: true } };
  const enabling = proposePolicy(target, candidate, { explicit_request: true });
  assert.equal(enabling.disclosures.length, 1);
  assert.equal(enabling.disclosures[0].text, TRIAGE_DISCLOSURE);
  const enableApproval = signPolicy(target, enabling, keyFile, [enabling.disclosures[0].digest]);
  assert.match(fs.readFileSync(`${path.join(target, '.rig-test-policy-message')}.sig`, 'utf8'), /BEGIN SSH SIGNATURE/);
  activatePolicy(target, enabling, { approval: enableApproval });
  assert.equal(policyStatus(target).model_assisted_triage.authorized, true);
  assert.match(output(report), new RegExp(matched));

  const disabling = proposePolicy(target, { ...candidate, secrets: { model_assisted_triage: false } }, { explicit_request: true });
  assert.equal(disabling.disclosures.length, 0);
  activatePolicy(target, disabling, { approval: signPolicy(target, disabling, keyFile) });
  assert.equal(policyStatus(target).model_assisted_triage.enabled, false);
  assert.equal(policyStatus(target).model_assisted_triage.authorized, false);
  assert.doesNotMatch(output(report), new RegExp(matched));
}));
