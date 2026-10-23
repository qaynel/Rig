---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: The unsigned owner amendment bundle inventories the candidate changes, but two package-script candidates lack green advisory runs.
---
Done: assembled `candidate-amendments/owner-bundle.md`; `AT-HOST-5` 1/1, `AT-PB-3` 1/1, onboarding offer 1/1, `AT-LF-20` 1/1, and `tests/advanced-catalogue.test.js` 10/10. The AT-PB-1 recomputed digest matches its candidate (1,036 files). In flight: T-10.3 remains open because `check-coherence.js` reports pending owner issues and nine evidence failures, while exact-SHA E2E refuses the dirty tree and the public `v6.0.0` tag is absent. Next: owner resolves those blockers and reviews the bundle before the signed Gate 1 update.
