---
date: 2026-10-13
source: agent
topics: the-overhaul
decisions:
status: historical
supersedes:
tags: specification, sow, applied-amendments
summary: Applied the reviewed amendments to ten plan files and created one consolidated specification sheet plus an engineering SOW; all six owner decisions are settled and product implementation remains pending.
---

# Close-everything — applied amendments, specification and SOW

## Owner request, verbatim

make those ammendemtns and create 1 spec sheet and SOW

## Routing and scope

This is product/technical design documentation, routed to rig-product-design.
The owner has already settled the product intent and six review choices; no
new grilling, implementation, signing or publication is requested. The earlier
report-only review is finished, and this request authorizes applying its
proposed plan amendments. Existing workspace changes remain intact.

## Work completed at 14:44 UTC

Applied the already-checked review diff to ten master/subplan files. Added
`wiki/specs/close-everything/specification-sheet.md` as the single consolidated
product/technical sheet, and `statement-of-work.md` as its delivery companion.
The master links them while retaining the authoritative item ledger and routes
to granular subplans. Updated its status from proposed amendment to applied
review amendments, and removed the stale claim that tier wording is open.

The sheet covers current system seams, product requirements, evidence,
compatibility, trust boundaries, failure/recovery behavior and the final
owner-signing sequence. The SOW covers ten deliverables, dependency order,
responsibilities, CI/network/signing dependencies, acceptance evidence and
scope control. It commits no invented schedule, fee or delivery estimate.

## Design choices

Reuse the reviewed plan and its existing subplans, rather than re-deriving
scope. Keep one compact specification and one delivery document; a replacement
monolithic plan would obscure the detailed runnable acceptance already written.
Do not add a new implementation framework, test suite or dependency for this
documentation change.

Preserve all settled choices: upstream fetches during onboarding; one corpus
root; compatible tier-flag transition; named missing-tool gaps; justified,
compatible duplicate merges; automated promotion checks on the exact QA commit.
Coverage gaps are not passing assurance, and the current protected oracle is
unchanged until the owner's later final bundle and signature.

## In flight and next

Document consistency, local-link checks, wiki index regeneration and existing
wiki budget/generated-index checks are the remaining validation. Then hand
back the two consolidated documents. No runtime code, tests, frozen artifacts,
tracker states, commit, push or release is part of this request.
