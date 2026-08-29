# runReadOnly maps memory_ceiling_unavailable to clean — investigation and fix (2026-08-28)

## Trigger

A fresh code review of the rig-120 release branch raised two issues:

1. A memory-limited read-only command can be killed when `ps` is absent from the
   task environment, yet the runner returns `clean` — violating the fail-closed
   resource-limit guarantee.
2. The existing test (AT-PROC-1f) only verifies the low-level `rssBytesTree`
   probe, not the user-facing `runReadOnly` result; it would pass even when the
   full path is broken.

## Root cause

`runReadOnly` in `rig/lib/lint-format.js` at the early-return check (line 703):

```js
if (result.status === 'timeout' || result.status === 'memory_exceeded') {
  return { status: result.status, changed_paths };
}
```

When `ps` is absent:

1. `rssBytesTree` returns `{ available: false }`.
2. `memory-guarded-exec.js` sets `killedFor = 'memory_ceiling_unavailable'` and
   kills the child command via `SIGKILL`.
3. The result file contains `{ killed_for: 'memory_ceiling_unavailable', ... }`.
4. `runCommand` returns `{ status: 'memory_ceiling_unavailable', exit_code: 1 }`.
5. Back in `runReadOnly`, neither branch of line 703 matches.
6. `snapshotDir` finds no working-tree mutation (the command was killed before it
   could write anything).
7. Falls through to `return { status: 'clean', changed_paths }`.

## Fix

Single-condition addition to line 703:

```js
if (result.status === 'timeout' || result.status === 'memory_exceeded' || result.status === 'memory_ceiling_unavailable') {
```

This mirrors the existing fail-closed pattern: any non-passing watchdog outcome
exits `runReadOnly` immediately with that status rather than proceeding to the
snapshot check.

## New test (AT-PROC-1i)

AT-PROC-1f tested only `rssBytesTree` in isolation. AT-PROC-1i exercises the
full path:

- Strip `ps` from PATH (`process.env.PATH = ''`).
- Call `runReadOnly` with a command that runs for 500ms (long enough for the
  15ms poll interval to fire), `memory_limit_mb: 64`, `network: true`
  (to bypass network isolation which also needs PATH).
- Assert result status is `'memory_ceiling_unavailable'`, not `'clean'`.

Confirmed red against the pre-fix code; green with the one-line fix. All
AT-PROC-1a–1i pass (9/9). No frozen oracle file was edited; no re-sign required.

## Why `runGrade` was not affected

`runGrade` does not have an explicit `clean` fallback. Its verdict comes from
`anyFail = executed.some((cmd) => cmd.result.exit_code !== 0)`. The
`memory_ceiling_unavailable` status maps to `exit_code: 1`, so `anyFail` is
true and `verdict` is `'fail'`. The per-command status is also propagated
directly in the command result array. No change needed in `runGrade`.
