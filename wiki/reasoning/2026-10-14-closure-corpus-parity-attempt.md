---
date: 2026-10-14
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: The first corpus parity run exposed unlisted active-runtime path changes and a fixture that left its generated evidence ledger behind.
---
Done: T-2.8 is green. First T-3.7 proof, `node --test tests/corpus-projection.test.js tests/migrate-v5.test.js`, failed with 54 tests failing: shelf and runtime path differences were not all enumerated, and two migration inventory checks retained `.rig/evidence-artifacts.json` after removing the session report. In flight: rerunning T-3.7 with explicit path-family reasons and paired evidence cleanup. Next: tick T-3.7 only if the complete command passes.
