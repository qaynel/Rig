---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: current
summary: T-3.10 remains open after its named bootstrap proof reproduced two failures twice.
---
Done: ran `node --test tests/rig-bootstrap.test.js` twice; both runs ended `tests 12`, `pass 10`, `fail 2`. Exact failures each time: `AssertionError: .rig/allowed-signers should exist after install` and `AssertionError: .claude/skills/rig/SKILL.md must exist after --hosts claude install (routing.md fallback names 'rig')`. Per executor rule, stopped T-3.10 without changing code or ticking the box. In flight: T-4.5. Next: run its named proofs after reading subplan 04.
