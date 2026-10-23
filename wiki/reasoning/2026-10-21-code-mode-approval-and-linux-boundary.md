---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: superseded
supersedes: 2026-10-21-code-mode-gate-green-findings-open
tags: review, remediation, verification
summary: Added wrong-key and cross-repository apply rejection proof; removed Linux's broad read-only host-root mount; focused checks pass and the full gate is running.
---

After the owner signed the frozen Gate 1 amendment, the full `npm test` gate
passed with 1,192 main tests, two skips, 15 Pi tests, and 6 MCP tests. Two
stale sandbox-status assertions were corrected before that green run.

Additional closure work exercises the finding 1 trust boundary. A different
untrusted SSH key is rejected, and an otherwise valid Gate 1 signature from
repository A cannot authorize its matching plan in repository B. The direct
exported `applyPlan` seam rejects the cross-repository replay before target
writes. `node --test --test-name-pattern='apply trust root rejects'
tests/advanced-apply.test.js` passes 1/1.

Finding 5 review found that Linux bubblewrap mounted the full host root
read-only. The sandbox now begins with an empty root and explicitly mounts
standard runtime directories and the command's required runtime paths. The
repository and private scratch remain the only writable mounts. The
command-construction regression and macOS task sandbox tests pass 2/2; actual
Linux/bubblewrap execution remains unverified on this Mac.

The focused Gate 1 oracle cases for filesystem isolation, network denial, and
the explicit local-listener grant pass 4/4. A final full `npm test` run is in
progress after these code changes. The 18 acceptance rows remain open until
their full finding-specific proof and required review are complete.
