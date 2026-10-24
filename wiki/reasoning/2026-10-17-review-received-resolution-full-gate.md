---
date: 2026-10-17
source: agent
topics: the-overhaul, review-receipts, trust-and-failure-boundaries
decisions:
status: historical
supersedes: 2026-10-17-review-received-resolution-verification
tags: review, verification
summary: The full local gate passed after restoring the fresh-install MCP host check; exact-commit, QA platform, review-receipt, and owner delivery evidence remain.
---

The first full `npm test` exposed a regression outside the four findings:
fresh installs attempted MCP dependency setup on hosts without emitted MCP
configuration. The shared finalization helper had lost the existing
host-emission condition. The fix restores that condition for fresh installs
and applies the migration's resolved host list before requested setup. The
frozen `AT-HOME-1 OpenClaw MCP opt-in is explicit, installed, and reversible`
case passed, as did the v5 bootstrap retry regressions (2/2).

After that fix, the full `npm test` command passed. The repository Node suite
reported 1,085 passes, zero failures, and two platform skips across 1,087
tests; the Pi extension suite passed 15/15 and the MCP suite passed 6/6. This
includes the signed Gate 1 oracle check, secret scan, rule-copy check, version
check, corpus projection check, and all migration, installer, MCP, workflow,
and diagnostic regressions. This run occurred before committing and before the
acceptance-policy checkboxes and this trace were added; exact-candidate full
gate evidence is still required.

The migration, MCP upgrade, workflow, and diagnostic code criteria are
recorded as met in the review policy. Finding 3's required successful Ubuntu
and macOS run URLs/artifacts for the exact QA SHA remain outstanding. A fresh
binding review receipt and independent PR approval are owner-controlled; the
connected PR author cannot self-approve, and previous GitHub review publication
returned HTTP 403. No PR push, approval, or merge was attempted.
