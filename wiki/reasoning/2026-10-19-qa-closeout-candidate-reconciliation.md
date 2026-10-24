---
date: 2026-10-19
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, verification
summary: The catalogue corpus is frozen for the proposed pin; focused policy and traceability checks pass after reconciling metadata and retaining exact test titles.
---

The catalogue worker froze `rig/corpus/catalogue.json` and service fragments after 13/13 focused semantic checks. The owner-only amendment candidate pins the current 1,042-file corpus digest. A focused networking metadata check initially failed because its editable test still expected now-retired repository-context/evidence-replay targets; it was changed to verify Policy-only native predicates and named fields, and passes. The authored-service test also passes.

The coherent proving-test scan found four failures that traced back to one editable host test title rename: ticket records still referenced its exact old title. Restoring that title without weakening the tri-state assertions made the host, ticket, and pre-v5 focused tests pass 11/11. A second candidate-patch review found eight renamed frozen acceptance test titles that would fail Gate 2 traceability after owner signing; the candidate now retains the original titles while strengthening their assertions. An isolated patched-tree coverage and manifest check reports all 95 case targets consistent. The actual signed worktree verifier remains green on 16 files/95 cases because frozen files are still untouched.

Installed lint-grade focused tests pass, including a nonzero observed Policy failure, and the separate target-aware CI planner now delegates to the shared CI adapter or returns a gap without a repository target. Final broad code checks, exact-commit release evidence, owner signing, and a newly authorized binding review remain.
