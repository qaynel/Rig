---
date: 2026-09-01
source: agent
topics: distribution-and-release, delivery-plan, onboarding-flow
decisions:
status: current
supersedes:
tags: interdependency
summary: Path B now has one public install grammar and a journal-backed onboarding weight and correctness check.
---

# Path B slice 6 — operator path and check closure

The public release path is now `install rig`. The launcher accepts repeatable
host selections, preserves bounded detection when no host is supplied, and
passes a first-seen deduplicated host list through the existing bootstrap and
registry. Unknown hosts fail before the payload journal or repository
instruction files are written. Every public install enables the active runtime
and ends with the two-line instruction to invoke `rig-onboarding`; it does not
run onboarding or write onboarding state automatically.

The onboarding check now measures current attributable weight from the latest
applied journal records, including full Rig-owned bytes, managed graft/line
bytes, and journal/preimage overhead. Previous-release growth is warning-only.
The check also classifies duplicate destinations, duplicate skill projections,
duplicate or malformed grafts, dangling references, skill-name and self-prefix
regressions, incomplete state, and unapproved projections as hard failures.

The implementation reuses the existing host registry, payload journal, graft
parser, state ledger, and installed CLI adapter. No new dependency or parallel
ownership ledger was added. The focused Path B suites (55 tests) and the MCP
package suite pass; the full repository gate remains the final completion check.
