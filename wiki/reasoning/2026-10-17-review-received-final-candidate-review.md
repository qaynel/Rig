---
date: 2026-10-17
source: intent owner
topics: the-overhaul, review-receipts
decisions:
status: superseded
supersedes:
tags: review, acceptance
summary: Renewed review of candidate 082d8467 reproduces external-file deletion and an interrupted upgrade that skips MCP setup; approval remains withheld.
---

## Owner handoff (verbatim)

Resolved the findings and added an acceptance-criteria review policy in [review-received-resolution.md](/Users/winmore/conductor/workspaces/rig-v0.1/ithaca/wiki/specs/close-everything/review-received-resolution.md). The architecture review found no remaining design conflict.

Final local candidate: `082d8467504d51aeda4ad955e78ee33c67ba548a`. The worktree is clean.

- `npm test` passed: 1,095 main tests, 2 skipped; Pi 15/15 and MCP 6/6. Full log: [.context/npm-test-final.log](/Users/winmore/conductor/workspaces/rig-v0.1/ithaca/.context/npm-test-final.log).
- Exact-SHA local-archive E2E passed for fresh and existing repositories. It exercised real npm downloads, the MCP tool call, service check, and uninstall inventory comparison. Evidence: [.context/final-candidate-e2e.json](/Users/winmore/conductor/workspaces/rig-v0.1/ithaca/.context/final-candidate-e2e.json).
- The real-npm public v5 upgrade test passed. Oracle, version, coherence, and diff checks passed.
- Verification details: [.context/final-candidate-verification.txt](/Users/winmore/conductor/workspaces/rig-v0.1/ithaca/.context/final-candidate-verification.txt).

PR #153 remains open at its previous head, `ba371b641e3dc6b245d94acaa1a29a882011a8ec`; this candidate has not been pushed. Closing it still requires the owner-controlled delivery steps: publish the candidate, obtain required QA checks and the preserved review receipt, then get eligible independent approval and merge. The local E2E evidence does not claim GitHub-hosted or Linux/macOS QA results.

## Report-only checkpoint at 18:31 UTC

- Verified the initial clean worktree and exact HEAD. Retained archive digest and Git tar commit header match the submitted E2E evidence. The full-suite log records the reported passing counts; that gate has not been rerun in this review session.
- Independent spec/scope, correctness/safety and architecture passes reviewed the candidate; primary reviewer covers test evidence. No binding review wrapper ran and the one-failure attempt state remains unchanged.
- Primary independently reproduced a post-publication parent swap: migration refuses but deletes an unrelated external mode-0640 `migration.json`. Reproducer and evidence are `.context/review-received-parent-race.js` and `.json`.
- Primary independently reproduced interruption immediately after migration returns: retry with the same requested MCP setup exits zero with no pending marker, descriptor or dependencies. Reproducer and evidence are `.context/review-received-upgrade-interruption.js` and `.json`.
- Spec review found the normative technical design still requires 55 materialized optional skills/eight native projections despite the branch's zero-staging/nine-native contract. The E2E interface documentation also describes the superseded default local-archive path.
- Fresh oracle/index/budget/version/coherence/rule-copy checks pass. Size-hint verification fails six stale hints. Focused migration/diagnostics/workflow/artifact/docs tests are in flight; no source fix is being applied.
- Fresh read-only GitHub lookup still shows PR #153 at the previous head with failing test checks and merge state BLOCKED. No review/comment/approval was published.
- Next: finish focused evidence, attach bounded acceptance criteria to every finding, and update the local Review Received report. Review documentation will be an uncommitted follow-up to the reviewed commit, not evidence that its implementation changed or passed.
