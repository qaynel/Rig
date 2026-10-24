---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: historical
supersedes: 2026-10-21-code-mode-finding-remediation-progress-2
tags: review, remediation, progress
summary: The remediation path now requires signed consent and supports rollback/restart recovery, while approved plan execution now launches its commands and rejects replay; installed lint-grade dispatch remains unfinished.
---

17:18 IST — continued implementing the signed eighteen-finding acceptance
checklist without changing Gate 1.

Finding 2: the public CLI now exposes a read-only remediation challenge and
requires a Gate 1 signature for the exact proposal, repository, current
preimages, and active-policy bytes. Apply rechecks the inputs under the shared
install lock, records backups and pending/applied/terminal states, rolls back
a later write failure, and recovers a process killed after a write. It runs the
repository check after successful remediation and returns that scan through
the API. `node --test tests/advanced-apply.test.js` passes the signed positive,
digest-only forgery, stale preimage, partial rollback, and killed-process
recovery cases. The CLI currently returns only the scan status; full safe
finding detail and concurrent-attempt proof remain open.

Finding 4: `executePlan` now validates signatures and current source snapshots,
atomically consumes the one-use receipt, launches its exact commands through
the shared runner, and stops if a read-only command mutates the repository.
The new dispatch regression and frozen AT-LF-20 case pass. The installed
Policy/Context/Evidence and CI routes still bypass this boundary, so the finding
remains open.

Finding 3 and 6 remain as recorded in the preceding progress trace: empty
executable shapes fail closed, and missing network declarations use tested
network isolation or a named refusal.

Current issue: adding fixture Gate 1 signatures exposes a fixture-accounting
case where a test's pre-apply trust-root replacement is not journaled and is
therefore correctly preserved by uninstall. The test setup needs to model the
bootstrap-owned trust-root lifecycle; this is not a product cleanup claim.

Next: wire one-use consent into installed lint-format dispatch, then implement
filesystem isolation. The full `npm test` gate has not been run; findings 1–18
remain open until their complete criteria and evidence are reviewed.
