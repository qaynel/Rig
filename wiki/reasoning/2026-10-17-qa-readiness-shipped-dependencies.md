---
date: 2026-10-17
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: superseded
summary: Independent review finds the installed MCP lock missed by health; its actual audit is red, so the clean source lock must also govern shipped runtime dependencies.
---

Done: Luna independently reviewed the workflow correction and confirmed the
root/pi dependency commands were inapplicable. It found a second real dependency
package: rig/manifest.json copies rig/mcp-runtime to the installed runtime,
whereas health audited only rig-mcp. The source package is 6.0.0 and audit-clean;
the installed package remains 5.0.0 with an older dependency lock. Actual npm
audit on that installed package reports six vulnerable packages: one critical,
two high and three moderate. Its lock dry run is otherwise synchronized. This
is a shipping gap despite a green source-package audit.

The frozen I-C-4 contract deliberately retains matching MCP entrypoints.
Removing a runtime tree would change that contract; the minimum fix reuses the
already clean source package manifest and lock in the shipped copy, extends the
existing parity guard to those package files, and audits/dry-runs both actual
dependency packages in health. No new dependencies or oracle amendment are
needed. This also prevents the stale installed version from recurring.

In flight: Luna owns that bounded implementation and real audit/lock checks.
Root's advisory full gate is still running with the newly included scoped
removal tests. The owner confirms the separate documentation agent is still
working. Final evidence waits for its write freeze; root preserves those edits,
adds no product-doc changes during that work, and retains the existing review
attempt counter. Next: finish dependency correction, receive docs-ready
handoff, freeze and verify the combined exact candidate.
