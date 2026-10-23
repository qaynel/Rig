---
date: 2026-10-18
source: review
topics: the-overhaul, review-receipts
decisions:
status: superseded
supersedes:
tags: review, verification
summary: Renewed report-only review checks the uncommitted migration and MCP recovery fixes; final evidence and cleanup entry ownership remain under review.
---

Owner implementation handoff, verbatim:

Implemented the migration and MCP retry fixes. Python 3’s standard library is the added migration helper.

- Migration uses pinned directory descriptors for temp creation, publication, and cleanup. If a temp path is replaced, refusal preserves the replacement file.
- Upgrade retries preserve MCP setup intent, including an interruption after marker creation but before its journal entry is applied.
- Updated the acceptance handoff, design docs, and generated wiki indexes and size hints.

**Verification:** focused migration checks passed 20/20; docs/catalogue checks passed 12/12; the real-npm retry completed an MCP handshake and called `rig_instructions`. `npm test` passed: main 1,109 passed, 2 skipped; Pi 15/15; MCP 6/6. The full log is at [.context/npm-test-final.log](</Users/winmore/conductor/workspaces/rig-v0.1/ithaca/.context/npm-test-final.log>).

PR #153 remains open and unchanged. I did not commit, push, request review, or approve. Exact-SHA Linux/macOS evidence and the owner-controlled review and delivery steps remain before it can close.

Review checkpoint: implementation HEAD remains 082d8467504d51aeda4ad955e78ee33c67ba548a and fixes are uncommitted. Independent fresh-context safety, architecture and scope reviews are running. The primary focused suite is running; fresh oracle, wiki index/budget, size hints and version checks pass. The retained full npm log reports 1,109 main passes, two skips, Pi 15/15 and MCP 6/6; this review has not rerun the complete gate. A replacement of the temporary directory entry immediately before successful unlinkat cleanup is independently reproduced as data loss and is being captured in a standalone ignored reproduction. No code, frozen oracle or binding review attempt has been changed.
