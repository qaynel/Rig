---
date: 2026-10-17
source: agent
topics: [delivery-plan]
decisions: []
status: historical
summary: PR #153 now closes 17 GitHub issues; three branch themes with no ticket got RIG-157/158/159 (GitHub #154-#156).
---

# Attaching issues and tickets to the v6.0.0 closeout branch

The owner asked to attach every GitHub issue the branch resolves and to create
tickets for anything it closes that had none.

- **Attached to PR #153 as "Closes":** #41, #44, #65, #66, #67, #69, #70, #78,
  #79, #80, #108, #109, #110, #151 (every board card whose disposition is "FIX on
  this branch"), plus the three new issues below. #127, #130, #138 shipped
  earlier and close by evidence, so they are not linked.
- **New tickets:** RIG-157 (QA-to-production promotion gate and weekly health,
  GitHub #154), RIG-158 (coherence and test-evidence checks, #155), RIG-159
  (AI-SDLC and delivery standards in the corpus, #156). Each has a ticket file, a
  board card and a `tracker-transitions.json` entry, state `open` until the
  commit reaches QA.
- **GitHub writes** used the owner's keyring login: the session `GH_TOKEN` is an
  integration token that cannot create issues or edit PRs. Owner approved this.
- The PR targets `qa-prod`, so GitHub's closing keywords do not fire on merge;
  issues are closed by hand with evidence after QA delivery, per subplan 01.
