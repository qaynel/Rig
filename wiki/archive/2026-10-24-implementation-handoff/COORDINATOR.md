# Coordinator protocol

Source of the protocol: `wiki/reasoning/2026-10-24-ai-sdlc-implementation-wave1.md` (written during the work) and plan 19 §Coordinator handoff. Where the trace is silent, this file says so.

## Protocol followed

| Step | What was done | Evidence |
|---|---|---|
| 1 | Checked authorization before any change: both `status` commands verified | Trace "Authorisation checked"; reproduced here |
| 2 | Baseline: lane 88 tests, 14 pass, 74 fail; each failure `capability not implemented: rig/catalog/baseline/<name>.js` | Trace |
| 3 | Confirmed the repository gate was green and that new files under `rig/catalog/baseline/` do not disturb it (probe module left 254/254 in eight named test files and three structural checks at exit 0) | Trace |
| 4 | Split by module, one owner per module, so file ownership is disjoint by construction | Trace |
| 5 | Dispatched six section leads in parallel (S1 WP01, S2 WP02, S4 WP04/WP10, S5 WP05/WP06, S6 WP07, S7 WP08/WP09); each fanned out one worker per module and independently verified its output | Trace |
| 6 | Coordinator kept WP03 (memory, because the offline-semantic choice was the one unsettled design call) and the WP10 upgrade path | Trace |
| 7 | Decided the embedding model (potion-base-2M) against North star 23 criteria | Trace; `model.json` |
| 8 | Adjudicated a reported contradiction (PT-037): not a contradiction; the seam `trim()` does not strip U+200B/C/D or U+2060 | Trace |
| 9 | Integrated, built the public archive script, reran the lane | File times in `EXECUTION-ORDER.md`; lane 85/88 |
| 10 | Full repository gate on integrated bytes | pending |
| 11 | Independent report-only review | **Not on record.** Open item 5 |
| 12 | Handoff package | This directory |

No section numbered S3 appears in the trace; WP03 was the coordinator's own.

## Rules the coordinator held

- Never edit `tests/ai-sdlc/**`, `wiki/gate1/**`, specs 15/16/17. Tests are the oracle; modules adapt to tests.
- Worker self-report never completes a package (this is itself PT-031).
- A claimed contradiction between test and contract is checked against the code before it is escalated.
- No commit, push, stash or branch switch. Nothing published.
- Reasoning trace at least every three active minutes; `node scripts/build-wiki-index.js` regenerates `wiki/status.md`, never hand-edit it.

## Who owns what now

| Area | Owner | Notes |
|---|---|---|
| Signing, re-signing, hardware key, amendments to signed files | Owner | One key; agents never sign (North star 4, 13) |
| Publish, deploy, promotion authorization | Owner | PT-046 |
| Unsigned modules (list in README) | Next coordinator | One module = one owner; see worker briefs |
| WP03 memory, embedding assets, WP10 upgrade, archive path | Coordinator (not delegated before) | Briefs 03 and 10 |
| Plan docs 12, 18, 19, README of the spec dir | Next coordinator (editable) | Corrections listed in README |
| Real-download and hardware evidence | Owner / release job | Open items 1, 2 |
| Independent review | Separate reviewer, never the integrator | Open item 5 |

## Escalate to the owner only for

A changed product contract; any signed-file change; protected authorization; a decision that is genuinely a product fork (open items 3, 4, 6). Technical choices and failed model attempts stay with engineering.
