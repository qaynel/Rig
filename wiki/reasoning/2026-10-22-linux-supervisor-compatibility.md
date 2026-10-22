---
date: 2026-10-22
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-22-cross-review-dependent-reports
tags: verification, remediation, linux, trap
summary: Seven shared review repairs are saved at a8f2d544; Linux Bubblewrap0.8 lacks preserve-fds, so signal preservation uses a bounded supervised envelope rather than a spoofable task stderr trailer.
---

18:05 UTC — Seven shared-seam repairs and their independent cross-review follow-up are committed at a8f2d544 for recovery. No push occurred. Installed dependency-report red/green10/10 is current. The active Linux lane owns only check-runner.js, lint-format.js, memory-guarded-exec.js, sandbox.js and its new regression; root owns final integration/wiki.

The Linux image's Bubblewrap0.8 rejects --preserve-fds. --sync-fd does not pass the descriptor through to the executed child. Do not repeat either unsupported channel assumption. A proposed marker/trailer on inherited task stderr was rejected before release because task output/descendants can impersonate a terminal status and turn failure into success.

The worker is reusing the existing Node memory supervisor: pipe child stdout/stderr privately, capture the actual child wait status, and serialize a bounded framed JSON envelope only on supervisor stdout. The host validates the exact envelope, restores separate public streams and fails closed on malformed/missing status. Child bytes are encoded as data, never parsed as control. Preserve requested per-stream output limits separately from envelope overhead; silent tasks with tiny limits must pass, genuine truncation must remain partial_output, and ordinary exit143 must stay distinct from SIGTERM. The OS isolation and process cleanup stay enforced. This is a fix within the existing task-outcome guarantee, not a change to the signed acceptance contract.

Actual Linux signal tests remain the blocking implementation work; no new owner signing or credential step is required. After its proof passes, root reconciles closure rows and final documents, commits the final candidate, reruns full npm on those exact bytes, obtains current-byte binding review and only then pushes PR153 and inspects required exact-head checks. The previous failed review/counter is retained.
