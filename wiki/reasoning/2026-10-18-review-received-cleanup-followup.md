---
date: 2026-10-18
source: agent
topics: distribution-and-release, review-receipts, testing-strategy
decisions:
status: superseded
supersedes: 2026-10-18-review-received-dirfd-fix.md
tags: review, migration, path-safety, mcp-retry
summary: Root-pinned migration temp cleanup and exclusive retry-marker creation close follow-up symlink races; focused verification is underway.
---

The first descriptor-publication fix still left cleanup operations that used
the mutable repository path. The review reproduced an external sentinel delete
both after successful publication and in temp-preparation error cleanup. The
migration now opens the repository-root descriptor before temp creation and
uses Python 3 standard-library `os.unlink(..., dir_fd=3)` for cleanup. A
preflight makes missing Python fail closed before temp creation. The editable
tests inject root replacement in both cleanup windows and verify external
bytes, modes and inventory.

The upgrade retry marker had two adjacent link boundaries. Reads now detect
present and dangling entries with `lstat`, require a regular non-symlink file,
open with `O_NOFOLLOW` and compare descriptor identity before reading. New
marker writes flow through the journal writer's exclusive no-follow create
path. Tests cover matching-content symlinks, dangling symlinks and a symlink
inserted between absence detection and creation; each must preserve outside
bytes, return nonzero and avoid npm.

The previously focused marker and root-publication subset passed before these
last cleanup expansions. The full current migration suite and new narrow
regressions are running; no repo-wide gate, commit, push, approval or merge has
been completed. Owner-controlled exact-commit QA evidence and the reserved
review receipt remain open.
