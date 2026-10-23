---
date: 2026-10-14
source: agent
topics: the-overhaul, testing-strategy, distribution-and-release
decisions:
status: current
summary: Weekly and manual QA health runs now have read-only execution and a separately permissioned issue reporter.
---
Done: T-8.3; `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/health.yml")'` — YAML parsed; `node --test tests/health-workflow.test.js` — 2 pass, 0 fail. Workflow includes weekly/manual/reusable QA refs, full gate, exact-SHA E2E, dependency audits and lockfile dry-runs, and wiki budget; only `report` has `issues: write`. Pure dedupe tests cover create/update by SHA and ignore pull requests/other labels. In flight: none. Next: WP9 T-9.1.
