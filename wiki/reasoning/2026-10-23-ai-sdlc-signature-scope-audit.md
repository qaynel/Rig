---
date: 2026-10-23
source: agent
status: current
topics: the-two-gates
checked: 2026-10-23
owner: rig-product-design
summary: AI-SDLC planning audit corrected a false owner question: the technical design already sits outside the signed oracle, despite its earlier place in the router sequence.
---

# AI-SDLC planning correction: sequence is not signature scope

During continuation of the AI-SDLC planning package, the decision register
claimed that placing the technical design before the lock made it part of the
frozen set. That was false. The signing message in
`scripts/approve-gate1.js` names the business spec, acceptance and testing
manifest. `scripts/check-advanced-spec.js` checks the technical design's
presence and traceability but does not sign its bytes. The existing North star
and `wiki/topics/the-two-gates.md` state the same rule.

The router still lists technical design before the signing step, whereas the
owner's proposed lifecycle puts it after. That is a workflow-order alignment
for the later pipeline work, not a change to what the owner signs. The SOW's
decision register and dependent architecture, capability, roadmap and drift
pages have been corrected. The earlier builder-mode `design.md` remains as
the historical draft; it is not the authority for the current gate.

The owner's preference statements were also drafted from the existing record
instead of assigning a manual export. Their proposed text is 1,641 UTF-8 bytes.
That is a plausibility check for an 8 KB working ledger, not approval of the
profile or a full-ledger size test. No implementation or frozen artifact changed.
