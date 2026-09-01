# Task 8 — Check re-inventories on every run

**Date:** 2026-09-01  
**Branch:** path-b-adaptive-onboarding-oracle  
**Author:** Vaibhav Kodiyan

## Problem

`onboarding-check.js` compared cached state — a post-approval external edit to a
repository file could not invalidate the approved snapshot. The check walked journal
entries, graft markers, and dangling references, but never re-computed the structural
inventory of the repository. A repository owner who appended instructions to `AGENTS.md`
after approval would get a passing check — a silent divergence.

## Decision

**Store a per-path inventory snapshot in `state.applied` during apply. Re-inventory at
every check and report drift as a hard failure with code `inventory-drift`.**

Alternatives considered and rejected:

- **Snapshot at prepare time.** Prepare runs before grafts are written. The graft
  changes the file digest. Comparing against a pre-graft snapshot at check time would
  produce false positives for every file that received a graft. Rejected.

- **Normalize out graft sections at comparison time.** Possible but complex: requires
  parsing graft markers in every tracked file on every check. The post-apply snapshot
  approach makes this unnecessary — grafts are already baked in when the baseline is
  recorded. Rejected in favour of snapshot-post-apply.

- **Track only aggregate digest change.** The aggregate `inventory.digest` already
  stored in state would change if any file changed. But aggregate comparison does not
  tell check WHICH file drifted. Per-path comparison produces a meaningful failure path
  and detail. Rejected.

## Implementation

### `rig/lib/onboarding.js` — apply function

After `writer.finish()` commits all mutations, call `inventoryHarness(request.target)`.
Build `inventorySnapshot: { [rel]: { kind, host, bytes, digest } }` and store it in
`state.applied.inventory_snapshot`. This snapshot is the canonical baseline for all
future checks until the next apply cycle.

The post-apply timing is the key design choice: every approved Rig graft is already
written to disk when the snapshot is taken, so the graft content is part of the baseline
digest. Check comparing against this baseline treats grafts as approved and only flags
external mutations.

### `rig/lib/onboarding-check.js` — `inventoryDriftFailures`

New function added before `checkOnboarding`:

1. Read `state.applied.inventory_snapshot`. If absent (state predates Task 8), return
   `[]` — graceful degradation, no false positives on upgrade.
2. Call `inventoryHarness(target)` for a fresh inventory.
3. Build a Map from the fresh entries.
4. Report `inventory-drift` for:
   - Paths present in snapshot but missing from fresh inventory.
   - Paths present in both but with a differing `sha256`.
   - Paths in fresh inventory but absent from snapshot (new files added post-approval).

Failure detail always ends with: "re-run prepare, propose, and apply."

`checkOnboarding` now includes `inventoryDriftFailures` in its `hardFailures` spread.

### `tests/path-b-hardening.test.js` — Task 8 tests appended

Two tests added under `Task 8 — check re-inventories on every run`:

1. **Drift test:** full apply → `fs.appendFileSync` to `AGENTS.md` → check → assert
   `result.hard_failures.some(f => /inventory.?drift/i.test(f.code))`. Confirms the
   mechanism triggers.

2. **Inverse test:** full apply → no modification → check twice → assert no
   `inventory-drift` failures on either check. Confirms the post-apply snapshot
   approach does not produce false positives from Rig's own approved graft.

## Acceptance criteria status

- [x] Post-approval external edit triggers `inventory-drift` hard failure.
- [x] Rig's approved graft baked into snapshot; re-check produces no false drift.
- [x] Drift message instructs operator to re-run prepare, propose, and apply.
- [x] `node --test tests/path-b-hardening.test.js` green (26/26).
- [x] `node scripts/check-advanced-spec.js` exit 0 (83 cases unchanged).
- [x] `npm test` exit 0 (all suites: 643 + 13 + 15 + 6 = 677 tests, 0 fail).

## What is next

Task 8 is complete. The remediation plan's remaining tasks (if any) can proceed.
