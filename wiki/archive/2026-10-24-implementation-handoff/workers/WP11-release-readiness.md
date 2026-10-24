# WP11 — Public release candidate and QA

Status: implemented; 1 of 9 proving tests fail in the lane, all environment-bound: PT-077.

## User-visible objective

Users can rely on the published artifact: a horizontal sweep of every proving test on the exact candidate bytes, offline semantic clean-install proof on each claimed platform, independent security and code review, exact-commit QA gates and post-release validation.

## Exact signed requirement, criterion and proving-test IDs

9 requirements: R043, R044, R045, R046, R071, R072, R077, R078, R079. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R043 | AC-043: one code-byte change invalidates the receipt. | PT-043 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R044 | AC-044: stale or failed health prevents eligibility. | PT-044 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R045 | AC-045: missing or stale install evidence prevents eligibility. | PT-045 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R046 | AC-046: a readiness report alone cannot execute a protected action. | PT-046 | F20 | `release.test.js` | release-evidence.js [WP07] | pass |
| R071 | AC-071: candidate is blocked if any required evidence class is absent. | PT-071 | F29 | `public-release.test.js` | release-evidence.js [WP07/WP11] | pass |
| R072 | AC-072: post-release failure is recorded and follows rollback/recovery policy. | PT-072 | F29 | `public-release.test.js` | release-evidence.js [WP07/WP11] | pass |
| R077 | AC-077: a clean real-download install finds the pinned model, tokenizer and runtime without a first-run download. | PT-077 | F27 | `portability.test.js` | portability.js [WP10] | FAIL (environment-bound) |
| R078 | AC-078: network-denied instrumentation records zero outbound calls while semantic results are returned. | PT-078 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R079 | AC-079: an upgraded index returns cited results without mixing incompatible vectors. | PT-079 | F28 | `upgrade.test.js` | upgrade.js [WP10] | pass |

## Dependencies and prerequisites

All prior packages. No parallel writes to the release candidate. Separate reviewer judges; the integrator does not.

## Exclusive file ownership

- `(no module files) `release-evidence.js` is the WP07 module that PT-043..046 and PT-071..072 exercise; `portability.js`/`upgrade.js` are WP10.`

WP11 produces evidence, not code: receipts under `.rig/release/`, the lane run, the full-gate run, the independent review report.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- A calendar- or version-driven release despite red evidence; no date or version is assumed.
- Publishing, deploying or promoting without the owner's authorization.
- Carrying evidence across a code change (change-management rule).

## Existing Rig code and pinned sources reused

- Existing: `rig/corpus/standards/change-management.md`, `node scripts/check-deployment-gate.js --receipt <path>`, `.github/workflows/{test,health,release-eligibility,e2e}.yml`, `scripts/clean-install-e2e.js`.

## Security and trust boundaries

- Protected publish/deploy needs owner authorization; readiness reports do not authorize.
- Evidence is bound to the exact commit; stale or missing evidence classes block (PT-071).
- A post-release failure is recorded as an incident and follows rollback/recovery (PT-072).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/public-release.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/release.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/portability.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/upgrade.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Not yet produced: real-download clean-install on each claimed platform (darwin, linux, win32) with network denied and a meaning-based query; independent review report; exact-QA health receipt; production post-release receipt.
- Produced: lane and full-gate runs on the current branch bytes (see `verification/integration-checklist.md`).

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
