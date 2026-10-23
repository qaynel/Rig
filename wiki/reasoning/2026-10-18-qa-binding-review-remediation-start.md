---
date: 2026-10-18
source: agent
topics: the-overhaul, gate1-signing, testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, binding-review, remediation
summary: Exact-commit engineering checks passed, but the owner-designated review failed and exhausted the author-context attempt cap; signed-oracle contradictions and runtime findings now require remediation.
---

Committed candidate `f8140b7214d004fd925b1009201ac52979dcd227` passed the full local npm gate, exact-commit local archive E2E, real-npm MCP retry, and targeted macOS/Linux migration checks. The owner-designated `claude-opus-5` binding review then returned `fail` with unresolved AT-DIST-1, AT-PB-3, AT-PB-6, and AT-HOST-1. The wrapper wrote no receipt and retained two failures for author context `v6.0.0-qa-readiness-2026-10-17`. Its report is retained at `.context/qa-readiness-final-review-run.log`; the attempt file has not been reset or bypassed. PR #153 remains at its prior remote head; the candidate was not pushed.

Read-only triage confirmed that frozen Gate 1 AT-SHAPE-6 prose requires generic Policy-baseline wording while the manifested executable check bans it. Frozen AT-DIST-1 and AT-PB-3/PB-6 still describe 5.0.0 and staged third-party skills, contrary to the owner's locked 6.0.0 fetch-during-onboarding direction. The same review found substantive catalogue authorship/disposition, policy-status, host-contract, and lint-format approval-identity defects. A few quantities in the review were overstated; the core contradictions remain. The owner must apply a batched Gate 1 and manifested-test amendment and re-sign it; no agent may edit those frozen files or reset the review cap. This turn begins preparing that amendment and correcting editable implementation and tests. Final-byte evidence and a fresh binding review must be renewed after the changes.
