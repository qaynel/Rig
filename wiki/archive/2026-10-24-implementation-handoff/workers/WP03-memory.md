# WP03 — Active and scoped memory

Status: implemented; all 10 proving tests pass in the lane.

## User-visible objective

A settled answer is recalled within an 8,192-byte working view; overflow stays retrievable by pointer; developer memory crosses projects, project memory does not; search is by meaning, offline, with cited lexical fallback on local-model failure.

## Exact signed requirement, criterion and proving-test IDs

10 requirements: R047, R048, R049, R050, R051, R052, R053, R073, R074, R078. Obligation text: `wiki/specs/ai-sdlc-harness/15-gate1-contract.md`; fixtures: `16-test-manifest.md`. Same-numbered AC and PT (R047 = AC-047 = PT-047).

| Requirement | Criterion | Proving test | Fixture | Test file | Satisfied by | Lane state |
|---|---|---|---|---|---|---|
| R047 | AC-047: multibyte input never renders 8,193 bytes. | PT-047 | F21 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R048 | AC-048: evicted content is found from its pointer. | PT-048 | F21 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R049 | AC-049: recall displays scope and original source, and excludes superseded value by default. | PT-049 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R050 | AC-050: cross-project query returns only developer-scope records. | PT-050 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R051 | AC-051: local-model failure still yields cited lexical results and a named semantic failure. | PT-051 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R052 | AC-052: an offline paraphrase query with no shared content words returns a relevant cited source. | PT-052 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R053 | AC-053: injected command in memory changes no protected action. | PT-053 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R073 | AC-073: recall presents the conflict and asks for resolution only when behavior depends on it. | PT-073 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R074 | AC-074: a deletion request never removes the sole oracle, decision or evidence source. | PT-074 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |
| R078 | AC-078: network-denied instrumentation records zero outbound calls while semantic results are returned. | PT-078 | F22 | `memory.test.js` | memory.js + embedding.js [WP03] | pass |

## Dependencies and prerequisites

WP02 (journal) per plan 19; in the build `memory.js` has no import of `run-journal.js`; its only code dependency is `embedding.js`. Kept by the coordinator, not delegated.

## Exclusive file ownership

- `rig/catalog/baseline/memory.js`
- `rig/catalog/baseline/embedding.js`
- `rig/catalog/baseline/assets/potion-base-2m/` (embeddings.i8, vocab.txt, model.json)

Persists `<repo>/.rig/memory/records.json` and `index.json` (project scope) and `$RIG_HOME/memory/records.json`, default `~/.rig/memory/records.json` (developer scope).

Never edited by any package: `tests/ai-sdlc/**`, `wiki/gate1/**`, `15-gate1-contract.md`, `16-test-manifest.md`, `17-customer-lifecycle.md`.

## Explicit out-of-scope work

- A vector database, daemon, model server, provider SDK or native binary (North star 23).
- Chinese/other-ecosystem model comparison beyond what the wave-1 trace recorded; the English `potion-base-2M` table is the shipped choice.
- Consolidation beyond whole-line active-view admission (newest first; the first record that does not fit and every later one become pointers).

## Existing Rig code and pinned sources reused

- Existing: `scripts/wiki-query.js` lexical path (fallback semantics), wiki index.
- **Open-source inheritance decision (R052, R068, R077, R078): `minishlab/potion-base-2M`, MIT, a model2vec static distillation of `baai/bge-base-en-v1.5`, source https://huggingface.co/minishlab/potion-base-2M. Per-row symmetric int8 (4-byte little-endian float scale per row, then 29,528 x 64 unsigned bytes offset by 128), BERT wordpiece uncased tokenizer (`vocab.txt` as published). Runtime is `embedding.js`: tokenise, table lookup, mean, unit-normalise. Pure JS; no native binary, no model server, no first-run download.**
- `embeddings.i8` 2,007,904 bytes, sha256 `e08aab892fcc8684fb221ae2ee868a8d2abe513ccdbb3dcb0f9c65ce525a5f98`; `vocab.txt` 219,690 bytes, sha256 `1394523a67ddd404a825428018c0582a6998bcfa044ecbcbf1f4d71adb94c61c` (both recomputed by `shasum -a 256` on this branch and equal to `model.json`).
- Rejected on record (wave-1 trace): `@xenova/transformers` + MiniLM ONNX (native prebuilts, per-OS packaging), GloVe subsets, any provider/daemon/vector DB.
- Not landed: the Claude-Mem budget-loop port and Hermes `sanitize_context` port named in plan 12. `memory.js` implements its own byte-cap loop and injection patterns; there is no upstream notice in the module. Treat plan 12 rows for these as unrealised.

## Security and trust boundaries

- Recalled text is data: matches against `INJECTION` patterns are reported, never obeyed (PT-053).
- Deleting never removes the sole oracle, decision or evidence source (PT-074).
- No network: PT-078 runs with `fetch`, `net`, `http`, `https` denied and counts zero calls.
- Developer store is outside the repository; only developer-scope records are visible from another project (PT-050).

## Focused tests and integration checks

| Check | Command |
|---|---|
| Focused | `node --test --test-reporter=tap tests/ai-sdlc/memory.test.js` |
| Whole lane | `node --test --test-reporter=tap tests/ai-sdlc/*.test.js` (current: 88 tests, 85 pass, 3 fail) |
| Graph | `node scripts/check-traceability.js` |
| Signature | `node scripts/approve-gate1.js status --programme ai-sdlc` |
| Repository gate | `env -u GITHUB_TOKEN -u GH_TOKEN npm test` (repository gate, unaffected by the lane) |

## Required evidence and artifacts

- Lane: memory 10/10 passing.
- Active view byte count <= 8192 on multibyte input; pointer-retrieval of an evicted record.
- Measured here: the PT-068 pair ("Steps to stop an automatic subscription charge." vs "How do I cancel a recurring payment?") scores 0.642 with no shared content word. The wave-1 trace reports PT-052 distractors at 0.039 and -0.072; not re-measured here.
- Asset digests as above.

## Stop conditions and blocker reporting

- A required change falls on a signed file (`tests/ai-sdlc/**`, `wiki/gate1/**`, `15-`, `16-`, `17-`): stop; the owner re-signs, batched. Never edit it.
- A test and its contract row disagree: stop and report the two IDs. (PT-037 was once reported this way and was not a contradiction; see `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md`.)
- The fix needs a file the package does not own: stop and name the file and its owner.
- A criterion is environment-bound and the environment is absent: report the named gap and the variable; do not simulate it.
- The repository gate (`env -u GITHUB_TOKEN -u GH_TOKEN npm test`) goes red on this package's bytes: stop and report the first failing test.

Report format: IDs affected, the file and line, the command run, the exact output, and the one next action. Put it in a dated trace under `wiki/reasoning/` (three-minute cadence applies on long work).

## Branch/worktree arrangement

Single shared worktree `/Users/winmore/conductor/workspaces/rig-v0.1/taipei-v1`, branch `vaibhav-kodiyan/gstack-pasted-text`, HEAD `0256c663`. No per-worker branch or worktree existed; ownership was disjoint by file, so concurrent writers could not collide. All work is uncommitted; nothing is pushed. Do not switch branches, stash or commit unless the owner asks.
