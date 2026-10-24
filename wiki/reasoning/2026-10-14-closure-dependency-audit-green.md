---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: All three package audits and clean-install dry-runs now pass.
---
Done: T-8.4; added minimal root and pi-extension lockfiles and updated only vulnerable transitive versions in `rig-mcp/package-lock.json`. `npm audit --omit=dev --audit-level=high`, `npm --prefix rig-mcp audit --omit=dev --audit-level=high`, and `npm --prefix pi-extension audit --omit=dev --audit-level=high` each report 0 vulnerabilities. `npm ci --dry-run`, `npm ci --prefix rig-mcp --dry-run`, and `npm ci --prefix pi-extension --dry-run` each exit 0. No package manifest or dependency was added. In flight: none. Next: T-8.5 CHANGELOG and release gate.
