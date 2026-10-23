---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, testing-strategy
decisions:
status: superseded
summary: Two full service-matrix runs each had one stale-binding failure in a different service, so T-4.4 remains open under the retry rule.
---
Done: T-4.4 first exact `node --test tests/catalogue-all-services.test.js` — 114 pass, 1 fail (`infrastructure.disaster-recovery.failover`: `approved service bindings are stale`). Second exact run — 114 pass, 1 fail (`development.documentation.adrs`: same error). Focused failover reproduction — 1 pass, 0 fail. After two full failures, T-4.4 is stopped and unticked. T-4.5 corpus contract — 8 pass; coherence remains red on RIG-155, RIG-156, and missing `docs/install.md`. In flight: T-4.6. Next: run `node --test tests/catalogue-all-services.test.js tests/advanced-catalogue.test.js` as its exact proof.
