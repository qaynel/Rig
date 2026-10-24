---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: historical
summary: Exact-SHA clean-install E2E cannot start while the shared checkout contains unrelated uncommitted work.
---
Done: T-6.4 attempted with `node scripts/clean-install-e2e.js --sha <HEAD> --out .context/e2e-evidence.json` — exit 1 before E2E setup: `AssertionError [ERR_ASSERTION]: Commit final candidate bytes before exact-SHA E2E`. The checkout contains pre-existing staged and unstaged release work, so I left it untouched and T-6.4 open. T-6.5 depends on a committed candidate artifact and cannot be meaningfully exercised on this dirty checkout. In flight: none. Next: prepare T-6.6's package-script candidate, then continue to independent WP7 tasks.
