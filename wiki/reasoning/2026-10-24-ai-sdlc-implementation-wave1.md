---
date: 2026-10-24
source: agent
topics: gate1-signing, the-two-gates, testing-strategy, distribution-and-release, agent-working-conventions
decisions:
status: current
supersedes:
tags: implementation, ai-sdlc, offline-search, open-source-inheritance
summary: AI-SDLC WP01-WP11 implemented into rig/catalog/baseline; acceptance lane at 85/88 with three environment-bound criteria; offline semantic memory reuses potion-base-2M (MIT, 2.2 MB, pure JS).
---

# AI-SDLC implementation, wave 1

Authorisation checked before any change: both
`node scripts/approve-gate1.js status --programme ai-sdlc` and
`node scripts/approve-gate1.js status` verify. The ai-sdlc contract is
protected under `gate1-owner`; the 6.0.0 oracle still verifies 16 files and
95 acceptance cases. Implementation is therefore in scope.

## What was true at the start

`node --test --test-reporter=tap tests/ai-sdlc/*.test.js` → 88 tests,
14 pass, 74 fail. Every failure was the same preimplementation red:
`capability not implemented: rig/catalog/baseline/<name>.js`. The signed
harness resolves twenty capability modules from `rig/catalog/baseline/`;
only `check-traceability.js` existed.

`env -u GITHUB_TOKEN -u GH_TOKEN npm test` was green before any change, and
the acceptance lane is deliberately outside it — `tests/*.test.js` does not
match `tests/ai-sdlc/`.

Verified before dispatch: adding files under `rig/catalog/baseline/` does not
disturb the repository gate. A probe module left
`tests/advanced-baseline.test.js`, `tests/traceability-invariant.test.js`,
`tests/release-blockers.test.js`, `tests/basic-renderers.test.js`,
`tests/guarantee-coverage.test.js`, `tests/policy-active-bundle.test.js`,
`tests/advanced-oracle.test.js` and `tests/migrate-v5.test.js` at 254/254,
and the three structural checks at exit 0. `rig/manifest.json` already
projects the whole `rig/catalog/baseline` directory, so new modules install
without a manifest change.

## How the work was split

One module per owner, which makes file ownership disjoint by construction.
Six section leads ran in parallel, each fanning out to one worker per module
and then independently verifying its output:

| Section | Modules | Proving tests |
|---|---|---|
| S1 WP01 | design-audit, discovery, work-packages | PT-006-008, PT-020-023 |
| S2 WP02 | run-journal, preflight | PT-024, PT-032-033, PT-037, PT-040-042 |
| S4 WP04/WP10 | profile, onboarding, portability, public-install | PT-001-005, PT-054-055, PT-066, PT-068, PT-077 |
| S5 WP05/WP06 | model-routing, efficiency, workers | PT-025-031, PT-065, PT-067, PT-080-084 |
| S6 WP07 | release-evidence, review-loop | PT-034-036, PT-043-046, PT-071-072 |
| S7 WP08/WP09 | knowledge, trace-retention, learning | PT-038-039, PT-056-064, PT-075-076 |

The coordinator kept WP03 (memory) and the WP10 upgrade path, because the
offline semantic requirement was the one genuinely unsettled design choice.

## The offline semantic decision (R052, R068, R077, R078)

North star 23 requires reusing an existing embedding model and selecting on
smallest complete installed footprint, redistributable licence, fully offline
inference, supported-OS coverage and latency. Selected:
**`minishlab/potion-base-2M`** — MIT, a model2vec static distillation of
`baai/bge-base-en-v1.5`.

A static model is a token-to-vector table, so inference is a wordpiece
tokenisation, a lookup and a mean. That removes the entire runtime problem:
no ONNX runtime, no native binary, no model server, no per-platform
prebuilts, no first-run download, identical behaviour on darwin, linux and
win32. Quantised per-row symmetric int8 the weights are 2,007,904 bytes;
with the published `vocab.txt` the whole installed footprint is 2.2 MB
against roughly 100 MB for a MiniLM/ONNX stack.

Quantisation was checked against the published float32 weights: ranking on
the acceptance queries is unchanged. The decisive case, PT-052, scores the
meaning-equivalent record at 0.642 and the two distractors at 0.039 and
-0.072, with no shared content word.

Rejected: `@xenova/transformers` with MiniLM ONNX (native prebuilts, ~100 MB,
per-OS packaging); GloVe subsets (no redistributable packaging at a
comparable footprint, weaker on these queries than potion at 2 MB);
any provider, daemon or vector database (North star 23 forbids one absent a
requirement that demands it).

Assets, digests and licence are recorded in
`rig/catalog/baseline/assets/potion-base-2m/model.json`; the runtime is
`rig/catalog/baseline/embedding.js`.

### Two memory design calls worth recording

Developer-scope records live once per developer, under
`$RIG_HOME` or `~/.rig/memory`, because PT-050 requires a second project to
see them. Project records of the current repository are offered first and
developer records must clear a relevance floor, because developer memory is
portable background rather than this project's answer. Without that ordering
a developer record outranks the project's own record on a query it merely
resembles (observed on PT-078).

The 8 KB active view admits records newest-first; from the first record that
does not fit, every remaining record is represented by its pointer. Only
whole lines are ever appended, so the cap cannot split a character.

## PT-037 was reported as a contract contradiction. It is not.

S2 reported `tests/ai-sdlc/vertical-journey.test.js` PT-037 as unsatisfiable,
on the grounds that the fixture seam `s.trim()` already strips leading
whitespace so the symptom "leading whitespace survives" cannot reproduce.
That is wrong. `String.prototype.trim` strips only ECMAScript WhiteSpace and
LineTerminator; it does not strip U+200B, U+200C, U+200D or U+2060. The
fixture carries a real, reproducible defect and the test is satisfiable
without touching the oracle. Filed here so the claim is not repeated.

## State at this trace

88 tests, 84 pass. Outstanding: PT-037 (in repair, not a contradiction),
PT-017 (needs a real `sk-ssh-ed25519@openssh.com` device; reported gap, this
lane never simulates a security-key touch), PT-068 and PT-077 (need a real
public archive; archive build in flight).

## Next

Full `env -u GITHUB_TOKEN -u GH_TOKEN npm test` on the integrated bytes, an
independent report-only review, and the handoff package under
`rig-implementation-handoff/`. Nothing is pushed, published or released.
