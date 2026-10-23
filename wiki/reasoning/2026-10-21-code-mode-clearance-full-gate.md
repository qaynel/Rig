---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-clearance-fixes
tags: review, remediation, verification, full-gate
summary: The signed-oracle full npm test gate passes after the missing-tool and signed-fixture corrections; the 18 finding rows remain open where their individual adversarial proof is incomplete.
---

After rebuilding the generated wiki indexes, the complete `npm test` command
passed against the current worktree. It verified the Gate 1 oracle (16 files,
95 cases), passed all 1,193 main Node test cases with 1,191 pass and two
platform-specific skips, then passed all 15 Pi-extension tests and all six
MCP tests.

The direct regressions also passed independently:
`node --test tests/catalogue-installed.test.js tests/rig-bootstrap.test.js`
passed 25/25. This covers the missing external tool classification before
sandbox wrapping and a real fixture SSHSIG on the bootstrap apply path. The
earlier 34/34 coherence, wiki-index and wiki-budget run passed after the wiki
index rebuild.

This clears the failures in the user's captured full run. It does not by itself
close the October 21 review: the 18-row acceptance ledger stays open until the
remaining per-finding adversarial cases and exact candidate-bound evidence are
reviewed and recorded.
