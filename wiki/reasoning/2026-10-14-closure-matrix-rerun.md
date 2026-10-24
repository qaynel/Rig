---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, testing-strategy
decisions:
status: historical
summary: The first service matrix had one stale-binding failure, while its isolated case passed and a second full run is underway.
---
Done: T-3.8 re-proved with `node --test tests/corpus-contract.test.js` — 8 pass, 0 fail. First T-4.4 matrix: 114 pass, 1 fail; `infrastructure.disaster-recovery.failover` reported `approved service bindings are stale`. Isolated reproduction: `node --test --test-name-pattern='infrastructure\.disaster-recovery\.failover' tests/catalogue-all-services.test.js` — 1 pass, 0 fail. In flight: second exact T-4.4 matrix run, output at `.context/t44-matrix-rerun.log`. Next: record the rerun and run the T-4.6 combined proof.
