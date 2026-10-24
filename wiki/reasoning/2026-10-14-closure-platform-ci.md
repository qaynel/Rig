---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: Focused process cleanup checks now cover Linux, Windows, and macOS CI runners.
---
Done: added a macOS process-cleanup job alongside the Linux and Windows jobs in `.github/workflows/browse-process-cleanup.yml`; local `RIG_REQUIRE_PROCESS_CLEANUP=1 node --test tests/browse-cookie-import-descendants.test.js tests/browse-skill-spawn-descendants.test.js` passed 5/5; Ruby YAML parse passed. In flight: pushed runner results. Next: exact candidate CI after freeze.
