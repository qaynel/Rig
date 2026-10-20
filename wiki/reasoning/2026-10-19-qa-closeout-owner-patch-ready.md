---
date: 2026-10-19
source: agent
topics: testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, verification
summary: The owner-only patch now covers the frozen lint fixtures exposed by the broad run; 17 amended cases and all manifest and trace checks pass in isolation.
---

The owner-only patch was extended for the target-aware CI case and for drift and symlink cases that require a valid signed nonce approval before execution. Its 17 focused cases pass in an isolated applied copy. All 16 manifest entries and all 95 Gate 2 trace targets match there, and `git apply --check` passes against the live worktree. The live frozen files remain untouched, and the current owner signature still verifies them.

The real-npm interrupted MCP retry passed. The broad `npm test` run is still inside the long catalogue matrix; its frozen lint failures are expected on the unsigned candidate. The next local steps are to read its complete result, fix any unrelated failure, commit the editable candidate, and exercise the exact-commit local archive. The owner then needs to inspect and apply the frozen patch, re-sign, run the full gate on those bytes, and authorize any further binding review attempt.
