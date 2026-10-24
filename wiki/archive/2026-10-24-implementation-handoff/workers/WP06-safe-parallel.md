# WP06 — Safe parallel work

Status: implemented; all 4 proving tests pass in the lane.

## User-visible objective

Independent agents progress without file collision: overlapping ownership stops before any write, disjoint work continues, a stale owner is reclaimed only after evidence, and a worker's self-report never completes a package.

## Exact signed requirement, criterion and proving-test IDs

4 requirements: R028, R029, R030, R031. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R028 | AC-028: child context excludes unrelated project and private state. | PT-028 | F13 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R029 | AC-029: overlap is detected and independent work may continue. | PT-029 | F14 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R030 | AC-030: an expired owner is reported and reclaimed only after evidence check. | PT-030 | F14 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R031 | AC-031: worker self-report alone cannot complete a package. | PT-031 | F13 | `workers.test.js` | workers.js [WP05/WP06] | pass |

## Dependencies and prerequisites

WP05. Same file as WP05 (`workers.js`); one author wrote it.

## Exclusive file ownership

- `rig/catalog/baseline/workers.js` (exports brief, publish, accept, state, reserve, reclaim)

Persists `.rig/workers/leases.json`, `.rig/workers/state.json`, `.rig/workers/<id>/artifact.json`. Default lease 900 seconds.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Automatic merges of overlapping edits.
- An agent runtime or scheduler.
- Known shortcut carried: JSON read-modify-write with no file lock; two separate OS processes can interleave. Upgrade is an O_EXCL lockfile when workers run as processes.

## Existing Rig code and pinned sources reused

- Existing: host-native subagents; isolated-worktree pattern used by Conductor. No upstream code.

## Security and trust boundaries

- `accept()` requires independent evidence; self-report alone is refused (PT-031).
- `reclaim()` requires evidence that the owner is gone (PT-030); no silent lock theft.
- Path keys refuse traversal, dotfiles and `private/`.

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/workers.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: workers 5/5 passing.
- Lease and state JSON after an overlap, a disjoint reserve and an expired-owner reclaim.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
