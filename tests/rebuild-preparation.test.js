'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { checkContract } = require('../scripts/rebuild/check-contract');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-rebuild-contract-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), content);
  };
  write('wiki/gate1/rebuild/requirements.md', '| Requirement | Source | Obligation | Criterion | Proving test |\n| RB-FIT-1 | design 8 | Reject overlap | AC-RB-FIT-1 | RB-FIT-1 |\n');
  write('wiki/gate1/rebuild/acceptance.md', '| Criterion | Requirement | Outcome |\n| AC-RB-FIT-1 | RB-FIT-1 | Duplicate triggers fail |\n');
  write('wiki/gate1/rebuild/test-manifest.json', JSON.stringify([{ id: 'RB-FIT-1', criterion: 'AC-RB-FIT-1', file: 'tests/rebuild/fit.test.js', title: 'RB-FIT-1 duplicate triggers fail', lane: 'unit' }]));
  write('tests/rebuild/fit.test.js', "test('RB-FIT-1 duplicate triggers fail', () => { assert.equal(checkOverlap(['same', 'same']), false); });\n");
  write('tests/rebuild/_harness.js', "'use strict';\n");
  function manifest() {
    const files = ['wiki/gate1/rebuild/requirements.md', 'wiki/gate1/rebuild/acceptance.md', 'wiki/gate1/rebuild/test-manifest.json', 'tests/rebuild/_harness.js', 'tests/rebuild/fit.test.js'];
    write('wiki/gate1/rebuild/contract.manifest', files.sort().map(file => `${createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')}  ${file}\n`).join(''));
  }
  manifest();
  return { root, write, manifest };
}

test('rebuild contract validates a complete graph without claiming approval', t => {
  const { root } = fixture(t);
  const result = checkContract(root);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.counts, { requirements: 1, criteria: 1, tests: 1 });
  assert.equal(result.approved, false);
  assert.match(result.digest, /^[a-f0-9]{64}$/);
  assert.match(checkContract(root, { approval: true }).errors.join('\n'), /owner approval/);
});

test('rebuild contract rejects orphans, duplicate mappings and changed protected bytes', t => {
  const { root, write, manifest } = fixture(t);
  write('tests/rebuild/fit.test.js', "test('RB-FIT-1 duplicate triggers fail', () => {});\ntest('RB-FIT-2 orphan', () => {});\n");
  let errors = checkContract(root).errors.join('\n');
  assert.match(errors, /orphan.*RB-FIT-2/);
  assert.match(errors, /changed protected file/);
  write('wiki/gate1/rebuild/acceptance.md', '| AC-RB-FIT-1 | RB-FIT-1 | Outcome |\n| AC-RB-FIT-1 | RB-FIT-1 | Duplicate |\n');
  manifest();
  assert.match(checkContract(root).errors.join('\n'), /duplicate criterion/);
});

test('rebuild contract refuses empty graphs, path escapes and incomplete hash sets', t => {
  const { root, write } = fixture(t);
  write('wiki/gate1/rebuild/test-manifest.json', JSON.stringify([{ id: 'RB-FIT-1', criterion: 'AC-RB-FIT-1', file: '../../escape.test.js', title: 'RB-FIT-1 duplicate triggers fail', lane: 'unit' }]));
  assert.match(checkContract(root).errors.join('\n'), /invalid proving-test path/);
  write('wiki/gate1/rebuild/contract.manifest', 'a'.repeat(64) + '  ../../escape\n');
  assert.match(checkContract(root).errors.join('\n'), /unexpected protected file/);
  write('wiki/gate1/rebuild/requirements.md', '# Empty\n');
  assert.match(checkContract(root).errors.join('\n'), /no requirements/);
});

test('rebuild approval must name the current manifest digest and actual owner words', t => {
  const { root, write } = fixture(t);
  const trace = 'wiki/reasoning/2026-10-30-rebuild-contract-approval-owner.md';
  const digest = checkContract(root).digest;
  write(trace, `---\nsource: intent owner\n---\nOkay, I authorise this contract.\nSHA-256: ${'0'.repeat(64)}\n`);
  assert.match(checkContract(root, { approval: true }).errors.join('\n'), /owner approval/);
  write(trace, `---\nsource: intent owner\n---\nOkay, I authorise this contract.\nSHA-256: ${digest}\n`);
  assert.deepEqual(checkContract(root, { approval: true }).errors, []);
  write(trace, `---\nsource: agent\n---\nI authorise this ${digest}\n`);
  assert.match(checkContract(root, { approval: true }).errors.join('\n'), /owner approval/);
});

test('evaluation runner isolates the rebuild lane and rejects a path escape', t => {
  const { root, write } = fixture(t);
  write('scripts/run-ai-sdlc.js', fs.readFileSync(path.join(__dirname, '../scripts/run-ai-sdlc.js')));
  write('tests/rebuild/fit.test.js', "require('node:test')('RB-FIT-1 fixture passes', () => {});\n");
  const env = { ...process.env };
  delete env.GITHUB_STEP_SUMMARY;
  delete env.RIG_PUBLIC_ARCHIVE;
  delete env.NODE_TEST_CONTEXT;
  const run = lane => spawnSync(process.execPath, ['scripts/run-ai-sdlc.js', lane], { cwd: root, env, encoding: 'utf8' });
  const result = run('rebuild');
  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(fs.readFileSync(path.join(root, '.context/rebuild/result.json')));
  assert.equal(summary.counts.pass, 1);
  assert.equal(fs.existsSync(path.join(root, '.context/ai-sdlc')), false);
  assert.notEqual(run('../../escape').status, 0);
});

test('rebuild status entrypoint refuses approval of an unsigned pending draft', t => {
  const { root, write } = fixture(t);
  write('scripts/approve-gate1.js', fs.readFileSync(path.join(__dirname, '../scripts/approve-gate1.js')));
  // The existing signer imports repository modules; run the real entrypoint
  // from the fixture cwd instead of replacing any trust-related dependency.
  const result = spawnSync(process.execPath, [path.join(__dirname, '../scripts/approve-gate1.js'), 'status', '--programme', 'rebuild'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /owner approval.*pending/);
});
