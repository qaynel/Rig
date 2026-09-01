---
date: 2026-09-01
source: agent
topics: catalogue-contract, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: trap
summary: The handoff named a frozen connect-chrome/browser tie-break test that is absent on this branch; the same frozen contract is now represented by an explicit duplicate-source fixture, with the discrepancy documented for the human signer.
---

# Path B hardening, Issue 5 — frozen test drift

The hardening handoff described an existing frozen catalogue assertion for the
`connect-chrome` / `browser` tie-break. Inspection of the baseline branch found
that the current frozen test contains only the live membership assertions and
does not contain that tie-break case.

The implementation therefore adds the equivalent explicit frozen acceptance
case: two source directories declare `name: qa`, and catalogue generation must
reject the collision while naming both source locations. The non-frozen
hardening suite carries the same behavior test. The unfreeze request records
that this is an equivalent replacement, not a line-for-line edit of a test that
is not present in the branch.

The live shelf was inspected for legitimate collisions; none were found, so no
declared identity or migration entry was changed.
