---
date: 2026-10-18
source: agent
topics: distribution-and-release, review-receipts, testing-strategy
decisions:
status: current
supersedes:
tags: review, migration, path-safety
summary: The post-link deletion race is closed by retaining failed publication links, but a pre-link parent swap still allows publication through a substituted path and keeps Finding 17 open.
---

A fresh race review found that comparing a mutable destination with the opened
inode before unlink is still unsafe: `.rig` can be replaced between `lstat` and
`unlink`. Failure handling now never unlinks the publication destination. The
root-level temporary file remains separately recoverable, and an editable
regression checks that cleanup does not inspect the mutable destination after a
parent swap.

The broader test exposed an adjacent publication race. If `.rig` is replaced
immediately before `fs.linkSync`, the syscall can create Rig's migration record
through the replacement path. The old cleanup removed that link, but that
cleanup could also delete an unrelated external replacement. Retaining it
prevents deletion but does not meet the existing containment criterion. The
pre-publication race remains a red test, Finding 17 stays open, and no candidate
commit, push, approval, binding review or merge is authorized from this state.

The MCP-emitting interrupted upgrade retries its owned setup marker, and a
retry that changes to non-emitting `generic` clears the stale owned marker
without npm or descriptor creation. Active release design terminology and the
AT-DIST-1/AT-PB-3 documentation checks were also tightened. The exact safe
publication primitive is under investigation; all other final wiki and
repository gates must be regenerated after the resolution.
