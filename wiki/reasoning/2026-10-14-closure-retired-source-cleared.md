---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue
decisions:
status: superseded
summary: T-3.8's retired-path check now passes after the T-4.5 service corpus cleanup removed the duplicate-copy failures.
---
Done: T-3.8; `node --test tests/corpus-contract.test.js` — 8 pass, 0 fail. The test confirms no live file points at a retired path and the service corpus has no forbidden twins. T-4.5 remains open because `node scripts/check-coherence.js` reports RIG-155, RIG-156, and missing `docs/install.md`. In flight: T-4.4 matrix rerun. Next: finish the matrix and run T-4.6's combined proof.
