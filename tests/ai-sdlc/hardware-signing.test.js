'use strict';

const test = require('node:test');
const { ROOT, assert, fs, path, spawnSync, tempRepo, write, testKey, environmentBound } = require('./_harness');

const approve = require('../../scripts/approve-gate1');

// F08 — a real supported hardware-backed SSH key in an explicit integration
// lane, and an absent-device fixture in local CI. No software fixture may
// stand in for a touch-required device.
const { keyTypeAllowed } = require('../../rig/lib/trust-root');

function configuredKey() {
  const configured = process.env.RIG_GATE1_SIGNING_KEY || process.env.RIG_GATE1_HARDWARE_KEY;
  if (!configured) return null;
  const pub = configured.endsWith('.pub') ? configured : `${configured}.pub`;
  if (!fs.existsSync(pub)) return null;
  const type = fs.readFileSync(pub, 'utf8').trim().split(/\s+/)[0];
  return keyTypeAllowed(type) ? configured : null;
}

function signCurrentContract(repo, key) {
  // The traceability preflight parses every .md file in the contract
  // directory, not only the three signed contract documents, so the whole
  // directory has to exist in the fixture repo for that check to run at all.
  const contractDir = path.join(ROOT, 'wiki', 'specs', 'ai-sdlc-harness');
  for (const name of fs.readdirSync(contractDir)) {
    if (!name.endsWith('.md')) continue;
    write(repo, path.join('wiki', 'specs', 'ai-sdlc-harness', name), fs.readFileSync(path.join(contractDir, name)));
  }
  for (const file of approve.programmeProtectedFiles(ROOT, 'ai-sdlc')) {
    write(repo, file, fs.readFileSync(path.join(ROOT, file)));
  }
  write(repo, 'wiki/gate1/ai-sdlc/contract.manifest', '');
  try {
    approve.approveProgramme(repo, 'ai-sdlc', { env: { RIG_GATE1_SIGNING_KEY: key } });
  } catch (error) {
    const confirmation = /--confirm-digest-delta ([0-9a-f]{64})/.exec(error.message);
    if (!confirmation) throw error;
    approve.approveProgramme(repo, 'ai-sdlc', {
      env: { RIG_GATE1_SIGNING_KEY: key }, confirmDigestDelta: confirmation[1],
    });
  }
}

function assertSignsAndVerifies(repo) {
  const allowed = fs.readFileSync(path.join(repo, 'wiki/gate1/gate1.allowed-signers'), 'utf8');
  const type = allowed.trim().split('\n').find((line) => line && !line.startsWith('#'))?.split(/\s+/).find((field) => keyTypeAllowed(field));
  assert.ok(type, 'the enrolled key uses an algorithm the single trust root accepts');
  const verify = spawnSync('ssh-keygen', [
    '-Y', 'verify', '-f', path.join(repo, 'wiki/gate1/gate1.allowed-signers'),
    '-I', 'gate1-owner', '-n', 'rig-gate1', '-s', path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig'),
  ], { input: approve.programmeMessage(repo, 'ai-sdlc'), encoding: 'utf8' });
  assert.equal(verify.status, 0, verify.stderr);
}

test('PT-017 an enrolled allowed key signs and verifies with the existing path', () => {
  const key = configuredKey();
  if (key) {
    const repo = tempRepo('rig-hw-');
    signCurrentContract(repo, key);
    assertSignsAndVerifies(repo);
    return;
  }
  if (process.env.GITHUB_ACTIONS !== 'true') {
    environmentBound('set RIG_GATE1_SIGNING_KEY to the enrolled owner key; local runs never simulate a touch or substitute a software fixture');
  }
  // Shared CI holds no owner key and never will (North star 24/26/27): it
  // cannot verify a human was present. This branch proves only that the
  // sign/verify mechanism itself is correct on this OS/Node version, using a
  // throwaway key generated and discarded inside this one job run — nothing
  // is written to a GitHub secret or any persistent store. It is not, and
  // must never be read as, evidence of owner approval; that proof exists
  // only in the owner's own ceremony, run outside CI with the enrolled key.
  const repo = tempRepo('rig-hw-ci-');
  signCurrentContract(repo, testKey(repo, 'ci-mechanism-key'));
  assertSignsAndVerifies(repo);
});

test('PT-018 absent key never causes agent approval or a second signer', () => {
  const repo = tempRepo('rig-hw-absent-');
  write(repo, 'wiki/gate1/ai-sdlc/contract.manifest', '');
  const missing = path.join(repo, 'no-such-security-key');

  assert.throws(
    () => approve.approveProgramme(repo, 'ai-sdlc', { env: { RIG_GATE1_SIGNING_KEY: missing } }),
    (error) => /does not exist/.test(error.message) && error.message.includes(missing),
    'the refusal must name the exact missing key path as its remedy',
  );
  assert.equal(fs.existsSync(path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig')), false, 'no signature is produced');
  assert.equal(fs.existsSync(path.join(repo, 'wiki/gate1/gate1.allowed-signers')), false, 'no second signer is enrolled');
});
