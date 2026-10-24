'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const journal = require('../rig/catalog/baseline/run-journal');
const preflight = require('../rig/catalog/baseline/preflight');
function fixture(t) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-phase-safety-'));
  t.after(() => fs.rmSync(repo, { recursive: true, force: true }));
  const write = (rel, value) => { const f = path.join(repo, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof value === 'string' ? value : JSON.stringify(value)); };
  return { repo, write };
}
test('phase entry refuses fake signatures and failed gate evidence without mutation', (t) => {
  const { repo, write } = fixture(t);
  write('.rig/run.json', { phase: 'designed' });
  for (const rel of ['.rig/design/digest.json', '.rig/packages.json', '.rig/oracle/signature']) write(rel, 'invalid');
  assert.equal(preflight.enter(repo, 'implementation').allowed, false);
  write('.rig/evidence/full-gate.json', { status: 'fail', exit_code: 1 });
  assert.equal(preflight.enter(repo, 'release_ready').allowed, false);
  assert.equal(JSON.parse(fs.readFileSync(path.join(repo, '.rig/run.json'))).phase, 'designed');
});
test('completion requires positive evidence for this phase and current candidate', (t) => {
  const { repo, write } = fixture(t);
  write('app.js', 'module.exports = 1;');
  for (const evidence of [{ status: 'fail', exit_code: 1 }, {}, { status: 'pass', phase: 'other', digest: 'old' }]) {
    write('.rig/evidence/full-gate.json', evidence);
    assert.equal(journal.complete(repo, { phase: 'verification' }).completed, false);
  }
});
test('an interrupted side effect is never repeated without reconciliation', (t) => {
  const { repo } = fixture(t);
  let effects = 0;
  assert.throws(() => journal.once(repo, 'publish', () => { effects++; throw new Error('interrupted after external effect'); }));
  assert.throws(() => journal.once(repo, 'publish', () => { effects++; return 'second'; }), /uncertain|reconcil/i);
  assert.equal(effects, 1);
});

test('verified oracle, current design and mapped packages permit implementation; changed source refuses', (t) => {
  const { repo, write } = fixture(t);
  const dir = '.rig/contract';
  write(`${dir}/15-gate1-contract.md`, '| R001 F01 | Obligation. | AC-001: result. | PT-001 F01 | J01 | — | P |\n');
  write(`${dir}/16-test-manifest.md`, '| F01 | setup | `tests/proof.test.js` |\n');
  write(`${dir}/17-customer-lifecycle.md`, '| J01 | scenario | R001 | E2E-J01: proof |\n');
  write(`${dir}/19-work-packages-and-public-roadmap.md`, '| **WP01 — one.** outcome. | R001 | owner | PT-001 |\n');
  write('tests/proof.test.js', '// proving test\n');
  const sha = (rel) => crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, rel))).digest('hex');
  const protectedFiles = [`${dir}/15-gate1-contract.md`, `${dir}/16-test-manifest.md`, `${dir}/17-customer-lifecycle.md`, 'tests/proof.test.js'];
  write(`${dir}/manifest.json`, { files: Object.fromEntries(protectedFiles.map((rel) => [rel, sha(rel)])) });
  write('.rig/design/spec.md', '# Technical design\n');
  write('.rig/design/digest.json', { files: { '.rig/design/spec.md': sha('.rig/design/spec.md') } });
  write('.rig/packages.json', { packages: [{ id: 'WP01', outcome: 'result', requirements: ['R001'], depends: [], owns: ['src/a.js'], exit: ['PT-001'] }] });
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-phase-test-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'key');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  write('.rig/trust/gate1.allowed-signers', `test-owner ${fs.readFileSync(key + '.pub', 'utf8')}`);
  const message = path.join(keys, 'message');
  fs.writeFileSync(message, `rig-ai-sdlc-freeze-v1\ncontract.manifest ${sha(`${dir}/manifest.json`)}\n`);
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-gate1', message]).status, 0);
  write('.rig/oracle/signature', fs.readFileSync(message + '.sig', 'utf8'));
  const result = preflight.enter(repo, 'implementation');
  assert.equal(result.allowed, true, JSON.stringify(result));
  write('tests/proof.test.js', '// changed protected test\n');
  assert.equal(preflight.enter(repo, 'implementation').allowed, false);
});

test('accepted dependency unlocks a mapped package only on unchanged candidate bytes', (t) => {
  const { repo, write } = fixture(t);
  write('packages.json', { packages: ['A', 'B'].map((id, i) => ({ id, outcome: id, requirements: ['R001'], owns: [`src/${id}.js`], depends: i ? ['A'] : [], exit: ['PT-001'] })) });
  write('package.json', { scripts: { test: 'node gate.js' } });
  write('gate.js', 'require("node:assert/strict").equal(2 + 2, 4);\n');
  journal.recordGreen(repo, { package: 'A', command: 'node gate.js', gate: 'npm test' });
  require('../rig/catalog/baseline/review-loop').record(repo, { round: 1, verdict: 'pass', reviewer: 'independent-agent' });
  const workers = require('../rig/catalog/baseline/workers');
  const audit = require('../rig/catalog/baseline/work-packages').audit;
  const digest = require('../rig/catalog/baseline/release-evidence').sourceDigest(repo);
  assert.equal(workers.accept(repo, { package: 'A', evidence: [{ source: 'reviewer', status: 'pass', package: 'A', candidate_digest: digest }] }).accepted, true);
  assert.deepEqual(audit(repo, { file: 'packages.json', approved: ['R001'] }).runnable, ['B']);
  write('src/new.js', 'changed');
  assert.equal(audit(repo, { file: 'packages.json', approved: ['R001'] }).runnable.includes('B'), false);
});

test('a caller-named success command cannot label itself the repository full gate', (t) => {
  const { repo, write } = fixture(t);
  write('package.json', { scripts: { test: 'node genuine-tests.js' } });
  write('genuine-tests.js', 'process.exit(1);');
  write('fake.js', 'process.exit(0);');
  assert.throws(() => journal.recordGreen(repo, { package: 'A', command: 'node fake.js', gate: 'node fake.js' }), /full gate|signed/i);
  assert.equal(journal.verify(repo, 'A').current, false);
  assert.throws(() => journal.recordGreen(repo, { package: 'A', command: 'full gate' }), /reserved|full gate/i);
});

test('journal rejects package traversal before executing any command', (t) => {
  const { repo } = fixture(t);
  assert.throws(() => journal.recordRed(repo, { package: '../../../outside', command: 'node -e "process.exit(1)"' }), /package|path|invalid/i);
});

test('work plan refuses path traversal and ancestor ownership conflicts', (t) => {
  const { repo, write } = fixture(t);
  write('packages.json', { packages: [
    { id: 'A', outcome: 'a', requirements: ['R001'], owns: ['src/tree'], depends: [], exit: ['PT-001'] },
    { id: 'B', outcome: 'b', requirements: ['R001'], owns: ['src/tree/child.js'], depends: [], exit: ['PT-001'] },
    { id: 'C', outcome: 'c', requirements: ['R001'], owns: ['../outside'], depends: [], exit: ['PT-001'] },
  ] });
  const result = require('../rig/catalog/baseline/work-packages').audit(repo, { file: 'packages.json', approved: ['R001'] });
  assert.ok(result.problems.some((p) => /outside|path/i.test(p)));
  assert.deepEqual(result.runnable, []);
});
