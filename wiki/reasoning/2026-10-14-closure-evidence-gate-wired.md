---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
summary: The coherence check now invokes the executed proving-test evidence gate.
---
Done: T-7.5; `node --test tests/coherence.test.js` — 4 pass, 0 fail. `scripts/check-coherence.js` now runs `scripts/check-test-evidence.js`; the integrated command reports 7 existing non-passing ticket references (RIG-149, RIG-120) plus RIG-155/RIG-156 pending GitHub issues and missing `docs/install.md`. These findings remain visible; unrelated tickets/tests were not changed. In flight: T-7.6. Next: verify CLAUDE/GEMINI standards and SOP links without duplicate restatement.
