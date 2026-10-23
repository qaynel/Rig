---
date: 2026-10-22
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: superseded
supersedes:
tags: security, data-loss, journal, tdd
summary: A malformed but valid-JSON install journal can omit ownership/state fields and authorize uninstall deletion; strict structural validation and public-uninstall preservation tests are in progress.
---

A fresh independent review found that `parseJournalRecords` checks `state`,
`ownership`, and `operation` only when those properties happen to be present.
An incomplete applied record with a matching digest can therefore be accepted
as deletion authority, and public uninstall can delete a user-created file
before refusing no further action. This is a data-loss boundary defect, not a
reason to weaken the malformed-journal oracle.

I own the shared journal parser in `rig/lib/lifecycle.js` and the new focused
public-uninstall regression file `tests/remediation-review-journal.test.js`.
Before implementation I am tracing actual producers and legitimate record
variants, including install-state markers, payload writes/deletes, graft and
CI ownership, onboarding/lint-format writes, and interrupted transaction
records. The next step is to write public uninstall tests proving missing
ownership/state/operation and malformed pending/history fields refuse before
any mutation while legitimate producer records for each supported operation
remain accepted. Then tighten the shared parser and run the focused journal,
install/uninstall, and coverage suites. Frozen acceptance criteria remain
untouched; no reviewer retry or full npm suite is part of this slice.
