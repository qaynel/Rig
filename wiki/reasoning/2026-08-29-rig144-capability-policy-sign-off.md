# RIG-144 capability-policy layer: owner sign-off with three scope corrections

2026-08-29

## What was approved

The owner reviewed the grilling draft
([[reasoning/2026-08-29-rig144-capability-policy-grilling]]) and said "go
ahead" with three corrections, plus one addition. Recorded verbatim as
ruling `GA-38` in [[index/decisions]].

## Correction 1 — undeclared network is a temporary compatibility state, not silent allow

The additive rollout (Option B) stands, but not as "undeclared == allowed
forever." The model is now three states, not two:

- `network: none` — explicit deny, enforceable now.
- `network: required` — explicit allow, enforceable now.
- undeclared — legacy compatibility only: execution proceeds, but it must
  emit a visible diagnostic, be recorded as undeclared (not silently folded
  into "allowed"), and the policy schema must be shaped so a later release
  can flip `undeclared -> deny` without a schema change.

This directly answers RIG-144's own worry (breaking the ~115 existing
catalog packs) while refusing to let "we haven't audited this yet" read as
"this is fine forever" in the reported state.

## Correction 2 — eliminate the second runner, don't just detect its drift

This is the real scope change. The draft's inferred default — keep
`rig/lib/checks.js` and `rig/catalog/baseline/check.js` independently fixed,
add a parity test — was explicitly rejected:

> A drift test changes silent divergence into divergence noticed by CI.
> Better, but the defect class still exists.

The owner's instruction: `.rig/bin/check.js` may remain a physical,
self-contained installed file, but it must be a **generated/copied
artifact** of one canonical source, not a second file a human hand-edits.
"You have now been bitten twice by security guarantees existing in one
implementation while production executes another... I would treat that as
the root defect."

**Done this session**, ahead of the rest of the capability-policy build,
because it was named as the highest-priority correction and is fully
self-contained: extracted the shared `runArgv`/`runBinding` containment and
execution logic — previously hand-duplicated between `rig/lib/checks.js`
and `rig/catalog/baseline/check.js` — into one module,
`rig/lib/check-runner.js`. Both files now `require()` it instead of each
carrying their own copy:

- `rig/lib/checks.js` re-exports `runArgv`/`runBinding` from
  `./check-runner` unchanged (its own `runChecks` orchestration —
  `writeReport`, catalog loading, coverage-gap classification — is
  untouched; only the containment/execution core moved).
- `rig/catalog/baseline/check.js` requires `../lib/check-runner` the same
  way it already requires `../lib/spawn-guarded` and `../lib/path-safety`.
- `apply.js` now materializes `.rig/lib/check-runner.js` alongside the
  `path-safety.js`/`spawn-guarded.js` it already copies, so the installed
  layout resolves the same module.
- `main()`'s error-output path was adjusted from `result.message` (the old
  standalone shape) to `result.reason` (the canonical shared shape).

This is a true single-source fix now, not two implementations kept in sync
by a test: `rig/lib/checks.js`'s `runBinding` and `rig/lib/check-runner.js`'s
`runBinding` are the same object by reference. A new regression test
(`AT-CAP-6`, `tests/guarantee-coverage.test.js`) asserts that identity
directly, plus asserts the materialized `.rig/bin/check.js` copy's
`runBinding.toString()` is byte-identical to the canonical module's — so a
future hand-written copy creeping back in fails immediately, the same day
it lands, rather than silently shipping until the next fresh review finds it.

Confirmed: `node --test tests/guarantee-coverage.test.js` — 18/18 passing,
including the rewritten `AT-PROC-1p` (updated to the canonical `result.reason`
shape) and the new `AT-CAP-6`.

**Not yet done:** unifying `checkCopies`/`check-copies.js`'s exact-copy
sync-group logic the same way (it doesn't currently duplicate as much
security-relevant logic as `runBinding` did, but the same principle applies
if it grows any). Flagged for the same pass that builds AT-CAP-1..5's actual
resource/network/authority mechanics, not deferred indefinitely.

## Correction 3 — no fake CI "approval," committed policy or refuse

The draft's CI-only committed-policy authority (interactive one-use grant
deferred to 5.x) was correct in shape but under-specified in wording. The
owner's tightening: no ephemeral approval environment variable, no implicit
yes, no prompting — only an explicit committed-policy entry authorizes a
capability beyond default, and it must be structured as a shared "capability
evaluator" so a later interactive one-use-grant path authorizes through the
same evaluator rather than a second bespoke mechanism. Not yet built —
folds into `AT-CAP-4`'s implementation, unchanged in spirit from the draft,
tightened in the acceptance wording (see [[tickets/RIG-144]]).

## Addition — resource limits are configurable defaults, not hard limits

The draft named `10 min / 2 GiB` as the concrete numbers (the owner's own
example from the original architecture document). The owner clarified after
seeing the draft: those are *defaults*, not the semantic contract. The
invariant is `0 < t_command <= t_authorised` and `0 < M_command <=
M_authorised` — a binding may declare a higher authorised ceiling (e.g. 20
min / 4 GiB) the same way network capability is declared, and the timeout
kill must cover the whole descendant process tree (already true via
`spawnGuardedSync`, no change needed there). Folds into `AT-CAP-1`/`AT-CAP-2`,
not yet built.

## Status after this session

- Runner unification (Correction 2): **done and tested**.
- Everything else approved in the draft (resource limits as mandatory
  defaults, fail-closed, CI-only authority) plus the three corrections above:
  **acceptance criteria updated, not yet implemented**. See the revised
  `AT-CAP-1`..`6` in [[tickets/RIG-144]].
- Full `npm run test:code` run to confirm no regression from the runner
  refactor before continuing to the remaining acceptance criteria.
