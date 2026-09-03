'use strict';

// Real SSHSIG approval receipts for the Path B onboarding tests.
//
// This lives beside `tests/helpers/path-b.js` rather than inside it because
// that helper is part of the signed Gate 1 manifest. Everything here is new
// surface, so it can move without an oracle re-sign.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  ALLOWED_SIGNERS_REL, APPROVAL_NAMESPACE, approvalMessage,
} = require('../../rig/lib/onboarding');

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')}: ${result.stderr || result.stdout}`);
  }
  return result;
}

// Generates a throwaway ed25519 key, appends its public half to the target's
// `.rig/allowed-signers`, and signs the plan-approval message for `planDigest`.
// Overrides exist so tests can produce receipts that are structurally valid but
// must still be refused (wrong namespace, unlisted identity, wrong digest).
function signApproval(target, planDigest, options = {}) {
  const {
    namespace = APPROVAL_NAMESPACE,
    identity = 'test@rig',
    trustIdentity = true,
    message = approvalMessage(planDigest),
  } = options;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-approval-key-'));
  try {
    const keyFile = path.join(dir, 'id');
    run('ssh-keygen', ['-t', 'ed25519', '-N', '', '-C', identity, '-f', keyFile]);
    if (trustIdentity) {
      const [keyType, keyBody] = fs.readFileSync(`${keyFile}.pub`, 'utf8').trim().split(/\s+/);
      const allowed = path.join(target, ALLOWED_SIGNERS_REL);
      fs.mkdirSync(path.dirname(allowed), { recursive: true });
      fs.appendFileSync(allowed, `${identity} ${keyType} ${keyBody}\n`);
    }
    const messageFile = path.join(dir, 'msg');
    fs.writeFileSync(messageFile, message);
    run('ssh-keygen', ['-Y', 'sign', '-f', keyFile, '-n', namespace, messageFile]);
    return {
      schema_version: 1,
      kind: 'plan-approval',
      plan_digest: planDigest,
      approval: {
        method: 'external-sshsig',
        identity,
        signature: fs.readFileSync(`${messageFile}.sig`, 'utf8'),
      },
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

module.exports = { APPROVAL_NAMESPACE, ALLOWED_SIGNERS_REL, approvalMessage, signApproval };
