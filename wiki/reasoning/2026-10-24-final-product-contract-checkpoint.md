---
date: 2026-10-24
source: agent
topics: what-rig-is, the-two-gates, agent-working-conventions
decisions: 
status: historical
supersedes: 
tags: progress, traceability
summary: Atomic contract, test obligations and lifecycle journey map drafted; signing remains a separate owner-reviewed dependency.
---

# Product contract checkpoint — 2026-10-24 00:50 IST

Done: read the owner's new directive verbatim and filed it; reconciled the 22
functional and 10 nonfunctional requirements against the 18 earlier broad
acceptance rows; drafted 72 atomic requirements with primary acceptance and
test IDs, 29 fixture definitions, and 20 end-to-end journeys over the complete
discover-to-transfer lifecycle. This is planning work only. Existing review
code and signed 6.0.0 oracle were not touched.

In flight: write architecture interaction diagrams, a source-to-capability
inheritance decision, detailed work packages and a public-product roadmap;
then run a deterministic cross-reference audit and update the hubs and index.

Next: inspect whether the proposed test obligations can actually enter the
existing signing manifest. Current `approve-gate1.js` signs the existing
`wiki/gate1` contract and manifested test files, so the new programme cannot
honestly be called signable until test files and a reviewed manifest extension
exist. No key action is authorised by this planning directive.
