---
date: 2026-09-03
source: agent
topics: onboarding-flow, trust-and-failure-boundaries, testing-strategy
decisions:
status: historical
supersedes:
tags: interdependency
summary: F1 (proposal body digest) and F3 (commit-time inventory recheck) landed per spec, but both needed the same journal-resume carve-out F2 already established — a crashed apply's own disk writes are not third-party drift or tampering. F1 also retired one test's premise; that test now models a self-consistent malicious proposal instead.
---

# F1 (body digest) and F3 (inventory recheck) — the same resume carve-out F2 needed — 2026-09-03

## What shipped

`wiki/gate2/onboarding-hardening-spec.md` §3 F1 and F3, the last two Phase 1
slices:

- `rig/lib/onboarding-state.js`: `proposalBodyDigest(proposal)` strips the
  `digest` key and re-hashes the body — symmetric with `canonicalProposal`'s
  own digest computation. Exported.
- `rig/lib/onboarding.js` `apply()`: calls `proposalBodyDigest` at the very
  top (after `requireCurrentRevision`, before `approvalRecord`) and fails
  `"proposal body has been tampered post-signing: digest mismatch"` on
  mismatch — before anything, including signature verification, trusts the
  stored digest.
- Same function: re-derives `inventoryHarness(request.target).digest` and
  compares to `state.inventory.digest`, mirroring the existing catalog-digest
  check, failing `"the repository inventory changed since propose: approval
  is stale"` on drift.

## The same pattern as F2 vs. Issue N, twice

Both landed clean against the oracle (`AT-HD-1`, `AT-HD-3`, `AT-HD-9 I-A-1`,
`AT-HD-10 I-B-1` all green immediately) but broke 4 tests in the non-frozen
`tests/path-b-hardening.test.js` — the same class of interaction already
documented in
[F2 vs. Issue N](../reasoning/2026-09-03-onboarding-hardening-phase1-f2-vs-issueN.md):
a hardening guard that is correct for a *fresh* apply fires incorrectly
during a *legitimate resume* of an apply that crashed mid-transaction.

**F3 vs. Task 4 (journal-aware preflight resume).** All 6 "AT-PB-hard
resume" cases crash `apply()` at a different point (pending record, disk
write, applied record — for both an owned-file write and a graft write) and
then retry. Several of those crash points leave real bytes on disk (the
graft already written to `AGENTS.md`, a skill file already projected) before
the simulated crash. A naive fresh-inventory-vs-propose-snapshot comparison
sees those bytes as drift, even though they are the same interrupted
transaction's own writes — exactly the class of false positive
`journalResumeDigest` already exists to prevent for the file-level preflight
checks.

Fix: gate the F3 check on `!writer.interrupted()`. `journalWriter`'s
`interrupted()` reflects whether a *previous* run of this repo's onboarding
left a transaction open (an `install_state` record with `complete: false`
and no closing record) — the exact signal Task 4's resume logic already
relies on. When resuming, F3 skips its blanket check and defers entirely to
the journal-aware preflights (`preflightGrafts`, `preflightOwnedFiles`,
`cleanProjection`'s `journalResumeDigest` calls), which verify per-path that
any live bytes match what *this* transaction was writing — a strictly
narrower and more precise guarantee than the aggregate inventory digest.
`writer` had to move up in `apply()` (created via `journalWriter` before the
F3 check instead of after) so `interrupted()` is available before the guard
runs; this is side-effect-free (`journalWriter` only reads the existing
journal, `.begin()` is what starts a transaction).

A fresh apply (no prior interrupted transaction — including `AT-HD-3`'s own
scenario, propose then apply once) still gets the full check: `interrupted()`
is only true when a previous run's `install_state` record was left open.

**F1 vs. a test whose premise F1 retires.** `AT-PB-hard binding — duplicate
approved binding rows are rejected` hand-edited `state.json` after propose —
pushing a duplicate `skill_bindings` row without updating `proposal.digest`
— to reach `verifySkillBindings`' duplicate-row rejection. That is now
indistinguishable from the exact attack F1 exists to close, so F1 fires
first with the tamper error, and the test's own assertion (expecting a
duplicate-binding message) fails. This is not a false positive: F1 is
correctly closing a path this test happened to be using as a testing
convenience. Fixed by making the test model a different, still-valid threat:
a proposal whose duplicate binding was baked in *before* signing (recompute
`proposal.digest` via the newly-exported `proposalBodyDigest` after
injecting the duplicate, then sign the approval against that new digest).
This exercises `verifySkillBindings` as defense-in-depth against a
self-consistent malicious or buggy proposal, which is what it is actually
for now that F1 closes the simpler post-signing-edit path.

## Verification

`node --test tests/path-b-*.test.js` — 120/120 pass.
`node --test tests/onboarding-hardening.test.js tests/onboarding-invariants.test.js`
— 21/21 pass (all AT-HD-1 through AT-HD-12 and every I-A/B/C/D sub-case).
Phase 1 (all 8 findings, F1–F8) is now fully implemented.

## Not a return-to-grilling trigger

No oracle test body changed. `tests/path-b-hardening.test.js` is outside the
frozen Gate 1 manifest. Both fixes reuse existing, already-accepted
mechanisms (`writer.interrupted()`, `proposalBodyDigest`) rather than
introducing new trust-boundary exceptions.
