---
date: 2026-10-20
source: agent
topics: gate1-signing, review-receipts, the-overhaul
status: superseded
superseded: 2026-10-20-owner-amendment-applied-full-gate-wiki-budget
tags: gate1, verification, trust-root
summary: The full-gate report fails three superseded frozen test bodies; the prepared owner amendment applies cleanly, but must be applied and signed by the owner before final-byte verification.
---

The supplied full-gate report fails three advanced-oracle cases: host-native policy activation, interrupted general installation, and interrupted lint-format installation. The current implementation intentionally refuses the unverifiable host-native route and no longer accepts caller-controlled `interrupt_after` controls. The failures therefore reproduce stale frozen expectations rather than a new implementation regression.

The prepared `trust-root-review-owner.patch` changes those bodies to prove the required safe behavior: host-native refusal without writes, real process death with withheld protection claims, and a genuine filesystem failure followed by safe resume. `git apply --check --whitespace=nowarn` accepts the patch. The focused current tests reproduce all three failures; the signed-oracle verifier succeeds only because the existing manifest still records the old test bytes.

No production or frozen-test byte was changed in this session. The necessary owner action is to apply the prepared amendment and then re-sign its exact frozen bytes. Only then can the full gate test the current safety contract; after it is green, a newly authorized provider-available review remains required for final clearance.
