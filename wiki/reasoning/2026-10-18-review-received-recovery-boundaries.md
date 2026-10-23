---
date: 2026-10-18
source: agent
topics: distribution-and-release, review-receipts, testing-strategy
decisions:
status: superseded
supersedes: 2026-10-18-review-received-cleanup-followup.md
tags: review, migration, path-safety, mcp-retry
summary: Descriptor-pinned migration cleanup now preserves a replaced regular temp file, and MCP retry settles an interrupted exclusive marker journal write.
---

Independent review found two additional recovery boundaries in the current
implementation. First, migration opened the temp by mutable path and refused a
replacement inode, but its error cleanup could then unlink that replacement.
The fix keeps the temporary entry on validation or publication failure; a
pathname check cannot make unlink conditional on the checked inode. The new
regression substitutes an unrelated mode-0640 regular file and verifies its
bytes, mode and repository inventory survive refusal.

Second, MCP retry-marker creation can be interrupted after bytes are written
and closed but before the journal's applied record is appended. Retry now
reconciles only a regular, non-symlink file whose descriptor identity and
bytes match the journal-owned pending create. It appends the applied record
and closes that transaction before resuming migration. The new public-bootstrap
regression was red before the fix and now passes, along with existing absent-
path symlink race coverage.

The 20 focused migration, publication, interruption, and marker checks pass.
The `RIG_TEST_REAL_NPM=1` interrupted-upgrade test also passes: retry installs
real dependencies, launches the installed descriptor, completes the MCP
handshake and calls `rig_instructions`. The full migration-file command did
not complete; Node reported an unresolved promise after 168 seconds, so that
result is not counted as green. Repo-wide `npm test`, generated wiki checks,
the final exact-candidate review receipt and owner-controlled delivery are
still required.
