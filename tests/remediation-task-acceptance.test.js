'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const h = require('./helpers/advanced');
const lint = require('../rig/lib/lint-format');
const { approved, sign } = require('./helpers/task-approval');
const { runBinding } = require('../rig/lib/check-runner');

test('execution routes refuse unsigned tasks and run a signed exact plan only once', () => h.withRepo((target) => {
  const command = { argv: [process.execPath, '-e', "process.stdout.write('observed')"], cwd: '.', network: false };
  assert.equal(lint.runReadOnly(target, [command]).status, 'not_authorized');
  assert.equal(lint.runGrade({ target, grade: 'minimal', changed: [], commands: [command] }).status, 'not_authorized');
  const auth = approved(target, [command]);
  assert.equal(lint.runReadOnly(target, [command], auth).status, 'clean');
  assert.equal(lint.runReadOnly(target, [command], { ...auth, approval: { ...auth.approval } }).status, 'not_authorized');
}));

test('signed plan rejects changed executable script and configuration before launch', () => h.withRepo((target) => {
  fs.writeFileSync(path.join(target, 'check.js'), "process.stdout.write('original')");
  fs.writeFileSync(path.join(target, 'rules.json'), '{"rule":true}');
  const commands = [{ argv: [process.execPath, 'check.js'], cwd: '.' }];
  const auth = approved(target, commands);
  fs.writeFileSync(path.join(target, 'check.js'), "require('fs').writeFileSync('launched','bad')");
  const result = lint.executePlan(auth.plan, auth.approval);
  assert.equal(result.status, 'command_drift');
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
}));

test('coverage rejects digest forgery, journals signed writes durably and preserves user bytes on removal', () => h.withRepo((target) => {
  const plan = { covered: ['root'], excluded: [{ component: 'legacy', reason: 'no binding' }], writes: [{ path: '.rig/lint-coverage.json', content: '{}\n' }] };
  assert.throws(() => lint.applyCoverage(target, plan, { digest: require('node:crypto').createHash('sha256').update(JSON.stringify(plan)).digest('hex'), exclusions: ['legacy'] }), /approval|signature/);
  const challenge = lint.createCoverageApprovalChallenge(target, plan);
  const signed = sign(target, { plan_digest: challenge.plan_digest }, 'rig-coverage-approval', challenge.message);
  const result = lint.applyCoverage(target, plan, { ...signed, kind: 'coverage-approval' });
  assert.equal(result.manifest_records.some((row) => row.path === '.rig/lint-coverage.json' && row.state === 'applied'), true);
  assert.match(fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8'), /lint-coverage/);
}));

test('malformed mixed bindings fail before any real command and bare read-only checks stop after mutation', () => h.withRepo((target) => {
  const bad = runBinding('fixture.check', { checks: { first: { repo: [process.execPath, '-e', "require('fs').writeFileSync('launched','bad')"] }, last: null } }, 'repo', target);
  assert.equal(bad.kind, 'coverage_gap');
  assert.equal(fs.existsSync(path.join(target, 'launched')), false);
  fs.writeFileSync(path.join(target, 'source'), 'before');
  const result = runBinding('fixture.check', { checks: { first: { read_only: true, repo: [process.execPath, '-e', "require('fs').writeFileSync('source','after')"] }, next: { repo: [process.execPath, '-e', "require('fs').writeFileSync('next','bad')"] } } }, 'repo', target);
  assert.equal(result.kind, 'mutated');
  assert.equal(fs.existsSync(path.join(target, 'next')), false);
  assert.ok(result.changes.some((row) => row.path === 'source' && row.before && row.after));
}));
