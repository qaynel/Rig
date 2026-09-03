---
date: 2026-09-02
source: intent owner
topics: gate1-signing
decisions:
status: current
supersedes: 2026-09-02-gate1-key-rotation-not-adopted
tags: gate1, key-rotation, authorization
summary: The gate1 owner intentionally changed the approved Gate 1 signing key on 2026-09-02. The new key and its verification fingerprint are recorded in wiki/gate1/gate1.allowed-signers as the signer of record.
---

# Gate 1 signing key — rotation adopted

## What happened

On 2026-09-02, the gate1 owner intentionally changed the key that signs
Gate 1. `wiki/gate1/gate1.allowed-signers` carries the new key, and its
fingerprint is printed by `node scripts/check-advanced-spec.js` on every
verification. Both are verification data — public inputs to signature
checking — not credentials, and together are the complete record of which
key is authoritative.

## What this trace does not record

Key custody, storage mechanism, recovery process, and the identity of anyone
with operational access to the private key are deliberately not recorded
here, or anywhere in this repository. That operational detail belongs in a
private, access-controlled system outside the repository — not in a
git-ignored local file as its only record. This trace exists only so an
agent or future reviewer does not mistake an intentional, owner-authorized
key change for a compromise. See
[rotation authorization](2026-09-02-gate1-key-rotation-authorized.md) and
[key retained, not rotated](2026-09-02-gate1-key-rotation-not-adopted.md)
for the earlier decision this one reverses.

## Current state

`wiki/gate1/gate1.allowed-signers` carries the current key and is the signer
of record going forward.
