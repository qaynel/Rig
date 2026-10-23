---
date: 2026-10-19
source: agent
topics: testing-strategy, gate1-signing
decisions:
status: current
supersedes:
tags: qa-closeout, verification
summary: The full gate revealed frozen lint-case fixtures that predate nonce approval and target-aware CI behavior; the owner-only patch is being reconciled.
---

The repository-wide run reached the frozen lint cases and reported eight failures. Four are the known Policy, Context, Evidence, and nonce assertions already covered by the candidate amendment. The other four are AT-LF-5, 13, 14, and 24. AT-LF-5 only expected the error to mention a plan digest, so the editable validation error was clarified and that original case now passes. AT-LF-13 still assumes a targetless CI summary; the implementation now requires an actual repository target and shared approved adapter. AT-LF-14 and 24 pass unsigned approval objects to execution, which the nonce signature gate correctly refuses before evaluating drift or symlink behavior. The owner-only patch is being extended to keep the same case titles and test those behaviors with valid approvals. No frozen worktree file was edited.

The real-npm public bootstrap retry with MCP setup intent passed on the current editable worktree. The full gate remains in progress because the catalogue matrix takes several minutes. After the owner patch is complete, a signed oracle and final-byte full gate remain necessary.
