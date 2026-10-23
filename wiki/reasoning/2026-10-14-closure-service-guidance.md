---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, authored-service-gate
decisions:
status: current
summary: Service specific grade and slice guidance now covers all four catalogue families, while the coherence proof remains blocked by unrelated release checks.
---
Done: T-4.5 guidance authored for all 115 services in four family commits; `rg -n -i 'generic baseline' rig/corpus/services` — 0 hits; `node --test tests/corpus-contract.test.js` — 8 pass, 0 fail. `node scripts/check-coherence.js` remains red on RIG-155, RIG-156, and missing `docs/install.md`; T-4.5 remains unticked until its complete proof passes. In flight: T-4.4 matrix (`node --test tests/catalogue-all-services.test.js`, still running). Next: finish T-4.4 and continue WP4.
