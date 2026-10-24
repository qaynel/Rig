# WP08 — Knowledge and recovery

Status: implemented; all 9 proving tests pass in the lane.

## User-visible objective

A cold session finds accurate docs, phase and next action: stale user-facing pages block closeout, owner decisions are filed verbatim and indexed, trace cadence is audited, and compaction archives only duplicates after a fidelity check.

## Exact signed requirement, criterion and proving-test IDs

9 requirements: R038, R039, R040, R041, R042, R056, R057, R058, R076. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R038 | AC-038: stale docs block closeout. | PT-038 | F18 | `knowledge.test.js` | knowledge.js [WP08] | pass |
| R039 | AC-039: the owner text is intact and indexed by topic. | PT-039 | F18 | `knowledge.test.js` | knowledge.js [WP08] | pass |
| R040 | AC-040: cold reader recovers these four facts from repo state alone. | PT-040 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R041 | AC-041: restart preserves idempotency and exact evidence pointer. | PT-041 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R042 | AC-042: no pass is fabricated from missing records. | PT-042 | F19 | `recovery.test.js` | run-journal.js [WP02] | pass |
| R056 | AC-056: a long run has no untraced interval over the cadence. | PT-056 | F24 | `trace-retention.test.js` | trace-retention.js [WP08] | pass |
| R057 | AC-057: before/after source map and cold lookup are equivalent for required facts. | PT-057 | F24 | `trace-retention.test.js` | trace-retention.js [WP08] | pass |
| R058 | AC-058: injected omission blocks move/delete and reports missing source. | PT-058 | F24 | `trace-retention.test.js` | trace-retention.js [WP08] | pass |
| R076 | AC-076: ordinary memory upkeep makes zero external-provider calls. | PT-076 | F24 | `trace-retention.test.js` | trace-retention.js [WP08] | pass |

## Dependencies and prerequisites

WP02 and WP03. PT-040..042 are satisfied by `run-journal.js` (WP02); WP08 owns PT-038, PT-039, PT-056..058, PT-076.

## Exclusive file ownership

- `rig/catalog/baseline/knowledge.js`
- `rig/catalog/baseline/trace-retention.js`

Persists `.rig/knowledge/closeout.json`, `.rig/archive/manifest.json`, `.rig/archive/reasoning/*`, `.rig/memory/source-map.json`, `.rig/memory/last-upkeep.json`.

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- Editing immutable trace bodies.
- Paid-model upkeep: zero provider calls by construction.
- Known shortcuts carried: staleness is a path/basename/name-stem match, not semantic; the fidelity check is the only guard on decision re-maps.

## Existing Rig code and pinned sources reused

- Existing: `scripts/build-wiki-index.js`, wiki topic hubs and decision index, reasoning-trace frontmatter.
- Pinned sources: DeepAgents summarization is a trigger pattern only; no code copied.

## Security and trust boundaries

- An injected omission blocks move/delete and names the missing source (PT-058); originals stay intact.
- Only duplicates (same instant and body) are archived.
- Owner wording is filed verbatim as a new record, never rewritten (PT-039).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/knowledge.test.js`; `node --test --test-reporter=tap tests/ai-sdlc/trace-retention.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: knowledge 2/2, trace-retention 4/4 passing.
- Before/after fidelity manifest and source hashes from `compact()`; a cold `lookup()`.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
