---
date: 2026-10-14
source: agent
topics: the-overhaul, onboarding-flow
decisions:
status: current
summary: The runtime payload proof passes and the documented Rig router now resolves on native hosts.
---
Done: T-3.10 — `node --test tests/rig-bootstrap.test.js` passed (12/12); `node --test tests/corpus-projection.test.js` passed (58/58); `node --test tests/rig-bootstrap.test.js tests/corpus-contract.test.js tests/path-b-onboarding.test.js` passed (27/27); `node scripts/project-repo.js --check` reported 40 generated files reproducible. Added the canonical router to the corpus and aligned the non-frozen bootstrap reachability assertion with the repository-owned signer file. In flight: T-2.9 local CI workflow. Next: repair coherence and exact-SHA E2E blockers.
