# RIG-120 close-out: handoff brief for the remaining code-level blocker

2026-08-29

This is the handoff document referenced from the chat reply of the same
timestamp. It exists so a fresh agent — or this session after a context
reset — can resume RIG-120/RIG-144 without re-deriving what's already
settled. See [[tickets/RIG-120]], [[tickets/RIG-144]],
[[reasoning/2026-08-29-rig144-capability-policy-sign-off]], and
`GA-38` in [[index/decisions]] for the full record this brief compresses.

## What's already closed, do not redo

1. `AT-LF-24` symlink-escape refusal in `lint-format.js` — fixed, tested,
   oracle rewritten (pending owner re-sign, not an agent action).
2. `rig/lib/checks.js` and `rig/catalog/baseline/check.js` realpath
   containment (`required_paths`, `cwd`, `semanticDrift`'s doc path) — fixed.
3. **The two runners are unified.** `rig/lib/check-runner.js` is now the one
   canonical `runArgv`/`runBinding` implementation; both `rig/lib/checks.js`
   and `rig/catalog/baseline/check.js` (materialized to `.rig/bin/check.js`
   by `apply.js`) `require()` it. `AT-CAP-6` proves this by object identity
   / source-text equality, not behavioral parity. Full `npm run test:code`
   confirmed green (529/530, 1 expected Linux-only skip) after this refactor.

**Do not** re-propose "add a drift test between the two runners" — that was
explicitly rejected by the owner and is recorded as a trap
([[index/traps]]). If you find a *third* copy of this logic anywhere, the
default move is to delete the duplication into the canonical module, not to
test that it currently agrees.

## What's actually open — the only remaining code blocker on RIG-120

The fresh independent review that blocked RIG-120 found the installed
runner had none of `lint-format.js`'s shell-trust guarantees. Containment
and de-duplication are done. Five acceptance criteria remain, all scoped
and owner-signed-off in [[tickets/RIG-144]] under "Owner sign-off, with
three corrections" — implement exactly that text, not a fresh guess:

- **AT-CAP-1 / AT-CAP-2 (resource limits — mandatory).** Every command
  `check-runner.js` runs gets a wall-clock timeout and a memory ceiling.
  Defaults 10 min / 2 GiB, but **configurable per binding** — the invariant
  is `0 < t_command <= t_authorised` and `0 < M_command <= M_authorised`,
  not a fixed constant. Reuse, don't reinvent: `lint-format.js`'s
  `runCommand()` (`rig/lib/lint-format.js:552`) already wraps
  `rig/lib/memory-guarded-exec.js` (`rssBytesTree`, `isChildRunning`,
  `scriptPath`) for exactly this. Timeout kill must cover the whole
  descendant process tree — already true via `spawnGuardedSync`, confirm it
  stays true once wired through `check-runner.js`.
- **AT-CAP-3 (network — three states, not two).** `network: none` (deny) and
  `network: required` (allow) are enforced now, reusing
  `lint-format.js`'s proven mechanism: `networkIsolationPrefix()` and
  `argvWithNetworkIsolation()` (`rig/lib/lint-format.js:661-687`). An
  **undeclared** binding keeps running (additive rollout, avoids breaking
  the ~115 existing catalog packs) but must emit a visible diagnostic and be
  recorded as its own distinct state in the check's reported result — never
  silently folded into "allowed" — so a later release can flip
  `undeclared -> deny` without a schema change. Write the state name and
  diagnostic text into the acceptance test itself; don't leave it to the
  implementation's discretion.
- **AT-CAP-4 (elevated capability needs committed authority).** A binding
  requesting a capability beyond its default (raised ceiling, network where
  undeclared going to `required`) executes only when a committed,
  repo-side policy file predeclares that exact grant for that exact
  binding id. No prompting, no ephemeral env var, no implicit yes — absent
  the entry, refuse with a distinct non-passing status. **Design gap:**
  this repo has no `.rig/execution-policy.json` (or equivalent) shape yet —
  confirmed via `grep -rn "execution-policy" wiki/gate2/technical-spec.md`
  (no hits). Run `rig-product-design` on this one question before writing
  code: new file vs. extending `.rig/service-bindings.json`. This is
  implementation-level per the sign-off ("will settle during
  rig-product-design, not blocking the acceptance-criteria sign-off") — it
  is not a re-grill, don't reopen the acceptance criteria over it. Structure
  the evaluator as a function both the current CI-only path and any future
  interactive path can call — the owner asked for one capability evaluator,
  not a second bespoke check bolted onto the CI runner specifically.
- **AT-CAP-5 (fail closed).** Any of the above that promises a control the
  host can't actually verify or enforce is a refusal of that execution
  class, its own distinct reported status — never a silent downgrade to "ran
  anyway." This is the same pattern already proven three times over
  (`network_isolation_unavailable`, `memory_ceiling_unavailable`,
  `boundary_violation` in `lint-format.js`) — apply it, don't redesign it.

## The vertical rule — depth, per criterion

For each of AT-CAP-1 through 5, in this order, every time:

1. Write the test in `tests/guarantee-coverage.test.js` first. Confirm red
   (`git stash push -- <impl files>`, rerun, confirm fail, `git stash pop`).
2. Implement in `rig/lib/check-runner.js` only — never in `checks.js` or
   `catalog/baseline/check.js` directly. If either of those two needs to
   change (e.g. to plumb a new option through), that's a sign the seam is in
   the wrong place; check-runner.js should be the one place with the
   containment/execution/capability logic.
3. Confirm green.
4. Prove it against the *materialized* bytes too, the same way
   `AT-PROC-1o`/`1p`/`1q`/`AT-CAP-6` already do: copy the real
   `rig/catalog/baseline/check.js`, `check-copies.js`,
   `rig/lib/spawn-guarded.js`, `rig/lib/path-safety.js`,
   `rig/lib/check-runner.js` (and `memory-guarded-exec.js` once AT-CAP-2
   needs it) into a temp dir at the post-`apply.js` layout
   (`.rig/bin/`, `.rig/lib/`) and `require()` from there. A test that only
   exercises `rig/lib/check-runner.js` from its source location proves
   nothing about what CI actually runs — that gap is exactly what caused
   this ticket in the first place.

A criterion is not done until both 3 and 4 are green. Doing 1-3 and skipping
4 reproduces the exact defect class this ticket exists to close.

## The horizontal rule — breadth, once, before declaring done

1. `apply.js` must materialize every new file this work adds (any new
   shared module, e.g. if `memory-guarded-exec.js` isn't already
   materialized for the non-`--with-runtime` install path, add it next to
   `path-safety.js`/`spawn-guarded.js`/`check-runner.js` — check first, don't
   assume). CI is generated on every install profile, not just
   `--with-runtime`, so anything the installed check runner needs must land
   unconditionally.
2. Grep for other hand-copied command-runner-shaped logic before declaring
   the ticket done: `grep -rn "spawnGuardedSync\|spawnSync" rig/catalog/
   rig/lib/*.js` and eyeball anything spawning subprocesses outside
   `check-runner.js`, `lint-format.js`, and `spawn-guarded.js` itself. If you
   find one, record it in [[index/traps]] and decide fix-now vs. ticket-it —
   don't silently leave a fourth copy for the next reviewer to find.
3. Confirm both real callers (`rig/lib/checks.js`'s `runChecks` orchestration
   and `.rig/bin/check.js`'s `main()`) actually surface each new status in
   their user-facing output (`writeReport`'s `status`/`reason` for the
   former, `process.stderr`/exit code for the latter) — not just that
   `check-runner.js` returns the right object internally.

## Explicit non-goals — do not do these

- Do not implement interactive one-use capability grants. Deferred to 5.x by
  the owner (`GA-38`). The evaluator should be *structured* so it can be
  added later, not built now.
- Do not audit or touch the ~115 existing catalog service packs' network
  declarations. Explicitly out of scope — additive rollout means they keep
  working undeclared, with a diagnostic, until someone does that audit as
  its own pass.
- Do not touch the release ceremony: no fresh independent review run, no
  `wiki/gate1/gate1.sig` re-sign, no `v5.0.0` tag or publish. Those are
  explicitly owner-only actions per [[tickets/RIG-120]]'s "Why this
  genuinely needs you" section — an agent doing them wouldn't make the
  release safe, it would defeat the reason the ceremony has a human
  signature in the first place.
- Do not promote `AT-CAP-1`..`6` into the frozen Gate 1 oracle
  (`wiki/gate1/`) without being asked. They belong in
  `tests/guarantee-coverage.test.js` (not frozen) the way RIG-135/141/142/143
  and this session's own work already do it.
- Do not push to the remote or open a PR without being asked.

## Definition of done (testable)

- `node --test tests/guarantee-coverage.test.js` — all tests green, including
  new named tests for `AT-CAP-1` through `AT-CAP-5` (6 already exists),
  each exercising both the direct module and a materialized-bytes copy per
  the pattern above.
- `npm run test:code` exits clean (0 failing; the one Linux-only
  `PR_SET_PDEATHSIG` skip is expected and not a regression).
- [[tickets/RIG-144]]'s status banner reflects the true state honestly — do
  not mark "Done" if any of AT-CAP-1..5 is stubbed, partially wired, or
  untested against materialized bytes. A fake-green status here is the
  specific failure mode this whole project's `GA-33`/`GA-35` culture exists
  to prevent.
- [[tickets/RIG-120]] updated to state plainly: the code-level blocker is
  closed, and the only remaining items are the three ceremony inputs listed
  in its "Why this genuinely needs you" section (fresh independent review,
  gate1 re-sign, tag/publish) — which need the owner, not more code.
- A closing reasoning trace filed under `wiki/reasoning/`, linked from
  `wiki/status.md`, stating what was built, which tests prove each
  criterion, and confirming both the vertical (per-criterion, real bytes)
  and horizontal (no other duplicate, materialized everywhere, both callers
  surface it) checks above were actually performed — not asserted.

## Reporting back

Per `rig/tier-1/rules/communication.md`: report to the user (the repo owner)
in short PM-framed updates at natural checkpoints — after AT-CAP-1/2 land,
after the `execution-policy.json` design question is resolved, after
AT-CAP-3/4/5 land — not as one large summary at the very end. If anything in
this brief turns out to be wrong once you're in the code (a function moved,
a mechanism doesn't reuse as cleanly as described), say so and correct
course; this brief is a compressed pointer into the wiki, not a substitute
for reading [[tickets/RIG-144]] and the sign-off trace directly.
