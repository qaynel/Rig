---
date: 2026-10-19
source: agent
topics: the-overhaul, testing-strategy
decisions:
status: current
supersedes:
tags: qa-closeout, verification
summary: Service authorship failures are corrected; installed lint grades and the owner amendment candidate have focused proof, with architecture and final-byte checks still open.
---

The catalogue worker reports correction of the 16 earlier authorship failures and 13/13 focused semantic tests, including the red-team metadata. A duplicate long service-matrix run was stopped; results from moving bytes are not final evidence. The active corpus must freeze before the owner amendment's catalogue digest is finalized.

The lint-grade worker extracted one small projected evaluator and wired the installed check path through it. A disposable install exercises the local Policy gap/review-request, operator-provided Context review, and Evidence replay receipt. Its focused run passed 49/50; the one older editable test expected a no-target call to execute, which now correctly returns a gap. That regression is being updated with a real target. A later integration review found an ordinary nonzero command exit was being labelled a gap instead of an observed Policy failure, and the grade worker is correcting that mapping while preserving actual exit status. The historical parallel lint install/uninstall and CI seams are still under review.

The unsigned owner patch now includes release/corpus/host/grade corrections, signer namespace enforcement, and stronger previously thin acceptance cases. The candidate agent reports 15 selected advanced cases, four verifier cases, and four install cases passing in an isolated copy, with all 16 manifested hashes internally matching. The final active-corpus pin and full candidate verification wait for settled bytes. No frozen worktree file, signature, review counter, remote branch, or PR has been changed by these candidate checks.
