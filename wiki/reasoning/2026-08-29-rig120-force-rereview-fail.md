---
date: 2026-08-29
source: agent
topics: trust-and-failure-boundaries, host-and-ci-coverage
---

# RIG-120 force re-review: FAIL — unsigned oracle bytes and unguarded autofix

Owner asked for a fresh receipt after the first spawn was killed. Ran
`scripts/review-receipt.js --force-rereview` against the current worktree,
base `origin/prod`, model `claude-opus-5`, same author-context as the
2026-08-28 ceremony. Wrapper exit 1; no binding receipt written. Raw report:
[[sources/reviews/rig-120-v5.0.0-2026-08-29.failed.review.json]].

## Independently verified

**Blocker — oracle digest vs manifest.** Confirmed by running the verifier:
`tests/advanced-oracle.test.js` hashes to `7efc231c…`; the manifest still pins
`6997a0be…`. The worktree did regenerate the manifest lines for
`scripts/check-advanced-spec.js` and `tests/helpers/advanced.js` and rewrite
`gate1.sig`, so this is a partial re-sign over a stale oracle-test pin, not
an unsigned tree. `npm test` cannot go green on these bytes. This is the
owner re-sign already listed on [[tickets/RIG-120]], not a new code defect —
but a release review cannot pass while the armed gate is red.

**Major — autofix seam unguarded.** Confirmed by reading `runAutofix`: both
the fix command and the verify command go through bare `spawnTask` with only
`cwd`. No `networkIsolationPrefix`, no `timeoutMs`, no `memoryLimitMb`.
`runReadOnly` / `runGrade` / `check-runner.js` all wrap those controls.
The previous ceremony pass had flagged this as unverified/minor; this pass
promoted it because the technical spec claims the shell-trust suite is
closed and D28's network/resource guarantees are scoped to every
repository-owned task Rig executes. Autofix is a mutating task.

## Not re-verified as release-blocking

Three minors: catalogue packs still omit `network` (AD-39 compatibility
state, already accepted); uninstall throws on one escaping journal record
instead of a named best-effort row; technical-spec prose still says 68
acceptance IDs while the table has 73. None of these would refuse a receipt
on their own.

## Next

A binding receipt still requires a pass. Re-signing alone will not clear the
major. Closing autofix to the same isolation/caps as the other two runners,
then the owner re-sign of the final oracle bytes, then one more forced
review, is the path that can actually write the receipt.
