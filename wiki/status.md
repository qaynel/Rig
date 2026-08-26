# Status - checked 2026-08-26 (updated 2026-08-26)

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
**Open follow-ups:** RIG-127.11 (#69), RIG-127.12 (#70), and RIG-135 (#75).
RIG-124.1 (#73) is Done. Defects found in the post-merge hand-verification and
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

`npm test` across all three components is **fully green**: root suite 474/474,
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
working technical design is v0.16 and is present rather than frozen. D24 keeps
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
is green end to end: the root suite is **474/474** and the pi-extension suite
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
