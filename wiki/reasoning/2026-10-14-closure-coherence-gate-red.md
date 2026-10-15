---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
summary: The coherence check is exercised by the test suite and exposes unresolved release findings.
---
Done: T-8.2 integration added to `tests/coherence.test.js`; `node --test tests/coherence.test.js` — 4 pass, 1 fail (42 seconds). The failing gate reports pending RIG-155/RIG-156 issues, missing `docs/install.md`, and seven non-passing evidence references including RIG-149 and RIG-120. Candidate package-script pin filed at `wiki/specs/close-everything/candidate-amendments/08-coherence/package-scripts.md`; package scripts and frozen pin remain unchanged. T-8.2 stays open. In flight: none. Next: T-8.3 health workflow lint and issue-deduplication proof.
