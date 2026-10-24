# WP09 — Bounded improvement

Status: implemented; all 7 proving tests pass in the lane.

## User-visible objective

A mistake or instruction seen twice yields exactly one cited candidate, replayed against positive and negative history and promoted only locally and only with an unchanged passing full gate; protected surfaces are proposals awaiting the owner key.

## Exact signed requirement, criterion and proving-test IDs

7 requirements: R059, R060, R061, R062, R063, R064, R075. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R059 | AC-059: duplicate class has two source links and one candidate. | PT-059 | F25 | `learning.test.js` | learning.js [WP09] | pass |
| R060 | AC-060: before/after fixture and positive/negative replay are attached. | PT-060 | F25 | `learning.test.js` | learning.js [WP09] | pass |
| R061 | AC-061: promotion fails on regression or missing proof. | PT-061 | F25 | `learning.test.js` | learning.js [WP09] | pass |
| R062 | AC-062: every protected target rejects an automatic write. | PT-062 | F26 | `learning.test.js` | learning.js [WP09] | pass |
| R063 | AC-063: second identical proposal abstains and cites prior failure. | PT-063 | F26 | `learning.test.js` | learning.js [WP09] | pass |
| R064 | AC-064: the agent cannot self-approve protected candidate bytes. | PT-064 | F26 | `learning.test.js` | learning.js [WP09] | pass |
| R075 | AC-075: two occurrences create one scoped candidate without automatic protected promotion. | PT-075 | F25 | `learning.test.js` | learning.js [WP09] | pass |

## Dependencies and prerequisites

WP03, WP07 and WP08 per plan 19; `learning.js` imports no sibling module.

## Exclusive file ownership

- `rig/catalog/baseline/learning.js`

Persists `.rig/history.json` (input), `.rig/learning/` (candidates, `trials.json`, `applied.json`, `proposals/<target>-<hash>.json`).

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Any write path to oracle, policy, trust, security, evaluator, release authority, gate1, acceptance, release-checks, skills, routing or model-policy (these are `PROTECTED`).
- Scalar-only optimisers, self-editing guards.
- Known shortcut carried: a candidate is judged on recorded `fails_before` flags, not by re-running code.

## Existing Rig code and pinned sources reused

- Existing: review finding history, signed oracle.
- Pinned sources: Harness2 candidate/evaluation pattern only; no code copied.

## Security and trust boundaries

- `apply()` on a protected target writes a proposal with status `awaiting-owner-key` and returns `applied: false`; `owner_approved` and `signed_by` are not authority (PT-064).
- A failed or no-effect trial persists and silences identical repeats (PT-063).
- Only `memory`, `check`, `fixture` are locally applicable.

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/learning.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: learning 7/7 passing.
- Candidate with two source links, before/after replay, trial log, protected-target proposal file.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
