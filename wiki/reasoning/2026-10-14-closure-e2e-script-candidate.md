---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
summary: An unsigned test:e2e package-script amendment is ready while the pinned scripts remain unchanged.
---
Done: T-6.6 candidate filed at `wiki/specs/close-everything/candidate-amendments/06-e2e/package-scripts.md`; it proposes `node scripts/clean-install-e2e.js` and a matching owner-applied `wiki/gate1/package-scripts.json` update, with `npm test` unchanged. The package script and frozen pin were not edited, so T-6.6 remains open until the entrypoint is available. T-6.4 remains open on the dirty-checkout exact-SHA precondition; T-6.5 is dependent on a committed candidate archive. In flight: none. Next: WP7 T-7.5.
