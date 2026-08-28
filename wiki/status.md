# Status - checked 2026-08-28 (updated 2026-08-28)

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
RIG-138/139/140. This does not touch the 68-case oracle above and needed no
re-sign — the acceptance text for these cases was already correctly scoped
where it exists; the gap was in tests and implementation written against it
on sibling branches. [Guarantee sharding](mistakes/guarantee-sharding.md) and
[reasoning trace](reasoning/2026-08-27-rig138-139-140-shell-trust-fix.md).
