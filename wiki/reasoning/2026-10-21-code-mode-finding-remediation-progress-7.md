---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: historical
supersedes: 2026-10-21-code-mode-finding-remediation-progress-6
tags: review, remediation, progress
summary: Focused apply, remediation, empty-binding, default-deny, and permission-mutation checks pass; autofix still fails and all eighteen findings remain open.
---

Added an empty-selected-plan regression for the lint-format dispatch seam. It
failed before the guard and now reports `coverage_gap` with zero executions.
The existing signed Gate 1 replay case uses an unselected empty plan and still
passes; that locked behavior is preserved.

Read-only snapshots now compare entry type, mode, symlink target and file
content for visited repository entries. A component command that changes only
file permissions is reported as `mutated`, and its changed path is preserved.
The combined focused apply and trust-root suites pass: 31 tests. The signed
dispatch and selected-empty-plan cases pass in a separate two-test run. The
oracle verifier passes, wiki generation is current, `git diff --check` passes,
and the wiki budget check is within caps.

The full `guarantee-coverage` suite still fails four autofix/replay cases. The
expected failure of its unapproved network/resource fixture needs a policy-
authorized test setup; its other autofix discrepancies need root-cause work.
No approval is claimed: the acceptance ledger keeps all eighteen findings
open, with updated evidence for findings 4 and 8. Findings 5 and 7, installed
dispatch, CI preservation/first-run evidence, privacy, lifecycle journal
agreement, durable coverage apply, history scanning and global byte
preservation remain unverified.

Next: resolve the failing autofix path without weakening policy authorization,
continue the remaining public-entry-point criteria, and run the complete
repository gate only after the candidate is ready.
