---
id: 2026-09-02-path-b-fix3-interrupt-sibling
title: "Path B Fix 3: interrupt-window and sibling-file reconcile"
date: 2026-09-02
status: current
tags: [path-b, onboarding, correctness, journal, sibling-sweep]
---

## Context

Two correctness gaps identified in the code review (DO NOT MERGE verdict) were
implemented via TDD this session. Both are in `rig/lib/onboarding.js`.

## Fix 3a — interrupt window (closed-journal crash before writeState)

**Root cause.** Between `writer.finish()` and `writeState()`, a crash left the
journal closed (`complete: true`) but state still at `proposed`. On the next
apply, `journalResumeDigest` returns `null` for a closed journal, so the
preflight treated the already-landed bytes as a stale-preimage conflict and
threw `"rig: graft has stale file digest or preimage"`.

**Fix.** Moved `writer.finish()` to after `writeState()`. A crash before state
advances now leaves the journal OPEN; the next apply's `journalResumeDigest`
recognises its own unfinished work and resumes cleanly.

**Test.** `AT-PB-hard interrupt-window` in `tests/path-b-hardening.test.js`:
intercepts `fs.writeFileSync` on `state.json.tmp` to simulate the exact crash
point, then re-applies and asserts the check passes.

## Fix 3b — sibling-file reconcile (orphan survives when skill stays selected)

**Root cause.** `planRemovals` built `desiredPaths` from
`projection.projections` which only records the SKILL.md row per host scope.
The outer loop short-circuited when `desiredPaths.has(row.path)` (SKILL.md
stays desired), so the sibling sweep via `liveFilesUnder` never ran for a
skill that remained selected. An orphan sibling from a previous catalog version
was therefore invisible to the removal ledger.

**First fix attempt.** Removed the `desiredPaths.has(row.path)` short-circuit
from the outer loop. This allowed the sweep to run, and EXTRA.md was deleted.
But the check still failed: `desiredPaths` was built from `projection.projections`
(SKILL.md only), so the sweep also removed `references/*` and `templates/*`
subdirectory files that are still projected in the new cycle. These files are
in `projection.plans` but not in `projection.projections`.

**Correct fix.** Extended `desiredPaths` to include both `projection.projections`
paths (SKILL.md entries) AND `projection.plans` paths (all files that will be
written in this apply, including sibling directories). Files that are no longer
in the plan — like a removed EXTRA.md — are therefore the only ones swept.

```js
const desiredPaths = new Set([
  ...projection.projections.map((row) => row.path),
  ...projection.plans.map((plan) => plan.rel),
]);
```

**Test.** `AT-PB-hard sibling-reconcile` in `tests/path-b-hardening.test.js`:
two-cycle test that adds EXTRA.md to the staged shelf, applies (EXTRA.md
projected), removes EXTRA.md from staged, re-applies (EXTRA.md removed, skill
stays selected), then asserts both the file is gone AND check passes cleanly.

## Status after this session

- Fix 3a: GREEN (interrupt-window test passes)
- Fix 3b: GREEN (sibling-reconcile test passes, all 64 path-b-hardening tests pass)
- Two pre-existing failures in `tests/wiki-maintenance.test.js` (staleHubs,
  lintFindings) are from prior wiki-maintenance work on this branch, unrelated
  to these fixes.
- Full CI gate: 692/695 pass; 2 failures are the pre-existing wiki-maintenance
  ones above, plus the oracle-consistency check in path-b-hardening.test.js
  which waits on the key-rotation question and acceptance.md re-sign.

## Remaining blockers before merge

1. **Key rotation answer** (human) — was the ecdsa key at
   `rig-gate-key@secretive.Manoj's-MacBook-Pro.local` authorized?
2. **acceptance.md fix + re-sign** (human) — H1 and §7 still say "AWAITING
   ORACLE SIGNATURE"; need key-holder to edit and re-run `approve-gate1.js`.
3. **Unfreeze ceremony** (human) — fill blanks in
   `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md`
   (Date, authorization, signature reference) and draft a second unfreeze
   request for `scripts/check-advanced-spec.js`.
