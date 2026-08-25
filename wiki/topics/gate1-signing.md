# Gate signing

## What it is

Once armed, gate integrity is an SSHSIG signature over the exact combined digests
of the **oracle** — the business spec, the acceptance file, and the testing
infrastructure that checks it — verified against a listed signer identity. Under
the one-gate model (2026-08-21) the signature covers the tests too, not only
intent and acceptance, because the tests are part of the frozen shell the code
adapts to. The intent owner attests that the key requires a live human act; the
artifact cannot prove its own key class. A locked oracle changes only by the key
holder re-signing — a quick act, never a full return to grilling. [D10/D17/D19](../gate1/business-spec.md) · [escape hatch](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md)

## Why it is this way

Repository process cannot protect intent from an agent that can modify the
repository and git state. A non-git signature moves the authority outside that
boundary. D19 corrected an impossible claim: SSH signature verification proves
identity, not hardware presence, so key-class assurance is explicitly the
owner's responsibility. [Advanced grilling GA-11](../sources/logs/advanced-grilling.md#ga-11--gate-1-integrity-mechanism-2026-07-26)

## What binds it

The revision sequence is `D5 → D10 → D17 → D19`; `AD-28` puts verification
first in the specification gate. `AT-GATE-2` and the Gate 1 integrity cases make
missing, malformed, stale, or non-verifying signatures fail once armed.
[Decision index](../index/decisions.md) [Acceptance index](../index/acceptance-cases.md)

`scripts/approve-gate1.js` is the local ceremony helper. It reads one
machine-local environment variable, `RIG_GATE1_SIGNING_KEY`, from the process or
from `.credentials/gate1.env`; writes the canonical oracle message; invokes
`ssh-keygen -Y sign` in namespace `rig-gate1`; and only after a successful
signature writes `gate1.allowed-signers` and `gate1.sig`. `.credentials/` is the
one directory for local secret/env files; it is gitignored except for tracked
`*.example` files, so `.credentials/gate1.env.example` shows the expected
setting and the real `.credentials/gate1.env` (key path, not private key
material) never leaves the machine.

## What was rejected

Branch protection, upstream comparison, a repository-stored private key, TTY
confirmation, artifact claims of hardware presence, and a recovery path for the
Gate 1 signer were rejected. Gate 1 deliberately has no recovery mechanism.
[Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen integrity rules: [Gate 1](../gate1/business-spec.md)
- Verification mechanism: [Gate 2 AD-28 and §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)
- Owner ceremony sequencing: [status](../status.md#ordered-next-steps)

## Standing

The gate is armed. `wiki/gate1/gate1.sig` and
`wiki/gate1/gate1.allowed-signers` both exist. Running
`node scripts/check-advanced-spec.js` prints
`Gate 1 protected: principal=gate1-owner
fingerprint=SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY` over the
unchanged five-file oracle. The signature covers business intent, acceptance,
and the manifest — a change to any of the manifested files invalidates it.
Owner key comment is `rig-gate-key@secretive.Manoj's-MacBook-Pro.local`;
class is owner-attested Secretive / Secure Enclave (D19: the artifact cannot
prove this; the owner did).
[Approval](../reasoning/2026-08-21-d24-owner-approval.md) ·
[Status](../status.md#gate-standing)
