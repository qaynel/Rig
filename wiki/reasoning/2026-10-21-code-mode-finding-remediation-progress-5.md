---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: current
supersedes: 2026-10-21-code-mode-finding-remediation-progress-4
tags: review, remediation, progress
summary: Signed apply/remediation and selected runner regressions pass, but repository-wide verification is blocked by legacy unsigned fixture expectations and most findings remain open.
---

17:25 IST — recorded the verification boundary for the ongoing eighteen-finding
remediation. Gate 1 files are unchanged and `scripts/check-advanced-spec.js`
passes with 16 protected files and 95 acceptance cases.

The signed apply/remediation suite passes all 16 tests using a new separate
fixture adapter. Targeted dispatch, empty-shape and read-only nonzero-exit
regressions pass. `git diff --check` is clean.

The repository-wide `npm test` run did not complete. It showed multiple legacy
fixture-driven failures because frozen tests use caller-asserted
`verified: true` approvals, which the corrected public apply path rejects.
Other existing cases now reach actual command execution and expose policy or
fixture assumptions. I stopped the run after more than five minutes without a
completion result. No test-only approval bypass was added. The owner criteria
say the Gate 1 oracle is preserved; a compatible signed fixture/oracle update
must be reviewed and signed before those frozen expectations can change.

Findings 1–3, 6 and 8 have partial implementation evidence; finding 2's CLI
now returns a redacted verdict and points to local reports. Findings 4–5 and
7–18 remain open or only partly implemented. No finding is marked closed.
Next required work is a signed oracle-compatible test path, complete coverage
of actual installed dispatch and all remaining criteria, then a complete green
repository gate and independent review.
