---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, trust-and-failure-boundaries
decisions:
status: current
summary: Missing tools, unsupported native inputs, and command failures now return named non-passes with setup guidance.
---
Done: T-4.8 red-first `node --test tests/catalogue-installed.test.js` exposed missing tool, unsupported input, and runner failures without the required classifications/guidance. After fixes, `node --test tests/catalogue-installed.test.js` — 8 pass, 0 fail; `node --test tests/guarantee-coverage.test.js` — 37 pass, 0 fail. Configuration-only Kubernetes checks retain an explicit validation ceiling and make no live-infrastructure claim. In flight: T-4.9. Next: add grade-growth, dependency-slice, and mixed-ID cases.
