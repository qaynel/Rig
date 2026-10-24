# WP05 — Bounded routing and delegation

Status: implemented; all 14 proving tests pass in the lane.

## User-visible objective

Routine work uses the least expensive reliable mechanism: mechanical work never reaches a model, bounded work starts on the cheapest model and escalates at most once, and every task reports logical tokens, billable cost and wall time with a verified-work-over-tokens ratio.

## Exact signed requirement, criterion and proving-test IDs

14 requirements: R025, R026, R027, R028, R029, R030, R031, R065, R067, R080, R081, R082, R083, R084. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R025 | AC-025: count, key and manifest tasks make zero model calls. | PT-025 | F12 | `routing.test.js` | model-routing.js [WP05] | pass |
| R026 | AC-026: routing records capability, price class and selection reason. | PT-026 | F12 | `routing.test.js` | model-routing.js [WP05] | pass |
| R027 | AC-027: one failed cheap attempt escalates or stops with reason, never loops without bound. | PT-027 | F12 | `routing.test.js` | model-routing.js [WP05] | pass |
| R028 | AC-028: child context excludes unrelated project and private state. | PT-028 | F13 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R029 | AC-029: overlap is detected and independent work may continue. | PT-029 | F14 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R030 | AC-030: an expired owner is reported and reclaimed only after evidence check. | PT-030 | F14 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R031 | AC-031: worker self-report alone cannot complete a package. | PT-031 | F13 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R065 | AC-065: cap breach produces a blocked record and actual/unknown cost, never zero by default. | PT-065 | F12 | `routing.test.js` | model-routing.js [WP05] | pass |
| R067 | AC-067: secret fixture is absent from child payload and published artifacts. | PT-067 | F13 | `workers.test.js` | workers.js [WP05/WP06] | pass |
| R080 | AC-080: a completed task reports total logical tokens, billable cost and wall time with no uncounted call class. | PT-080 | F30 | `efficiency.test.js` | efficiency.js [WP05] | pass |
| R081 | AC-081: two runs delivering the same accepted acceptance evidence rank by tokens, so added retries lower the ratio. | PT-081 | F30 | `efficiency.test.js` | efficiency.js [WP05] | pass |
| R082 | AC-082: the benchmark replays the named scenarios offline and emits a recorded baseline, and an efficiency target with no prior baseline is rejected. | PT-082 | F30 | `efficiency.test.js` | efficiency.js [WP05] | pass |
| R083 | AC-083: a candidate with a better ratio but a failed acceptance, coverage or security check does not promote. | PT-083 | F30 | `efficiency.test.js` | efficiency.js [WP05] | pass |
| R084 | AC-084: an identical repeated read in a task surfaces a counted redundancy signal. | PT-084 | F30 | `efficiency.test.js` | efficiency.js [WP05] | pass |

## Dependencies and prerequisites

WP02 and WP03 per plan 19. In the build the three modules import no sibling; all were written in parallel with them.

## Exclusive file ownership

- `rig/catalog/baseline/model-routing.js`
- `rig/catalog/baseline/efficiency.js`
- `rig/catalog/baseline/workers.js` (shared with WP06; one owner for the file)

Persists `.rig/model-routing-log.jsonl`, `.rig/model-inventory.json` (input), `.rig/spend.json`, `.rig/efficiency/*`, reads `.rig/run.json`.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- A provider SDK or dispatcher runtime; the provider is a function the caller injects.
- Real price or capability data: tests use a stubbed inventory (cheap = 0, expensive = 1; capability mechanical = 0, judgement = 1).
- Known shortcut carried: zero billable tokens scores ratio 0, not infinity.
- The benchmark baseline is ten fixed offline replay fixtures in `efficiency.js` (file-count ... release-readiness), not measured production runs. Real baselines are an open item.

## Existing Rig code and pinned sources reused

- Existing: `rig-execution` skill, run-record and receipt accounting idea.
- Pinned sources named in plan 12 (Superpowers task-choice, DeepAgents `_EXCLUDED_STATE_KEYS`, Hermes `budget_for_context_window`): not landed as code. `workers.js` builds a brief by copying only the sources a scope names (allowlist by construction), which is an independent implementation, not a port.

## Security and trust boundaries

- Spend cap reached -> a blocked record with cost `unknown`, never zero (PT-065).
- Child brief copies only scoped sources; traversal, dotfiles, `private/` and symlinks resolving outside the repository are refused (PT-028, PT-067).
- A candidate with a better ratio but a failed acceptance, coverage or security check does not promote (PT-083).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/routing.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/workers.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/efficiency.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: routing 4/4, efficiency 5/5, workers 5/5 passing.
- Routing log rows (mechanism, capability, price class, reason, escalation) and one blocked-cap row.
- Recorded benchmark baseline file under `.rig/efficiency/`.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
