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
from `.context/gate1.env`; writes the canonical oracle message; invokes
`ssh-keygen -Y sign` in namespace `rig-gate1`; and only after a successful
signature writes `gate1.allowed-signers` and `gate1.sig`. The tracked
`scripts/gate1.env.example` shows the expected setting; the ignored local env
file stores the key path, not private key material.

## What was rejected

Branch protection, upstream comparison, a repository-stored private key, TTY
confirmation, artifact claims of hardware presence, and a recovery path for the
Gate 1 signer were rejected. Gate 1 deliberately has no recovery mechanism.
[Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen integrity rules: [Gate 1](../gate1/business-spec.md)
- Verification mechanism: [Gate 2 AD-28 and §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)
- Owner ceremony sequencing: [status](../status.md#ordered-next-steps)

## What is still open

The gate is currently unarmed: no allowed-signers or signature file exists.
The intent owner approved the D24/one-gate oracle amendment on 2026-08-21, but
that approval is not the cryptographic ceremony. The deterministic five-file
testing infrastructure is now complete, manifested, and structurally verified
at all 68 exact IDs. The owner can now perform the live-human signature before
implementation begins. The signature covers the testing-infrastructure
manifest as well as intent and acceptance.
[Approval](../reasoning/2026-08-21-d24-owner-approval.md) ·
[Status](../status.md#gate-standing)
