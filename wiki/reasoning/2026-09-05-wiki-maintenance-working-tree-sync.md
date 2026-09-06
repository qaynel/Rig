---
date: 2026-09-05
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags: verification
summary: The wiki-maintenance lint now accepts an uncommitted hub synchronization only when the changed hub explicitly cites every trace newer than its committed version, allowing the required pre-commit full-gate check without masking stale hubs.
---

# Wiki-maintenance working-tree synchronization

The maintenance lint previously compared a hub's last committed timestamp with
each trace's first-add timestamp. It therefore rejected a correct hub update
until after a commit, despite the required workflow running the full gate
before committing.

The lint now treats a modified hub as synchronized only when its working-tree
body names every trace newer than the hub's committed version. The regression
test covers that pre-commit path; a stale hub without the required citation
continues to fail.
