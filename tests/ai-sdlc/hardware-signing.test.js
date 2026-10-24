'use strict';

const test = require('node:test');
const { ROOT, assert, fs, path, spawnSync, tempRepo, write, environmentBound } = require('./_harness');

const approve = require('../../scripts/approve-gate1');

// F08 — a real supported hardware-backed SSH key in an explicit integration
// lane, and an absent-device fixture in local CI. No software fixture may
// stand in for a touch-required device.
const HARDWARE_TYPE = 'sk-ssh-ed25519@openssh.com';

function hardwareKeyFromEnv() {
  const configured = process.env.RIG_GATE1_HARDWARE_KEY;
  if (!configured) return null;
  const pub = configured.endsWith('.pub') ? configured : `${configured}.pub`;
  if (!fs.existsSync(pub)) return null;
  return fs.readFileSync(pub, 'utf8').trim().startsWith(HARDWARE_TYPE) ? configured : null;
}

function signCurrentContract(repo, key) {
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

test('PT-017 a real sk-ssh-ed25519@openssh.com key signs and verifies with the existing path', () => {
  const key = hardwareKeyFromEnv();
  if (!key) {
    environmentBound('set RIG_GATE1_HARDWARE_KEY to a present sk-ssh-ed25519@openssh.com key; this lane never simulates a security-key touch');
  }
  const repo = tempRepo('rig-hw-');
  signCurrentContract(repo, key);

  const allowed = fs.readFileSync(path.join(repo, 'wiki/gate1/gate1.allowed-signers'), 'utf8');
  assert.ok(allowed.includes(HARDWARE_TYPE), 'the enrolled key must be the hardware-backed type');
  const verify = spawnSync('ssh-keygen', [
    '-Y', 'verify', '-f', path.join(repo, 'wiki/gate1/gate1.allowed-signers'),
    '-I', 'gate1-owner', '-n', 'rig-gate1', '-s', path.join(repo, 'wiki/gate1/ai-sdlc/ai-sdlc.sig'),
  ], { input: approve.programmeMessage(repo, 'ai-sdlc'), encoding: 'utf8' });
  assert.equal(verify.status, 0, verify.stderr);
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
