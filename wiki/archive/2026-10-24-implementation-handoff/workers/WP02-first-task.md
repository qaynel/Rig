# WP02 — First complete task

Status: implemented; all 14 proving tests pass in the lane.

## User-visible objective

A user goes from idea to a verified local change and can resume cold: a transition runs only when its inputs exist, red/green evidence binds to the exact candidate bytes, and a killed run is recoverable from repository state alone.

## Exact signed requirement, criterion and proving-test IDs

14 requirements: R023, R024, R032, R033, R034, R035, R036, R037, R038, R039, R040, R041, R042, R043. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R023 | AC-023: each package has outcome, ownership, dependency and exit evidence. | PT-023 | F10 | `work-packages.test.js` | work-packages.js [WP01] | pass |
| R024 | AC-024: missing inputs stop the transition with a precise gap. | PT-024 | F11 | `preflight.test.js` | preflight.js [WP02] | pass |
| R032 | AC-032: red/green evidence is attached to the package. | PT-032 | F15 | `vertical-journey.test.js` | run-journal.js [WP02] | pass |
| R033 | AC-033: a changed candidate reruns required checks. | PT-033 | F15 | `vertical-journey.test.js` | run-journal.js [WP02] | pass |
| R034 | AC-034: repeat review includes carried findings and cannot certify itself. | PT-034 | F16 | `review.test.js` | review-loop.js [WP07] | pass |
| R035 | AC-035: outage, malformed output and timeout leave authorization unconsumed. | PT-035 | F16 | `review.test.js` | review-loop.js [WP07] | pass |
| R036 | AC-036: location drift does not erase the same unresolved class. | PT-036 | F16 | `review.test.js` | review-loop.js [WP07] | pass |
| R037 | AC-037: a caller regression fails until the common seam is corrected. | PT-037 | F17 | `vertical-journey.test.js` | run-journal.js [WP02] | pass |
| R038 | AC-038: stale docs block closeout. | PT-038 | F18 | `knowledge.test.js` | knowledge.js [WP08] | pass |
| R039 | AC-039: the owner text is intact and indexed by topic. | PT-039 | F18 | `knowledge.test.js` | knowledge.js [WP08] | pass |
| R040 | AC-040: cold reader recovers these four facts from repo state alone. | PT-040 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R041 | AC-041: restart preserves idempotency and exact evidence pointer. | PT-041 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R042 | AC-042: no pass is fabricated from missing records. | PT-042 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R043 | AC-043: one code-byte change invalidates the receipt. | PT-043 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |

## Dependencies and prerequisites

WP01 (signed contract). Shares R023 (PT-023, WP01 module) and several PT with WP07/WP08 modules: PT-034..036 and PT-043 are satisfied by `review-loop.js` / `release-evidence.js` (WP07), PT-038..039 by `knowledge.js` (WP08). WP02 owns the other IDs below.

## Exclusive file ownership

- `rig/catalog/baseline/run-journal.js`
- `rig/catalog/baseline/preflight.js`

Run state lives under `<repo>/.rig/`: `run.json`, `journal.json`, `evidence/*.json`, `complete`, `tdd/<pkg>.json`. Writes are temp-file-then-rename.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Rich memory, model dispatch, release gating (other packages).
- Known shortcut carried: `once()` is at-least-once if the process dies between the effect and the journal write; an intent record written before the effect is the upgrade. R041 is proven for completed effects only.
- `rootCause()` handles three symptom classes and CommonJS seams only.

## Existing Rig code and pinned sources reused

- Existing: `rig-tdd` skill, `scripts/review-receipt.js` attempt state-machine idea, `npm test` as the full gate.
- Pinned sources: Superpowers TDD/verification skills are a pattern only (reuse plan 12); no upstream text or code was copied.

## Security and trust boundaries

- `recordRed`/`recordGreen` run caller-supplied shell commands in the repository: callers must be the host agent, never recalled memory text.
- A red command that passes is rejected as not a genuine failure.
- A pass is never fabricated from missing or corrupt evidence (`complete()` refuses).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/preflight.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/recovery.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/vertical-journey.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Persisted samples under `.rig/` listed above after a kill/restart replay.
- Lane: preflight 1/1, recovery 3/3, vertical-journey 3/3 passing.
- Candidate digest in `tdd/<pkg>.json` changes when one tracked byte changes (`verify()` returns `must_rerun`).

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
