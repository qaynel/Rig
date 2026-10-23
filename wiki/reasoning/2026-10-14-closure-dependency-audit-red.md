---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: Dependency acceptance is red because two packages lack lockfiles and the MCP lock has high and critical advisories.
---
Done: T-8.4 first proof pass: root `npm audit --omit=dev` and `npm ci --dry-run` fail with missing-lockfile errors; `npm --prefix rig-mcp ci --dry-run` passes, but its audit reports 2 high and 1 critical advisories (plus moderate); pi-extension audit and dry-run fail for missing lockfile. In flight: inspect package manifests and lock coverage, then address only required lock/audit state. Next: rerun all audits and dry-runs.
