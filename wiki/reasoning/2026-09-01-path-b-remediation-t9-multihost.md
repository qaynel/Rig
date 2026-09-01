# Task 9 — Multi-host projection deduplication

**Date:** 2026-09-01
**Branch:** path-b-adaptive-onboarding-oracle
**Commit:** 9b0fff24

## Problem

In a two-host install (Codex + Claude), `planSkillProjections` built rows for
both host scopes but then collapsed them with:

```js
const uniqueRows = [...new Map(rows.map((row) => [row.skill, row])).values()];
```

Keying by `row.skill` alone meant the second-host row silently replaced the
first.  `state.applied.skills` therefore stored only one path for `qa` (the
claude path, alphabetically last), and `reconcileApplied` never checked whether
the Codex copy existed or matched its expected digest.

## Constraint discovered during implementation

The frozen oracle file `tests/path-b-weight.test.js` (AT-PB-10) explicitly
asserts `state.applied.skills.filter(({ skill }) => skill === 'qa').length === 1`
for a two-host install.  Changing `applied.skills` to store two rows would have
broken that acceptance case and invalidated the oracle digest.

## Solution chosen

Add a new `state.applied.projections` field — parallel to `skills` — that holds
every `(skill, host_scope, path, sha256)` row without deduplication.

- `applied.skills` is unchanged (1 row per unique skill ID).  AT-PB-10 stays
  green.
- `applied.projections` has 1 row per `(skill, host_scope, path)` triple.  A
  two-host install produces 2 rows for `qa`.
- `reconcileApplied` now iterates `projections` (or falls back to `skills` for
  state written before this task), so every host copy is verified on check.

## Files changed

- `rig/lib/onboarding.js`
  - `planSkillProjections` returns `{ plans, rows, projections }` instead of
    `{ plans, rows }`.
  - `apply` stores `projections` alongside `skills` in `applied`.
  - `reconcileApplied` iterates `state.applied.projections || state.applied.skills`.
- `tests/path-b-hardening.test.js`
  - Two new tests appended under "Task 9 — multi-host projection deduplication".

## Approaches rejected

- **Change dedup key to `(skill, host, path)` in `skills`**: Breaks frozen
  AT-PB-10 which expects `length === 1`.  Not viable without an oracle re-sign.
- **Change check to re-derive expected paths from installed scopes**: Complex
  and fragile; requires `check` to re-run `installedSkillScopes` and recompute
  expected digests without having the original bytes.

## Test results

`npm test`: all pass (0 failures).  `node scripts/check-advanced-spec.js`: exit 0,
Oracle verified: 14 files, 83 acceptance cases.
