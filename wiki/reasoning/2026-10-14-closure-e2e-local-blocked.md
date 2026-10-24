---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: historical
summary: T-6.4 exact-SHA E2E cannot start because the required candidate commit is not cleanly available in this worktree.
---
Done: ran `node scripts/clean-install-e2e.js --sha 872954c260c9bc72c3b4e565ce4d68dda6f0e259 --out .context/e2e-evidence.json`; exit 1 before E2E setup with `AssertionError: Commit final candidate bytes before exact-SHA E2E`. The worktree contains numerous unrelated pending changes, so the candidate SHA cannot be prepared as a single-task commit here; no local evidence artifact was produced. T-6.4 remains open. In flight: T-6.5. Next: exercise the two deliberate-breakage cases in isolated disposable copies and record each result.
