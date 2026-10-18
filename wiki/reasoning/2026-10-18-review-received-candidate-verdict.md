---
date: 2026-10-18
source: review
topics: the-overhaul, review-receipts
decisions:
status: current
supersedes: 2026-10-17-review-received-final-candidate-review
tags: review, acceptance
summary: Candidate 082d8467 still requires changes for two reproduced recovery defects, normative design drift and failing size hints; findings 17–20 have acceptance criteria.
---

## Review Received — final advisory verdict

Reviewed `082d8467504d51aeda4ad955e78ee33c67ba548a` against `origin/qa-prod`.
Approval remains withheld. Three independent fresh-context passes covered
spec/scope, safety/correctness and architecture; primary reviewed tests and
evidence and independently reran both new failure probes.

- Migration refusal can delete an unrelated external mode-0640
  `migration.json` after a parent swap immediately following publication.
  `node .context/review-received-parent-race.js` exits 1 and records external
  inventory loss in `.context/review-received-parent-race.json`.
- An upgrade interrupted immediately after migration and before recording MCP
  setup retries successfully without the requested descriptor/dependencies.
  `node .context/review-received-upgrade-interruption.js` exits 1; its JSON
  records interrupted status 73, retry status zero and absent setup outputs.
- Current normative technical design still requires 55 materialized optional
  skill trees and eight native projections, while this branch's signed
  contract/implementation require zero optional trees and nine native skills.
  The default remote SHA download path also needs its working E2E spec synced.
- Six size hints fail verification on the submitted commit, despite its
  completion claim. Final checklist ticks were reopened rather than claiming
  evidence for the reviewed failures or pending platform results.

The acceptance handoff now records findings 17–20 with severity, evidence,
impact, observable criteria and runnable regression/integration commands.
Primary focused checks pass 44/44; the signed shelf-install check passes 1/1.
Fresh oracle/index/budget/version/coherence/rule-copy checks pass; size hints
fail. The prior full-suite log and local-archive E2E evidence were inspected,
not represented as new executions. Archive SHA-256 and Git tar commit header
match the submitted candidate.

The complete local report is `.context/review-received.md`; the former report
is preserved separately. This review changes report/acceptance/wiki documents
only, leaving uncommitted review notes beyond the reviewed SHA. It does not
fix implementation, push the candidate or create a GitHub approval. PR #153
remains at the previous head and BLOCKED. No binding review attempt ran; the
one prior failure and designated reviewer remain preserved. Correct the
findings, commit the full candidate, and renew final-byte tests/install/review
evidence before owner-controlled publication, exact-head checks and eligible
independent approval. Actual exact-QA-SHA remote Linux/macOS evidence still
belongs to the ordered promotion process.
