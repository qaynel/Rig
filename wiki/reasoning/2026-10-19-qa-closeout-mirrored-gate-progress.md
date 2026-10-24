---
date: 2026-10-19
source: agent
topics: testing-strategy
decisions:
status: historical
supersedes:
tags: qa-closeout, verification
summary: The restarted broad run confirms AT-LF-5 now passes and is processing the service matrix with the digest-pinned mirror.
---

The second `npm test` diagnostic uses the exact tar-digest-verified shelf archive in `.context/` as a local mirror. It passed AT-LF-5 after the editable invalid-plan message change. The lint failures emitted so far are the frozen fixtures already addressed by the owner-only amendment. The run is processing the long catalogue matrix; no unrelated failure has appeared in its output so far. A duplicate coherence process was stopped so the broad run remains the only active coherence scan. The local owner patch continues to pass `git apply --check` and has not touched the signed worktree files.

After the broad run finishes, inspect its complete failures, finish any editable correction, commit the candidate, and run the local exact-commit archive install and real-npm MCP retry again on that commit. The owner's amendment/signature and binding review exception remain separate release blockers.
