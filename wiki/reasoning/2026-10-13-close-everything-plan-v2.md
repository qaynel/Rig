---
date: 2026-10-13
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: historical
supersedes:
tags: plan, self-review, handoff
summary: The close-everything spec was self-reviewed and restructured into one master plan with ten subplans plus a self-contained reviewer handoff; the review fixed build order (corpus first), added a v5 migration, a 6.0.0 release, a frozen-test strategy (10 of 16 signed files reference the current layout), a trust boundary for agent-written projection scripts, and six owner open points.
---

# Close-everything — plan v2 after self-review

The owner asked for one plan that links to subplans, self-reviewed, and handed
off as a single file to a reviewer agent that will settle the open points with
them.

## Delivered

- `wiki/specs/close-everything/00-master-plan.md` — intent, settled decisions,
  item ledger (every tracker item, one row), order, signing strategy,
  cross-cutting risks, self-review delta, open points.
- Subplans `01`–`10` in the same folder.
- `wiki/specs/close-everything/REVIEWER-HANDOFF.md` — the one file to give a
  reviewer agent.
- The v1 single-file draft is removed; its content lives in the subplans.

## Self-review findings (verified against the code)

1. v1 ordered services and docs before the corpus they live in; the corpus is
   now the spine.
2. No migration for existing v5 installs; added (journaled uninstall then
   re-project).
3. The corpus breaks the layout, so the release is 6.0.0.
4. 10 of the 16 files pinned by the signed manifest reference the current
   skill, catalogue, or tier-1 layout; v1 had assumed only a handful of frozen
   edits. Strategy: keep the installed layout byte-identical, bundle source-path
   updates as one unfreeze request, keep an explicit expected-red list, sign once.
5. The clean-install E2E was written around one host's MCP flag; rescoped
   host-agnostic.
6. The 115-service work had no scale plan; added a schema and family batches.
7. Agent-written projection scripts execute code; added a trust boundary.
8. Scheduled jobs had no failure destination; they open a `health` issue.
9. The tracker sync check needs GitHub API access; uses the read-only workflow
   token and skips visibly without one.
10. Vendored third-party skills and the "tier" vocabulary were unaddressed;
    raised as owner open points.

## Next

Owner hands the handoff file to a reviewer agent. Open points 1–6 are
settled there. Then implementation starts with subplans 01 and 02.
