---
date: 2026-09-03
source: agent
topics: onboarding-flow, trust-and-failure-boundaries, testing-strategy
decisions:
status: current
supersedes:
tags: interdependency
summary: F2's O_EXCL atomicWrite guard (AT-HD-2) intentionally narrows Issue N's crash-resume promise — a stale state.json.tmp left by Rig's own interrupted apply now requires one operator `rm` before re-apply succeeds, exactly as the F2 spec's own risk note anticipated.
---

# F2 (O_EXCL atomicWrite) narrows Issue N's automatic crash-resume — 2026-09-03

## What happened

Implementing F2 (AT-HD-2: `atomicWrite` opens its `.tmp` file with
`fs.openSync(temp, 'wx', 0o600)` instead of a bare `fs.writeFileSync`) broke
an existing, non-frozen regression test: `tests/path-b-hardening.test.js`
"Issue N (interrupt window) — crash after writer.finish() but before
writeState()". That test simulates a crash between the journal closing and
`state.json` committing, then asserts an immediate re-apply succeeds with no
operator action.

Root cause of the conflict: the simulated crash (whether patching
`fs.writeFileSync` as the test did originally, or `fs.renameSync` as it does
now) fires *after* the new state bytes are already written to
`state.json.tmp`. That leaves a real, fully-written temp file on disk after
the "crash" — exactly the file F2 now refuses to write through on the next
attempt (`EEXIST`, actionable message naming the path and telling the
operator to `rm` it).

## Why this is not a bug in F2

`wiki/gate2/onboarding-hardening-spec.md` §6 "Risks and explicit limits"
anticipated this exact scenario under "F2 error message": *"If the operator
hits a legitimate stale `.tmp` from a prior crash, the error must give them
the exact `rm` command."* That sentence describes precisely Issue N's crash
shape — Rig's own interrupted write, not an attacker's symlink — and states
the intended behavior is still to throw the F2 guard error, not to silently
resume. F2's own rejected-approach (a) is explicit: *"Unlink stale temp on
EEXIST and retry. This is the attack window."* The guard does not
distinguish "attacker-placed symlink" from "Rig's own stale regular file" by
design — any pre-existing bytes at a predictable temp path get the same
refusal, because distinguishing them safely (e.g. by `lstat`-checking for a
symlink) would only close the symlink case and leave the general
predictable-filename race open for a regular-file plant.

## Resolution

Updated the Issue N test (not frozen — no Gate 1 unfreeze needed) rather than
weakening F2:

1. Assert the immediate re-apply after the simulated crash throws the F2
   guard error (`already exists... EEXIST... remove`).
2. Simulate the operator's remediation: `fs.unlinkSync` the stale
   `state.json.tmp`.
3. Assert the re-apply *after* that succeeds and reaches `phase: 'applied'`
   — preserving the original test's real intent (a closed journal does not
   permanently wedge a resume) while conforming to F2's stricter contract.

Also updated the crash-injection point itself: the old test patched
`fs.writeFileSync`, which no longer exists in `atomicWrite`'s write path
(F2 replaced it with `openSync`/`writeSync`/`closeSync`). The new patch
intercepts `fs.renameSync` when the destination basename is `state.json` —
the rename is `atomicWrite`'s actual commit point post-F2, so this models
"crash after the new bytes are durably on disk but before the swap" more
precisely than the old write-level interception did.

## Verification

`node --test tests/path-b-*.test.js` — 120/120 pass, including the corrected
Issue N test and the rest of the AT-PB-* suite (no other test patches
`fs.writeFileSync`/`fs.renameSync` at the state.json path, so this was an
isolated interaction).

## Not a return-to-grilling trigger

This does not meet any of the four §7 triggers in the technical spec: no
oracle test (`tests/onboarding-hardening.test.js` /
`tests/onboarding-invariants.test.js`) needed a body change, F4/F5 are
untouched, and the affected test is outside the frozen manifest. The fix is
confined to updating a non-frozen regression test's fault-injection
technique to match the new (correct, spec-anticipated) implementation.
