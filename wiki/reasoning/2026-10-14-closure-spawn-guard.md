---
date: 2026-10-14
source: agent
topics: trust-and-failure-boundaries, testing-strategy
decisions:
status: historical
summary: New timed subprocess callers use the shared process-tree guard and pass the spawn-guard ratchet.
---
Done: T-2.8; `node --test tests/spawn-guard-allowlist.test.js tests/spawn-guarded.test.js` — 9 pass, 1 Linux-only skip. The three new timed subprocess callers now use `spawnGuardedSync`, reducing the ratchet from 24 to 21 debt sites. In flight: T-3.7. Next: fix corpus parity and v5 migration reds.
