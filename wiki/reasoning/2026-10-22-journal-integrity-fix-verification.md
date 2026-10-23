---
date: 2026-10-22
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: current
supersedes: 2026-10-22-journal-integrity-fix-progress
tags: security, data-loss, journal, verification
summary: Lifecycle uninstall now rejects structurally incomplete operation journals before mutation; complete producer records and strict preservation regressions pass focused verification.
---

The independent review reproduced a destructive trust-boundary flaw: an
ownership-free applied row could make public uninstall delete a user file.
`rig/lib/lifecycle.js` now requires complete structural fields for each
operation record, validates typed install-state and truncated-tail recovery
records, and permits only the actual payload preimage-backup producer's
documented digest shape. Invalid operation history fails during manifest read,
before uninstall begins any file or global mutation.

`tests/remediation-review-journal.test.js` checks missing ownership, state,
operation, or digest, malformed pending/history rows, and byte-for-byte
preservation through public uninstall. It also covers all legitimate
writer-emitted operation variants. Hand-authored non-frozen fixtures in
`install-uninstall-roundtrip`, `release-blockers`,
`remediation-history-global-journal`, `path-b-inventory`, `path-b-weight`, and
`trust-root-review-fixes` were upgraded to complete schemas; tests that target
corrupt journals retain strict refusal assertions rather than accepting
best-effort mutation. No frozen acceptance artifact was changed.

Passing focused checks:

- `node --test tests/remediation-review-journal.test.js tests/remediation-history-global-journal.test.js tests/install-uninstall-roundtrip.test.js tests/remediation-apply-coverage.test.js` — 50/50.
- `node --test tests/release-blockers.test.js` — 42/42.

An extended run additionally passed the Path B inventory cases and had 100
passing assertions overall, but Path B hardening and weight tests were canceled
after hanging on external upstream fetches. The extended run also exposed one
unrelated `trust-root-review-fixes` failure, `missing_context_index`, in a
separate staged-blob coverage change. It is not evidence about this journal
fix. Root's full main suite is running independently; no full suite was started
here. `git diff --check` also reports an existing extra blank line at EOF in
root-owned `docs/advanced/operator.md`.

Next: root integrates this slice with the other active repairs and final
binding review. This checkpoint makes no branch-readiness or deployment claim.
