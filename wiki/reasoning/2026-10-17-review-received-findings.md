---
date: 2026-10-17
source: review
topics: the-overhaul, review-receipts
decisions:
status: historical
supersedes: 2026-10-17-review-received-request
tags: review, trap
summary: Final report-only review withholds QA approval for migration write-through, skipped MCP setup, omitted macOS eligibility proof and dropped network warnings; CI and candidate freeze remain red.
---

The owner's requested Review Received review covers PR #153 at
ba371b641e3dc6b245d94acaa1a29a882011a8ec against origin/qa-prod, plus the
uncommitted documentation correction inventory. Three independent report-only
reviewers covered spec/scope, correctness/safety and architecture; the primary
reviewer checked tests and evidence and independently reproduced the runtime
findings. No implementation fix was applied during review.

Confirmed findings:

- High: rig/lib/migrate.js:310–312 writes through a pre-existing
  .rig/migration.json.tmp symlink and truncates an outside file. Reproduced
  twice with disposable targets; there is no race requirement. Existing tests
  protect final and parent paths but miss the temporary sibling.
- High: rig/bootstrap.sh:126 exits after migration before requested MCP setup
  and OpenClaw registration. A v5-shaped active upgrade exits zero without the
  MCP descriptor or SDK. Existing migration comparisons omit this setup too.
- High: .github/workflows/release-eligibility.yml:40 requires Ubuntu health
  only and never calls the Linux/macOS E2E workflow. It can emit pass without
  the exact-SHA macOS install proof required by the clean-install subplan.
- Medium: rig/lib/check-runner.js:329 drops diagnostics after successful named
  and component checks. The compatibility-mode undeclared-network warning is
  present for equivalent bare bindings and missing for named ones.

Both current-head CI runs fail generated wiki-index equality. The corrected
local index passes, but the documentation work remains uncommitted. Fresh
oracle, wiki, size, version, coherence, rule-copy and whitespace checks pass,
as do 17 focused deployment/health/index tests. The deployment checker stops
at candidate freeze. No full gate or exact-SHA install is claimed on new bytes.

The binding review attempt state remains at one failure, unchanged. Branch
protection cannot be inspected with the current token (HTTP 403). The connected
GitHub account also owns the PR, so it cannot submit an APPROVE event. Review
Received is prepared as a COMMENT review with approval withheld, not a binding
release receipt. The full report and raw logs are in ignored .context files.

Next: report these findings on the PR, fix them in an implementation task,
freeze and commit the complete candidate, renew exact-byte evidence, and obtain
an independent eligible approval before QA merge. No push or merge was performed.
