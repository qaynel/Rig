---
date: 2026-09-04
source: agent
topics:
decisions:
status: current
supersedes: 2026-09-04-pr146-test-plan-receipt
tags: review, verification
summary: Closes the one PR #146 test-plan failure — updated the five stale hubs (distribution-and-release, onboarding-flow, testing-strategy, the-catalogue, the-two-gates) to cite the 2026-09-04 traces that already named them in topics; independently re-verified npm test green at 6a1b6803.
---

# PR #146 hub-sync fix

[[2026-09-04-pr146-test-plan-receipt]] found `npm test` red:
`tests/wiki-maintenance-lint.test.js` failed because five topic hubs were
older than the newest 2026-09-04 trace that named each of them in `topics:`
— the "After filing" follow-up in `wiki/reasoning/README.md` had not been
done for [[2026-09-04-finished-product-design]],
[[2026-09-04-landscape-research-in-flight]], and
[[2026-09-04-structural-workflow-fix-design]].

Per the receipt's own "what would make this a pass" section, each hub was
given a citing addition (not a rewrite) summarizing the relevant trace
content and linking back to it:

- `wiki/topics/distribution-and-release.md` — cites the office-hours
  positioning research (catalogue-vendoring liability, tension with the
  tiered-rollout plan); flagged as research, not a ruling.
- `wiki/topics/onboarding-flow.md` — cites the open premise challenge to
  adaptive onboarding's "entire selling point" ranking; flagged as
  unresolved, pending intent-owner answers to Part 6's four questions.
- `wiki/topics/testing-strategy.md` — cites the structural root-cause
  design (mandatory-write / advisory-unbounded-read asymmetry) and the
  landscape research's framing of the frozen-oracle discipline as Rig's
  least-copied differentiator.
- `wiki/topics/the-catalogue.md` — cites the sharpened deletion case for
  the services matrix and the vendored skill shelf; flagged as not
  implemented, pending the Part 6 Q4 veto.
- `wiki/topics/the-two-gates.md` — cites the root-cause naming of the
  re-sign-multiplier symptom and the retirement of "decouple oracle from
  prose" in favor of separate signing-UX work.

Nothing implemented in the cited traces changed as part of this fix — only
the hubs' own text, to satisfy the citation obligation the lint enforces.
`node scripts/build-wiki-index.js` produced an empty diff against the
committed generated pages, so `wiki/status.md` and `wiki/index/reasoning.md`
did not need regeneration.

Not in scope, per the receipt: the standalone `check-size-hints.js` drift on
`wiki/index/quick-reference.md` (4 stale counts) and wiring it into
`package.json` (would need a Gate 1 re-sign). Left as recorded residual
findings.

## Verification

`npm test` — full suite green after this change (see commit for exact
output); the wiki-maintenance lint no longer reports any stale hub.
