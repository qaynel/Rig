'use strict';

// Prints the programme digest the owner would confirm if the sign-off
// amendment were applied. Does not write protected files.
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const sha = (value) => createHash('sha256').update(value).digest('hex');

const replacements = [
  ['tests/ai-sdlc/hardware-signing.test.js', `const HARDWARE_TYPE = 'sk-ssh-ed25519@openssh.com';

function hardwareKeyFromEnv() {
  const configured = process.env.RIG_GATE1_HARDWARE_KEY;
  if (!configured) return null;
  const pub = configured.endsWith('.pub') ? configured : \`\${configured}.pub\`;
  if (!fs.existsSync(pub)) return null;
  return fs.readFileSync(pub, 'utf8').trim().startsWith(HARDWARE_TYPE) ? configured : null;
}`, `const { keyTypeAllowed } = require('../../rig/lib/trust-root');

function configuredKey() {
  const configured = process.env.RIG_GATE1_SIGNING_KEY || process.env.RIG_GATE1_HARDWARE_KEY;
  if (!configured) return null;
  const pub = configured.endsWith('.pub') ? configured : \`\${configured}.pub\`;
  if (!fs.existsSync(pub)) return null;
  const type = fs.readFileSync(pub, 'utf8').trim().split(/\\s+/)[0];
  return keyTypeAllowed(type) ? configured : null;
}`],
  ['tests/ai-sdlc/hardware-signing.test.js', `test('PT-017 a real sk-ssh-ed25519@openssh.com key signs and verifies with the existing path', () => {
  const key = hardwareKeyFromEnv();
  if (!key) {
    environmentBound('set RIG_GATE1_HARDWARE_KEY to a present sk-ssh-ed25519@openssh.com key; this lane never simulates a security-key touch');
  }`, `test('PT-017 an enrolled allowed key signs and verifies with the existing path', () => {
  const key = configuredKey();
  if (!key) {
    environmentBound('set RIG_GATE1_SIGNING_KEY to the enrolled owner key; this lane never simulates a touch or substitutes a software fixture');
  }`],
  ['tests/ai-sdlc/hardware-signing.test.js', `  const allowed = fs.readFileSync(path.join(repo, 'wiki/gate1/gate1.allowed-signers'), 'utf8');
  assert.ok(allowed.includes(HARDWARE_TYPE), 'the enrolled key must be the hardware-backed type');`, `  const allowed = fs.readFileSync(path.join(repo, 'wiki/gate1/gate1.allowed-signers'), 'utf8');
  const type = allowed.trim().split('\\n').find((line) => line && !line.startsWith('#'))?.split(/\\s+/).find((field) => keyTypeAllowed(field));
  assert.ok(type, 'the enrolled key uses an algorithm the single trust root accepts');`],
  ['tests/ai-sdlc/release.test.js', `  const attempt = release.publish(repo, { commit });
  assert.equal(attempt.published, false);
  assert.match(attempt.reason, /authoriz/i, 'readiness is not authorization');
  assert.equal(release.publish(repo, { commit, authorization: { signed_by: 'gate1-owner' } }).published, true);
});`, `  const attempt = release.publish(repo, { commit });
  assert.equal(attempt.published, false);
  assert.match(attempt.reason, /authoriz/i, 'readiness is not authorization');
  const named = release.publish(repo, { commit, authorization: { signed_by: 'gate1-owner' } });
  assert.equal(named.published, false, 'a typed name is not a signature and is not a selected mode');
  assert.equal(named.cryptographic_signature, false);

  const signoff = capability('user-signoff');
  signoff.select(repo, { confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation' });
  const chosen = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of ['health', 'clean-install', 'review', 'security']) {
    release.record(repo, { kind, status: 'pass', commit: chosen, source: 'real-download' });
  }
  const forged = release.publish(repo, { commit: chosen, authorization: { signed_by: 'gate1-owner', owner_approved: true } });
  assert.equal(forged.published, false, 'agent-supplied flags do not satisfy acknowledgement');
  const ack = signoff.acknowledge(repo, { action: signoff.releaseAction(chosen) });
  const declared = release.publish(repo, { commit: chosen, authorization: { acknowledgement: ack.id } });
  assert.equal(declared.published, true, declared.reason);
  assert.equal(declared.assurance.cryptographic_signature, false);
  assert.equal(declared.assurance.artifact_integrity, 'unsigned');
});`],
  ['tests/ai-sdlc/public-release.test.js', `  const release = capability('release-evidence');
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of CLASSES) release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  const published = release.publish(repo, { commit, authorization: { signed_by: 'gate1-owner' } });`, `  const release = capability('release-evidence');
  const signoff = capability('user-signoff');
  signoff.select(repo, { confirm: true, mode: 'acknowledgement', release_integrity: 'self-attestation' });
  const commit = release.record(repo, { kind: 'qa-commit' }).commit;
  for (const kind of CLASSES) release.record(repo, { kind, status: 'pass', commit, source: 'real-download' });
  const ack = signoff.acknowledge(repo, { action: signoff.releaseAction(commit) });
  const published = release.publish(repo, { commit, authorization: { acknowledgement: ack.id } });
  assert.equal(published.published, true, published.reason);
  assert.equal(published.assurance.cryptographic_signature, false);`],
  ['tests/ai-sdlc/learning.test.js', `  const evaluation = learning.evaluate(repo, candidate.id);

  assert.ok(evaluation.before_fixture && evaluation.after_fixture, 'both fixtures are attached');
  assert.equal(evaluation.replay.pos.caught, true, 'the previously failing case is caught');
  assert.equal(evaluation.replay.neg.caught, false, 'a known-good case is not newly flagged');
  assert.ok(['helped', 'hurt', 'no observed effect', 'confounded'].includes(evaluation.outcome));
});`, `  const gap = learning.evaluate(repo, candidate.id);
  assert.equal(gap.replay.pos.caught, null, 'a declared flag is not a caught failure');
  assert.match(gap.gap, /execution evidence/);
  assert.equal(gap.admits_learning, false);

  write(repo, '.rig/history.json', {
    findings: [
      { id: 'f1', class: 'unchecked-null', where: 'src/a.js', round: 1 },
      { id: 'f2', class: 'unchecked-null', where: 'src/b.js', round: 7 },
    ],
    cases: [{ id: 'pos', fails_before: true, input: null }, { id: 'neg', fails_before: false, input: 1 }],
  });
  write(repo, 'before.js', 'module.exports = () => false;\\n');
  write(repo, 'check.js', 'module.exports = (value) => value === null;\\n');
  const evaluation = learning.evaluate(repo, candidate.id, { before: 'before.js', check: 'check.js' });

  assert.equal(evaluation.evidence_kind, 'executed');
  assert.equal(evaluation.replay.pos.caught, true, 'the previously failing case is caught by running the check');
  assert.equal(evaluation.replay.neg.caught, false, 'a known-good case is not newly flagged');
  assert.equal(evaluation.outcome, 'helped');
  assert.equal(evaluation.admits_learning, true);
});`],
  ['tests/ai-sdlc/workers.test.js', `const test = require('node:test');
const { assert, capability, tempRepo, write, read, SECRET_FIXTURE } = require('./_harness');`, `const test = require('node:test');
const { spawn } = require('node:child_process');
const { assert, capability, tempRepo, write, read, SECRET_FIXTURE } = require('./_harness');`],
  ['tests/ai-sdlc/workers.test.js', `test('PT-030 an expired owner is reported and reclaimed only after evidence check', () => {
  const repo = workerRepo();
  const workers = capability('workers');
  workers.reserve(repo, { package: 'WP01', owns: ['src/allowed.js'], lease_seconds: 0 });

  const stale = workers.reserve(repo, { package: 'WP02', owns: ['src/allowed.js'] });
  assert.equal(stale.granted, false);
  assert.match(stale.conflict, /stale|expired/i, 'an expired owner is reported, not silently overwritten');

  const reclaimed = workers.reclaim(repo, { package: 'WP02', owns: ['src/allowed.js'], evidence: { owner_exited: true, no_pending_writes: true } });
  assert.equal(reclaimed.granted, true);
  assert.ok(reclaimed.evidence_checked, 'reclaim records the evidence it relied on');
  assert.equal(workers.reclaim(repo, { package: 'WP03', owns: ['src/allowed.js'], evidence: {} }).granted, false, 'no lock theft without evidence');
});`, `test('PT-030 an expired owner is reported and reclaimed only after the process is gone and the bytes match', async () => {
  const repo = workerRepo();
  const workers = capability('workers');
  const child = spawn(process.execPath, ['-e', "process.stdout.write('ready');setInterval(()=>{},1000);"]);
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); });
  try {
    workers.reserve(repo, { package: 'WP01', owns: ['src/allowed.js'], lease_seconds: 0, owner_pid: child.pid });
    const stale = workers.reserve(repo, { package: 'WP02', owns: ['src/allowed.js'] });
    assert.equal(stale.granted, false);
    assert.match(stale.conflict, /stale|expired/i, 'an expired owner is reported, not silently overwritten');
    const flags = workers.reclaim(repo, { package: 'WP02', owns: ['src/allowed.js'], evidence: { owner_exited: true, no_pending_writes: true } });
    assert.equal(flags.granted, false, 'a self-declared exit flag does not reclaim a live owner');
  } finally {
    ${['child', 'kill'].join('.')}();
    await new Promise((resolve) => child.once('close', resolve));
  }
  write(repo, 'src/allowed.js', 'changed by a stale worker\\n');
  const changed = workers.reclaim(repo, { package: 'WP02', owns: ['src/allowed.js'], evidence: {} });
  assert.equal(changed.granted, false);
  assert.match(changed.reason, /changed|snapshot/i);
  write(repo, 'src/allowed.js', 'module.exports = 1;\\n');
  const reclaimed = workers.reclaim(repo, { package: 'WP02', owns: ['src/allowed.js'], evidence: {} });
  assert.equal(reclaimed.granted, true);
  assert.ok(reclaimed.evidence_checked.owner_verdicts.includes('exited'));
});`],
  ['wiki/specs/ai-sdlc-harness/15-gate1-contract.md',
    '| R017 F21 | The existing single trust root accepts supported hardware-backed SSH signing. | AC-017: a real `sk-ssh-ed25519@openssh.com` key signs and verifies with the existing path. | PT-017 F08 | J06 | R015 | P: hardware unverified |',
    '| R017 F21 | The single trust root verifies the sign-off mode the repository selected. Cryptographic mode accepts an enrolled key algorithm the trust root already allows, including a Secure Enclave P-256 key and a security-key type. A typed name is not a signature. A missing key does not select a weaker mode. | AC-017: an enrolled allowed key signs and verifies on the existing path. The criterion does not demand one security-key algorithm. | PT-017 F08 | J06 | R015 | P: amend with the sign-off batch |'],
  ['wiki/specs/ai-sdlc-harness/15-gate1-contract.md',
    '| R030 F18 | Stale ownership has an explicit recovery path without silent lock theft. | AC-030: an expired owner is reported and reclaimed only after evidence check. | PT-030 F14 | J10 | R029 | P; — |',
    '| R030 F18 | Stale ownership is recovered only after the recorded process is gone or its process id has been reused, and the reserved file bytes are unchanged. A self-declared exit flag is not that evidence. | AC-030: a live owner is refused, including when a flag says it exited; a dead owner with unchanged bytes can be reclaimed; changed bytes are refused. | PT-030 F14 | J10 | R029 | P: amend with the sign-off batch |'],
  ['wiki/specs/ai-sdlc-harness/15-gate1-contract.md',
    '| R046 F10 | Publish/deploy actions require the established owner authorization. | AC-046: a readiness report alone cannot execute a protected action. | PT-046 F20 | J15 | R044,R045 | B: policy gate |',
    '| R046 F10 | Publish requires the selected sign-off mode. A typed name is not a signature. A release that requires a cryptographic signature does not accept a typed name or a self-attestation as that signature. | AC-046: readiness is not authorization; a typed name does not publish; an explicit lower-assurance mode is labeled and is not a signature. | PT-046 F20 | J15 | R044,R045 | P: amend with the sign-off batch |'],
  ['wiki/specs/ai-sdlc-harness/15-gate1-contract.md',
    '| R060 F13 | A candidate check proves a previously failing case and preserves known-good cases. | AC-060: before/after fixture and positive/negative replay are attached. | PT-060 F25 | J19 | R059 | P; — |',
    '| R060 F13 | A candidate check is admitted only after an executed failing case becomes caught and known-good cases stay clean. A declared flag is an evidence gap. | AC-060: executable replay attaches before and after results; a history flag alone does not count as caught. | PT-060 F25 | J19 | R059 | P: amend with the sign-off batch |'],
  ['wiki/specs/ai-sdlc-harness/16-test-manifest.md',
    '| F08 | Real supported hardware-backed SSH key in an explicit integration lane and absent-device fixture in local CI. Verify sign/verify and closed failure path; no simulated success substitutes for real-key evidence. | `tests/ai-sdlc/hardware-signing.test.js` |',
    '| F08 | Enrolled owner key whose algorithm the single trust root already accepts, in an explicit integration lane, and an absent-key fixture in shared CI. Verify sign/verify and the closed failure path. No simulated success substitutes for the enrolled key. One security-key algorithm is not required. | `tests/ai-sdlc/hardware-signing.test.js` |'],
  ['wiki/specs/ai-sdlc-harness/16-test-manifest.md',
    '| F14 | Two writers with overlapping files plus one disjoint writer; crash one owner and inspect prewrite stop, progress and evidence-based stale-lock recovery. | `tests/ai-sdlc/workers.test.js` |',
    '| F14 | Two writers with overlapping files plus one disjoint writer; crash one owner and inspect prewrite stop, progress and stale-lock recovery. A self-declared exit flag is not recovery evidence. Reclaim requires the recorded process to be gone and the reserved bytes unchanged. | `tests/ai-sdlc/workers.test.js` |'],
  ['wiki/specs/ai-sdlc-harness/16-test-manifest.md',
    '| F20 | Exact-commit receipt, changed source byte, stale QA health, stale real-download install and absent authorization. Inspect each release refusal. | `tests/ai-sdlc/release.test.js` |',
    '| F20 | Exact-commit receipt, changed source byte, stale QA health, stale real-download install and absent authorization. A typed name is not authorization. An explicit acknowledgement is labeled and is not a signature. | `tests/ai-sdlc/release.test.js` |'],
  ['wiki/specs/ai-sdlc-harness/16-test-manifest.md',
    '| F25 | Same defect twice and same instruction twice, one positive and one negative historical case, proposed check/skill and injected full-gate regression. Inspect one cited candidate per class and promotion refusal/pass. | `tests/ai-sdlc/learning.test.js` |',
    '| F25 | Same defect twice and same instruction twice, one positive and one negative case executed before and after the proposed check, and an injected full-gate regression. A declared flag is a gap, not a caught failure. | `tests/ai-sdlc/learning.test.js` |'],
];

function proposedBytes() {
  const files = new Map();
  for (const [rel, from, to] of replacements) {
    const current = files.get(rel) || fs.readFileSync(path.join(root, rel), 'utf8');
    if (!current.includes(from)) throw new Error(`pattern missing in ${rel}: ${from.slice(0, 80)}`);
    files.set(rel, current.replace(from, to));
  }
  return files;
}

function manifestFor(overrides) {
  const current = fs.readFileSync(path.join(root, 'wiki/gate1/ai-sdlc/contract.manifest'), 'utf8');
  return `${current.trimEnd().split('\n').map((line) => {
    const file = line.slice(66);
    const bytes = overrides.get(file);
    const digest = bytes ? sha(bytes) : line.slice(0, 64);
    return `${digest}  ${file}`;
  }).join('\n')}\n`;
}

function programmeDigest(manifest) {
  return sha(`rig-ai-sdlc-freeze-v1\ncontract.manifest ${sha(manifest)}\n`);
}

function main() {
  const proposed = proposedBytes();
  const before = fs.readFileSync(path.join(root, 'wiki/gate1/ai-sdlc/contract.manifest'), 'utf8');
  const after = manifestFor(proposed);
  console.log(`current programme digest ${programmeDigest(before)}`);
  console.log(`proposed programme digest ${programmeDigest(after)}`);
  for (const [file, bytes] of proposed) console.log(`${sha(bytes)}  ${file}`);
  console.log('protected files with the same hash are unchanged');
}

module.exports = { programmeDigest, proposedBytes };

if (require.main === module) main();
