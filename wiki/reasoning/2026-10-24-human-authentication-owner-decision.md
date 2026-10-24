---
date: 2026-10-24
source: owner
topics: gate1-signing, the-two-gates
decisions: human authentication need not be hardware-backed; any agent-defeating prompt qualifies
status: current
supersedes: 2026-09-02-gate1-human-presence-what-is-checkable
tags: owner-decision, security, human-presence, unfreeze-needed
summary: Owner closed the September open question — the requirement is that an agent cannot perform the authentication, not that it is FIDO hardware. sudo, Touch ID or a Windows administrator prompt all qualify; the owner will not buy a USB security key. The signed hardware-signing criterion demands the FIDO algorithm specifically and now needs an amendment.
---

# Human authentication: any agent-defeating prompt qualifies

## What the owner said

> How do you authorize something on a Linux or Unix-based system? You do
> `sudo`, or on a Mac you do a fingerprint. If there's any sort of user
> authentication that cannot be done, obviously agents cannot enter the user's
> passwords.
>
> Any sort of authentication need not be hardware-based. I think we have
> already solved this. Why are we running around in circles? ... Any sort of
> authentication that separates a human from an agent should be good enough,
> the easiest to set up.
>
> I don't want to go ahead and buy a USB stick. `sudo`, or authentication as
> administrator in Windows, should be good enough.

## This closes an open question, it does not change direction

`2026-09-02-gate1-human-presence-what-is-checkable.md` ended with exactly this
question left to the owner: *"Whether to move to a FIDO key and add
`verify-required`."* It recorded the cost — enrolling a hardware token or
macOS Secretive, and re-signing. The owner has now answered: **no FIDO
requirement**. The criterion is agent-defeat, not hardware.

The owner is also already set up. The signing key on the machine is an
`ecdsa-sha2-nistp256` key held in Secretive, i.e. the macOS Secure Enclave,
which prompts for Touch ID on every signature. That is a real per-signature
human action that an agent cannot perform. The September trace named Secretive
as an acceptable option; the owner took it.

## What this breaks

The signed acceptance criterion for hardware signing demands the key type
`sk-ssh-ed25519@openssh.com` by literal string match, and the signed harness
refuses to run unless such a key is present. The owner's Secure Enclave key is
a different algorithm, so the criterion rejects a setup that satisfies its own
intent completely.

This is a protected assertion that is wrong, not a gap in the implementation.
Per the governing brief the correct response is to stop and prepare an
amendment, never to work around it. **Do not edit the signed test.** The
amendment belongs in the owner's next signing session.

### What the amended criterion should say

The check should accept any key whose use demands a per-signature human action
that an agent cannot supply, and should name the acceptable mechanisms rather
than one algorithm: the macOS Secure Enclave by Touch ID, an administrator or
`sudo` prompt, and FIDO security keys for anyone who already owns one.

The September finding that constrains this still holds and must survive the
amendment: **a passphrase on a key file proves nothing.** Ed25519 signatures are
deterministic, so signing with and without a passphrase produces byte-identical
output, and once the key is in an agent the passphrase is never requested
again. Any amended wording that would admit "a password-protected key file"
re-opens a hole that was already tested and closed. The property that is
actually checkable is that the signing key lives somewhere the agent cannot
read and that releases a signature only after a human action.

## Status

Recorded as locked owner decision 24. Until the owner re-signs, the hardware
signing case stays red on every machine, and that is an honest reported gap
rather than a defect.
