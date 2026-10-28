'use strict';

const test = require('node:test');
const crypto = require('node:crypto');
const { assert, fs, path, spawnSync, tempRepo, write, testKey } = require('./_harness');

const approve = require('../../scripts/approve-gate1');

// F07 — candidate business spec, criteria and manifested test files; sign with
// the owner test key, revise the design, then mutate one protected byte.
const ROW = '| R001 F01 | An obligation. | AC-001: an observable result. | PT-001 F01 | J01 | — | P |';

function programmeRepo() {
  const repo = tempRepo('rig-oracle-');
  const spec = 'wiki/specs/ai-sdlc-harness';
  write(repo, `${spec}/15-gate1-contract.md`, ['| R | O | AC | PT | J | D | S |', '|---|---|---|---|---|---|---|', ROW].join('\n'));
  write(repo, `${spec}/16-test-manifest.md`, ['| Fixture | Setup | Home |', '|---|---|---|', '| F01 | setup | `tests/ai-sdlc/x.test.js` |'].join('\n'));
  write(repo, `${spec}/17-customer-lifecycle.md`, ['| J | S | R | E |', '|---|---|---|---|', '| J01 | one | R001 | E2E-J01: fixture |'].join('\n'));
  write(repo, `${spec}/19-work-packages-and-public-roadmap.md`, ['| P | S | O | C |', '|---|---|---|---|', '| **WP01 — one.** outcome. | R001 | owner | PT-001 |'].join('\n'));
  write(repo, 'tests/ai-sdlc/x.test.js', "test('PT-001 an observable result', () => {});\n");
  const protectedFiles = [
    'rig/catalog/baseline/check-traceability.js',
    'tests/ai-sdlc/_harness.js',
    'tests/traceability-invariant.test.js',
    `${spec}/15-gate1-contract.md`,
    `${spec}/16-test-manifest.md`,
    `${spec}/17-customer-lifecycle.md`,
    'tests/ai-sdlc/x.test.js',
  ].sort();
  for (const file of protectedFiles) {
    if (!fs.existsSync(path.join(repo, file))) write(repo, file, `// fixture for ${file}\n`);
  }
  // Start empty: the ceremony must derive the complete protected set from the
  // contract, rather than trusting a possibly incomplete hand-written list.
  write(repo, 'wiki/gate1/ai-sdlc/contract.manifest', '');
  return { repo, spec, protectedFiles };
}

function sign(repo, key, extra = {}) {
  // First ceremony: the manifest digests are placeholders, so confirm the delta.
  try {
    approve.approveProgramme(repo, 'ai-sdlc', { env: { RIG_GATE1_SIGNING_KEY: key }, ...extra });
  } catch (error) {
    const match = /--confirm-digest-delta ([0-9a-f]{64})/.exec(error.message);
    if (!match) throw error;
    approve.approveProgramme(repo, 'ai-sdlc', { env: { RIG_GATE1_SIGNING_KEY: key }, confirmDigestDelta: match[1], ...extra });
  }
}

test('PT-015 all three exact digests verify before design can begin', () => {
  const { repo, protectedFiles } = programmeRepo();
  sign(repo, testKey(repo));

  const verified = approve.verifyProgramme(repo, 'ai-sdlc');
  assert.equal(verified.principal, 'gate1-owner');

  const manifest = fs.readFileSync(path.join(repo, 'wiki/gate1/ai-sdlc/contract.manifest'), 'utf8');
  for (const file of protectedFiles) {
    const want = crypto.createHash('sha256').update(fs.readFileSync(path.join(repo, file))).digest('hex');
    assert.ok(manifest.includes(`${want}  ${file}`), `${file} must be bound by its exact digest`);
  }
  assert.ok(/15-gate1-contract\.md/.test(manifest) && /16-test-manifest\.md/.test(manifest) && /17-customer-lifecycle\.md/.test(manifest),
    'requirements, acceptance and the test manifest lock together');
});

test('PT-016 altered protected bytes fail verification and require owner re-sign', () => {
  const { repo, spec } = programmeRepo();
  sign(repo, testKey(repo));
  approve.verifyProgramme(repo, 'ai-sdlc');

  fs.appendFileSync(path.join(repo, spec, '15-gate1-contract.md'), '\n<!-- agent edit -->\n');

  assert.throws(() => approve.verifyProgramme(repo, 'ai-sdlc'), /changed protected file/);
});

test('PT-019 design revision preserves the oracle signature and receives a new design digest', () => {
  const { repo, spec } = programmeRepo();
  const key = testKey(repo);
  sign(repo, key);
  const signature = fs.readFileSync(path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig'));

  // The technical design is deliberately outside the protected set.
  write(repo, `${spec}/18-system-interactions.md`, '# Design v2\n');
  approve.verifyProgramme(repo, 'ai-sdlc');

  assert.deepEqual(fs.readFileSync(path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig')), signature, 'a design revision must not disturb the signature');
  const manifest = fs.readFileSync(path.join(repo, 'wiki/gate1/ai-sdlc/contract.manifest'), 'utf8');
  assert.doesNotMatch(manifest, /18-system-interactions/, 'the editable design is not part of the signed oracle');
});

test('PT-015b signing the new programme leaves the 6.0.0 oracle untouched', () => {
  const { repo } = programmeRepo();
  write(repo, 'wiki/gate1/business-spec.md', '# intent\n');
  write(repo, 'wiki/gate1/acceptance.md', '# acceptance\n');
  write(repo, 'wiki/gate1/testing-infrastructure.manifest', '');
  const before = ['business-spec.md', 'acceptance.md', 'testing-infrastructure.manifest']
    .map((f) => fs.readFileSync(path.join(repo, 'wiki/gate1', f)).toString());

  sign(repo, testKey(repo));

  const after = ['business-spec.md', 'acceptance.md', 'testing-infrastructure.manifest']
    .map((f) => fs.readFileSync(path.join(repo, 'wiki/gate1', f)).toString());
  assert.deepEqual(after, before, 'the 6.0.0 oracle bytes must be unchanged');
  assert.equal(fs.existsSync(path.join(repo, 'wiki/gate1/gate1.sig')), false, 'the 6.0.0 signature is not created or replaced');
});

test('PT-015c an incomplete traceability graph refuses the ceremony before any signature', () => {
  const { repo, spec } = programmeRepo();
  fs.appendFileSync(path.join(repo, spec, '15-gate1-contract.md'),
    '\n| R002 F01 | Unmapped. | AC-002: a result. | PT-002 F01 | J01 | — | P |\n');

  assert.throws(() => sign(repo, testKey(repo)), /traceability graph is incomplete/);
  assert.equal(fs.existsSync(path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig')), false, 'nothing is signed while the graph is incomplete');
});

test('PT-015d a second key cannot sign the new programme', () => {
  const { repo } = programmeRepo();
  sign(repo, testKey(repo, 'owner-key'));

  assert.throws(
    () => approve.approveProgramme(repo, 'ai-sdlc', { env: { RIG_GATE1_SIGNING_KEY: testKey(repo, 'other-key') } }),
    /one trust root/,
  );
});

test('PT-015e a signature for one programme does not verify for the other', () => {
  const { repo } = programmeRepo();
  const key = testKey(repo);
  sign(repo, key);
  const message = approve.programmeMessage(repo, 'ai-sdlc');
  assert.match(message, /^rig-ai-sdlc-freeze-v1\n/, 'the new programme signs a distinct message prefix');

  const result = spawnSync('ssh-keygen', [
    '-Y', 'verify', '-f', path.join(repo, 'wiki/gate1/gate1.allowed-signers'),
    '-I', 'gate1-owner', '-n', 'rig-gate1', '-s', path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig'),
  ], { input: 'rig-oracle-freeze-v2\nnot this message\n', encoding: 'utf8' });
  assert.notEqual(result.status, 0, 'the 6.0.0 message must not verify against the new programme signature');
});
