---
date: 2026-10-18
source: review
topics: the-overhaul, review-receipts
decisions:
status: superseded
supersedes: 2026-10-18-review-received-renewed-review-start.md
tags: review, verification, release-gate
summary: Renewed review withholds approval for temp-entry deletion and corrupt record publication; MCP retry passes real-npm verification and source-archive wording needs correction.
---

The uncommitted follow-up candidate over 082d8467504d51aeda4ad955e78ee33c67ba548a remains changes-required. Pinning directories closes ancestor substitution but does not bind source entries. Two independent reviewers reproduced unrelated regular-file deletion immediately before Python directory-relative unlink; the primary reran the standalone probe and confirmed public migration reports migrated after deleting the replacement. A second public-flow case replaces the temp immediately before hard-link publication: migration publishes unrelated bytes, refuses, then refuses migration-corrupt on retry. Findings 17 and 21 now specify exact boundary regressions and preservation/recovery criteria. The source-archive wording still says optional trees do not ship although tracked reference trees occur in the source archive; Finding 19 has a narrow correction criterion.

Primary focused migration/docs/catalogue tests pass 58/58. A separate primary real-npm interrupted-upgrade test passes 1/1, including installed server handshake and rig_instructions. The retained full npm log reports main 1,109 pass/two skipped, Pi 15/15, MCP 6/6; this review did not rerun that full gate and its review-document changes require renewed final-byte evidence. Oracle, versions, coherence and rule copies pass; wiki index/budget/size checks passed before report edits and are regenerated/rechecked after them. No additional confirmed MCP recovery or Python portability finding remains. A pre-existing FIFO blocking risk is outside this fix delta and is not a new approval finding.

Review Received is updated in .context/review-received.md. The acceptance handoff reopens overall resolution and final-byte full-suite criteria; final candidate freeze, exact-commit evidence, binding receipt, owner delivery, branch protection verification and independent approval remain open. Read-only GitHub lookup confirms PR 153 is OPEN/BLOCKED at ba371b641e3dc6b245d94acaa1a29a882011a8ec. No code/frozen artifact changes, commit, push, GitHub write or binding review attempt occurred. The saved wrapper state remains author context v6.0.0-qa-readiness-2026-10-17, failures 1.
