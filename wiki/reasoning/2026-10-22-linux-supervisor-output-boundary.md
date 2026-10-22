---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-linux-supervisor-compatibility
tags: verification, remediation, linux
summary: Bounded supervisor envelope replaces unsupported fd channels; Linux launch removes unnecessary detached child, while output-limit/metadata validation and final platform checks finish.
---

18:09 UTC — Seven shared review fixes remain recoverable at a8f2d544; the Linux follow-up remains uncommitted under the active worker. A bounded exact envelope now encodes task output separately from actual code/signal, with no child-inherited supervisor output descriptor. Root reviewed envelope parsing, stream restoration, outer-code consistency, missing/malformed metadata failure, and original per-stream output limits. Root identified that maxBuffer must be mapped explicitly to the supervisor limit, distinct from envelope headroom, and requested exact code/signal validation and bounded metadata collection outside the watchdog's monitored tree.

The worker found an unnecessary detached child launch failed inside Bubblewrap's new session and removed it. The outer process-group and PID-namespace teardown already own cleanup. Actual configured six-ending/timeout cases are reported green during the current loop; final public-run Linux/macOS and spawn-ratchet evidence is still pending. Root additionally requested that output overflow terminate reliably even if a fork keeps output pipes open, rather than hanging until the unrelated timeout and losing partial_output taxonomy. No speculative exception or policy downgrade is accepted.

No protected oracle file changed, no owner action or new signing requirement exists, and no branch push/deployment is claimed. Complete the actual platform regression evidence before final ledger reconciliation, freeze/commit, complete npm, fresh binding review and required exact-head PR checks. The earlier full gate1292+15+6 belongs to baf53252 and cannot certify these changed bytes. Logs and handoff remain under .context/qa-closure/.
