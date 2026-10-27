'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const baseline = path.resolve(__dirname, '../rig/catalog/baseline');
const release = require(`${baseline}/release-evidence`);
const learning = require(`${baseline}/learning`);
const signoff = require(`${baseline}/user-signoff`);
const workers = require(`${baseline}/workers`);
const review = require(`${baseline}/review-loop`);

function repo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-hardening-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function write(dir, rel, content) {
  const file = path.join(dir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

function reviewEvidence(dir, rel, result) {
  return {
    path: rel,
    digest: crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, rel))).digest('hex'),
    check: { command: 'node --test tests/rotate.test.js', result },
  };
}

function learningFixture(dir) {
  write(dir, 'app.js', 'module.exports = 1;\n');
  write(dir, '.rig/history.json', JSON.stringify({
    findings: [{ id: 'a', class: 'null', where: 'a.js' }, { id: 'b', class: 'null', where: 'b.js' }],
    cases: [{ id: 'bad', input: 'bad', fails_before: true }, { id: 'good', input: 'good', fails_before: false }],
  }));
}

function enrolledRoot(t, dir) {
  const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-key-'));
  t.after(() => fs.rmSync(keys, { recursive: true, force: true }));
  const key = path.join(keys, 'owner');
  assert.equal(spawnSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]).status, 0);
  fs.mkdirSync(path.join(dir, '.rig/trust'), { recursive: true });
  write(dir, '.rig/trust/gate1.allowed-signers', `owner ${fs.readFileSync(`${key}.pub`, 'utf8')}`);
  return key;
}

test('review remediation resolves only explicit evidence-backed dispositions and preserves each full batch', (t) => {
  const dir = repo(t);
  const file = write(dir, 'src/rotate.js', 'function rotate(days) { return days > 90; }\n');
  const firstFinding = { file: 'src/rotate.js', line: 1, problem: 'rotation threshold exceeds monthly policy' };
  const first = review.record(dir, { round: 1, verdict: 'fail', reviewer: 'reviewer-a', findings: [firstFinding] });
  const firstLedger = JSON.parse(fs.readFileSync(path.join(dir, '.rig/review/ledger.json'), 'utf8'));
  const findingClass = firstLedger.findings[0].class;
  assert.equal(first.unresolved.length, 1);

  write(dir, 'src/rotate.js', 'function rotate(days) { return days > 30; }\n');
  const prepared = review.prepare(dir, { round: 2, diff: ['src/rotate.js'] });
  assert.equal(prepared.phase, 'remediation');
  assert.equal(prepared.prior_batch.length, 1);
  assert.equal(prepared.prior_review_digest, firstLedger.rounds[0].candidate_digest);

  assert.throws(() => review.record(dir, {
    round: 2, verdict: 'pass', reviewer: 'reviewer-b', findings: [],
  }), /disposition every carried finding/);
  assert.throws(() => review.record(dir, {
    round: 2, verdict: 'pass', reviewer: 'reviewer-b', findings: [],
    dispositions: [{ class: findingClass, status: 'resolved', evidence: 'unstructured prose' }],
  }), /disposition evidence needs a repository path/);

  const passed = review.record(dir, {
    round: 2, verdict: 'pass', reviewer: 'reviewer-b', findings: [],
    dispositions: [{ class: findingClass, status: 'resolved', evidence: reviewEvidence(dir, 'src/rotate.js', 'pass') }],
  });
  assert.equal(passed.unresolved.length, 0);
  const ledger = JSON.parse(fs.readFileSync(path.join(dir, '.rig/review/ledger.json'), 'utf8'));
  assert.equal(ledger.rounds.length, 2);
  assert.equal(ledger.rounds[0].finding_batch.length, 1);
  assert.equal(ledger.rounds[1].dispositions[0].class, findingClass);
  assert.equal(ledger.findings[0].status, 'resolved');
});

test('review remediation requires evidence to retain findings and keeps serious new defects open', (t) => {
  const dir = repo(t);
  write(dir, 'src/rotate.js', 'function rotate(days) { return days > 90; }\n');
  const original = { file: 'src/rotate.js', line: 1, problem: 'rotation threshold exceeds monthly policy' };
  review.record(dir, { round: 1, verdict: 'fail', reviewer: 'reviewer-a', findings: [original] });
  const first = JSON.parse(fs.readFileSync(path.join(dir, '.rig/review/ledger.json'), 'utf8'));
  const existingClass = first.findings[0].class;
  write(dir, 'src/rotate.js', 'function rotate(days) { return days > 30; }\n');
  review.prepare(dir, { round: 2, diff: ['src/rotate.js'] });
  const newFinding = { file: 'src/rotate.js', line: 1, problem: 'rotation result is not persisted atomically' };

  assert.throws(() => review.record(dir, {
    round: 2, verdict: 'fail', reviewer: 'reviewer-b', findings: [original],
    dispositions: [{ class: existingClass, status: 'open', evidence: 'unstructured prose' }],
  }), /disposition evidence needs a repository path/);
  assert.throws(() => review.record(dir, {
    round: 2, verdict: 'fail', reviewer: 'reviewer-b', findings: [original],
    dispositions: [{ class: existingClass, status: 'resolved', evidence: reviewEvidence(dir, 'src/rotate.js', 'pass') }],
  }), /resolved finding .* cannot remain in the current findings batch/);
  const failed = review.record(dir, {
    round: 2, verdict: 'fail', reviewer: 'reviewer-b', findings: [newFinding],
    dispositions: [{ class: existingClass, status: 'resolved', evidence: reviewEvidence(dir, 'src/rotate.js', 'pass') }],
  });
  assert.equal(failed.unresolved.length, 1);
  assert.match(failed.unresolved[0].problem, /persisted atomically/);
  const ledger = JSON.parse(fs.readFileSync(path.join(dir, '.rig/review/ledger.json'), 'utf8'));
  assert.equal(ledger.findings.find((item) => item.class === existingClass).status, 'resolved');
  assert.equal(ledger.findings.filter((item) => item.status === 'open').length, 1);
});

test('review receipt rejects a candidate changed after its comprehensive preflight', (t) => {
  const dir = repo(t);
  write(dir, 'src/app.js', 'module.exports = 1;\n');
  review.prepare(dir, { round: 1, diff: ['src/app.js'] });
  write(dir, 'src/app.js', 'module.exports = 2;\n');
  assert.throws(() => review.record(dir, {
    round: 1, verdict: 'pass', reviewer: 'reviewer-a', findings: [],
  }), /candidate changed after review preflight/);
  assert.equal(review.attempts(dir), 0, 'a stale candidate did not consume a completed review attempt');

  review.prepare(dir, { round: 1, diff: ['src/app.js'] });
  assert.equal(review.record(dir, {
    round: 1, verdict: 'pass', reviewer: 'reviewer-a', findings: [],
  }).verdict, 'pass');
});

function signed(key, file, message, namespace) {
  fs.writeFileSync(file, message);
  assert.equal(spawnSync('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', namespace, file]).status, 0);
  const signature = fs.readFileSync(`${file}.sig`, 'utf8');
  fs.rmSync(`${file}.sig`);
  return signature;
}

test('learning refuses replay code outside candidate digest coverage', (t) => {
  const dir = repo(t);
  learningFixture(dir);
  write(dir, 'before.js', 'module.exports = () => false;\n');
  write(dir, 'node_modules/check.js', 'module.exports = () => true;\n');

  const evaluation = learning.evaluate(dir, 'cand-null', { before: 'before.js', check: 'node_modules/check.js' });
  assert.equal(evaluation.evidence_kind, 'gap');
  assert.equal(evaluation.admits_learning, false);
  assert.match(evaluation.gap, /covered by the candidate digest/);
  assert.equal(release.sourceFileCovered(dir, 'node_modules/check.js'), false);
});

test('learning rejects bytes substituted only during replay fixture copying', (t) => {
  const dir = repo(t);
  learningFixture(dir);
  write(dir, 'before.js', 'module.exports = () => false;\n');
  const checkFile = write(dir, 'check.js', 'module.exports = () => false;\n');
  const originalRead = fs.readFileSync;
  let substituted = false;
  fs.readFileSync = function (file, ...args) {
    if (path.resolve(String(file)) === fs.realpathSync(checkFile)) {
      const stack = new Error().stack;
      if (!substituted && stack.includes('learning.js:111:')) {
        substituted = true;
        return Buffer.from("module.exports = input => input === 'bad';\n");
      }
    }
    return originalRead.call(this, file, ...args);
  };
  let evaluation;
  try { evaluation = learning.evaluate(dir, 'cand-null', { before: 'before.js', check: 'check.js' }); }
  finally { fs.readFileSync = originalRead; }

  assert.equal(substituted, true, 'the substitution occurs on the exact copy read');
  assert.equal(evaluation.evidence_kind, 'gap');
  assert.equal(evaluation.admits_learning, false);
  assert.match(evaluation.gap, /fixture bytes changed after candidate snapshot/);
});

test('learning sandbox prevents replay fixtures from escaping the VM to mutable repository files', (t) => {
  const dir = repo(t);
  learningFixture(dir);
  write(dir, 'before.js', 'module.exports = () => false;\n');
  fs.mkdirSync(path.join(dir, '.context'), { recursive: true });
  write(dir, '.context/secret.json', '{"expected":true}\n');
  const marker = path.join(dir, '.context', 'outside.txt');
  write(dir, 'check.js', `module.exports = () => {
    const process = module.constructor.constructor('return process')();
    const fs = process.getBuiltinModule('node:fs');
    try { fs.writeFileSync(${JSON.stringify(marker)}, 'escaped'); } catch {}
    return JSON.parse(fs.readFileSync(${JSON.stringify(path.join(dir, '.context', 'secret.json'))}, 'utf8')).expected;
  };\n`);

  const evaluation = learning.evaluate(dir, 'cand-null', { before: 'before.js', check: 'check.js' });
  assert.equal(evaluation.evidence_kind, 'gap', 'the repository itself is not mounted into the replay sandbox');
  assert.equal(evaluation.admits_learning, false);
  assert.equal(fs.existsSync(marker), false, 'a VM escape cannot write into the candidate repository');
  assert.equal(release.sourceFileCovered(dir, 'before.js'), true);
});

test('a Gate 1 release signature binds the exact mutable evidence log', async (t) => {
  const dir = repo(t);
  write(dir, 'app.js', 'module.exports = 1;\n');
  const key = enrolledRoot(t, dir);
  const commit = release.record(dir, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'security', 'independent-review', 'scenario-coherence']) {
    release.record(dir, { kind, status: 'pass', commit, source: 'real-download' });
  }
  const authorization = { identity: 'owner', nonce: 'a'.repeat(32), expires_at: new Date(Date.now() + 60000).toISOString() };
  authorization.signature = signed(key, path.join(path.dirname(key), 'message'), release.authorizationMessage(dir, { commit, ...authorization }), 'rig-release');
  const evidenceFile = path.join(dir, '.rig/release/evidence.jsonl');
  fs.appendFileSync(evidenceFile, `${JSON.stringify({ kind: 'health', status: 'pass', commit, digest: commit })}\n`);

  const result = await release.publish(dir, { commit, authorization });
  assert.equal(result.published, false);
  assert.match(result.reason, /authorization|verify/i);
});

test('an unavailable platform mode has a Gate 1 signed path only to stronger cryptographic mode', (t) => {
  const dir = repo(t);
  assert.throws(() => signoff.select(dir, { confirm: true, mode: 'platform', release_integrity: 'self-attestation' }), /Gate 1 trust root/);
  const key = enrolledRoot(t, dir);
  const selection = { purpose: 'rig-signoff-select', mode: 'platform', release_integrity: 'self-attestation', key_protection: 'unspecified' };
  signoff.select(dir, {
    confirm: true, mode: 'platform', release_integrity: 'self-attestation',
    authorization: { identity: 'owner', signature: signed(key, path.join(dir, 'select'), signoff.approvalMessage(dir, selection), 'rig-signoff') },
  });
  const change = { purpose: 'rig-signoff-change', from: 'platform', to: 'cryptographic', release_integrity: 'signature', key_protection: 'unspecified' };
  const next = signoff.change(dir, {
    mode: 'cryptographic', authorization: { identity: 'owner', signature: signed(key, path.join(dir, 'change'), signoff.approvalMessage(dir, change), 'rig-signoff') },
  });
  assert.equal(next.mode, 'cryptographic');
  assert.throws(() => signoff.change(dir, { mode: 'acknowledgement', release_integrity: 'self-attestation' }), /refused/);
});

test('worker artifact bytes are part of the candidate digest used for acceptance', (t) => {
  const dir = repo(t);
  write(dir, 'package.json', JSON.stringify({ scripts: { test: 'node gate.js' } }));
  write(dir, 'gate.js', "require('node:assert/strict').equal(1+1,2);\n");
  write(dir, 'src/a.js', 'module.exports=1;\n');
  workers.publish(dir, { id: 'WP1', owns: ['src/a.js'], criteria: ['AC-1'], sources: ['src/a.js'] });
  const journal = require(`${baseline}/run-journal`);
  journal.recordGreen(dir, { package: 'WP1', command: 'node gate.js', gate: 'npm test' });
  const review = require(`${baseline}/review-loop`);
  review.prepare(dir, { round: 1, diff: 'gate.js' });
  review.record(dir, { round: 1, verdict: 'pass', reviewer: 'independent-reviewer' });
  const digest = release.sourceDigest(dir);
  const evidence = [{ source: 'reviewer', status: 'pass', package: 'WP1', candidate_digest: digest }];
  assert.equal(workers.accept(dir, { package: 'WP1', evidence }).accepted, true);
  assert.equal(release.sourceDigest(dir), digest, 'mutable accepted-state bookkeeping stays outside the candidate digest');

  write(dir, '.rig/workers/WP1/artifact.json', '{"tampered":true}\n');
  assert.equal(workers.accept(dir, { package: 'WP1', evidence }).accepted, false);
  assert.notEqual(release.sourceDigest(dir), digest);
});
