---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: current
supersedes: 2026-10-21-code-mode-finding-remediation-progress-8
tags: review, remediation, verification
summary: Focused suites pass but the full npm gate is red on protected unsigned fixtures and other baseline paths; all eighteen findings remain open.
---

The focused guarantee-coverage suite passes 44/44 tests. The focused trust-root,
catalogue and apply suites pass 42/42, including shared journal parser checks.
The Gate 1 oracle, wiki index/budget checks and diff whitespace check pass.

The full `npm test` run fails during its main Node test suite. Failures include
public apply callers whose fixture helper still creates unsigned approval,
plus baseline install/graft, host coverage, reporting, history-scan, copy-check,
scope and installed onboarding cases. The helper is included in the frozen
Gate 1 file set, so this remediation did not edit it or weaken signature
verification to satisfy it. Pi-extension and MCP test commands were not reached.

The candidate is not acceptance-complete. All eighteen rows stay open, and no
binding review was attempted. The acceptance checklist now records the exact
focused results and the red full-gate status. Findings 4, 8, 15 and 16 have
partial behavioral evidence only; several other rows have changes in the dirty
worktree but lack the adversarial and installed-entry proof their criteria
require.

Next: reconcile the unsigned public-apply fixtures through an owner-authorized
Gate 1 amendment, then fix and verify the remaining findings and rerun the
entire gate on final bytes. Keep criteria and reviewer status open until then.
