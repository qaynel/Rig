# Gate 1 signing

## What it is

Once armed, Gate 1 integrity is an SSHSIG signature over the exact combined
digests of the frozen business spec and acceptance file, verified against a
listed signer identity. The intent owner attests that the key requires a live
human act; the artifact cannot prove its own key class. [Gate 1 D10/D17/D19](../gate1/business-spec.md)

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

## What was rejected

Branch protection, upstream comparison, a repository-stored private key, TTY
confirmation, artifact claims of hardware presence, and a recovery path for the
Gate 1 signer were rejected. Gate 1 deliberately has no recovery mechanism.
[Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen integrity rules: [Gate 1](../gate1/business-spec.md)
- Verification mechanism: [Gate 2 AD-28 and §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)
- Owner ceremony: [roadmap Step 3](../specs/roadmap.md#step-3--sign-the-requirements-with-a-key-an-agent-cant-use)

## What is still open

The gate is currently unarmed: no allowed-signers or signature file exists.
Only the intent owner can perform the ceremony, after Gate 2's blockers are
resolved and before implementation begins. [Status](../status.md#gate-standing)
