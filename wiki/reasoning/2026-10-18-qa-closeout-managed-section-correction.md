---
date: 2026-10-18
source: review
topics: the-overhaul, review-receipts
decisions:
status: superseded
supersedes: 2026-10-18-qa-closeout-review-progress.md
tags: review, correction, acceptance
summary: Edited managed bodies are intentionally removed under the signed contract; retract the proposed code defect and correct contradictory live documentation instead.
---

The progress checkpoint's proposed managed-section uninstall defect is retracted. Signed acceptance AT-PB-2 explicitly requires removing recorded managed capabilities even when their bodies were edited, while preserving edits outside those sections. Business specification risk D11 expressly accepts loss of edits inside the Rig-owned range. The disposable graft probe therefore demonstrates expected behavior; its failing assertion encoded the wrong expectation and must not be promoted into a regression test or used to change implementation. This review leaves all signed artifacts untouched.

The live install/removal hub instead says an edited managed body survives as best-effort preservation. That claim is wrong under the signed contract and belongs in the consolidated current-guidance documentation finding. The rest of the broad review continues; accepted behavior is removed from the active code finding list immediately rather than sent to the fixing agent.
