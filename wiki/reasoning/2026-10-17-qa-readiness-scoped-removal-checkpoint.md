---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: current
summary: Generated-only removal passes focused and provisional E2E checks; exact-byte evidence awaits candidate freeze and concurrent documentation coordination.
---

Done: Luna implemented the generated-only mode using the existing ownership
ledger. Root independently ran the moved root-scoped evidence tests and the
nested installer-artifact regression: 7/7 pass. Luna also reports the three
frozen uninstall cases and two legacy uninstall checks passing, and a
provisional real-download E2E passing both fresh and existing repositories.
The old October 14 scoped-purge trace is superseded: its assertion about broad
purge is incompatible with the signed whole-report-scope contract. Its body
remains unchanged. The current design and installation guide distinguish the
two cleanup modes. No frozen files or signature were changed.

Known ceiling: generated-only removal reverses the fixed existing evidence
ledger and the unchanged install-seeded network policy. It leaves arbitrary
unowned runtime files alone; extensions need a separately specified ownership
path rather than a sweeping deletion heuristic.

In flight: independent Luna review of the correction. A new untracked
documentation-overhaul design appeared during verification; none of the active
workers claims it. Root preserves it and has asked the owner whether another
agent is editing this workspace. It has not been silently committed or removed.
Next: coordinate that file, freeze a clean candidate, run exact-SHA E2E and the
full signed gate, then obtain the fresh binding review. The aborted review's
failed-attempt count remains intact.
