---
date: 2026-10-17
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: superseded
summary: Health command reproduction finds missing-lockfile failures; workflows now target real dependencies and match full-gate runner setup, while live docs are reconciled.
---

Done: running the health workflow dependency commands locally exposed
ENOLOCK from root and pi-extension. Both packages have no dependencies and
no lockfile; rig-mcp is the actual production dependency package. Its real
npm audit reports zero vulnerabilities at every severity and its lockfile
dry run passes. Removed the inapplicable root npm ci from health and release
eligibility, and the root/pi audit and dry-run calls. No empty lockfiles or
new dependencies were added. Both full-gate Ubuntu workflows now enable and
verify the same rootless namespace capability as the main test workflow;
that Linux setup still requires exact-candidate hosted CI verification.
Ruby's YAML parser accepts both workflow documents.

The read-only Luna sweep found additional drift in live closeout subplans,
user docs and the operator guide. The resulting minimal edits put full tests
before binding review, tracker closure after publication/smoke, agent-proposed
service choices inside the approved adaptive proposal, and legacy manifest
commands under an explicit compatibility heading. The obsolete baseline in
subplan 03 is labeled historical. Root also corrected the mutable technical
removal design and hub: purge does not authorize deleting edited user policy.
The runbook retains the real review context, output path and interrupted-attempt
counter instead of offering a new identity that would bypass the cap.

In flight: the full signed gate includes the new root-scoped removal tests.
Documentation and workflow corrections moved while it ran, so the run cannot
alone freeze final release evidence. The separate untracked documentation
proposal remains preserved and awaits coordination. Next: finish that
coordination, commit the final docs/workflows, run exact-SHA E2E, renew the full
gate on clean final bytes and then run the remaining binding-review attempt.
