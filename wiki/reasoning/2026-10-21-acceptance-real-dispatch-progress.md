---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-final-privacy-gate-green
tags: remediation, verification
summary: New regressions reproduce unsigned task execution, post-approval script drift, unsigned coverage writes, and mixed-map partial launches; fixes now pass four focused cases while independent baseline/discovery/history work continues.
---

Scope is the existing eighteen-finding acceptance checklist, its shipping implementation modules and regression fixtures, and matching live documentation. The current owner instruction supersedes the old lack-of-authorization note for continued fixes and necessary review; frozen contract signing remains human-only.

Ranked causes confirmed by boundary observations: (1) execution approval was detached from actual read-only/grade routes, (2) coverage apply still trusted a public digest and returned only in-memory records, (3) installed discovery/scoping and baseline dispatch were incomplete, (4) acceptance evidence was never advanced from partial implementation to actual route proofs. Four new public-seam regressions failed on the existing code before changes and now pass. Exact referenced task/script/configuration snapshots and durable single-use consumption share a small installed task-approval module. Coverage reuses the durable install journal under exclusion rather than inventing another journal.

Parallel workers have non-overlapping ownership for activated policy/baseline, agent-proposed discovery/Path B, and history/global/journal. Root owns task dispatch, coverage, CI adapters, output taxonomy, integration and final evidence. Docker Linux is locally available, so Linux isolation proof will run here rather than being handed to the owner. Existing frozen positive fixtures that assume unsigned execution or digest-only coverage need a bounded fixture-only amendment before the final signed oracle can pass; no behavioral guarantee will be relaxed.

Next: finish all route integration, add remaining adversarial proofs, run Linux and installed-path tests, then record per-finding outcomes and run the full gate on final bytes.
