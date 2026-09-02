---
date: 2026-09-02
source: intent owner
topics: gate1-signing
decisions:
status: current
supersedes:
tags: gate1, key-rotation, correction
summary: The gate1 owner re-signed the amended oracle with the original ssh-ed25519 key rather than the Secretive-backed key recorded earlier the same day; the hardware-key rotation is not adopted going forward, and the original key is the active signer of record.
---

# Gate 1 signing key — original key retained

## What happened

Earlier the same day, the gate1 owner confirmed that commit `5694fd7b`'s
rotation to a Secretive-backed (`ecdsa-sha2-nistp256`) key was theirs and
authorized recording it as the active signer — see
[rotation authorization](../reasoning/2026-09-02-gate1-key-rotation-authorized.md).
Signing instructions were prepared for that key, including the
agent-forwarding path required because a Secretive key's private half never
leaves the Mac's Secure Enclave.

When the owner actually ran the re-sign ceremony (after the wording fix in
[wording-fix trace](../reasoning/2026-09-02-gate1-wording-fix-and-signing-instructions.md)),
the resulting signature verified under the *original* `ssh-ed25519
vaibhav.kodiyan.vk@gmail.com` key
(`SHA256:MYPMlpxH/cY5SGPoD2ghrL48SLoU5thTvRfViN8gdA4`), not the
Secretive-backed one. Asked directly, the owner chose to keep the original
key rather than complete the switch — a decision, not a failed forwarding
attempt that needs retrying.

## Current state

`wiki/gate1/gate1.allowed-signers` carries the original `ssh-ed25519` key.
The Secretive-backed key from the rotation commit is not in use. The earlier
rotation-authorization trace is left as written — it accurately records what
was confirmed at the time — but this trace is the current word on which key
actually signs the oracle going forward.
