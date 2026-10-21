---
date: 2026-10-20
source: agent
topics: gate1-signing, review-receipts, the-overhaul
status: superseded
superseded: 2026-10-20-final-byte-full-gate-green
supersedes: 2026-10-20-frozen-oracle-amendment-not-applied, 2026-10-20-owner-lock-retained-superseded-oracle
tags: gate1, verification, trust-root, wiki
summary: The owner applied and signed the trust-root oracle amendment; the amended cases pass, while the first final-byte full gate is blocked only by an over-budget review-receipts hub.
---

The owner applied `trust-root-review-owner.patch`, confirmed the reported digest delta, and re-signed the resulting oracle. `node scripts/check-advanced-spec.js` verifies the owner signature over 16 files and 95 acceptance cases. The manifested `tests/advanced-oracle.test.js` hash is `7d5eb318a0bec43122f7e0c2640153141414de7aac54e01a133cc9ab4cda5dd7`, so the signature now binds the amended cases rather than the superseded bodies.

The focused run for the three previously failing cases passes. The first full `npm test` on the signed bytes passed 1,181 of 1,184 tests; its sole failure was the wiki budget check because `wiki/topics/review-receipts.md` was 12,196 bytes against the 12,000-byte hub limit. The failure is documentation size only, not an implementation or oracle failure. Trim the redundant historical hub narrative, rebuild the generated wiki index, and rerun the full gate before considering the candidate locally green.

The post-fix binding review remains unavailable: the authorized attempt stopped at the provider weekly limit and wrote no receipt. A fresh explicit authorization and provider availability are still required after the final-byte gate is green. Exact-QA-commit automated health and clean-download evidence remain subsequent release steps.
