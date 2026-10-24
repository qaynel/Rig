---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy, trust-and-failure-boundaries
decisions:
status: historical
summary: Wiki hubs were condensed and stale waivers removed without raising any budget.
---
Done: T-8.6; the initial proof found waiver-exceeded `testing-strategy`, `the-overhaul`, `trust-and-failure-boundaries`, and entry-path bytes; generated status/index were also stale. Condensed the historical overhaul and testing strategy hubs, shortened repeated trust-boundary wording, removed the two now-stale hub waivers, then rebuilt generated indexes. `node scripts/check-wiki-budget.js` — within caps and waivers; `node --test tests/wiki-budget.test.js tests/wiki-index.test.js` — 29 pass, 0 fail. In flight: none. Next: T-8.7 coherence sweep after the remaining WP9 docs and owner-only tracker steps.
