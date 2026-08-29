# RIG-120: symlink-escape refusal fixed; checks.js containment hardened to realpath

2026-08-29

## What this closes from the 2026-08-29 fresh review

[[reasoning/2026-08-29-rig120-fresh-review-fails-shipping-path-bypass]] found
two blockers. This pass closes the second one (symlink-escape refusal) and
the unambiguous sub-part of the first (realpath containment in the code path
the shipping product actually calls). It does not close the rest of blocker
#1 — that needs an owner scoping decision, recorded below.

## Fix 1: `planExecution`/`executePlan` symlink-escape refusal (AT-LF-24)

Read both functions directly, as the review instructed. `planExecution`'s
containment check computed `fs.realpathSync` itself inline instead of using
the shared `containedPath()` helper, and on a mismatch it did nothing — the
`try` block's body simply didn't execute, leaving `source_snapshot: null`,
indistinguishable from "file missing" or "JSON parse failed". `executePlan`
then re-read the same file a *second* time (`fs.readFileSync(abs, ...)`
directly, no realpath check of any kind) to compare against that snapshot
for drift — so an escaping symlink's real content got read, and because it
differed from the `null` snapshot, surfaced as `command_drift`: a
recoverable, re-plannable state, not a refusal.

Fix: one `readSource(target, cmd)` helper, used by both call sites, built on
`containedPath()` (the same realpath-walking helper `taskCwd`,
`ci-adapters.js`, and `checks.js`'s `checkCopies` already use — this project
already had the right primitive, it just wasn't used here). Two properties,
not one:

- **Plan time** marks `source_boundary_violation: true` on the command
  instead of a bare null snapshot, so a caller can tell "no source" apart
  from "source escapes."
- **Execute time independently re-derives from disk** — it does not trust
  the plan-time flag. A plan can be held across an agent turn boundary
  (that's the whole reason `consumePlanApproval` is durable/on-disk); the
  symlink could be planted after planning and before execution. Trusting a
  boolean computed at plan time would just move the TOCTOU window one level
  up instead of closing it. Returns a hard `boundary_violation` status,
  matching the existing pattern `taskCwd`'s callers already use
  (`runReadOnly`, `runGrade`) rather than inventing a new status shape.

## Test fix: AT-LF-24 rewritten to assert the refusal, not the symptom

The frozen oracle test (`tests/advanced-oracle.test.js`, listed in
`wiki/gate1/testing-infrastructure.manifest`) only asserted
`source_snapshot === null` — true for the escape, but equally true for a
missing file, and it never called `executePlan` at all, so the actually
unguarded second read was never exercised. Rewritten to: assert both
`source_snapshot === null` AND `source_boundary_violation === true` at plan
time, then call `executePlan` and assert `status === 'boundary_violation'`
and that the outside command's side-effect file was never created (inside
*or* outside the repo — inside would mean it ran under the wrong cwd, outside
would mean it ran at all). Confirmed red against pre-fix `lint-format.js`
(stashed and reran): fails on the `source_boundary_violation` assertion,
`undefined` where `true` was expected. Green after.

**This edits a signed oracle file's bytes.** Per this project's gate rule,
an implementer proposes a change to a frozen oracle test but the key holder
signs it — this change is proposed on direct instruction from the person I
report to in this session, mirroring how RIG-115's shell-trust cases were
drafted directly into `tests/advanced-oracle.test.js` before their re-sign.
`wiki/gate1/gate1.sig` is stale until the owner re-signs; `tests/advanced-oracle.test.js`'s
digest in `wiki/gate1/testing-infrastructure.manifest` needs updating in the
same re-sign pass. No other oracle file changed in this pass.

## Fix 2: `checks.js` containment hardened from lexical to realpath (RIG-144's unambiguous item)

[[RIG-144]] already named this exact gap and explicitly scoped it as
"unambiguously worth doing regardless of the other four" open questions
(network isolation, memory ceiling, plan/approval — all of which legitimately
conflict with what CI checks need to do). Three call sites in
`rig/lib/checks.js` used `path.resolve(target, rel)` +
`abs.startsWith(path.resolve(target) + path.sep)` — a purely lexical check.
`fs.existsSync`/`fs.readFileSync` both resolve symlinks at the OS level
regardless of what the lexical check computed, so a symlink whose *name*
sits inside the repo but whose *target* sits outside it passed the check and
then actually got read or had a command run in it:

- `runBinding`'s `check.required_paths` loop (line ~44).
- `runBinding`'s `commandBinding.cwd` loop (line ~61) — the one that
  actually spawns a process in that directory.
- `semanticDrift`'s `doc.path` handling for `.rig/context-index.json`
  entries (line ~120) — reads and hashes the target's bytes.

All three now go through `containedPath()`, the same helper `checks.js`'s
own `checkCopies()` already used two functions up (visible in-file
precedent that was not applied consistently). `commandBinding.cwd` follows
the established `!rel || rel === '.'` special case (`taskCwd`'s pattern)
since `containedPath` itself rejects a rel that resolves to exactly the
root.

## Regression tests: `tests/guarantee-coverage.test.js` AT-PROC-1l/1m/1n

Not part of the frozen oracle (this file lives outside
`wiki/gate1/testing-infrastructure.manifest`), so no re-sign is needed for
these three. Each demonstrates one of the three call sites above with a
symlink pointing outside a fresh temp repo, and each was confirmed red
against the pre-fix `checks.js` (stashed and reran) before the fix and green
after:

- **AT-PROC-1l**: a `commandBinding.cwd` escape — asserts the spawned
  command's side-effect marker file was never created outside the repo, and
  that the result is `coverage_gap`. Red-before actually ran the command
  outside the repository.
- **AT-PROC-1m**: a `required_paths` escape — asserts `coverage_gap` with
  reason `invalid required path`. Red-before returned no finding at all (the
  lexical check passed, `fs.existsSync` found the file through the OS-level
  symlink resolution, so the loop just moved on).
- **AT-PROC-1n**: a `context-index.json` document path escape — asserts a
  `escaping_context_path` finding. Red-before actually read and hashed the
  outside file's bytes, reporting `digest_changed` instead (proof it read
  through the symlink rather than refusing).

## What's still open: blocker #1's remaining scope

The review's blocker #1 was four gaps in `checks.js` relative to
`lint-format.js`'s shell-trust guarantees: no plan/approval, no environment
allowlist, no network isolation, no memory ceiling, and (now fixed) lexical
not realpath containment. Only the containment piece is closed by this pass.
The other three are exactly what [[RIG-144]] already flagged as needing an
owner decision, for a concrete reason: `checks.js` runs CI/git-floor checks
(`npm test`, linters, package installs) that legitimately need network
access and can legitimately run long or use real memory for a large repo's
actual test suite — `lint-format.js`'s default-deny network stance or a
fixed memory ceiling could break ordinary CI rather than protect anything if
copied over unscoped. Guessing a default here is the same mistake this
ticket's own history already shows repeatedly (patch the demonstrated case,
not the general shape) turned into five-plus review rounds on the CI/journal
trust boundary. Reported to the user as a decision, not implemented blind.

## Full gate

`npm test` run: oracle check fails as expected (edited a frozen test file,
pending owner re-sign); `npm run test:code` run directly is green, 525/526
(1 expected Linux-only skip), no regressions.

## Follow-up, same session: the fix above only touched half the real runner

While starting the grilling pass for the larger capability-policy work
(RIG-144's remaining three axes), checking the existing record turned up
something the fix above missed. `rig/lib/checks.js` (which I fixed first) is
**not** the only production command runner — it's the one wired into the
in-process `rig check` subcommand (`rig/lib/cli-advanced.js`, reachable via
`materialize.js`, `--with-runtime` only). The runner every generated CI
workflow actually invokes is a **separate, hand-maintained duplicate**:
`rig/catalog/baseline/check.js`, byte-copied by `apply.js` to
`.rig/bin/check.js` at install time (`ci-adapters.js` writes
`node .rig/bin/check.js --scope repo` into every provider's generated
workflow). The two files are not sync-mapped or generated from one source —
no `check-rule-copies.js`-style drift guard covers this pair — so fixing one
silently left the other's identical bug live. Also found the same class of
gap one level deeper: `rig/catalog/baseline/check-copies.js`'s `inspectInside`
only checked whether the **leaf** of a path was a symlink, not any
intermediate directory segment, so `escape-link/secret.txt` where
`escape-link` is a symlinked directory passed uncaught.

This is the exact "seam the product doesn't use" pattern from
[[reasoning/2026-08-29-rig120-fresh-review-fails-shipping-path-bypass]],
recurring one layer down: I fixed the file that *looks* like the shipped
runner and nearly missed the one CI actually executes.

**Fixed:** `rig/catalog/baseline/check.js`'s two lexical checks and
`check-copies.js`'s leaf-only symlink check now use `containedPath()`,
matching `rig/lib/checks.js`. `apply.js` now also materializes
`rig/lib/path-safety.js` to `.rig/lib/path-safety.js` (previously only
`spawn-guarded.js` was copied over — `containedPath` wasn't available at the
installed layout at all until this). Four new regression tests
(`tests/guarantee-coverage.test.js` AT-PROC-1o/1p/1q) `require()` the actual
catalog source files from a temp directory laid out exactly like a real
install (`.rig/bin/check.js` next to `.rig/lib/`) rather than
`rig/lib/checks.js`, specifically so this class of miss can't recur silently
in a future session. All three confirmed red-before/green-after against the
pre-fix catalog files (stashed and reran).

**Not addressed, flagged as an open question rather than fixed silently:**
the two runners remain two independently-maintained implementations of the
same logic. Whether to unify them (one real source, the other a thin
delegating wrapper or generated copy) or add an explicit copy-check the way
other file pairs in this repo already have is a real design fork with a real
cost either way — folded into the capability-policy grilling pass as an open
decision rather than guessed at here.
