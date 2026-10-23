---
date: 2026-10-19
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, verification
summary: All maintained migration, host-contract, optional-helper and health checks pass; the signed oracle verifier is restored while installed lint grade and authored catalogue work continue.
---

The combined migration, catalogue, and installed-catalogue run finished with 70 passes and two failures; all 48 migration cases passed. Both failures shared an in-flight release-gating fragment authorship mismatch, reduced from 16 earlier fragment findings as the catalogue work progressed. Separately, the host contract suite passed 15/15, and the optional helper plus health reporter suite passed 6/6. These runs are on a moving uncommitted tree and are diagnostic, not final candidate evidence.

An editable technical-spec traceability row accidentally lost the verifier's required ``test-file title`` shape while describing the pending host amendment. The two rows were restored to the exact current signed test titles. `node scripts/check-advanced-spec.js` again verifies 16 files and 95 cases, and wiki budget and diff checks pass. No frozen artifact was edited.

The local higher-grade lint code needs a small installed projection; `lint-grade.js` and its evidence writer are now copied with the installed check runner. The grade worker is testing that route and aligning it with the local API. The owner-only candidate patch is being assembled separately with all affected frozen hashes; no signing, binding-review retry, push, or PR approval has occurred.
