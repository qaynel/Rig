---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: Exact-commit E2E exposes destructive full-purge semantics; generated-only cleanup will reuse the evidence ledger while retaining the frozen full-purge contract.
---

Done: the full signed npm test gate on f5f2ba705c653f0a787ab4f39792c0de0be45611
passes using the freshly downloaded verified mirror: main 1067 pass / 0 fail /
2 skip, secrets 15/15, pi-extension 15/15, MCP 6/6. Exact-SHA E2E then passes
real dependency download, MCP traffic and an executed approved service check
in both scenarios, but fails the existing-repository uninstall inventory:
reports/rig/last-uninstall.json and reports/rig/user.json are deleted.

The cause is a contradictory E2E invocation: it asks for --purge, which the
frozen AT-UNINSTALL-3 explicitly defines as deleting the complete reports scope,
then asserts preservation of the original reports. The earlier E2E subplan's
claim that --purge became scoped is wrong. Removing that frozen behavior or
weakening the inventory assertion would move a goalpost; neither is allowed.

Chosen minimal design: expose --purge-generated as a distinct removal mode.
Reuse the existing evidence ownership ledger and unchanged-seed cleanup; restore
recorded preimages and remove only unchanged generated artifacts. Keep complete
report-directory deletion exclusive to --purge. Wire both public command forms
to the same implementation and reject simultaneous destructive/scoped flags
before writes. The E2E requests generated-only cleanup, so its exact inventory
assertion still checks all original bytes and modes. Move the existing nested
scoped-evidence regression into the root test suite so npm test executes it.
The signed oracle remains unchanged; this implements its existing distinction
between normal preservation and explicit whole-scope purge.

In flight: Luna owns implementation and focused red/green checks. Root updates
the companion working technical design, E2E subplan and user guide. The binding
review was started in parallel with E2E and stopped when that check failed;
no receipt was produced, its optimistic failed-attempt count remains 1, and
the next final review must use the new verified bytes. No cap reset or signing
was performed. Next: exact-SHA E2E, full gate and fresh review after the fix.
