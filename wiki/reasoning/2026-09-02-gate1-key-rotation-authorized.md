---
date: 2026-09-02
source: intent owner
topics: gate1-signing
decisions:
status: historical
supersedes:
tags: gate1, key-rotation, authorization
summary: The gate1 owner confirmed the ssh-ed25519 -> ecdsa-sha2-nistp256 (Secretive-backed) signing-key rotation on commit 5694fd7b was performed by them; recorded as the key-class attestation the signature itself cannot provide.
---

# Gate 1 signing-key rotation — authorized

## What happened

Commit `5694fd7b` ("Author Path B adaptive-onboarding oracle and red
acceptance checks") changed `wiki/gate1/gate1.allowed-signers`'s principal
key from `ssh-ed25519 ... vaibhav.kodiyan.vk@gmail.com` to
`ecdsa-sha2-nistp256 ... rig-gate-key@secretive.Manoj's-MacBook-Pro.local`
without an accompanying wiki trace explaining the rotation. That silence was
flagged as a closeout blocker for this branch: SSH signature verification
proves identity, not who performed the rotation or why, so an unexplained
key swap in gate1's trust root has to be treated as a possible compromise
until the owner says otherwise.

## Resolution

Asked directly; the gate1 owner confirmed the rotation was performed by
them — moving the signing key from a plain file-based key to a
Secretive-backed key (macOS Secure Enclave, private key never leaves
hardware). This is a strengthening of the key class, not a downgrade.

## What this does not do

This trace is the wiki-side record of the authorization. It does not
substitute for the key-class comment on the `gate1.allowed-signers` line
itself, which is the artifact an agent or a future reviewer actually reads
when auditing the file in place — both were added in the same change.
