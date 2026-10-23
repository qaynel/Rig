---
date: 2026-10-17
source: agent
topics: the-overhaul, review-receipts
decisions:
status: superseded
supersedes:
tags: review, implementation
summary: The per-finding acceptance policy is in place; the network diagnostic and exact-SHA Linux/macOS eligibility fixes are red-green verified while two fixes remain in flight.
---

The resolution acceptance policy already exists at
`wiki/specs/close-everything/review-received-resolution.md`. It gives each of
the four findings observable acceptance criteria and per-finding evidence,
preserves the signed oracle, and reserves delivery and approval actions for the
owner-controlled process.

Finding 4 has a new editable regression file,
`tests/review-received-diagnostics.test.js`. Its first run failed because
successful named and component checks discarded their diagnostics and because
the installed CLI emitted no warning for those bindings. The fix accumulates
distinct diagnostics in `runBinding`, carries them through later failures, and
lets the normal reporting caller render each once. The focused regression now
passes all four cases, including local CLI output, one GitHub annotation,
execution counts and IDs after a failure, and declared network denial.

Finding 3 now invokes the reusable clean-install workflow on the resolved QA
SHA and requires its result for eligibility. Its editable workflow regression
failed on the reviewed workflow and now passes, including the Linux/macOS
matrix, failed/cancelled/skipped blocking behavior, both-green progression,
stale-QA checks, and the separate tag smoke test. Actual exact-SHA platform
run URLs and artifacts remain pending.

Findings 1–2 are assigned to isolated workers with ownership limited to their
runtime files and editable regressions. Their results, full relevant test
suites, and the full candidate verification remain pending. No PR review,
push, or merge was attempted.
