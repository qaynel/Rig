---
date: 2026-10-18
source: agent
topics: the-overhaul, install-manifest-removal, testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, migration, verification
summary: The maintained migration suite passes on macOS and the interrupted-publication and replacement cases pass on Linux; final candidate checks remain.
---

The maintained migration suite passed 49/49 on macOS after the temporary-record retention and projected-file protection changes. On Linux in the Node 22 Docker image, the named interrupted-publication recovery and both post-validation replacement cases passed 3/3. Linux's hard-link publication required a narrow guard exception only for the final migration record linked to its own matching regular temporary record; unrelated hard links remain refused. The macOS clone is recognized by matching transaction bytes, rather than inode equality.

The final documentation and generated-file checks, full npm gate, exact-commit archive E2E, and real-npm MCP retry remain pending. Report-only audits are in flight. No binding receipt, commit, push, approval, or merge has been attempted.
