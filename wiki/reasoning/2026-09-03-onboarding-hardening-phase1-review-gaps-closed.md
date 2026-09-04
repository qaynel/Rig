---
date: 2026-09-03
source: review
topics: onboarding-flow, trust-and-failure-boundaries, testing-strategy
decisions:
status: historical
supersedes:
tags: review
summary: Closed the two non-blocking gaps left open by the Phase 1 code review — added a regression test for the unscoped-resume-signal fix, and synced the technical spec's F4 text to the implemented `instructionOnlyScope` fallback deviation.
---

# Phase 1 review gaps closed — 2026-09-03

## Context

[The Phase 1 code-review trace](2026-09-03-onboarding-hardening-phase1-code-review.md)
found and fixed four real defects, then deferred four items as non-blocking
simplification/reuse findings. Before treating the branch as clean for
`qa-prod`, two of those defects — not the deferred simplifications — turned
out to still have open loose ends worth closing pre-push rather than as
fast-follows: the fix that closed a security-relevant bypass shipped with zero
regression coverage, and one fix quietly diverged from the written spec
without the spec being updated to match.

## Closed: regression test for the unscoped resume-signal fix

`rig/lib/onboarding.js apply()`'s `resumingThisProposal` check
(`writer.interrupted() && writer.interruptedOwner() === state.proposal.digest`)
had no test exercising the *scoped* half of that condition — every existing
resume test (`tests/path-b-hardening.test.js`, "Task 4 (Issue 4) — journal-aware
preflight resume") only ever resumes a crashed transaction with its *own*
proposal still current. Nothing proved that an unrelated interrupted
transaction — left by an abandoned, superseded proposal — cannot suppress the
freshness check for a different, later proposal reusing the same
`.rig/install-manifest.jsonl`.

Added `AT-PB-hard resume-scope` to `tests/path-b-hardening.test.js` (new
describe block, same file as the existing resume tests since this is beyond
the frozen oracle's own coverage, matching the review trace's own scoping
note): crash a first proposal's apply mid-write via the existing `crashAfter`
helper, leaving an open `install_state` record owned by that proposal's
digest; drift the repository; re-propose a second, genuinely different
proposal (different `summary_digest`, same graft path/content as the first so
the *separate* "changed pending payload write" guard in `preflightGrafts`
stays silent and doesn't mask the check under test); apply the second
proposal and assert it is rejected with "inventory changed since propose".

**Verified the test actually discriminates the regression**, not just
exercises the code path: reverted `resumingThisProposal` to the pre-review
`writer.interrupted()` (unscoped) form, confirmed the new test fails with
"Missing expected exception," restored the real fix, confirmed it passes
again. An earlier draft of this test used a differently-worded second graft
body to force a distinct digest; that made the *wrong* guard fire (a
`preflightGrafts` "changed pending payload write" mismatch, which also
matches a loose `/changed/i` assertion) and passed even against the broken
code — a false-positive regression test. Narrowed the graft body to stay
identical and drove the digest difference through the summary text instead,
which isolates the inventory-freshness check cleanly.

## Closed: spec sync for the `instructionOnlyScope` deviation

[The F4 scopes trace](2026-09-03-onboarding-hardening-phase1-f4-scopes.md) and
[the code-review trace](2026-09-03-onboarding-hardening-phase1-code-review.md#fixed-instructiononlyscope-lost-the-old-catch-all-fallback-for-uncommon-hosts)
both record a deliberate deviation from the literal F4 spec text: dropping the
`INSTRUCTION_ONLY_HOSTS.has(host)` gate from `instructionOnlyScope` to restore
the pre-F4 fallback for hosts outside that registry set (e.g. `copilot-cli`).
`wiki/gate2/onboarding-hardening-spec.md` §F4 still described the original,
now-superseded design (registry-gated `instructionOnlyScope`) as current —
the process step meant to flag "an implementation deviation needs the spec
updated to match" didn't fire during Phase 1.

Updated `wiki/gate2/onboarding-hardening-spec.md`'s F4 section: replaced the
registry-gate description with the actual (ungated, playbook-existence-only)
behavior, explained why (registry membership answers an install-time staging
question, not a projection-time discovery question), cited the empirical
regression repro, and added a fourth **Rejected** option for the
registry-gated design with a pointer to why it was tried and reverted. The
doc's own header ("Status: WORKING... the code adapts to this design and this
design adapts to what the code learns") is what licenses updating it here
rather than treating the deviation as spec-violating.

## Verification

`node --test tests/path-b-hardening.test.js` — 65/65 pass (was 64/64 before
the new test). Full `npm test` run pending as the final pre-push gate.
