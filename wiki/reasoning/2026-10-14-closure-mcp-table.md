---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
summary: The unused host-capabilities MCP table reader is removed and the single-table proof passes.
---
Done: T-3.9; `node --test tests/mcp-one-table.test.js tests/path-b-mcp.test.js` — 8 pass, 0 fail. Removed the zero-caller `materializeSelectedHosts` reader and export; the existing candidate for the frozen AT-HOST-5 assertion is already filed. In flight: T-3.10. Next: verify runtime payload completeness.
