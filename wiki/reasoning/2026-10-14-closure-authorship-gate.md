---
date: 2026-10-14
source: agent
topics: the-overhaul, authored-service-gate, the-catalogue
decisions:
status: current
summary: The live authorship report now rejects generic and near-duplicate service bodies, and its frozen assertion change is filed as an unsigned candidate.
---
Done: T-4.6 red test first failed because `authoredBodiesReport` did not exist; after implementation `node --test tests/advanced-catalogue.test.js` — 6 pass, 0 fail. The live `authorshipReport()` reports 115 services and zero failures. Candidate amendment filed at `wiki/specs/close-everything/candidate-amendments/04-catalogue/AT-SHAPE-6.md`; frozen AT-SHAPE-6 was not edited. In flight: T-4.4 `node --test tests/catalogue-all-services.test.js` (still running; output redirected to `.context/t44-matrix.log`). Next: wait for the matrix, then run T-4.6's exact combined proof.
