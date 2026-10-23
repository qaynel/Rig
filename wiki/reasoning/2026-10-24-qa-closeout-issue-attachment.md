---
date: 2026-10-24
source: agent
topics: delivery-plan
decisions: []
status: current
supersedes:
tags:
summary: PR #153's closing keywords never attached; each closeout issue now has QA-SHA evidence, and PR #157 carries the keywords into prod.
---

# Attaching the v6.0.0 closeout issues after the QA merge

The owner asked to finish the GitHub bookkeeping the QA merge left behind, resolve the `qa-prod` / `prod` conflicts, and update the docs before deployment.

PR #153 merged to `qa-prod` as `0256c663`. Its body lists `Closes` for #41, #44, #65, #66, #67, #69, #70, #78, #79, #80, #108, #109, #110, #151, #154, #155, and #156, plus #127, #130, and #138 as evidence closures. `prod` is the default branch, so those keywords did not attach and every one of those issues stayed open. `closingIssuesReferences` on PR #153 is empty.

PR #157 (`qa-prod` → `prod`) was open with an empty body, the title of an older catalogue PR, and a conflict. The conflict was `prod`'s three commits after the shared base: the catalogue PR that `qa-prod` had already superseded, and the Gate 1 fingerprint pin that `qa-prod` already contained. The only unique pages were the 2026-08-30 process traces. Those are kept, with historical frontmatter, so they do not reappear as current work. The merge commit is `683fbc00`.

Each delivered issue now has a `[rig-qa-attach:…]` comment naming `0256c663` and the proving test that exists on that commit. #125 and #126, already closed, have the corrective evidence comments their stale threads were missing. The five redesign issues (#42, #43, #62, #63, #152) have deferral comments and stay out of the closing list, so a production merge cannot mark them completed. PR #157's body carries the delivered `Closes` keywords. Issue state stays open until that pull request merges, which is when GitHub can actually close them. The post-tag not-planned closure for the redesign five is unchanged.

Prepared close commands in `wiki/specs/close-everything/github-actions-pending.md` now cite the test titles on `0256c663`. The earlier #108, #109, and #130 titles did not match the suite.
