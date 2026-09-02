---
date: 2026-09-02
source: agent
topics: gate1-signing
decisions:
status: current
supersedes:
tags: gate1, wording-fix, signing-ceremony
summary: Owner-authorized wording fix on acceptance.md and business-spec.md ("AWAITING ORACLE SIGNATURE" -> "ORACLE SIGNED", the submitted-for-approval line -> approved) invalidates the current signature by design; re-sign ceremony instructions prepared for the Ubuntu-side owner, including the Secretive-agent-forwarding path since the signing key is non-exportable.
---

# Gate 1 wording fix and the pending re-sign

## What changed

Both frozen headers still read as pre-signature leftovers even though the
oracle had already been carrying a valid signature over their content for
some time:

- `wiki/gate1/acceptance.md` H1: `AWAITING ORACLE SIGNATURE` -> `ORACLE
  SIGNED`.
- `wiki/gate1/business-spec.md` H1: same fix, same reason — found while
  cross-checking the acceptance-file fix and confirmed in scope by the owner
  before touching it, since it sits inside the same signed bundle.
- `wiki/gate1/acceptance.md` §7 lead-in: "submitted for owner approval" ->
  "approved by the owner".

Owner-authorized before either edit, since both files are inside the signed
manifest and editing them invalidates `gate1.sig` by construction —
`node scripts/check-advanced-spec.js` now correctly reports "oracle
signature does not verify." This is the expected, designed state between an
oracle edit and its re-sign, not a regression.

## Re-sign ceremony, Ubuntu side

The signing key (`rig-gate-key@secretive.Manoj's-MacBook-Pro.local`) is
Secretive-backed — the private key never leaves the Mac's Secure Enclave, so
it cannot be copied to or generated on the Ubuntu machine. Signing from
Ubuntu requires the Mac's Secretive agent forwarded in over the SSH
connection, then `ssh-keygen -Y sign` delegates to that forwarded agent via
a public-key file rather than a private-key file. `defaultSecretiveAgent()`
in `scripts/approve-gate1.js` only auto-selects the Secretive socket on
`darwin`; on `linux` the forwarded `SSH_AUTH_SOCK` set by `sshd` at
connection time is used as-is.

One caveat found while preparing this: `approveGate1()`'s final write step
unconditionally overwrites `wiki/gate1/gate1.allowed-signers` with a bare
principal line — `fs.writeFileSync(..., \`${PRINCIPAL} namespaces=... ${publicKey}\n\`)`
— discarding any comments. The key-class comment recording the rotation
attestation (added the same day) does not survive a re-sign and needs to be
restored afterward. `signerPrincipals`/`signerFingerprint` in
`scripts/check-advanced-spec.js` already skip `#`-prefixed lines, so this is
a cosmetic loss, not a verification break — but worth fixing in the script
itself at some point so the ceremony doesn't quietly eat hand-authored
comments every time it runs.

Full instructions relayed to the owner in chat rather than duplicated here
verbatim; this trace is the record that they were prepared and why the
agent-forwarding path is the only one that applies to this specific key.
