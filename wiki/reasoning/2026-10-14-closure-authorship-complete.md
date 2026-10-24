---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, authored-service-gate, testing-strategy
decisions:
status: historical
summary: The full service matrix and authored-service checks pass together, so T-4.4 and T-4.6 are complete.
---
Done: `node --test tests/catalogue-all-services.test.js tests/advanced-catalogue.test.js` — 121 pass, 0 fail. This run covered all 115 services at every grade and both good/bad configurations; the new gate rejects generic boilerplate and near-duplicate bodies, while the live authorship report has zero failures. T-4.4 and T-4.6 ticked. T-4.5 remains open because `node scripts/check-coherence.js` reports RIG-155, RIG-156, and missing `docs/install.md`; its corpus-contract test passes 8/8. Next: continue WP4 with T-4.7.
