---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-final-gate-green
tags: review, remediation, verification
summary: Added shared output redaction and suppressed raw pre-commit scanner streams; focused privacy and materialized-runner suites pass, with the final full gate running.
---

Finding 14's matched-secret output path is tightened. A shared redaction module
filters scanner-shaped credentials, email addresses, and the local home path.
The canonical check runner applies it to results, reasons, and diagnostics;
interactive exact-copy errors use it too. `apply.js` materializes the helper
with the installed check runner. The installed pre-commit shim suppresses raw
gitleaks/trufflehog output and keeps a safe scanner-identity message.

A harmless credential sentinel is exercised through `runChecks`; it is absent
from the returned object and the local report. Scanner fakes emit the same
sentinel and the installed hook's output does not expose it. The focused
command covering inspect, scanner hooks, guarantee coverage, materialized
diagnostics, bootstrap, and trust-root fixes passes 91/91.

The owner-signed Gate 1 oracle check passes with 16 files and 95 cases. Wiki
index and budget checks and `git diff --check` pass. The final full `npm test`
run is in progress with output saved to `/tmp/rig-final-acceptance.log`. The
acceptance ledger is still 18/18 Open; other output routes and the remaining
finding-specific proof remain in flight.
