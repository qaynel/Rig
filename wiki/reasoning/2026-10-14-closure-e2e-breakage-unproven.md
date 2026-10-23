---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: superseded
supersedes: 2026-10-14-closure-e2e-faults-red
summary: T-6.5 fault injection cannot be attributed because both corrupted-lock and clean-lock E2E runs fail at the same earlier missing MCP descriptor.
---
Done: used isolated temporary repository snapshots with committed candidate bytes. The invalid-integrity lockfile run (`node scripts/clean-install-e2e.js --sha 00d3af77c6f02c608c50b860af0e67fd07ebc93a --out /tmp/rig-e2e-bad-lock.4pNAf3/evidence.json`) exited 1 with `ENOENT ... fresh/.rig/mcp-server.json`; restoring the valid SDK integrity and rerunning on a clean candidate (`a1dba18e5ecbefa1e195edc761b49ac4f5194743`) produced the same error. Thus the control is already red before E2E reaches a point that can establish the bad-lock effect. Did not claim the requested missing-corpus case; T-6.5 remains open. In flight: T-6.6 candidate script entrypoint. Next: inspect its filed pin amendment and verify the candidate leaves package scripts unchanged.
