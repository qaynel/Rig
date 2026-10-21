---
date: 2026-10-20
source: agent
topics: gate1-signing, review-receipts, the-overhaul
status: superseded
superseded: 2026-10-20-owner-amendment-applied-full-gate-wiki-budget
tags: gate1, verification, trust-root
summary: The owner re-signed the unchanged oracle; its three superseded expectations still fail, so the prepared amendment must be applied and re-signed before a full gate can be green.
---

The owner ran the approval helper with its reported digest confirmation and obtained a valid Gate 1 signature. Verification confirms 16 files and 95 cases, but the manifest retains the prior SHA-256 for `tests/advanced-oracle.test.js`; the prepared owner amendment is not part of the signed bytes.

The focused current oracle reproduces all three known failures: it expects an unverifiable host-native attestation to activate policy, and it relies on the removed caller-controlled `interrupt_after` control for the two interrupted-install cases. The implementation's refusal and real interruption behavior are intentional safety fixes. Changing production code to satisfy the retained cases would reintroduce the resolved review findings.

The prepared `trust-root-review-owner.patch` continues to apply cleanly. The owner must apply it, run the approval helper's digest-confirmation command against the resulting manifest, and then verify the signed result. At that point the full `npm test` gate can validate the current contract. A fresh explicitly authorized, provider-available binding review and the exact-QA-commit automated promotion checks remain required before deployment clearance.
