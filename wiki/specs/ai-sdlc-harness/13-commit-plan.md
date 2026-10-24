---
status: current
checked: 2026-10-24
owner: rig-product-design
---

# Local change grouping — no action executed

The earlier three-command commit recipe is stale after the owner-directed product-first rewrite. It is withdrawn. This page describes reviewable groups only; no file has been staged, committed, pushed or deployed by this planning pass.

| Group | Contents | Required check before any future commit |
|---|---|---|
| Review state machine | Uncommitted `scripts/review-receipt.js`, `tests/release-blockers.test.js`, ticket and evidence trace from the earlier session | Focused 49-case suite and full `npm test` on exact candidate bytes; review the existing diff independently of this planning package. |
| Wiki status reclassification | Existing trace frontmatter changes and generated index/status from the earlier session; seven marker-line exceptions remain documented | Mechanical body-preservation audit and wiki lint/index/budget checks. |
| Product-first planning package | Owner directive verbatim, North star, SOW documents, topic hubs, decision index and progress traces | Cross-document drift scan; wiki lint/index/budget checks; source pin/licence audit. No Gate 1 files changed. |
| Gate 1 preparation | `rig/catalog/baseline/check-traceability.js`, `scripts/check-traceability.js`, the `--programme` path in `scripts/approve-gate1.js`, `rig/corpus/standards/traceability.md`, router and standards-index edits, `rig/lib/baseline-payload.js`, `tests/traceability-invariant.test.js`, `tests/ai-sdlc/`, `wiki/gate1/ai-sdlc/`, and the two parity/containment fixtures that record the new baseline entrypoint | Graph audit green; the acceptance lane at 83 cases with its pass/fail split recorded; full `npm test` with only the pre-existing coherence ticket failure; both `approve-gate1.js status` paths verified. |

The 6.0.0 QA/CI release work is separate from these groups. If the owner later authorizes committing, prepare fresh staging commands against the actual `git status`, inspect each staged diff, run the full local gate before any push, and keep the PR branch checked out for Conductor. The target branch for this workspace is `qa-prod`. Nothing here grants authorization for an external review, paid model, upstream execution, push or release.
