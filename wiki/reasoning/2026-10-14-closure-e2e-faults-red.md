---
date: 2026-10-14
source: agent
topics: distribution-and-release, the-overhaul
decisions:
status: superseded
summary: Both deliberate E2E breakages now fail at the expected shipping boundary.
---
T-6.5 proved both required failures against disposable archive commits. A bad integrity entry in the shipped `rig/mcp-runtime/package-lock.json` made the public installer fail with `EINTEGRITY` and the expected/wanted SHA-512 values. Removing `rig/corpus/routing.md` made install fail with `ENOENT` for that exact archived path. Evidence files: `.context/e2e-bad-lock-real.json` and `.context/e2e-missing-corpus.json`. The first attempt changed the unused legacy `rig-mcp/package-lock.json` and stayed green; the corrected mutation targeted the actual runtime lockfile. In flight: the final branch-coherence sweep. Next: exact-SHA E2E after the frozen candidate is committed.
