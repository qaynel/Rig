---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, catalogue-contract
decisions:
status: historical
summary: Grade ceilings, dependency-only slices, and stale or mixed service IDs now have explicit catalogue tests.
---
Done: T-4.9; `node --test tests/advanced-catalogue.test.js` — 10 pass, 0 fail. Coverage checks cumulative grade ceilings and retained service limits, null-grade dependency-only named slices, and rejection of retired IDs both alone and mixed with a current ID; existing strict growth coverage remains. In flight: T-4.10. Next: verify duplicate merges or record that there are none and the count remains 115.
