---
date: 2026-08-30
source: agent
topics: agent-working-conventions
decisions:
status: superseded
supersedes: wiki/status.md
tags: interdependency
---

# Status - checked 2026-08-29 (updated 2026-08-29)

## Development-process handoff in flight (2026-08-30)

Implementing the office-hours handoff. External research found no existing tool
that meets the markdown-only, append-only, checked-in generated-summary shape
without adding a viewer, static-site build, or runtime dependency, so the
authoring-time generator remains the selected approach. In flight: the
delete-first implementation doctrine and evidence-bearing frozen-test exception
path; next: add the deterministic wiki-summary generator and its sync check.

## Full per-ticket verification sweep of all open tickets (2026-08-29, latest)

Verified all 17 genuinely open tickets on `wiki/Tickets.md` against HEAD
`30d6e20` (branch `qa-prod-v2`). Result: **zero stale claims** — every open
ticket accurately describes the current code or product state.

**Code-claim tickets — all defects confirmed still present:**

- **RIG-145**: `runReadOnly` (`lint-format.js:696-700`) still does a
  function-level `return { status: 'network_isolation_unavailable' }` on the
  first ungranted command (inside a `for...of`), while `runGrade` (`:627-628`,
  inside `.map`) returns per-command. Granted commands silently skipped in
  `runReadOnly` when isolation is absent. CONFIRMED OPEN.
- **RIG-146**: `executePlan` (`lint-format.js:459`) still rejects the second
  call via in-memory `approval.used` before reaching `consumePlanApproval`
  (`:483`). `AT-LF-20` (`tests/advanced-oracle.test.js:916-927`) reuses one
  `approval` object, so the on-disk guard is never exercised. CONFIRMED OPEN.
- **RIG-147**: `check-runner.js:198` still calls `console.warn(diagnostic)` in
  the `undeclared` branch alongside the structured `network_state`/`diagnostic`
  return. CONFIRMED OPEN.
- **RIG-127.11**: `removeGlobalConfig()` (`global-writes.js:200`) calls
  `readJson()` (`:35`) — raw `JSON.parse(fs.readFileSync(...))` with no
  try/catch — while sibling `removeGlobalMcp` has a try/catch at `:173`.
  CONFIRMED OPEN.
- **RIG-127.12**: Non-string `record.managed_block` (`lifecycle.js:380`) falls
  back to `'[^\\n]*'` wildcard — regex matches any rig block in the file, not
  just the owned one. CONFIRMED OPEN.
- **RIG-135.1**: `cookie-import-browser.ts` CDP path launches Chrome via bare
  `Bun.spawn` (`:860`, no Job Object), kills with bare `chromeProc.kill()` at
  lines `:908` and `:927` — child renderer/GPU/network processes not reaped on
  Windows. CONFIRMED OPEN.
- **RIG-135.2**: `browser-skill-commands.ts` `spawnSkill` uses `Bun.spawn`
  (`:266`) with bare `proc.kill()` (`:276`) on timeout — no negative-pid group
  kill. CONFIRMED OPEN.
- **RIG-135.3**: `xvfb.ts` comment at `:134` says "Spawn detached" but
  `Bun.spawn` call at `:136-138` has no `detached: true` option. CONFIRMED OPEN.

**Structural tickets — all accurately described:**

- **RIG-132**: `rig/raw-registry-access.json` exists (pre-v5 ratchet landed);
  v5.1 semantic-model collapse still undone. CONFIRMED OPEN.
- **RIG-133**: `tests/advanced-oracle.test.js` is still 73 enumerated named
  test cases via direct-require `api(file, name)` — not properties + a
  generator. CONFIRMED OPEN; awaiting owner approve-for-Coding.
- **RIG-130**: `scripts/review-receipt.js` has no finding-class ledger (only
  `console.log(findings)` at `:224`; no closed-class feed-in). CONFIRMED OPEN.
- **RIG-125**: Loop-breaker tests landed (RIG-126/127/128 closed and green);
  not yet promoted to signed oracle (blocked on RIG-133). CONFIRMED OPEN as
  described.

**Blocked tickets — blockers still accurate:**

- **RIG-116**: No beta selection/receipt evidence or approved demand ranking.
  BLOCKED as described.
- **RIG-113**: Ecosystem preferences + write scopes drafted; not owner-approved
  policy. BLOCKED as described.
- **RIG-112**: D27 (`wiki/index/decisions.md`) confirmed: "Nothing locks until
  solution + acceptance + tests are all in place and the owner agrees." Ceremony
  deferred. BLOCKED as described.
- **RIG-110**: No real-wire records; owner beta-roster decision pending.
  BLOCKED as described.

**Post-release:**

- **RIG-122**: v5.0.0 published; post-release status correctly marked OPEN
  (unblocked). CONFIRMED.

No wiki or board edits needed — all claims were accurate. Next remaining work:
choose a ticket to implement, or ask the owner to approve-for-Coding on
RIG-132/133/130/125 (the structural cluster that gates the others).

## GitHub issues reconciled with ticket board (2026-08-29, latest)

Re-verified all 53 board-linked GitHub issues against `wiki/Tickets.md`:

- **States:** 17 open / 36 closed on both sides — zero mismatches.
- **Bodies:** five closed issues (#64, #68, #73, #75, #92) still carried
  stale OPEN/BLOCKED status lines from before the v5.0.0 close-out; bodies
  updated to match the board's DONE/COMPLETE resolution text and PR links.
- **PR links on closed issues (2026-08-29, second pass):** all 36 closed
  issues now carry a `Resolved by #…` line in the issue body. Seventeen
  pre-v5 close-out tickets (#45–#61, RIG-101–124 batch) were closed during
  the 2026-08-26 board sync without PR references — linked to #27 (the
  close-out merge). Seven shell-trust issues (#91, #93–#97, #104) had PR refs
  only in comments; bodies updated with the resolving PR numbers (#99–#103,
  #107).
- **Coverage:** every board card has a GitHub `#` ref; no orphan RIG issues on
  GitHub; `node scripts/check-ticket-traceability.js` exits 0.

Earlier same-day pass (states + filing):

- **Closed (were open on GitHub, done on board):** #64 RIG-115 (#87/#85/#86/#89/#88/#90), #75 RIG-135 (#77), #92 RIG-136 (#107), #104 RIG-144 (#107).
- **Filed:** #108 RIG-145, #109 RIG-146, #110 RIG-147 (open follow-ups from v5.0.0 review).
- **Filed and closed:** #111 RIG-143 (#102/#107).
- **PR links added** via reconciliation comments on #35–#40, #68, #73, #91, #93–#97 (previously closed manually without PR references).

## Full ticket-board reconciliation against the codebase (2026-08-29, latest)

Swept every ticket on `wiki/Tickets.md` against HEAD `9d1ea45` and the ticket
files. Changes made to the board:

- **17 stale duplicates pruned.** RIG-101/102/103/104/105/106/107/108/109/111/
  114/117/118/119/121/123/124 each appeared twice — a current, accurate
  `DONE (2026-08-26)` card in `## Done` **and** a pre-RIG-131 card in
  `## Backlog` still reading "RIG-131: no ## Acceptance evidence reference".
  The Backlog copies were deleted; the `## Done` cards (GitHub issues closed,
  named test evidence) are unchanged and remain the record.
- **RIG-115 → DONE.** Was filed under `## Blocked` as "IMPLEMENTING —
  AT-LF-22 / AT-LF-24 pending". Both landed weeks ago (commits `7010eca`,
  `dd65b97`); its own ticket file has said DONE since 2026-08-27. Card moved
  out of Blocked, marked `[x]` DONE. Left in the Backlog lane rather than
  `## Done` because the RIG-131 traceability gate requires a `## Acceptance`
  section with `→ test::title` bullets, which this ticket's history predates —
  its evidence is the signed oracle cases `AT-LF-20..24`.
- **RIG-135 checkbox corrected** `[ ]` → `[x]` (status was already COMPLETE;
  the card was just left unchecked).
- **RIG-133 status line corrected** — it claimed "still 65 enumerated cases";
  `tests/advanced-oracle.test.js` is now 73 signed acceptance IDs. The
  structural ask (sign properties + a generator, not a sample list) is
  genuinely untouched, so the ticket stays OPEN.
- **RIG-127.11** re-verified against code and left OPEN: `removeGlobalConfig()`
  → `readJson()` (`global-writes.js:200`/`:35`) is still a bare `JSON.parse`
  with no try/catch, called unguarded from `uninstall()`.

Board lanes after this pass:
- `## Backlog` — open work only: RIG-145/146/147 (review follow-ups),
  RIG-132/133/130/125 (structural, awaiting owner approve-for-Coding),
  RIG-127.11/127.12, RIG-135.1/135.2/135.3 (browse-skill-owned, need an owner
  fix-shape decision), RIG-122 (post-release); plus the completed shell-trust
  cluster (RIG-115/135/136/137/138/139/140/141/142/143/144) marked `[x]` with
  dated COMPLETE / CODE COMPLETE status lines and verifying test names.
- `## Blocked` — RIG-116/113/112/110, all genuinely waiting on an owner
  decision or vendor access; verified still accurate.
- `## Done` — RIG-120 plus the RIG-125-cluster and pre-v5 tickets, all with
  `→ test::title` evidence; RIG-131's `check-ticket-traceability.js` gate is
  green on the reconciled board.

No code changed. `node scripts/check-ticket-traceability.js` and
`node scripts/check-versions.js` both exit 0 on the new board.

## v5.0.0 tagged and published (2026-08-29, latest)

The annotated tag `v5.0.0` points at `9d1ea45ea4876b300fbfe964d46319188ff2f09d`,
the same bytes the passing independent review receipt binds
(`implementation_digest`
`3013e34931a8e44b244c385315b37a10f256f93aee0156803e60cede1d573550`, 1743 files).
The GitHub release is latest:
https://github.com/qaynel/Rig/releases/tag/v5.0.0
Tag CI on that ref is green. The installer resolves this tag by name or as
`latest`. [[RIG-120]] is Done. Trace:
[[reasoning/2026-08-29-v5.0.0-tag]].

The ceremony PR remains open against `qa-prod-finishing-up`; `origin/prod`
does not yet contain this commit. Named-tag installs do not need that merge.

## RIG-120: the 3 accepted-follow-up minors investigated and confirmed against current HEAD (2026-08-29)

The passing Sonnet-4.6 review
([[sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.review.json]]) carries **three**
findings, not two — one `correctness`, one `testability`, one `architecture`, all
`minor`, `unresolved: []`. Every anchor still lines up with HEAD (`9d1ea45`), so
they are live follow-ups, not stale notes:

1. **`runReadOnly` batch-aborts where `runGrade` marks per command**
   (`rig/lib/lint-format.js:696-700` vs `:627-628`). When no OS isolation prefix
   is available, `runReadOnly` does a function-level `return { status:
   'network_isolation_unavailable' }` the moment it meets the first command
   without a network grant, so every later command — including one with
   `network: true` that `runGrade` *would* run inside its `.map` — is skipped.
   Not a safety hole (nothing ungranted runs); an availability/parity gap that
   only bites on a host lacking `unshare`/`sandbox-exec` running a multi-command
   read-only plan whose first command is ungranted. Secondary nit: that early
   return omits `changed_paths`, unlike the sibling early returns. Neither
   `runReadOnly` nor `runGrade` has a non-test caller in `rig/` today, so the
   exposure is "frozen-guarantee parity is asymmetric," not a shipped bug. Fix
   touches the batch-status return shape (skip-and-continue with a reconciled
   final status) — a design call, hence deferred.

2. **AT-LF-20 proves the weak half of one-use** (`tests/advanced-oracle.test.js:916-927`).
   It reuses one `approval` object across both `executePlan` calls, so the second
   call is rejected by the in-memory `approval.used` guard
   (`lint-format.js:459`) *before* it ever reaches the durable
   `consumePlanApproval` disk check (`:483`). The test would still pass with the
   entire on-disk mechanism (`:462-485`) deleted. The real cross-process case is
   covered only by `AT-PROC-1a` in `tests/guarantee-coverage.test.js`, which is
   **non-frozen**. Strengthening AT-LF-20 (pass a fresh `{ plan_digest }` to the
   second call) edits a frozen-manifest file (`advanced-oracle.test.js`, pinned
   `7efc231c…`) so it needs an owner re-sign — that is why it is follow-up, not a
   quick patch. Behavior is correct; the frozen oracle just under-specifies.

3. **Undeclared-network diagnostic is emitted to stderr as well as returned**
   (`rig/lib/check-runner.js:196-200`). The `undeclared` branch already returns
   the structured `network_state: 'undeclared'` and `diagnostic: '…'` fields
   (AD-39 / GA-38 compliant; `AT-CAP-3` + `AT-PROC-1u` assert this), but also
   calls `console.warn`. `status` stays whatever the command returned (0 on
   success) — undeclared is deliberately not a named non-passing result, so
   packs don't break. Residual: the `console.warn` is a redundant side-channel
   that CI can bury under the checked command's own output; callers should route
   `network_state === 'undeclared'` from the return value into a visible
   annotation and the `console.warn` can go.

No code or oracle change made — these were accepted as non-blocking follow-up and
two of the three need an owner decision (return-shape change / frozen re-sign).
The "Two minor testability notes … unchanged-manifest re-sign … shipping
disclosure" phrasing in the entry below and in `wiki/tickets/RIG-120.md` does not
match the receipt's actual three findings; corrected in place.

**Filed and board reconciled (2026-08-29):** the three findings are now
[[RIG-145]] / [[RIG-146]] / [[RIG-147]] (ticket files + `wiki/Tickets.md`
backlog entries). Same pass, verified against HEAD `9d1ea45` and corrected on
the board: [[RIG-144]] OPEN → CODE COMPLETE (canonical `rig/lib/check-runner.js`
shipped, `AT-CAP-1..6` green in both runner layouts); [[RIG-136]] OPEN → DONE
(`check-advanced-spec.js` already prints a dynamic `caseCount`, no "68"
literal). [[RIG-127.11]] re-checked and still accurately OPEN (`readJson` at
`global-writes.js:34` is still an unguarded `JSON.parse`). Not yet done: a
full per-ticket verification sweep of the remaining ~30 open/structural
tickets, and the ~17 stale duplicate entries sitting in `## Backlog` for
tickets already marked DONE in `## Done` (RIG-101/102/103/104/105/106/107/108/
109/111/114/117/118/119/121/123/124) — needs an owner call on whether to prune
them.

## RIG-120 fresh independent review passes (2026-08-29)

The owner authorized another local force re-review and iteration to a passing
receipt. The eight prior runtime/design findings remain remediated in the
working tree. The strict autofix-command digest experiment was removed because
it contradicted the signed acceptance test; exact argv binding is now stated
honestly as a non-frozen hardening gap, while the signed separate-approval and
re-verification behavior stays intact. The historical re-sign blocker is fixed
at its reusable cause: the ceremony helper now refuses a changed manifest or
any re-sign until the owner returns the digest of the exact proposed combined
oracle, and it changes no frozen byte before that confirmation. Its focused
test was observed red before implementation and is green after. The combined
focused suite is green (112/112). The requested Opus force re-review launched
but the local Claude account exited before reviewing because its session limit
is exhausted until 22:10 IST; no receipt or findings were produced. The fresh
fallback Codex review completed but failed on five findings that require
reopening the frozen-vs-CI authority split: it treats every CI check as needing
a one-use human plan approval, while the owner-approved CI design explicitly
requires committed policy or refusal and forbids fake approval. It also asks
for whole-child filesystem sandboxing beyond the narrower executable case.
That non-binding fallback report is saved under sources/reviews; no frozen
artifact is being rewritten to satisfy it. The full `npm test` gate is now
green: the signed oracle verifies, the root suite reports 544 pass / 1
platform skip, the pi-extension suite passes 15/15, and rig-mcp passes 6/6.
The earlier aggregate review-test hang was reproduced and removed by replacing
its forked shell/stdin fake with a single-process Node fake; its focused suite
passes 40/40 and the full parallel gate now terminates. The owner switched the
unavailable Opus reviewer to Claude Sonnet 4.6. That fresh review passes with
zero blockers and zero unresolved cases. Its **three** non-blocking minor
findings (`runReadOnly`/`runGrade` network-isolation parity, AT-LF-20 proving
one-use only via the in-memory flag, undeclared-network `console.warn` side
channel) are accepted follow-up; none edit the frozen oracle without an owner
re-sign. See the top entry for the per-finding investigation. The receipt
is refreshed after this tracked status reconciliation so its implementation
digest binds the final bytes. Nothing has been committed or pushed.

## RIG-120 fresh review FAIL again, 8 findings — handoff written, not yet fixed (2026-08-29, latest)

A newer fresh review (author-context `...ceremony-2026-08-29`, run after
the capability-policy close-out below) came back `fail` with 8 findings (3
blockers, 3 majors, 2 minors) — deeper than the prior force-rereview: the
canonical `check-runner.js` unification is real but still defaults network
open on undeclared bindings, leaks the full parent environment, and the
plan/one-shot guarantees still have no shipping caller; separately, the
gate1 re-sign mechanism itself (`approve-gate1.js`) blindly absorbs any
oracle edit into a fresh signature, which is what commits `5b5cfb6` and
`0d59371` did on this branch. Raw report saved:
[[sources/reviews/rig-120-v5.0.0-2026-08-29-fresh.failed.review.json]].
Owner made three scoping decisions (keep CI-path plan/approval out per
GA-38, revert the on-branch oracle re-sign rather than justify it, iterate
locally via `--interim` before spending the real capped review) and asked
for an execution handoff. Full brief, all 8 findings mapped to fixes, and
the local-iteration-loop mechanics:
[[reasoning/2026-08-29-rig120-fresh-review-v2-handoff]]. Not started yet —
next session/agent should pick up there.

## RIG-120 autofix isolation/caps gap closed (2026-08-29)

Fixed the "major" finding from the 2026-08-29 force-rereview
([[reasoning/2026-08-29-rig120-force-rereview-fail]]): `runAutofix`
(`rig/lib/lint-format.js:777`) called bare `spawnTask` for both its fix and
verify commands, with no `networkIsolationPrefix`, `timeoutMs`, or
`memoryLimitMb` — the only one of the three execution seams (read/grade/fix)
missing those guarantees, and the mutating one. It now routes both commands
through `networkIsolationPrefix()` + `runCommand(..., { timeoutMs,
memoryLimitMb })`, matching `runGrade`/`runReadOnly`: an ungranted command
refuses with `network_isolation_unavailable` when no OS isolation is
available, and a `timeout`/`memory_exceeded` result on either the fix or
verify step halts before reporting `verification: 'pass'`.

Two new regression tests in `tests/guarantee-coverage.test.js`
(`AT-PROC-1r` network, `AT-PROC-1s` memory ceiling), both confirmed
red-before (via `git stash` of only the `lint-format.js` change) and
green-after. Not added to the frozen oracle — same non-frozen pattern used
for every other single-seam gap fix in this ticket's history, so this does
not force a second oracle re-sign. The existing frozen `AT-LF-12` case still
passes unchanged.

**Does not by itself clear the review.** The other blocker from the same
force-rereview — `tests/advanced-oracle.test.js` hashes to `7efc231c…` but
`wiki/gate1/testing-infrastructure.manifest` still pins `6997a0be…` — is a
ceremony step, not a code defect; `npm test` confirms the gate is red on
exactly this digest mismatch (`scripts/check-advanced-spec.js` output).
Needs the key holder to re-sign against current bytes; `RIG_GATE1_SIGNING_KEY`
is not available in this session.

Ran `npm run test:code` (bypassing the gate, same as prior passes in this
history) to confirm no regressions: 535/537 pass, 1 expected Linux-only skip,
1 failure (`review-receipt cap is scoped per author-context and clears on a
passing verdict`, RIG-124) — confirmed pre-existing full-suite flakiness, not
caused by this fix: it passes standalone (`node --test
tests/release-blockers.test.js`, 40/40 in ~19s) both with and without the
`lint-format.js`/`guarantee-coverage.test.js` change stashed out; it only
fails, and takes ~30 minutes instead of ~1s, inside the full 537-test run —
cross-test contention/state leakage, tracked separately, not this ticket's
concern.

## RIG-120 fresh independent review FAIL (2026-08-29, force re-review)

`--force-rereview` completed (~3.6 min, `claude-opus-5`). Wrapper refused
the binding receipt (`verdict must pass`). Raw report:
[[sources/reviews/rig-120-v5.0.0-2026-08-29.failed.review.json]]. Independently
verified: (1) blocker — `tests/advanced-oracle.test.js` is `7efc231c…` while
the manifest still pins `6997a0be…`; helpers/verifier were re-pinned and
`gate1.sig` rewritten in this worktree, so this is a partial re-sign over a
stale oracle pin; verifier red. (2) major — `runAutofix` still uses bare
`spawnTask` with no network isolation or resource caps. Three minors (undeclared
catalogue network, uninstall throw on escaping journal path, "68" prose vs 73
IDs) are not receipt-blocking. Attempts file is at failures: 3. Trace:
[[reasoning/2026-08-29-rig120-force-rereview-fail]].

## RIG-120 capability close-out in flight (2026-08-29)

The remaining code-level runner work is complete. The canonical shared runner
now applies per-binding timeout and memory ceilings, three-state network
handling, committed exact-service authority for raised ceilings or required
network, and named fail-closed refusals. Direct and materialized-runner tests
are green, as is the full code suite; only the owner release ceremony remains.
[[reasoning/2026-08-29-rig120-capability-policy-close-out]].

## rig-120 symlink-escape blocker fixed; shipping-path-bypass blocker still open, needs owner scoping (2026-08-29, latest)

Acting on the 2026-08-29 fresh-review findings below. Two blockers were found;
one is fixed, one needs an owner decision before implementation (recorded as
a question in [[RIG-144]]'s terms, not guessed at).

**Fixed — symlink-escape refusal (AT-LF-24), both flagged gaps:**
`rig/lib/lint-format.js`'s `planExecution` used to swallow a `cmd.source`
symlink escape silently (leaves `source_snapshot: null`, no refusal), and
`executePlan` then re-read the same file a second time with *no* containment
check at all, actually reading the outside file's bytes through the symlink.
Both call sites now share one `readSource()` helper built on the existing
`containedPath()` realpath-aware guard (same one `taskCwd` already uses) —
plan time marks `source_boundary_violation: true` instead of a bare null
snapshot, and execute time independently re-derives from disk (does not
trust the plan-time flag, since the symlink could appear only after
planning) and returns a hard `boundary_violation` instead of falling through
to the recoverable `command_drift` state. AT-LF-24
(`tests/advanced-oracle.test.js`, frozen oracle file) rewritten to assert the
actual refusal and that the outside command's side effect never ran, not just
that the snapshot was empty — confirmed red against pre-fix code, green after.
**This edits a file in `wiki/gate1/testing-infrastructure.manifest`; `gate1.sig`
is now invalid pending owner re-sign, same as every other oracle-touching
change in this ticket's history.**

**Same-pattern generalization, not requested by name but same lexical-vs-
realpath bug class:** `rig/lib/checks.js`'s `runBinding` (`required_paths`
check and `commandBinding.cwd` check) and `semanticDrift` (`doc.path` from
`.rig/context-index.json`) all used `path.resolve` + `startsWith` string-
prefix containment — the exact non-realpath check [[RIG-144]] already named
as "unambiguously worth doing regardless of the other four" open questions.
All three now use `containedPath()`. Three new regression tests in
`tests/guarantee-coverage.test.js` (AT-PROC-1l/1m/1n, non-frozen), each
confirmed red-before/green-after.

**Still open — blocker #1, the shipping-path-bypass finding itself.**
`checks.js` (materialized as `.rig/bin/check.js`, the runner the installed
product actually calls) still has no plan/approval concept, no environment
allowlist (inherits real env), and no network isolation or memory ceiling —
only the cwd/path containment axis is now realpath-based. [[RIG-144]] already
lists open owner questions on this (network/memory legitimately needed by
real CI, no plan/execute seam to hang one-use approval on). Not implementing
a guess on a security-consequential default for the shipping product;
asking the owner for scope per the ticket's own "needs owner decision"
section rather than repeating this ticket's other pattern (patching the
demonstrated case without generalizing).

Full `npm test` run: `node scripts/check-advanced-spec.js` now fails as
expected/by design (`tests/advanced-oracle.test.js` digest changed —
`gate1.sig` needs owner re-sign), so the gate short-circuits before the test
suite. Ran `npm run test:code` directly to verify the code itself: **525/526
root tests pass (1 expected Linux-only skip), pi-extension 15/15, rig-mcp
6/6, 0 failures** — no regressions from either fix. `every runtime library
module has a production caller` (the file-granularity guard) still passes.

**Same-day follow-up, found starting the next grilling pass:** the
`checks.js` fix above only covered half the real runner. `rig/catalog/baseline/
check.js` — a second, hand-maintained, not sync-mapped duplicate materialized
byte-for-byte to `.rig/bin/check.js`, which is what every generated CI
workflow actually invokes (`rig/lib/checks.js` backs the separate in-process
`rig check` subcommand instead) — had the identical lexical-containment bug,
plus `check-copies.js`'s symlink check only looked at the path's leaf, not
intermediate directory segments. Fixed both, materialized `path-safety.js`
into `.rig/lib/` (`apply.js`) so `containedPath()` is available at the
installed layout, and added four regression tests
(`tests/guarantee-coverage.test.js` AT-PROC-1o/1p/1q) that `require()` the
actual catalog files from a temp dir laid out like a real install — not
`rig/lib/checks.js` — specifically so this exact "fixed the wrong copy" miss
can't recur silently. All four confirmed red-before/green-after. New trap
entry recorded (third recurrence of "the oracle is green at a seam the
product doesn't use," this time: two live shipped copies of one runner,
independently hand-copied and silently drifting). Full `npm run test:code`
re-run after this: **528/529 pass (1 expected skip), pi-extension 15/15,
rig-mcp 6/6, 0 failures.**

Wiki synced this pass: `wiki/tickets/RIG-120.md`, `wiki/tickets/RIG-144.md`,
`wiki/topics/trust-and-failure-boundaries.md`, `wiki/index/traps.md`, this
file, and the reasoning trace (updated in place with the follow-up). No new
decision-index entry yet — these are implementation-gap corrections against
the already-frozen `GA-37`, not a new ruling. The larger capability-policy
scope (RIG-144's remaining plan/approval, network, memory axes, now shaped
by the owner's pasted architecture decision) is a real new ruling and is
being drafted as acceptance criteria via `rig-grilling` next, including the
open question this pass surfaced: whether to unify the two runner copies or
add an explicit drift guard between them.

**Grilling draft delivered, awaiting sign-off (2026-08-29, latest):** six
acceptance criteria (`AT-CAP-1`..`6`) drafted from the owner's pasted
document plus RIG-144's existing scoping questions — resource limits and
fail-closed are unconditional/mandatory, network-declaration reuses
`lint-format.js`'s proven `cmd.network` mechanism, capability authority for
v5 is CI-committed-policy only (interactive approval deferred, declared as a
reversible inference), the two runner copies stay independently fixed plus
gain a parity test rather than being unified now. One real decision flagged,
not inferred: whether the new network-deny-by-default should apply
immediately (breaks any of the ~115 existing catalog service packs that need
network and don't yet declare it) or additively (opt-in now, audit catalog
packs over time) — recommended additive. Full draft:
[[reasoning/2026-08-29-rig144-capability-policy-grilling]]. No testing
infrastructure or implementation started yet; waiting on the owner's
acceptance-criteria sign-off and the one decision, per the gate contract
(an agent may draft the oracle, the human signature is what makes it safe to
build against).

## rig-120 fresh independent review FAILS: shipping path bypasses the safety guarantees (2026-08-29)

Ran the formal release-review ceremony against the exact worktree (including
all uncommitted safety-defect fixes below), base `origin/prod`. Verdict:
**fail** — no receipt written, as designed. Two blocker findings independently
verified against the code, not just taken on the reviewer's word:

- The five shell-trust guarantees are implemented and tested only inside the
  functions the guarded read/grade/execute/autofix paths use. Nothing outside
  that module and its own tests calls those functions. The command runner the
  installed product actually uses (traced from install through to execution)
  has none of those guarantees: it inherits the real environment, applies no
  network isolation, no memory ceiling, and checks working-directory
  containment by string prefix rather than by real path. This is the same gap
  [[RIG-144]] already tracks as open — confirmed here to be release-blocking,
  not just a hardening backlog item.
- The symlink-escape refusal the technical design promises does not happen: a
  containment check on the planning step silently swallows an escape instead
  of refusing, and the execution step re-reads the same file with no
  containment check at all, so an outside file is actually read through the
  symlink. The one test covering this only checks for an empty result, which
  is equally true for an unrelated failure, so it never caught this.

One flagged item was checked and cleared: the uncommitted, resigned oracle
files verify cleanly against the registered owner signing key. One flagged
item (non-GitHub CI provider removal downgraded to best-effort) matches a
scope decision already recorded elsewhere in this log, likely not new
information. Full trace and unverified minor items:
[[reasoning/2026-08-29-rig120-fresh-review-fails-shipping-path-bypass]].

**Net: RIG-120 does not clear the ceremony on this worktree.** This is a new
kind of finding for this ticket — every prior review round found and closed
defects inside the guarded functions themselves; this one found the guarded
functions aren't on the path the installed product runs. Awaiting an owner
decision on scope/priority before any further ceremony attempt.

## rig-120 memory-watchdog poll/exit race closed (2026-08-28)

Closed the one item left open below (2.4): a memory-ceiling poll landing in
the gap between a guarded child exiting and `memory-guarded-exec.js`'s `close`
handler clearing the interval could read the already-reaped pid out of `ps`,
see it missing, and report `memory_ceiling_unavailable` (killing/misreporting
a command that had actually finished clean). Small-radius fix: a new
`isChildRunning(child)` predicate in `rig/lib/memory-guarded-exec.js` checks
`child.pid`/`exitCode`/`signalCode` (all set synchronously by the `exit`
event, which always fires before `close`) and the poll's `setInterval`
callback now skips itself when the child has already exited or been
signaled, instead of treating that as "RSS unavailable, kill it." No change
to `rssBytesTree`, `run`'s control flow, or the reported status shape.

New test: `tests/guarantee-coverage.test.js` `AT-PROC-1k` — spawns a real
child, asserts `isChildRunning` is `true` immediately after spawn and `false`
inside the child's own `exit` handler. Confirmed red (`isChildRunning is not
a function`) against the pre-fix module, green after. Not part of the frozen
oracle (`guarantee-coverage.test.js` isn't in
`wiki/gate1/testing-infrastructure.manifest`), so no re-sign is needed for
this change. Full `npm test` re-run clean: root 522/523 (1 expected
Linux-only skip), pi-extension 15/15, rig-mcp 6/6.

Still uncommitted, same as the rest of this pass.

## rig-120 clearance checklist verified against the review handoff (2026-08-28)

Checked the working tree against `.context/rig-120-safety-followup-handoff.md`'s
"Definition of done" (§6), the review that found the ordering regression and
the CI allow-list gap below. Every mandatory item was already implemented in
this worktree, uncommitted:

- **2.1 ordering regression:** fixed — `isRigInstallPath` now runs after
  `resolveRecordPath`'s symlink-aware containment in `rig/lib/lifecycle.js`;
  `tests/release-blockers.test.js`'s ancestor-symlink case is green.
- **2.2 CI allow-list gap:** fixed — `INSTALL_UNIQUE_CI_FILES` derives from
  `ci-adapters.js`'s `PROVIDERS` registry rather than a second hardcoded list;
  `tests/install-uninstall-roundtrip.test.js` gained a full round-trip case
  per provider plus forged-record and merge-preservation cases, all green.
- **2.3 read-only install identity:** fixed — `removeOpenClawMcp` now calls
  `readInstallId` instead of the allocating `installId`.
- **2.4 memory-watchdog poll/exit race:** left as-is in this pass — the
  handoff marks it optional/low-probability (15ms same-tick overlap only)
  and not gating. Closed in the follow-up entry above.
- Wiki sync (topics, decisions, ticket, reasoning traces): already done, all
  five 2026-08-28 reasoning files present and cross-linked.
- Oracle re-sign: `wiki/gate1/gate1.sig` already carries a fresh signature
  over the updated `tests/helpers/advanced.js` / `scripts/check-advanced-spec.js`
  digests; `node scripts/check-advanced-spec.js` verifies (73 acceptance IDs).

Ran the full gate fresh: `npm test` green end to end — oracle verified,
rule-copies/versions/secrets checks pass, root 521/522 (1 expected Linux-only
skip), pi-extension 15/15, rig-mcp 6/6, `check-ticket-traceability.js` clean.
No code changes were needed this pass; the worktree already clears every
mandatory item. Remaining RIG-120 work is unchanged from the ticket: the
owner-controlled ceremony (fresh independent review receipt bound to these
exact bytes, then the explicit `v5.0.0` tag/publish). This local work is still
uncommitted.

## rig-120 CI journal trust closed locally (2026-08-28, latest)

Uninstall no longer treats editable journal fields as proof of CI ownership.
Classification uses the real path of the file being changed. Unique GitHub
workflow removal is digest-checked whole-file delete only. The only CI
line-strip is the exact GitHub adapter pointer, and only when that line is
present. Directory-symlink trampolines, hard links, lexical aliases, empty
forged-pointer workflows, and forged `managed_line` / `append_managed` records
are named best-effort.

Evidence on these bytes: focused safety suites 63/63; frozen executable suite
74/74; signed five-file oracle verified (73 acceptance IDs); literal `npm test`
green — root 521 pass / 1 expected Linux-only skip / 0 fail, pi-extension 15/15,
rig-mcp 6/6. Independent review of the final CI boundary found no remaining
forged-journal mutation of user pipeline content. Remaining release work is the
ceremony: a fresh receipt bound to the exact PR worktree, signer attestation,
and explicit `v5.0.0` tag/publish.

## rig-120 CI path-identity follow-up (2026-08-28)

Uninstall no longer treats editable journal fields as proof of CI ownership.
Classification uses the real path of the file being changed. Unique GitHub
workflow removal is digest-checked whole-file delete only. The only CI
line-strip is the exact GitHub adapter pointer, and only when that line is
present. Directory-symlink trampolines, hard links, lexical aliases, empty
forged-pointer workflows, and forged `managed_line` / `append_managed` records
are named best-effort. Focused safety suites: 63/63. Frozen executable suite:
74/74. Signed five-file oracle: verified (73 acceptance IDs). Literal `npm test`
is the remaining local gate, then ceremony review and publish.

## rig-120 CI path-identity follow-up (2026-08-28)

Independent review of the managed-line gate found two remaining CI grants:
unique-file `create_owned` still let a forged `managed_line` rewrite bytes
(including through an in-repo symlink), and lexical `..` aliases under an
install-tree prefix could delete a resolved user pipeline. Uninstall now
classifies against the contained relative path, refuses symlink write-through,
and limits unique-file removal to digest-checked whole-file delete. Focused
safety suites are 60/60. Frozen oracle, literal `npm test`, and a second
independent review of these bytes are next.

## rig-120 CI managed-line attribution closed locally (2026-08-28)

Uninstall no longer treats an editable journal `managed_line`, `managed_block`,
or `append_managed` field as proof that a user CI line belongs to Rig. CI
line-strip is limited to the exact GitHub workflow pointer the adapter writes,
under that append-managed ownership class. The dedicated Rig-named workflow
remains whole-file removable. Forged `create_owned` + `managed_line` and forged
`append_managed` + an arbitrary user line are named best-effort and leave the
file unchanged. `.github` directory membership is no longer whole-file
ownership proof.

The new pair of regressions is green (forged managed-line rejected; legitimate
pointer-line uninstall restores the user workflow and deletes `rig.yml`).
Focused safety suites: 57/57. Frozen executable suite: 74/74. Signed five-file
oracle: verified (73 acceptance IDs). Literal `npm test` is next, then a fresh
independent review of the final diff.

## rig-120 editable-journal deletion blockers fixed locally (2026-08-28)

Uninstall no longer accepts a `create_owned` journal label and matching digest
as proof that a common CI pipeline belongs exclusively to Rig. The dedicated
Rig-named GitHub workflow remains removable; common GitLab, CircleCI, Jenkins,
Buildkite, and Azure pipeline files now survive as named best-effort cases. A
forged OpenClaw runtime prefix also cannot bypass containment because every
journal path resolves through the symlink-aware guard before preservation.

Both regressions were demonstrated red before the shared lifecycle fix. The
complete focused safety suites are green at 53/53 and the frozen executable
suite is green at 74/74. The literal `npm test` release gate is also green:
511 root tests passed with one expected macOS skip, plus pi-extension 15/15 and
rig-mcp 6/6. The frozen oracle and its five-file signature verify at 73
acceptance IDs. Fresh independent review of the final diff is in flight.

## npm test fixture-hook leak fixed and re-signed (2026-08-28)

The owner re-signed the corrected checker manifest and the oracle now verifies.
The next full local run then exposed a real fixture-isolation defect: a temporary
Git repository inherited this Mac's global pre-commit hook, which referenced a
deleted temporary file and prevented the history-scanner acceptance case from
creating its fixture commit. The shared advanced fixture helper now loads the
existing hermetic Git configuration, so every temporary advanced repository
ignores machine-global and system Git configuration. The focused frozen suite is
green: 74/74, including the formerly failing history-scanner case.

That shared helper is one of the signed testing-infrastructure files. Its new
digest is now present in the owner-signed manifest and the oracle verifies; the
literal `npm test` rerun remains the next release check.

## rig-120 safety defects fixed for independent re-review (2026-08-28, latest)

Fresh review receipt blocked release on three safety defects plus documentation
drift. All three code defects now have red-before/green-after regression tests,
and the stale release notes were corrected:

- **Journal path trust:** uninstall refuses to delete paths outside Rig's own
  install area, so a forged manifest record cannot aim removal at an unrelated
  in-repository file even when the digest matches.
- **OpenClaw ledger trust:** uninstall only unregisters the server name derived
  from this repository's install id (`rig-<install-id>`), not whatever name a
  forged ledger entry supplies.
- **Memory watchdog partial listing:** `rssBytesTree` treats a missing root pid,
  non-zero `ps` exit, or empty process list as unavailable and fails closed
  instead of reading zero bytes and letting a capped command continue.
- **Documentation drift:** `scripts/check-advanced-spec.js` now prints the live
  acceptance-case count it just verified (73 today, not a stale "68" literal);
  [[review-receipts]] no longer lists RIG-124.1 as open.

No frozen oracle acceptance document was edited. The checker log-line change
invalidates `gate1.sig` until the owner re-signs during the RIG-120 ceremony.

## rig-120 code blocker: runReadOnly maps memory_ceiling_unavailable to clean (2026-08-28, latest)

Code review raised a correctness defect that blocks the rig-120 release: a
memory-limited read-only command killed because `ps` is unavailable returns
`{ status: 'clean' }` instead of `{ status: 'memory_ceiling_unavailable' }`.

**Root cause:** `runReadOnly` (`rig/lib/lint-format.js:703`) only intercepts
`'timeout'` and `'memory_exceeded'` before falling through to the snapshot-diff
check. When `ps` is absent, `memory-guarded-exec.js` correctly kills the command
and writes `killed_for: 'memory_ceiling_unavailable'` to the result file, and
`runCommand` faithfully returns that status — but `runReadOnly` never matches
it, finds no working-tree mutation (the command was killed), and returns `clean`.
This violates the fail-closed resource-limit guarantee.

**Test gap:** AT-PROC-1f only calls `rssBytesTree` directly; it never exercises
the full `runReadOnly` → `runCommand` → result-file path. A test that strips `ps`
from PATH and calls `runReadOnly` with `memory_limit_mb` would have caught this.

**Fix (red-before / green-after, both on current HEAD):**

- `rig/lib/lint-format.js:703`: added `|| result.status === 'memory_ceiling_unavailable'`
  to the early-return condition in `runReadOnly`.
- `tests/guarantee-coverage.test.js`: added AT-PROC-1i — strips `ps` from PATH,
  calls `runReadOnly` with `memory_limit_mb: 64`, asserts the result is
  `memory_ceiling_unavailable` not `clean`. Confirmed red against the pre-fix
  code, green with the fix.

No frozen oracle file was edited; no re-sign is required. Full AT-PROC-1a–1i
focused suite: 9/9 passed. Full `npm test` gate: 501/504 root tests pass, 1
expected Linux-only skip, 2 pre-existing failures (AT-B3 git-hooks workspace
leak, AT-HOME-1 rig-mcp node_modules not installed) — identical to the
pre-fix baseline. Reasoning trace: [[reasoning/2026-08-28-runReadOnly-memory-ceiling-unavailable-clean]].

## Linux CI regression isolated and fixed locally (2026-08-28, latest)

The red hosted runs were caused by the Python executable path resolver added to
`rig/lib/spawn-guarded.js`. On Linux it selected the project virtualenv's
interpreter for the process wrapper, so the network-isolation probe and guarded
commands returned non-zero with no useful output. The resolver now selects a
host interpreter instead, while preserving the absolute lookup needed when a
guarded task deliberately empties PATH. The existing rootless namespace probe
and per-command refusal behavior remain unchanged. The local full gate is green:
502 root tests passed, one expected Linux-only skip, plus 15 pi-extension and
6 rig-mcp tests. The hermetic fixture helper is intentionally not part of this
fix because it is a frozen oracle file and the hosted failure is independent
of the local machine's global Git hook. Hosted Linux CI is green on commit
`4729360` (run `33180105316`).

## PR #83 non-gating triage: 3 of 4 items fixed with regression tests; gate1.sig double-resign explained; 4th item filed as RIG-144 (2026-08-28, latest)

Picked up the "non-gating, triage before RIG-115 is marked Done" list below.

**gate1.sig resigned twice 51s apart (`b58493b`, `3e98993`), same author,
identical message — resolved, not a conflict.** Both commits touch only
`wiki/gate1/gate1.sig`, no manifest content, so both signatures cover the
identical underlying digest — ECDSA-SHA2 is randomized, so signing the same
bytes twice produces two different-looking but equally valid signatures. Not
a content dispute; ordinary consequence of running the sign step twice.
Moot either way now: both were later superseded (`5650e49`, then again by
`8ad5825`/`59a0c1c` landing RIG-137's actual implementation), and current HEAD
verifies cleanly (`node scripts/check-advanced-spec.js`: 68 cases, signature
valid).

**Fixed, with regression tests in `tests/guarantee-coverage.test.js`
(non-frozen — outside `wiki/gate1/testing-infrastructure.manifest`), all
confirmed red-before/green-after against the pre-fix code:**

- **Drift-abort burned the one-use approval.** `executePlan`
  (`rig/lib/lint-format.js`) wrote the durable one-use approval record
  *before* checking for source drift, so an aborted (never-executed) attempt
  permanently consumed the approval — a later re-approval of the identical,
  drift-reverted `plan_digest` could never execute. Fixed by moving the
  drift check (read-only) before `consumePlanApproval`. Test: `AT-PROC-1e`.
- **Approval records never cleaned up on uninstall.** `.rig/lint-format/`
  (durable one-use plan-approval records) isn't journal-tracked — it's
  runtime state, not an install artifact — so `cleanupReceiptArtifacts`
  (`rig/lib/uninstall.js`) never removed it, and it also blocked the
  `.rig` empty-dir cleanup from ever firing. Fixed: unconditional
  `rm -rf .rig/lint-format` added to uninstall. Test: `AT-PROC-1h`.
- **Memory ceiling silently no-ops when `ps` is absent; only sampled the
  direct child.** `memory-guarded-exec.js`'s `rssBytes` treated a `ps`
  spawn failure (ENOENT) identically to "process using 0 bytes" —
  `0 <= memoryLimitBytes` is always true, so the ceiling never fired on a
  host without `ps`. It also only ever queried the one directly-spawned
  pid, so a command that forks (shell wrapper, test runner spawning
  workers) could blow the ceiling entirely inside an unsampled descendant.
  Fixed: `rssBytesTree` walks the full `ps -eo pid,ppid,rss` process tree
  rooted at the spawned pid and reports `available: false` on a `ps`
  failure; the caller now kills and reports a distinct
  `memory_ceiling_unavailable` status (same fail-closed pattern as
  AT-LF-22's `network_isolation_unavailable`), instead of silently
  enforcing nothing. Tests: `AT-PROC-1f`, `AT-PROC-1g`.

**Filed, not implemented — [[RIG-144]] ([ticket](tickets/RIG-144.md)):** the
installed `rig/catalog/baseline/check.js` (materialized as `.rig/bin/check.js`
in target repos) carries none of `lint-format.js`'s AT-LF-20..24 hardening
(no plan/approval, string-prefix not realpath cwd containment, no network
isolation, no memory ceiling). Not a drop-in port: this runner executes CI/
git-floor checks that legitimately need network and can legitimately run
long/heavy for a real repo's test suite, so AT-LF-22's default-deny network
stance or a fixed memory ceiling could break ordinary CI rather than protect
anything — needs owner scoping on which of the five guarantees actually
apply here, same as RIG-135.1/.2/.3 needed owner input on the Bun group-kill
gap. The realpath-containment gap looks unambiguous and worth fixing
regardless of the other four.

Full `npm test` gate run on this HEAD with the three fixes: 483/503 root
tests pass. All 20 remaining failures are pre-existing and reproduce
identically with the three fixes stashed out — traced to this workspace's
global `core.hooksPath` (`~/.config/git/hooks`) leaking into every test's
temp git repos and breaking their pre-commit-hook assertions/secret-guard
scans; unrelated to this change and outside this triage's scope.

## Board/GitHub reconciliation: RIG-137/138/139/140 corrected to COMPLETE; RIG-144 filed (2026-08-28, latest)

Follow-up to the "separately noticed" flag above, per explicit request.
`wiki/index/decisions.md` already recorded (2026-08-27) that RIG-138/139/140
closed via the consolidated `lint-format.js` fix and linked GitHub #93/#94/#95
as closed — but `wiki/Tickets.md`'s board and the actual GitHub issues were
never updated to match, and RIG-137 (#91) was still marked OPEN/blocked
despite its own re-sign and implementation having landed. Re-verified before
touching anything: `AT-LF-20`–`24` (named oracle cases) and
`AT-PROC-1a`/`1b`/`1c` (guarantee-coverage cross-cutting tests) are all green
on current HEAD.

- `wiki/Tickets.md` and `wiki/tickets/RIG-137.md`/`138.md`/`139.md`/`140.md`
  updated to COMPLETE with the verifying test names.
- `wiki/topics/trust-and-failure-boundaries.md`'s RIG-137 paragraph rewritten
  from present-tense "the patch is global, still ships" to past-tense
  resolved — it was describing removed code as still in production.
- GitHub #91, #93, #94, #95 closed with the same evidence.
- [[RIG-144]] (the installed-baseline-runner gap, previously drafted only in
  the wiki) filed as GitHub #104.
- Confirmed one apparent inconsistency was not a mistake: `git remote`
  here points at `qaynel/Rig-v0.1.git`, but that name 302s to the actual
  repo, `qaynel/Rig` — every `gh issue` call in this pass landed in the same
  single repo regardless of which name was used to reach it.


## Merged origin/rig-120-release-ceremony (2026-08-28, later)

Took RIG-143 (`runGrade` network isolation matching `runReadOnly`) while
keeping this branch's owner-canonical RIG-137 Option A: async `AT-LF-22`
with `listen(0, '127.0.0.1')` awaiting `'listening'`, not the incoming
`listen(0)` no-host rewrite. Gate-1 signature and oracle hash stay on this
branch's test bytes. Still blocked on key-holder re-sign of
`wiki/gate1/testing-infrastructure.manifest`.

## RIG-137: canonical branch decided, gate1 re-sign is the only remaining blocker (2026-08-28, later)

Implementation of the owner-approved async `AT-LF-22` fix landed on this
branch (`rig-137-option-a-scope`): production monkey-patch deleted from
`rig/lib/lint-format.js`, `AT-LF-22` rewritten async (keeps
`listen(0, '127.0.0.1')`, awaits `'listening'` and `server.close()`, manages
its own temp dir). `node --test tests/advanced-oracle.test.js` passes
`AT-LF-22` and shows no regression (two pre-existing, unrelated failures —
`AT-B3`, `AT-HOME-1 OpenClaw` — reproduce identically on unmodified HEAD).

A parallel, uncoordinated RIG-137 fix was found on sibling workspace
`mogadishu` (branch `rig-137-monkey-patch`, commit `69db079`): same patch
deletion, but `AT-LF-22` fixed via `listen(0)` with no host (synchronous on
current Node, but undocumented behavior, and drops the loopback-only
fixture). Owner ruled this workspace's async version canonical;
`mogadishu` notified via cross-session message and asked not to sign/merge.

**Blocked on:** key-holder re-sign of
`wiki/gate1/testing-infrastructure.manifest`'s `tests/advanced-oracle.test.js`
hash — `node scripts/approve-gate1.js` correctly refuses here (no
`RIG_GATE1_SIGNING_KEY` in this session). Once signed: full `npm test`, then
this closes RIG-137/#91 and clears PR #83's G1 gating item. Record:
[[reasoning/2026-08-28-rig137-option-a-scope]], [ticket](tickets/RIG-137.md).


## RIG-137 (G1 blocker) decided: Option A, scoped to AT-LF-22 (2026-08-28)

Grilled with the owner. Chose Option A over Option B — investigation found B
wasn't actually lighter (both options' only landing spots sit inside the
signed oracle manifest, so both need a key-holder re-sign). Root cause
(Node 24 async bind, even for a literal IP) verified empirically. Owner
explicitly scoped the fix to `AT-LF-22` only; `tests/helpers/advanced.js`'s
`withTempDir`/`withRepo` stays synchronous, generalizing it deferred to a
later ticket. Draft test rewrite is written and owner-approved (async
`AT-LF-22`, inline temp-dir management, awaited `server.close()`).

**Next:** get the key-holder re-sign on
`wiki/gate1/testing-infrastructure.manifest`'s `tests/advanced-oracle.test.js`
hash, then implement — delete the `net.Server.prototype.listen` patch from
`rig/lib/lint-format.js`, land the drafted test, run the full gate. This
closes PR #83's G1 gating item. Full record:
[[reasoning/2026-08-28-rig137-option-a-scope]], [ticket](tickets/RIG-137.md).

## RIG-143 complete; runGrade network contract now matches runReadOnly (2026-08-28)

- `runGrade` now verifies the host isolation mechanism once, applies it to
  every ungranted command, and reports `network_isolation_unavailable` as a
  non-passing command result when the host cannot provide isolation.
- Commands with `network: true` bypass the isolation prefix and still run,
  including when the sandbox executable is absent. The gate is per command,
  so a granted command is not blocked by an unavailable sandbox needed by a
  different command.
- `tests/guarantee-coverage.test.js` adds AT-PROC-1d for the grade path and
  marks AT-PROC-1c's memory fixture explicitly network-granted. The focused
  guarantee suite is green: 4 passed.
- No frozen oracle file was edited and no re-sign is required. The ticket,
  reasoning trace, decision index, topic hubs, and board are synchronized.
- Full `npm test` gate with isolated global Git config and installed ignored
  `rig-mcp` dependencies: 497 passed, 1 expected Linux-only skip, 1
  pre-existing failure in `tests/gate1-approval-script.test.js` caused by the
  local credentials-example edit. All RIG-143 tests pass.

## PR #83 preconditions now green; independent review in flight (2026-08-28)

Supersedes the "CI is RED on head 8450ee1" entry below — that head is stale.

- Re-signed oracle is committed and pushed: `b58493b` + `3e98993` (both
  "Update gate1 signature for release ceremony verification.", Cursor
  co-author) on top of `bf1871b` (Linux CI fix). `HEAD` == `3e98993` ==
  `origin/rig-120-release-ceremony` == PR #83 head, base `qa-prod-finishing-up`.
- `node scripts/check-advanced-spec.js`: **Oracle verified**, signature valid,
  `check-advanced-spec.js:133` enforces exactly 73 accepted IDs. The
  "68 acceptance cases" print is still the [[RIG-136]] cosmetic literal
  (`check-advanced-spec.js:166`), not a coverage regression.
- GitHub Actions `test` job is **green** on `3e98993` (push + pull_request
  runs, 2026-08-28T07:09Z). The earlier RED runs were `8450ee1`, fixed by
  `bf1871b`.
- Local `npm test` full gate **green** on this HEAD: root 497 pass / 1
  expected Linux-only skip, pi-extension 15/15, rig-mcp 6/6, plus
  rule-copies / versions / secrets / oracle checks.
- One open code concern carried into the review: the
  `net.Server.prototype.listen` monkey-patch at `rig/lib/lint-format.js:16-23`
  ([[RIG-137]] / #91) is still live and unfixed.
- Independent report-only review (four axes, fresh context) against PR #83's
  diff vs merge-base `298a8d1` is **complete. Verdict: does NOT merge to
  `qa-prod-finishing-up` as-is.** No `scripts/review-receipt.js` receipt
  written (the wrapper refuses a failing verdict, and none should be forced).
  Two gating items:
  - **G1 — [[RIG-137]] monkey-patch.** `net.Server.prototype.listen` global
    rewrite at `rig/lib/lint-format.js:16-23` ships in the same module as the
    AT-LF-22 guarantee it weakens; loopback-only `listen(0,'127.0.0.1')`
    silently becomes wildcard/`::`. RIG-137 is OPEN / owner-undecided. Needs
    Option B (patch → test setup) or a recorded owner waiver on [[RIG-120]].
  - **G2 — `runGrade` network isolation: RESOLVED by RIG-143.** `runGrade`
    now mirrors `runReadOnly`'s per-command `argvWithNetworkIsolation` and
    `network_isolation_unavailable` refusal contract. AT-PROC-1d covers the
    ungranted, unavailable-host, and explicitly granted paths. The frozen
    oracle was not edited and no re-sign is required.
  - Non-gating, triage before RIG-115 is marked Done: approval record burned
    on a drift-abort (`lint-format.js:453-483`); approval records never
    cleaned up by `uninstall()`; memory ceiling fails open where `ps` is
    absent and only samples the direct child; installed
    `rig/catalog/baseline/check.js` carries none of the AT-LF-20..24
    hardening. [[RIG-136]] cosmetic "68" print rides the next re-sign.
  - Open owner question: `gate1.sig` was rewritten twice 51s apart
    (`b58493b`, `3e98993`), same author, identical message — confirm which
    is authoritative and why the redo.

## PR #83 Linux CI blockers fixed in the worktree (2026-08-28)

The three Linux-only failures are addressed without changing the signed
oracle. Ungranted read-only tasks now use a rootless user + network namespace
only after probing that exact launch path; an unavailable namespace is still
reported as `network_isolation_unavailable` instead of being treated as clean.
GitHub Actions enables the Ubuntu runner's restricted user-namespace setting
and verifies the namespace before testing. The workflow also installs
`rig-mcp` before the root test suite, because the OpenClaw fixture deliberately
uses that checkout's bundled dependencies.

Focused verification passes on macOS for AT-LF-11, AT-LF-22, AT-LF-23, and
AT-HOME-1. The full local gate is green: 497 root tests passed with one
expected Linux-only skip, plus 15 pi-extension tests and 6 rig-mcp tests. A
GitHub Actions run is still required for final Linux evidence.

## PR #83 CI is RED on head `8450ee1` — not mergeable, RIG-120 cannot resolve (2026-08-28)

Checked in response to "I resolved the review findings, can I merge?". The
GitHub `test` job fails on the exact head commit (`8450ee1`), both the push
and the pull_request run. `prod` CI is green on the same `ubuntu-latest`
image (2026-08-27, `60c3a33`), so these are regressions this branch
introduces, not pre-existing infra noise. Local `npm test` on this macOS
workspace is fully green (497 pass / 1 skip) — the three failures are
Linux-only, which is the platform the release gate actually runs on.

Failing oracle cases (`tests/advanced-oracle.test.js`, Linux):

- **AT-LF-11** "a read-only check that mutates halts with preserved evidence"
  — pre-existing case, green on `prod`, now returns `clean` where it must
  return `mutated`. Regressed by the `runCommand` / `memory-guarded-exec.js`
  refactor that rerouted `runReadOnly`.
- **AT-LF-23** "a task exceeding its resource or time cap is killed and
  reported" — one of the five newly frozen shell-trust cases. Returns `clean`
  where it must return `timeout`. Root cause: `runReadOnly` calls
  `runCommand` with no `memoryLimitMb`, so it takes the plain `spawnTask`
  branch (`lint-format.js:555-562`), which only maps to `timeout` when
  `result.error?.code === 'ETIMEDOUT'`. `spawnGuardedSync`'s timeout kill does
  not surface `ETIMEDOUT` on Linux, so the status falls through to
  `completed` and `runReadOnly` reports `clean`. The memory-ceiling path
  (`AT-PROC-1c`) enforces its own timeout and passes — only the no-limit
  path is broken.
- **AT-HOME-1** — `npm ci failed for bundled rig-mcp runtime: cp: cannot stat
  '.../rig-mcp/node_modules'`. The root suite runs before the `rig-mcp`
  sub-project's `pretest` installs its deps; `.github/workflows/test.yml`
  never runs `npm ci` at the root or in `rig-mcp/`. Green on `prod`, so
  either ordering or timing shifted here too.

Still open in code, not just on the board:

- The global `net.Server.prototype.listen` monkey-patch is still live at
  `rig/lib/lint-format.js:16-23` (review blocker #3). It was filed as
  [[RIG-137]] (#91), not removed — any module that requires `lint-format.js`
  rebinds `listen(0, '127.0.0.1')` process-wide.
- Frozen Gate-1 artifacts (`wiki/gate1/acceptance.md`, `gate1.sig`,
  `testing-infrastructure.manifest`) still differ from merge-base `298a8d1`.
  The branch's position ([[guarantee-sharding]]) is that this was a
  legitimate owner re-grill + re-sign (`5650e49`); the signature's
  authenticity is an owner-ceremony question, not verifiable from the diff.

RIG-120's own ceremony inputs (§"Owner-controlled release inputs" below) —
fresh independent review receipt bound to the exact PR worktree, signer-class
attestation, explicit `v5.0.0` tag+publish after a green gate — are all still
outstanding.

## Merged origin/rig-120-release-ceremony (2026-08-28)

Took guarantee-sharding (#101: durable one-use, shared `taskCwd` on `runGrade`,
memory ceiling via `runCommand`) and AT-LF-24 (#90) on top of this branch's
AT-LF-22 / RIG-141/142 work. `runReadOnly` keeps the per-command network grant
check (RIG-141) and now routes execution through `runCommand` so the memory
ceiling holds on the read-only path too.

## RIG-141 and RIG-142 implemented (2026-08-27)

Four acceptance tests added to `tests/advanced-oracle.test.js`:

- `RIG-141 granted-network task runs when no sandbox tool is present` — asserts
  `result.status === 'clean'` for a `{ network: true }` command when PATH is
  emptied to prevent `unshare`/`sandbox-exec` from being found. RED against
  `rig-115-at-lf-22-network-denial`'s early-return bug; GREEN after the fix.
- `RIG-141 ungranted task still refuses when no sandbox tool is present` —
  asserts `result.status === 'network_isolation_unavailable'` for an ungranted
  command under the same PATH condition. Existing AT-LF-22 behaviour preserved
  for ungranted tasks; GREEN on this branch before and after the fix.
- `RIG-142 spawnTask shell is false even when caller passes shell: true` —
  verifies shell injection cannot execute even if a caller passes `shell: true`.
- `RIG-142 spawnTask env isolation holds even when caller passes env: process.env` —
  verifies a secret env var absent from `TASK_ENV_ALLOWLIST` is invisible to
  the child even if a caller passes `env: process.env`.

The implementation now checks the network grant per command, locks the shell
and environment safety options after caller options are spread, and exports
`spawnTask` for the direct safety checks. The focused oracle is green; the full
CI-equivalent suite ran with 493 passing tests and one pre-existing
`AT-LF-24` failure on this base branch.

The frozen oracle and its acceptance artifacts were preserved unchanged.

## RIG-141 and RIG-142 filed: two structural gaps in AT-LF-21/22 enforcement (2026-08-27)

Two correctness/shell-trust issues filed from a code-level read of `runReadOnly`
and `spawnTask` in `rig/lib/lint-format.js`. GitHub #96 and #97.

**[[RIG-141]]** (#96): `runReadOnly` hard-refuses **all** tasks when `unshare`/
`sandbox-exec` is absent — including tasks with `cmd.network === true`
(explicitly granted network access). AT-LF-22 only requires blocking ungranted
tasks; the early-return block fires before `argvWithNetworkIsolation` can apply
the correct bypass. Separately, the granted-network execution path has no test
at all. Fix: check the grant before deciding whether absence of sandbox tools
is fatal; add a test for the granted path.

**[[RIG-142]]** (#97): `spawnTask`'s `shell: false` and `env: isolatedTaskEnv()`
defaults are placed before `...options` in the options object, so any caller
can pass `shell: true` or a replacement env and silently win. No assertion,
type guard, or test prevents this. Fix: move the safety properties after the
spread (or validate and reject overrides), and add tests for each invariant.

## Merged origin/rig-120-release-ceremony into guarantee-sharding (2026-08-27)

Conflicts in `rig/lib/lint-format.js` and four wiki hubs are resolved: durable
one-use / shared `taskCwd` / memory-ceiling from this branch sit on top of
isolated task env, `spawnGuardedSync`, and AT-LF-22 network isolation from
the ceremony branch. AT-LF-20–24, AT-PROC-1a/b/c, spawn-guard ratchet, and
the lint-format suites are green. Next: finish the merge commit so PR #101
is no longer conflicting.

## RIG-136 filed for the oracle success-log stale count (2026-08-27)

The wiki-only pass that closed [[RIG-115]] flagged a leftover literal in
the oracle verifier: after confirming 73 acceptance IDs it still prints
"68 acceptance cases". Filed as [[RIG-136]] (GitHub #92). The success
line must interpolate the number of tests present — not a replacement
literal of 73, not a named constant. Same pattern as the file count
already next to it. Not a v5 blocker. The checker is byte-pinned, so the
fix rides the next re-sign. Absorbed if [[RIG-133]] rewrites the
verifier first.

## Wiki brought back in sync with code; AT-LF-24 landed, RIG-115 fully Done (2026-08-27)

HEAD (`dd65b97`, #90) implements `AT-LF-24` (`planExecution` refuses a read
whose target escapes the repository through a symlink), closing out the last
of RIG-115's five shell-trust guarantees — `AT-LF-20`–`AT-LF-24` are now all
implemented and green. The wiki had not been updated across the four PRs
(#87–#90) that landed them, so `status.md`, `wiki/tickets/RIG-115.md`,
`wiki/tickets/RIG-120.md`, `wiki/Tickets.md`, `wiki/Home.md`,
`wiki/index/decisions.md`, `wiki/index/acceptance-cases.md` (which was
missing `AT-LF-20`–`24` outright, not just under-counting),
`wiki/gate2/technical-spec.md` (stale case count, stale Gate-1 hash pins,
wrong decision-ID citation "D25" instead of `D28`), `wiki/specs/mvp-roadmap.md`,
`wiki/topics/delivery-plan.md`, `wiki/topics/testing-strategy.md`, and
`wiki/topics/trust-and-failure-boundaries.md` all still described `AT-LF-22`–
`24` as pending and the oracle as 68 cases. Verified directly: full `npm test`
is green (root 490/491 — 1 expected Linux-only skip — pi-extension 15/15,
rig-mcp 6/6), `check-advanced-spec.js` confirms the oracle signature and
enforces exactly 73 accepted IDs (its own final log line is a separate,
unfixed cosmetic bug printing a stale "68 acceptance cases" string —
now [[RIG-136]] / GitHub #92, not in scope for that wiki-only pass).
RIG-124.1 (the other thing RIG-120.md
listed as an open blocker) was already Done in an earlier entry below; that
ticket's stale references were corrected too. Full trace:
[[2026-08-27-wiki-code-sync-at-lf-24]].

**Net: RIG-115 is DONE. RIG-120's only remaining blockers are the three
owner-controlled ceremony inputs** — a fresh independent review receipt bound
to the exact PR worktree, the intent owner's signer-class attestation, and
the explicit `v5.0.0` tag + publish. No implementation work is outstanding.

## AT-LF-22 network denial lands in runReadOnly (2026-08-26)

`runReadOnly` prepends OS network isolation to each ungranted task argv:
`unshare --net` on Linux and Seatbelt `sandbox-exec` on macOS, after a
one-shot `--help` availability check. If neither tool is present it logs a
warning and returns `network_isolation_unavailable`. Named check: `AT-LF-22
a task has no network reachability without an explicit grant`. `AT-LF-20`,
`AT-LF-21`, and `AT-LF-23` already landed; `AT-LF-24` remains unimplemented.

## AT-LF-23 time-cap kill-and-report implemented (2026-08-26)

`runReadOnly` now honors a configured `timeoutMs`, terminates the task through
the shared spawn helper, and reports `timeout` as its own non-passing state.
`AT-LF-20` and `AT-LF-21` already landed; `AT-LF-22` and `AT-LF-24` remain red
until their separate implementations land.

## AT-LF-21 filesystem/env isolation landed (2026-08-26)

`runReadOnly` now refuses a working directory that is, or is reached only
through, a symlink resolving outside the repository (`boundary_violation`,
the command is not started), and spawns each task with an explicit
environment allowlist instead of the parent process's environment. Named
check: `AT-LF-21 task filesystem and environment stay isolated`. Remaining
red: `AT-LF-22`–`AT-LF-24` (`AT-LF-20` is implemented).
Verify: `node --test --test-name-pattern "AT-LF-21" tests/advanced-oracle.test.js`.

## AT-LF-20 single-use plan approval implemented (2026-08-26)

`executePlan` now consumes a matching plan approval on a successful
execution and refuses the same approval on a second presentation
(`not_authorized`). `AT-LF-20` is green. `AT-LF-21` is green on this merge.
`AT-LF-22` through `AT-LF-24` remain red until their runtimes land as
separate tickets. The RIG-120 ceremony (independent review receipt,
`v5.0.0` tag and publish) still waits until `npm test` is green.

## RIG-120 oracle re-signed; AT-LF-20–24 land as separate tickets (2026-08-26)

Owner re-signed `wiki/gate1/gate1.sig`. The bundled oracle — RIG-120 ceremony
items, [[RIG-115]] shell-trust, and [[RIG-112]] catalogue-contract — now
verifies. Remaining red-by-design case: `AT-LF-24` (`AT-LF-20`–`AT-LF-23`
implemented). That remaining implementation ships as a separate ticket; the
RIG-120 ceremony (independent review receipt, `v5.0.0` tag and publish) waits
until `npm test` is green.

## RIG-120 release ceremony: bundling confirmed, ready for owner signing (2026-08-26)

Owner confirmed: bundle [[RIG-112]] (catalogue-contract) into this signing
round alongside [[RIG-115]] (shell-trust guarantees) and RIG-120's own items.
All acceptance criteria and testing infrastructure are locked in. The three-part
oracle — release ceremony + shell-trust + catalogue-contract — is ready for
owner re-signature. Once signed, the ticket resolves and the independent review
runs.

## RIG-115 shell-trust guarantees drafted; signed oracle now stale pending re-sign (2026-08-26)

The owner approved five concrete guarantees closing [[RIG-115]]'s shell-trust
suite — single-use plan-bound approval, filesystem/env isolation including
through symlinks, default-deny network reachability, killed-and-reported
resource/time caps, refused symlink escapes (`GA-37`, `D28`). `AT-LF-20`
through `AT-LF-24` are authored in `wiki/gate1/acceptance.md`, traced in
`wiki/gate2/technical-spec.md` §9.4, and tested in
`tests/advanced-oracle.test.js`; the acceptance ID set is now **73**, up from
68. Trace: [[2026-08-26-rig115-shell-trust-guarantees]].

None of the five is implemented. `node scripts/check-advanced-spec.js` now
reports `oracle signature does not verify` — expected, not a regression: the
manifest and 73-case coverage check both pass cleanly (confirming the draft is
internally consistent), and only the final signature step fails because the
signed bytes changed underneath the existing signature. The five new tests
fail by design until `rig/lib/lint-format.js` is implemented against them.
**This branch's gate is deliberately red until the owner re-signs and the
implementation lands — do not treat this as a build break.**

RIG-115 is now ready to bundle into [[RIG-120]]'s single signing round,
alongside RIG-120's own naming/ceremony items. [[RIG-112]]'s catalogue-contract
freeze remains a separate owner yes/no (no new oracle content needed — the
mechanical work is already signed via `AT-SHAPE-6`) that has not yet been
explicitly confirmed for this same round.

## RIG-135 complete (2026-08-26)

Implemented `rig/lib/spawn-guarded.js` with detached process-group cleanup,
exactly-once callbacks, timeout/cancel escalation, and Linux parent-death
protection. All 19 mandatory debt sites now route through it; the focused
recursive-cleanup and ratchet suites pass on this host. The three Bun-native
sites remain deferred to RIG-135.1/.2/.3 because their owner-specific process
and Windows Job Object designs are not frozen.
The full `npm test` gate is green: 485 passing, 1 expected Linux-only skip,
including the pi-extension and rig-mcp suites.

## RIG-135 scope expanded: all 19 debt sites now mandatory (2026-08-26)

Per owner instruction, `wiki/tickets/RIG-135.md`'s mandatory migration
scope grew from 2 sites (site 1 `rig-memory-ingest.ts`, site 5
`rig-brain-sync.ts`'s bun ingest) to all 19 sites `rig/spawn-guard-
allowlist.json` classifies `debt` — including the 7 sites found during
the grilling-pass extension (15–21) and the 4 found during the
pending-triage pass (`rig/lib/checks.js`, `rig/lib/lint-format.js`,
`rig/catalog/baseline/check.js`, `browse/src/project-slug.ts`). The 3
`separate-follow-up` sites stay excluded, deferred to RIG-135.1/.2/.3
(#78/#79/#80) as before; the 18 `allowlisted` sites are unaffected. No new
investigation — every debt site was already individually traced and
classified. Reasoning: [[reasoning/2026-08-26-rig135-scope-expansion]].
GitHub issue #75 was previously synced to match; the implementation now
closes the ticket's mandatory scope.

## RIG-135 pending-triage sites resolved: 0 remain (2026-08-26)

Investigation-only pass (no implementation) on the 21 `pending-triage` sites
`wiki/tickets/RIG-135.md` flagged as needing owner triage. Every site's
caller chain was traced by reading the actual spawn/kill call, not inferred
from a `kill()`/`timeout`/`spawn` match alone. Result: **19 debt, 18
allowlisted, 3 separate-follow-up, 0 pending-triage** (was 15 debt / 4
allowlisted / 21 pending-triage before this pass; totals 40 sites tracked,
unchanged).

- **4 sites newly added to RIG-135's own scope as debt**: two generic
  command runners (`rig/lib/checks.js`, `rig/lib/lint-format.js`) whose
  caller chain ultimately executes `npm`/`pnpm`/`yarn`/`bun`/`make`/`just` or
  a fully custom repo-declared command with a bare timeout and no
  group-kill; `rig/catalog/baseline/check.js`, the materialized copy of that
  same runner that ships into installed target repos; and
  `rig/catalog/skills/browse/src/project-slug.ts`, which wraps a bash script
  (`rig-slug`) that itself forks `git`/`mktemp`/`mkdir` children under a bare
  timeout — the same pattern already known-debt elsewhere in the ticket.
- **14 sites verified individually safe and allowlisted**: mostly fixed,
  non-forking one-shot commands (`git rev-parse`, `node --version`,
  `tasklist`, `osascript` over an enumerated app list) or thin client
  wrappers whose real subprocess lifecycle is owned elsewhere and already
  tracked. Two prior allowlist rationale strings were factually wrong and
  corrected in the same pass — one said a call killed "a Chromium-launched
  process" when it actually runs a `bun` script; another called an env var
  "externally configured" when it is hardcoded to a sibling script one line
  before use.
- **3 sites need a browse-skill-owned follow-up, not migration inside this
  ticket** (`browser-skill-commands.ts`, `xvfb.ts`, `cookie-import-browser.ts`):
  all three spawn through Bun's own `Bun.spawn`/`Bun.spawnSync` API rather
  than Node's `child_process`, and Bun's own documentation plus a linked
  upstream bug ([oven-sh/bun#15791](https://github.com/oven-sh/bun/issues/15791))
  confirm Bun's subprocess handle cannot be group-killed by negative pid the
  way the ticket's helper design assumes — so the fix shape isn't decided
  yet. `cookie-import-browser.ts` is flagged highest priority of all 21: it
  launches a real headless Chromium instance against the user's actual
  installed Chrome/Edge profile (Windows-only) and can orphan a lock on that
  real profile, with no Windows CI in this repo to verify a fix. Recorded as
  a new trap ([[index/traps|Bun's spawn API cannot be group-killed the way
  Node's can]]) so a future implementer checks this before assuming the
  existing helper design just works for these files.
- One unrelated implementation defect found and flagged, not fixed:
  `xvfb.ts` has a comment claiming "spawn detached" that its code doesn't
  match (no `detached: true` is actually passed to `Bun.spawn`).
- Updated: `rig/spawn-guard-allowlist.json` (final classifications),
  `wiki/tickets/RIG-135.md` (full 21-site triage table + Bun-native
  follow-up section + updated scope), `wiki/index/traps.md` (new entry).
  `scripts/check-spawn-guard.js` and both its tests pass; full `npm test`
  gate re-run pending as the next step.
- Ticket remains **OPEN** — this pass changed classification and
  documentation only, no call sites were migrated to the (still
  unimplemented) shared helper.

## RIG-135.1/135.2/135.3 raised for the three separate-follow-up sites (2026-08-26)

Per owner request, wrote up the three `separate-follow-up` sites from the
pending-triage pass above as their own tracked follow-ups, following this
project's existing `RIG-N.M` sub-ticket convention (same pattern as
RIG-124.1, RIG-127.11/.12): a `## Follow-up — RIG-135.N` section in
`wiki/tickets/RIG-135.md` plus a `wiki/Tickets.md` Backlog card for each,
Solution-linked back to the same file. GitHub issues filed as #78/#79/#80.

- **RIG-135.1** (highest priority): `cookie-import-browser.ts`'s Windows-only
  cookie-import path launches headless Chromium against the user's real
  installed Chrome/Edge profile and kills it leader-pid-only — an orphan
  locks the user's actual browser. Needs a Windows Job Object design; no
  Windows CI exists in this repo to verify one.
- **RIG-135.2**: `browser-skill-commands.ts` spawns caller-authored skill
  scripts via `Bun.spawn` with a bare `proc.kill()` on timeout — same risk
  as the ticket's already-debt sites, but Bun's own API can't be
  group-killed the way the helper design assumes.
- **RIG-135.3** (lowest priority): `xvfb.ts`'s Xvfb daemon spawn has a
  comment claiming "spawn detached" that its code doesn't match (no
  `detached: true` passed), plus the same Bun group-kill gap as .2.

`node scripts/check-ticket-traceability.js` passes (Backlog cards aren't
subject to the completed-card evidence check). Acceptance criteria on all
three are marked draft/not yet reviewed — these are freshly raised, not
grilled or signed.

## RIG-135 grilling pass: oracle written, not yet frozen (2026-08-26)

Ran the rig-grilling process against [[RIG-135]] on the owner's request
(context-sufficiency check → acceptance criteria → deterministic tests, no
implementation). Findings and deliverables:

- Spot-checked 3 of the ticket's original 14 surveyed sites directly against
  file bytes — all matched exactly, so the recursive-cleanup contract itself
  is trustworthy to build tests against.
- The build-time-guard side of the record was **not** fully sufficient: a
  mechanical scan for the same violation shapes (direct-pid kill on a
  fork-prone child; `spawnSync`/`execFileSync` + `timeout` with no group-kill
  pairing) found 6 more debt sites the original extension-scoped grep missed
  — all in `rig/catalog/plumbing/lib/*` or extensionless `plumbing/bin/*`
  shebang scripts, all confirmed by reading the actual call (`brain-exec.ts`,
  `brain-guards.ts`, `brain-sources.ts`, `rig-memory-helpers.ts`,
  `brain-local-status.ts`, `rig-brain-detect`), plus one more Category-A site
  (`rig-detach`, a generic Python watchdog wrapper — higher blast radius than
  a single call site since it wraps arbitrary caller-supplied commands).
- 21 further candidate sites surfaced in the `browse` skill and `ios-qa`
  daemon subsystems — neither was in the original survey at all. Seeded as
  `pending-triage` in the new allowlist rather than guessed at; flagged as
  the skill owner's call, not blocking this ticket.
- Delivered: `tests/spawn-guarded.test.js` (functional recursive-cleanup +
  cleanup-callback + parent-death-signal oracle, currently **red** — module
  doesn't exist yet, expected pre-implementation), `scripts/check-spawn-guard.js`
  + `rig/spawn-guard-allowlist.json` + `tests/spawn-guard-allowlist.test.js`
  (build-time-guard ratchet, mirrors the `raw-registry-access` pattern,
  currently **green** against today's tree, 6/6 passing).
- `wiki/tickets/RIG-135.md` updated: survey extended with sites 15–21,
  acceptance criteria rewritten as concrete test-file references, API shape
  for `rig/lib/spawn-guarded.js` declared as an inferred default (not yet
  signed off).
- **Not done, and explicitly not this pass's job:** no implementation code
  (`rig/lib/spawn-guarded.js` does not exist), no migration of the 15 debt
  call sites, `wiki/index/invariants.md`/`traps.md`/`rejected.md` entries
  the ticket's acceptance criteria call for (owed at ticket close). The gate
  has not been asked to freeze; `rig-product-design`'s technical
  specification is still owed before that can happen.
- **Known effect on `npm test`:** `tests/spawn-guarded.test.js` will fail
  (3 red, 1 skipped on non-Linux) until the helper is implemented — this is
  the intended TDD red state for this ticket's oracle, not a regression to
  fix blindly.

## RIG-125/130/132/133 re-evaluated from committed evidence only, since the citations can't be recovered yet (2026-08-26)

Follow-up to the re-investigation below, per owner request. Full trace:
[[2026-08-26-rig125-130-132-133-committed-evidence-reevaluation]].

Two more dead citations found (RIG-132 cited two source files by plain markdown
link, not `[[...]]`, missed by the first grep — neither exists). Everything else
is positive: **RIG-125's and RIG-133's central claims no longer depend on the
missing analysis at all** — both are independently corroborated by other
committed material (a surviving distillation doc, and RIG-134, which is closed
and carries the same evidence with line numbers). **RIG-130's evidence table is
6/7 verified** against real receipt files; the 7th (worst-looking) round has no
committed source and shouldn't be cited as fact yet — the conclusion holds on
the six verified rounds alone. **RIG-132's shipped pre-v5 slice is unaffected**;
its unshipped v5.1 case is weaker than it read — two more sources confirmed
dead, plus an internal arithmetic error (a headline anchor count that doesn't
match its own breakdown) unrelated to any citation.

Net: RIG-125, RIG-130, RIG-133 now rest on committed, re-checkable evidence
rather than the ticket's own word. RIG-132's shipped work does too; its
architectural framing for v5.1 should wait on recovered sources before its
specific figures are treated as verified.

## RIG-125/130/132/133 re-investigated; two are further along than their board status said (2026-08-26)

Full trace: [[2026-08-26-rig125-130-132-133-reinvestigation]].

**Defect found:** all four tickets cite eight 2026-08-25 reasoning documents
([[2026-08-25-branch-code-review-snapshot]], round-3 receipt/map, structural
root-cause, semantic-model-assessment, escaping-the-quadratic, prev5
classification-and-migration-pattern, why-each-pass-finds-new-issues) that do
not exist in this repository's committed history on any branch. They existed
only as uncommitted files in a prior session's checkpoints and were lost before
being committed; the four ticket bodies landed via `da4a41e` already citing
them. Each ticket's `[[...]]` links to these names are dangling. The ticket
bodies remain self-contained (inline tables/grep/code quoted directly), but the
analysis behind them is currently unreachable. **Needs an owner decision:**
recover the original sessions and file the traces verbatim, or strike the
citations and treat the inline evidence as the whole record.

**RIG-125** — its three named loop-breaker tests (`tests/host-contract-parity.test.js`,
`tests/install-uninstall-roundtrip.test.js`, `tests/runtime-onboarding.test.js`)
and its uninstall-authority collapse (`uninstall.js` now delegates to
`lifecycle.js` as sole authority) are already implemented and green — they
landed as part of closing [[RIG-126]]/[[RIG-127]]/[[RIG-128]], which cite the
same tests as their own Done evidence. Still open: promoting these into the
signed oracle, blocked on RIG-133.

**RIG-132** — its "pre-v5 ratchet only" packet (`rig/raw-registry-access.json`,
`scripts/check-raw-registry-access.js`, `tests/raw-registry-allowlist.test.js`,
5/5 passing, prints `raw registry debt: 1`) is already implemented, landed
alongside [[RIG-134]]'s gate work. The ticket's v5.1 migration body (the
`HostContract` semantic layer, generated rule/skill copies) has not started —
correctly, per the ticket's own "does not land in v5.0.0" scoping.

**RIG-130** and **RIG-133** — confirmed no progress on either. No finding-class
ledger exists for RIG-130; `tests/advanced-oracle.test.js` is still 65
enumerated cases for RIG-133. Both remain fully open, still blocking what they
were filed to block (RIG-133 blocks RIG-125's last step; RIG-130 blocks making
review convergence measurable).

Board (`Tickets.md`) and all four ticket files updated to match.
## Wiki reconcile notes retained from RIG-120 branch (2026-08-26)

Still accurate after merging `qa-prod-finishing-up`:

- `gate2/technical-spec.md` is **v0.17** (status/acceptance index had read v0.16).
- [[Home]] topic hubs: 28 (was undercounted as 27).
- `enforcement-and-git-dispatch-wiring.md` is linked from safety/consent/control on [[Home]].

Superseded by this merge: RIG-135 is landed (see "RIG-135 complete"); root suite
count is the post-RIG-135 figure (485), not 476; the missing 2026-08-25 citation
issue is covered by the RIG-125/130/132/133 re-investigation entries.


## RIG-124.1 fixed, narrow scope (2026-08-26)

GitHub [#73](https://github.com/qaynel/Rig/issues/73) closed to match. Both parts of [[RIG-124]] **124.1** are fixed in `scripts/review-receipt.js`,
scope kept deliberately narrow to this one file per owner decision — the
general "every spawned process gets guaranteed cleanup" version is tracked
separately as [[RIG-135]] and is not part of this change. (1) The re-review
cap now writes the failure record before spawning the reviewer and only
clears it on a confirmed pass, so a killed/timed-out attempt can no longer be
silently dropped from the count. (2) The reviewer now spawns in its own
process group and the whole group is signalled right after the spawn call
returns, so a descendant process it forked can no longer be orphaned when the
spawn is killed. Both regressions have a named test in
`tests/release-blockers.test.js`, confirmed red against the pre-fix code and
green with the fix; a test-only `RIG_REVIEW_RECEIPT_TIMEOUT_MS` env override
lets those tests force the timeout path without a real 30-minute wait. Full
gate re-run on the fixed bytes: green end to end (root 476/476, pi-extension
15/15, rig-mcp 6/6) — the only failure on the first pass
(`AT-HOME-1`/`advanced-oracle.test.js`) was `rig-mcp/node_modules` not being
installed in this workspace, unrelated to this change; fixed with `npm ci`
in `rig-mcp/` and confirmed green after.

## Why the RIG-124 red run took ~30 minutes — real defect found (2026-08-26)

Follow-up question after filing RIG-124.1: was the ~30-minute duration itself
a code defect, or incidental? First pass ruled out several causes (no other
test reaches a real reviewer, no pipe deadlock, no measurable slowdown from
heavy synthetic load, no machine sleep event) and concluded no reproducible
cause — but the user correctly pushed back that a 30-minute stall deserves an
actual "is something stuck" check rather than resting on "network calls are
sometimes slow." Checking directly found a real one: a leftover process from
the earlier deterministic-repro work (which deliberately made a reviewer
stand-in hang forever, to prove the cap bug) is still alive on this machine
right now, orphaned, working directory long gone. Root cause, confirmed with
a controlled test: killing the reviewer spawn only terminates the one tracked
process — any child process it had already forked is not touched by that
kill and is orphaned, running forever. The real reviewer is a full agent
that plausibly forks children of its own; the same gap means a review the
tool believes it cancelled may keep running unsupervised in the background.
Added as a second fix, alongside the already-filed cap bug, to [[RIG-124]]
**124.1** — both are about the same kill path being incomplete. Still blocks
[[RIG-120]]. Trace: [[2026-08-26-rig124-timeout-duration-investigation]].

## RIG-127.11 / 127.12 and RIG-124.1 filed as follow-ups (2026-08-26)

Post-merge and post-gate-rerun hand review found three defects the existing
test suites do not catch, filed as GitHub issues (not buried only in the closed
parents):

**Uninstall path findings:**
- [[RIG-127]] **127.11** → [GitHub #69](https://github.com/qaynel/Rig/issues/69) — hard-crash on corrupted legacy global config. `removeGlobalConfig()` does raw `JSON.parse` with no try/catch.
- [[RIG-127]] **127.12** → [GitHub #70](https://github.com/qaynel/Rig/issues/70) — legacy nameless managed-block over-strip. A nameless record falls back to wildcard regex.

**Release gate finding:**
A fresh RIG-120 review-ceremony attempt started with `npm test`, which came back
RED: `tests/release-blockers.test.js`'s `review-receipt cap is scoped per
author-context and clears on a passing verdict (RIG-124)` failed (`capped.invocationCount` read `1`, expected `0`), after a run duration (~1,800,952ms)
within ~1s of `scripts/review-receipt.js`'s `TIMEOUT_MS` (1,800,000ms).

Investigated fresh (checkout confirmed current). The failure does not reproduce
in isolation (34/34 green, 16s) — it is a genuine timing-dependent lost-update.
Root cause: `scripts/review-receipt.js` only persists a failed attempt to
`<out>.attempts.json` *after* the reviewer subprocess spawn returns cleanly; a
spawn killed by its own 30-minute timeout exits the process first, so that
failure is silently dropped and the next same-`author-context` attempt gets an
extra, uncounted retry past the cap. Confirmed with a deterministic repro.
Full trace: [[2026-08-26-rig124-cap-lost-update]].

- [[RIG-124]] **124.1** → [GitHub #73](https://github.com/qaynel/Rig/issues/73) — killed/timed-out reviewer attempt is dropped from the re-review cap.
- [[RIG-135]] → [GitHub #75](https://github.com/qaynel/Rig/issues/75) — general fix: create a shared process-cleanup helper to ensure all spawned subprocesses and their children are properly killed when cancelled or timed out.

Same pattern as RIG-127.11/127.12 — defects found after the parent ticket's own
suite went green. New invariant [[index/invariants|I-16]]. This sits directly on
the RIG-120 path (exactly the "reviewer subprocess times out" case); it defeats
RIG-124's one-retry cap when it does. **RIG-120's fresh review-receipt run should
not proceed until RIG-124.1 is fixed or the owner explicitly accepts the residual
risk**. Trace: [[2026-08-26-review-round-code-level-findings]], [[2026-08-26-rig124-cap-lost-update]].

## Wiki and GitHub issue sync (2026-08-26)

Board and GitHub issues reconciled after the six merged ticket PRs landed.
**Done (23 tickets):** RIG-101 through RIG-124 (except blocked structural
tickets), plus RIG-126/127/128/129/131/134. GitHub #45–#61 closed to match.
**Open follow-ups:** RIG-127.11 (#69), RIG-127.12 (#70), RIG-135 (#75), and
RIG-135's three spawn-site sub-tickets RIG-135.1 (#78), RIG-135.2 (#79),
RIG-135.3 (#80). RIG-124.1 (#73) is Done. Defects found in the post-merge hand-verification and
gate-rerun passes ([[2026-08-26-review-round-code-level-findings]],
[[2026-08-26-rig124-cap-lost-update]]). **Still blocked:** RIG-120
(release ceremony), RIG-110–116, RIG-122.
**Structural backlog:** RIG-125, RIG-130, RIG-132, RIG-133.

## Invariants index seeded (2026-08-26)

Added [[index/invariants]] as a first-class wiki index alongside `traps.md` and
`rejected.md`. Seeded with 15 invariants ranked by blast radius, converted
from the traps index, the six merged tickets, the 127.11/127.12 findings, the
MCP unification work, and the safety baseline. Motivation: the pattern of
"every review pass surfaces new issues" traces to invariant surface > assertion
surface — `traps.md` records reactively, `invariants.md` records proactively,
and every ticket close from here writes one line here (matching an existing
`I-N` or adding a new one). Wired into [[Home]] under the indexes list.
Post-v5 depth-per-host-cluster cadence should treat this index as the checklist
the adversarial-read gate runs against.

## Test suite is fully green (2026-08-26)

`npm test` across all three components is **fully green**: root suite 476/476,
pi-extension suite 15/15, `rig-mcp` suite 6/6. [[RIG-126]], [[RIG-127]],
[[RIG-128]], [[RIG-129]], [[RIG-131]], [[RIG-134]] are Done (GitHub #35–#40,
closed and linked to their merged PRs).

## RIG-126 onboarding (solved 2026-08-25)

The printed post-install chain is runnable for 126.1–126.4: host-review and
explicit select produce the review and `rig.json` later steps consume, staged
apply renders the Antigravity manual MCP entry it verifies, and a clean check
prints a success confirmation. 126.5 (source-checkout wrapper) remains deferred.
Named onboarding suite is green (`runtime-onboarding` + bootstrap +
antigravity-manual-mcp). The owner-signed oracle is unchanged.

The signed oracle remains unchanged and green at 68 acceptance cases. The
working technical design is v0.17 and is present rather than frozen. D24 keeps
the beta boundary at all 115 Policy leaves plus the 55-skill vendored shelf,
detected-host onboarding, the mandatory safety baseline, six CI providers, and
named-tag `5.0.0` distribution.

The pre-v5 release gate ([[RIG-134]]) is Done: every known finding
in RIG-126/127/128/129 is tagged `debt` or `v5-observable`, the observable set
is fixed as leaf changes, and the debt set is the printed raw-registry
inventory (`rig/raw-registry-access.json`, count 1). [[RIG-131]] makes Done
mechanical. Remaining release work is [[RIG-120]]'s ceremony (fresh receipt,
owner re-sign, tag).

The protected oracle, secret scan, rule-copy check, version check, ticket
traceability, and raw-registry ratchet pass on the current bytes. `npm test`
is green end to end: the root suite is **476/476** and the pi-extension suite
is **15/15** (rig-mcp **6/6**).

The leftover production holes from the last pass are closed: apply writes a CI
file only when that path is in the signed plan and still compare-and-swaps it;
uninstall on a linked worktree no longer crashes, and install still places the
secret-guard hook in the shared hooks directory. The copy check fails closed
on a sync-map entry that is a symlink out of the repository.

## Production review findings

The nine findings supplied on 2026-08-23 are implemented and have focused
regression coverage.

| Finding | Current state |
|---|---|
| Repository symlinks escape write/delete boundaries | One shared realpath-aware containment guard protects lifecycle, payload, coverage, remediation, apply, and CI paths. Ancestor symlinks resolving outside the target fail before mutation. |
| Installer omits catalogue and safety runtime | The tagged-release payload installs the catalogue metadata, all service/baseline fragments, `materialize.js`, and all runtime modules under `.rig/runtime/`; local Tier 1 remains static-only. |
| Bare repository receives no vendored skills | Hostless install now receives all 55 neutral skills under `.rig/skills/` while still creating no absent host-specific tree. |
| Service packs repeat prohibited generic boilerplate | All Policy packs name exact scopes, applicability, dispositions, leaf-specific checks, distinct acceptance targets, explicit given/pass/fail evidence, and slice behavior. Generic selected services without repository bindings fail as coverage gaps instead of `process.exit(0)`. |
| Five CI providers have no adapter | GitHub Actions, GitLab CI, CircleCI, Jenkins, Buildkite, and Azure Pipelines each render and apply a provider-visible, detail-free repository check with approval, preservation, idempotence, journaling, and first-wire coverage. |
| Shipping journal and uninstall are incompatible; crash window is ambiguous | JSONL is authoritative for install, resume, and reverse removal. Pending records reconcile landed, unlanded, or conflicting state. The shipping CLI restores chained hooks, removes install-ID-attributed global entries, writes removal evidence, lists purge targets before deletion, and preserves user policy. |
| Review producer and validator schemas differ | Both use one strict `report-only` schema bound to technical-spec, catalogue-fragment, and exact PR implementation digests plus the PR base, exact passing case coverage, no release-blocking findings, and no unresolved IDs. |
| Distribution test never runs the installer/archive | The regression builds a tagged archive, transports it through fake `curl`, executes the real installer under `dash`, and checks tag, skills, catalogue, and runtime in the installed target. |
| Installer requires Bash | The root stub is POSIX `sh` with no Bash shebang, `pipefail`, substring expansion, or `[[ ... ]]`. |

[Intent-owner findings](reasoning/2026-08-23-production-release-blockers.md)

## Release boundary

The owner selected plan-time disclosure for model-assisted secret triage. The
policy proposal, exact disclosure-bound approval, CLI flow, persistent status,
and regressions are implemented with actual SSHSIG verification. One-use
approval replay, recovery signing/ordering, real lint argv execution, vetted
history scanning, structured semantic drift, axis-specific host contracts, and
uninstall integration are also covered. The full gate is green (see above); the
release is blocked on the signer-class attestation and a fresh independent
receipt bound to the resulting exact PR worktree.

After those are resolved, rerun the full gate on the final bytes and explicitly
cut/publish `v5.0.0`; tag publication is never an implicit side effect of code
changes.

A default local `sh rig/bootstrap.sh` (no `--with-runtime`) is now
markdown-only end to end: per-skill code and `.rig/plumbing` are gated behind
`active_delivery` alongside the runtime engine, and `.tmpl`/`TODOS-format.md`
never land. All 55 `SKILL.md` files still land unconditionally, so the frozen
oracle's 55-skill reading is unaffected and no re-sign was required
([AD-37](index/decisions.md), [lean-install protocol](reasoning/2026-08-23-lean-install-protocol.md)).

## Current mechanics

- `npm test` verifies the protected oracle first, then secrets, rule copies,
  versions, the root Node suite, and pi-extension tests.
- `install.sh` downloads a named tag to disk and executes only the extracted
  local bootstrap with its explicit active-delivery runtime gate.
- `.rig/install-manifest.jsonl` is the single lifecycle authority.
- Policy activation and recovery verify external SSHSIG receipts under separate
  namespaces; caller-set verification booleans are not accepted by shipping
  commands.
- The release-review wrapper starts a fresh reviewer process, binds the exact PR
  implementation worktree and base, and refuses incomplete or failing evidence.
- Historical review receipts remain void for current bytes.

## Owner-controlled release inputs

- Produce the authorized fresh independent review against the exact PR
  worktree.
- Add the intent owner's signer-class attestation comment to the frozen Gate 1
  signer file through an owner-authorized re-signing ceremony.
- Confirm the final `v5.0.0` tag and publication operation after the full gate
  is green.

## RIG-115 shell-trust guarantee (branch-local, not yet part of the v5.0.0 gate above)

`rig/lib/lint-format.js`'s durable one-use plan approval, `runGrade`/
`runReadOnly` symlink-and-cwd containment, and memory-ceiling enforcement
(AT-LF-20/21/23/24) are implemented and green on this branch, closing
RIG-138/139/140. This does not touch the 73-case oracle above and needed no
re-sign — the acceptance text for these cases was already correctly scoped
where it exists; the gap was in tests and implementation written against it
on sibling branches. [Guarantee sharding](mistakes/guarantee-sharding.md) and
[reasoning trace](reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md).

**Owner sign-off on the RIG-144 capability-policy plan, with corrections
(2026-08-29, latest):** owner reviewed the grilling draft and approved it
with three corrections plus one addition, recorded as `GA-38`: (1) undeclared
network capability is a temporary, visibly-diagnosed compatibility state, not
silent equivalence to an explicit grant; (2) **the two runner copies must be
unified into one canonical implementation, not just drift-tested** — rejected
my drafted default explicitly ("a drift test changes silent divergence into
divergence noticed by CI... the defect class still exists"); (3) CI-path
capability authority is committed-policy-or-refuse only, no ephemeral/implicit
approval, structured as a shared evaluator an interactive grant path can reuse
later; (4) resource ceilings are configurable per-binding defaults
(10min/2GiB), not hard limits.

Item 2 was flagged as the highest-priority correction and done immediately,
ahead of the rest: extracted the shared `runArgv`/`runBinding` logic
(previously hand-duplicated between `rig/lib/checks.js` and
`rig/catalog/baseline/check.js`) into one module, `rig/lib/check-runner.js`.
Both files now `require()` it; `apply.js` materializes it into `.rig/lib/`
alongside `path-safety.js`/`spawn-guarded.js`. New test `AT-CAP-6`
(`tests/guarantee-coverage.test.js`) asserts object identity between the two
callers' `runBinding`, not just matching behavior. `tests/guarantee-coverage.
test.js` is 18/18 green (including the rewritten `AT-PROC-1p`, updated to the
canonical `result.reason` shape). Full `npm run test:code` kicked off to
confirm no wider regression from the refactor — running in background,
checking back for the result.

Not yet done: `AT-CAP-1`/`2` (configurable resource ceilings), `AT-CAP-3`
(three-state network + diagnostic), `AT-CAP-4` (`.rig/execution-policy.json`
+ capability evaluator), `AT-CAP-5` (fail-closed applied to the new
mechanisms) — these still need their own red-before/green-after pass. Full
trace: [[reasoning/2026-08-29-rig144-capability-policy-sign-off]]. Tickets:
[[tickets/RIG-144]]. Decision: [[index/decisions|GA-38]]. Trap update:
[[index/traps|the oracle is green at a seam the product does not use]] (the
"add a drift test" instinct itself is now recorded as the wrong default).

Full `npm run test:code` gate confirmed green after the runner-unification
refactor: 529/530 (one Linux-only PDEATHSIG case skipped on this host, same
as every prior run), plus the pi-extension and rig-mcp suites both green.
No regression from moving `runArgv`/`runBinding` into `rig/lib/check-runner.js`.

**Handoff brief written for the remaining RIG-120 code blocker
(2026-08-29):** [[reasoning/2026-08-29-rig120-close-out-handoff]] compresses
what's closed, the five remaining `AT-CAP` criteria and exactly which
existing mechanism each should reuse, the vertical (per-criterion, proven
against materialized bytes) and horizontal (no new duplication, materialized
everywhere, both callers surface it) completion rules, explicit non-goals
(ceremony actions stay owner-only), and a testable definition of done. Not
yet dispatched to an agent or started.
