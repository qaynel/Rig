# WP07 — Verification and release evidence

Status: implemented; all 16 proving tests pass in the lane.

## User-visible objective

The user gets a reliable ship/no-ship report: receipts bind to exact source bytes, an independent review loop carries unresolved findings across rounds and consumes an attempt only on a completed verdict, and publication needs authorization plus current health and clean-install evidence.

## Exact signed requirement, criterion and proving-test IDs

16 requirements: R033, R034, R035, R036, R037, R038, R039, R040, R041, R042, R043, R044, R045, R046, R071, R072. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
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
| R044 | AC-044: stale or failed health prevents eligibility. | PT-044 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R045 | AC-045: missing or stale install evidence prevents eligibility. | PT-045 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R046 | AC-046: a readiness report alone cannot execute a protected action. | PT-046 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R071 | AC-071: candidate is blocked if any required evidence class is absent. | PT-071 | F29 | `public-release.test.js` | release-evidence.js [WP07/WP11] | pass |
| R072 | AC-072: post-release failure is recorded and follows rollback/recovery policy. | PT-072 | F29 | `public-release.test.js` | release-evidence.js [WP07/WP11] | pass |

## Dependencies and prerequisites

WP02, then WP05-WP06 for routed runs. PT-033 and PT-037 are satisfied by `run-journal.js` (WP02).

## Exclusive file ownership

- `rig/catalog/baseline/release-evidence.js`
- `rig/catalog/baseline/review-loop.js`

Persists `.rig/release/` (append-only JSONL evidence plus `published/<commit>.json`) and `.rig/review/ledger.json`. `release-evidence.js` uses node built-ins only so it ships standalone.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Bypassing the 6.0.0 QA closeout (its own evidence chain).
- Known shortcuts carried: `publish()` checks `authorization.signed_by` is a non-empty string only; it does not verify the Gate 1 key. Decision pending with the owner before any claim of R046 beyond "a report alone cannot publish".
- No append lock; whole-tree walk per call; `review-loop.js` diffs each file whole against /dev/null instead of the delta since the last round.

## Existing Rig code and pinned sources reused

- Existing: `npm test`, `scripts/review-receipt.js` (Open-Code-Review `findingKey` adaptation, Apache-2.0, already local), `scripts/check-deployment-gate.js`, change-management order.
- `review-loop.js` reuses the idea (class key = file + normalised problem text), implemented independently; no new upstream code.

## Security and trust boundaries

- Outage, timeout and malformed output leave the attempt unconsumed (PT-035).
- The author context can never certify its own work (PT-034).
- Protected actions (publish/deploy) need owner authorization; a readiness report is not authorization (PT-046).
- One changed source byte invalidates a receipt (PT-043).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/review.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/release.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/public-release.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: review 3/3, release 4/4, public-release 2/2 passing.
- Evidence JSONL rows and `published/<commit>.json` artifact digest.
- Changed-byte, stale-QA and missing-evidence refusals.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
