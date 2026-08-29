---
date: 2026-08-29
source: user
topics: trust-and-failure-boundaries, host-and-ci-coverage, review-receipts
---

# RIG-120: handoff for the 8-finding fresh review (author-context `...ceremony-2026-08-29`, fail)

This is the execution brief for the next coding agent on `rig-120-safety-defects`.
It supersedes nothing in [[2026-08-29-rig120-close-out-handoff]] (that work —
AT-CAP-1..6, the two-runner unification — is done and verified; do not redo
it) but extends past it: a newer fresh review
(`wiki/sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.review.json.attempts.json`,
`failures: 1`) ran *after* that close-out and found 8 new findings. Raw
report was pasted by the owner, not yet written to `wiki/sources/reviews/`
as a file — do that first (see "Housekeeping" below).

## Owner decisions (binding, do not re-litigate)

**D1 — Do not build a plan/approval/one-shot seam into `check-runner.js`.**
Reviewer blocker 2 says AT-LF-5/11/14/20 (plan-bound execution, halt-on-
mutation, halt-on-drift, one-execution-per-approval) are unenforced on the
shipping CI runner. They are, by a decision the owner already signed
(GA-38 / [[tickets/RIG-144]] "Owner sign-off, with three corrections", item
3: "CI authority is committed-policy-or-refuse, no fake approval... no
ephemeral approval environment variable, no implicit yes, no prompting").
That decision already excludes a plan/approval seam from the CI path. The
fix is **not** new machinery, it's correcting `wiki/gate2/technical-spec.md`
§9.4, which currently claims "All five guarantees are now implemented; the
shell-trust suite is closed" without qualification — that sentence
overclaims relative to GA-38 and is what's generating the blocker. State the
real, owner-approved split explicitly: the five guarantees are fully
implemented (including plan/one-shot) on the `lint-format.js` grade path;
the CI floor runner (`check-runner.js` via `checks.js` /
`.rig/bin/check.js`) implements containment, resource ceilings, three-state
network, and committed-policy capability authority, with no plan/approval
seam by design (GA-38). This is fixing a doc that never reflected an
already-made decision, not lowering a bar to dodge a reviewer — don't reopen
GA-38 to argue this further.

**D2 — Blocker 1 (oracle re-sign) resolved as B1: no on-branch re-sign.**
Revert `tests/advanced-oracle.test.js`'s AT-LF-24 case to the last
owner-signed bytes; move the *stronger* assertion (the one that actually
proves the symlink-escape refusal, not just an empty snapshot) into
`tests/guarantee-coverage.test.js` as new, non-frozen coverage — the same
pattern already used for every other fix in this ticket's history. Do the
same for any other content this branch added directly to
`tests/advanced-oracle.test.js` (check `git diff origin/prod...HEAD --
tests/advanced-oracle.test.js` for the full set, not just AT-LF-24 — some of
that diff may be pre-existing/already-signed content unrelated to this
ticket; only revert what this ticket's work added). Goal: `gate1.sig`
verifies against bytes nobody rewrote mid-branch, so blocker 1's AT-GATE-2
concern has nothing to point at. If reverting turns out to be genuinely
infeasible for some specific frozen assertion, stop and report why — do not
fall back to a blind `approve-gate1.js` run as a substitute.

**D3 — Local iteration loop: use `--interim`, not the real ceremony, until
converged.** `scripts/review-receipt.js` does **not** require commits or
signing — `implementationDigest()` (`rig/lib/release-evidence.js:10`) reads
`git ls-files --cached --others --exclude-standard` and then the *current
on-disk bytes*, so it reviews the live working tree, uncommitted edits
included, every time. `--interim` already exists for exactly this: cheap
model, prints verdict + findings, exits non-zero on fail, **never writes the
binding receipt**. Use it as the autonomous loop:

```bash
node scripts/review-receipt.js \
  --target wiki/gate2/technical-spec.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --model claude-sonnet-5 \
  --implementation-root "$(pwd)" \
  --base origin/prod \
  --author-context rig-120-safety-defects-interim \
  --out .context/rig120-interim-review.json \
  --interim
```

Note the scratch `--out` under `.context/` (gitignored, never a release
artifact) — this keeps the interim loop's own `.attempts.json` cap
completely separate from the real ceremony's, so the loop can run
unbounded times without ever needing `--force-rereview`. Before each
interim spawn, run `npm run test:code` first (seconds, not minutes —
catches obvious breakage before spending an LLM call on it; skip
`check-advanced-spec.js`/full `npm test` during the loop since D2's oracle
work may be mid-flight). Loop: fix → `npm run test:code` → interim review →
read findings → fix → repeat.

**Only after two consecutive clean `--interim` passes** (verdict `pass`, 0
blockers, 0 majors — minors are fine to carry if you've made a deliberate
call to accept them and said so in the wiki) move to the real ceremony:
finish D2's oracle work, run the full `npm test` (must be green, including
`check-advanced-spec.js`), commit locally (do not push), then run the
binding review once for real:

```bash
node scripts/review-receipt.js \
  --target wiki/gate2/technical-spec.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --model claude-opus-5 \
  --implementation-root "$(pwd)" \
  --base origin/prod \
  --author-context rig-120-v5.0.0-ceremony-2026-08-30 \
  --out wiki/sources/reviews/rig-120-v5.0.0-2026-08-30.review.json
```

(Bump the date in `--out`/`--author-context` to the actual run date — a
fresh author-context each real attempt keeps the RIG-124 cap meaningful; do
not reuse a prior failing author-context to dodge the cap.) If this comes
back `fail`, that's real signal — go back to the interim loop with the new
findings, do not just retry the same command. Stop and report to the owner
after 3 real (non-interim) attempts total, per the cap's own intent, rather
than spending `--force-rereview` silently.

## The 8 findings, mapped to fixes

Source: pasted reviewer report, author-context `rig-120-v5.0.0-ceremony-2026-08-29`.
Verified against code in this session (see chat transcript / commit that
adds this file); all 3 blockers and all 3 majors were independently
confirmed by reading the referenced source, not just relayed from the
report.

1. **Blocker — `approve-gate1.js` re-signs blindly.** → D2/B1 above. If, after
   reverting the frozen-test bytes, `approve-gate1.js` itself still needs a
   process fix (so a *future* re-sign can't silently absorb an oracle edit),
   the minimal fix is a `--confirm-digest-delta` mode that prints the diff
   between old and new manifest lines and requires an explicit flag/typed
   confirmation before signing, rather than the current `refresh !== false`
   default. Only do this if D2 doesn't fully close the finding on its own;
   don't build it speculatively.

2. **Blocker — guarantees have no shipping caller** (`planExecution`/
   `executePlan`/`runReadOnly`/`runGrade`/`runAutofix` in `lint-format.js`,
   never called outside that file and its tests). → D1 above (spec fix), plus:
   add tests in `tests/guarantee-coverage.test.js` that exercise
   `checks.js`/materialized `.rig/bin/check.js` for exactly what the
   corrected spec claims for that path (containment, timeout/memory ceiling,
   three-state network, committed-policy authority) — not a re-assertion of
   plan/one-shot, which D1 explicitly scopes out of this path.

3. **Blocker — `check-runner.js` defaults network open and leaks env.**
   Two separate real bugs, fix both:
   - `runArgv` (`rig/lib/check-runner.js:32`) spawns with no `env` option,
     so every check command inherits the full parent environment. Mirror
     `lint-format.js`'s `TASK_ENV_ALLOWLIST` isolation here — same allowlist
     shape, applied at the `spawnGuardedSync` call inside `runArgv`. Add a
     red-before/green-after test.
   - The `network === 'undeclared'` branch (`check-runner.js:219-223`) is
     legitimate under GA-38 (additive rollout, see D1) but currently only
     logs via `console.warn` — the reviewer's complaint that it's
     indistinguishable from "allowed" needs the diagnostic to also land in
     the *returned result* (it already does: `diagnostic` key), and needs
     the corrected spec (D1) to say explicitly that `undeclared` is a named,
     visible, temporary compatibility state, not silent default-allow. Check
     whether `tests/guarantee-coverage.test.js` AT-CAP-3 already asserts the
     `diagnostic` field; if not, add that assertion so the state is
     provably non-silent, not just non-silent by convention.

4. **Major — `classifyEnding` test is tautological, and only 4 of 7 endings
   are producible in production.** Rewrite the test to drive `classifyEnding`
   through `runCommand`'s real callers (actual timeout, actual signal, actual
   missing binary) rather than calling `classifyEnding({kind})` directly with
   synthetic kind strings. For `cancelled`, `missing_dependency`,
   `partial_output`: for each, either find/wire a real producer in
   `runCommand` (if the state is meaningful) or remove it from the enum if
   nothing can ever produce it — don't leave speculative dead states. Decide
   per-state, don't blanket either way.

5. **Major — install/uninstall lifecycle bound to a `{}`-writing stub.**
   `rig/lib/lint-format.js:833-863`'s `install()`/`uninstall()` write/delete
   three empty-object files instead of using `rig/lib/lifecycle.js`. Wire
   these to the real lifecycle module the way the rest of the install path
   already does, so AT-LF-17/AT-LF-18 evidence is the actual artifact set
   (generated CI, configuration, managed blocks), not a stub.

6. **Major — Linux `execvpe` rewrite swallows ENOENT.**
   `rig/lib/spawn-guarded.js`'s `linuxPdeathCommand` rewrites every guarded
   spawn to `python3 -c '...os.execvpe(...)'`, so a missing target binary
   surfaces as a nonzero python exit, not `ENOENT` on the spawn — breaking
   `runCommand`'s `result.error?.code === 'ENOENT' ? 'command_not_found' :
   ...` branch on Linux specifically. Either detect the binary's absence
   before the exec (e.g. resolve it against `PATH` first and fail fast with
   a distinguishable code) or have the python wrapper catch its own
   `OSError` from a failed `execvpe` and exit with a reserved, checkable
   code that `runCommand` maps back to `command_not_found`. Needs a Linux-path
   test (or a test that forces the python-wrapper branch on any OS) — the
   existing suite apparently only observes the darwin path.

7. **Minor — "68" vs 73 acceptance IDs.** Three prose fixups in
   `wiki/gate2/technical-spec.md` (§12.3, §13, §17.1) — trivial, do it
   alongside the D1 spec edit in the same pass.

8. **Minor — `runAutofix` approval accepts any `{verified: true}`.**
   `rig/lib/lint-format.js:779`'s approval check isn't bound to a digest of
   the fix argv, unlike plan/remediation approvals elsewhere in the same
   file (§8.7/§9.4 pattern). Bind it the same way: the approval object
   should carry a digest of the exact fix command, and `runAutofix` should
   verify that digest matches the command it's about to run, not just check
   a boolean.

## Definition of done for this handoff

- All 8 findings above have a landed fix or an explicit, wiki-recorded
  reason one was out of scope (should not happen here — all 8 are in scope).
- Every new/changed behavior has a red-before/green-after test, in
  `tests/guarantee-coverage.test.js` unless D2 specifically calls for
  frozen-oracle content.
- `npm test` (the full gate, including `check-advanced-spec.js`) is green
  with **no on-branch re-sign** — i.e. `gate1.sig` verifies without this
  branch having touched `wiki/gate1/testing-infrastructure.manifest` or
  `wiki/gate1/gate1.sig` beyond what was already signed before this
  handoff's work started. If that turns out to be impossible, stop and
  report exactly which frozen file forced it and why, rather than running
  `approve-gate1.js` and moving on.
- Two consecutive clean `--interim` review passes (see D3), then one real
  (non-interim) review with a fresh author-context returns `verdict: pass`
  and writes a receipt under `wiki/sources/reviews/`.
- Nothing pushed. Local commits only, one per logical fix (matches this
  ticket's existing commit granularity), until the owner reviews and decides
  to push.

## Housekeeping (do first)

The pasted 8-finding report currently exists only as the untracked attempts
counter (`wiki/sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.review.json.attempts.json`,
`failures: 1`) with no corresponding `.failed.review.json` file (the wrapper
doesn't write one on `--interim`-less normal fails the way it does for
`--force-rereview`, or the file wasn't saved this time). Write the raw
report the owner pasted to
`wiki/sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.failed.review.json`
now, so it's citable the way every prior round's report is, before starting
the fixes.

## Guardrails — do not

- Do not re-propose unifying `checks.js`/`check-runner.js` further or adding
  a drift test between runner copies — already done and explicitly rejected
  as insufficient by the owner (see [[index/traps]]).
- Do not build a plan/approval seam on the CI path (D1).
- Do not run `approve-gate1.js` as a first resort (D2) — reverting frozen
  bytes comes first.
- Do not run the real (non-`--interim`) ceremony more than once per genuine,
  distinct fix cycle — that's what burned 7 receipts flat in the earlier
  RIG-130 analysis ([[Tickets]] STRUCTURAL entry). The `--interim` loop
  exists precisely so the expensive, cap-limited real review is only spent
  when you already believe you're clean.
- Do not push to `origin/rig-120-safety-defects` or open/update a PR — local
  only, per the owner's explicit instruction this session.
