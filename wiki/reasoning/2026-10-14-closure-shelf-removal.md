---
date: 2026-10-14
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: historical
summary: Optional shelf installation paths are removed, fetch metadata remains, and v5 parity plus migration round-trip proofs pass.
---
Done: T-3.12; `node --test tests/vendored-skills-install.test.js tests/upstream-shelf.test.js` — 4 pass, 0 fail. Removed the projection helper, shelf snapshot loading and host-projector calls; retained catalogue metadata and verified fetch behavior. T-3.7 was re-proved after these changes: `node --test tests/corpus-projection.test.js tests/migrate-v5.test.js` — 79 pass, 0 fail. In flight: T-4.4. Next: run the 115-service matrix alone, then author service guidance family by family.
