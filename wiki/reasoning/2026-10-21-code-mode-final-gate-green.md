---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-index-and-global-json
tags: review, remediation, verification
summary: The signed Gate 1 oracle and final full npm test pass after approval-boundary, filesystem sandbox, staged-index, and global JSON fixes; all eighteen findings remain open pending the remaining specific acceptance proof.
---

The owner-signed Gate 1 oracle passes with 16 files and 95 acceptance cases.
The final full `npm test` run passes: 1,196 main-suite tests passed, 2 were
skipped, Pi extension passed 15/15, and MCP passed 6/6. `node scripts/build-wiki-index.js
--check`, `node scripts/check-wiki-budget.js`, and `git diff --check` also
pass. A preceding full invocation emitted a wiki diff failure; all three
isolated wiki test files passed 13/13, and a logged complete rerun passed.

Finding-specific work added real SSHSIG wrong-key and cross-repository apply
rejections; Linux bubblewrap now starts with an empty root and explicit
runtime mounts; staged sanitation reads index blobs and shares the adoption
content classifier; global JSON changes use member-span edits that preserve
unrelated lexical bytes. Their focused tests pass.

The acceptance ledger remains 18/18 Open. Required proof still missing
includes installed dispatch and drift coverage, complete discovery/scope and
Path B end-to-end runs, policy-aware real git/CI dispatch, atomic policy and
action races, semantic-review evidence, real provider first runs, full
abnormal-output route capture, Linux runtime execution, generic namespace
ownership transfer, and a fresh independent binding receipt authorized by
the owner. Do not report project acceptance from the green automated gate
alone.
