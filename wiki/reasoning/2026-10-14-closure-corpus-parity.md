---
date: 2026-10-14
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: historical
summary: The v5 parity inventory now accounts for corpus, standards, runtime, fetched-shelf differences and the migration uninstall round trip passes.
---
Done: T-3.7; `node --test tests/corpus-projection.test.js tests/migrate-v5.test.js` — 79 pass, 0 fail. Added explicit intended-difference path families for the removed default shelf and the active corpus/runtime payload; uninstall inventory cleanup removes the session evidence ledger paired with the generated report. In flight: T-3.8. Next: clear the live retired-source reference.
