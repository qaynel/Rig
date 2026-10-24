---
date: 2026-10-18
source: agent
topics: distribution-and-release, testing-strategy, review-receipts
decisions:
status: historical
supersedes:
tags: review, migration, recovery
summary: Findings 17 and 18 now have durable regressions and root-cause fixes; active design and clean-install documentation match the current release model, with final verification underway.
---

The renewed review of candidate 082d8467 exposed two boundaries outside the
earlier migration tests. Migration publication could stat an external file
after `.rig` was replaced by a symlink, then delete that file as cleanup. The
safe response is to retain a published migration record on refusal for resume,
not to unlink through a pathname whose parent may have changed. An editable
regression swaps the parent immediately after the real hard link and checks a
mode-0640 external sentinel and inventory.

The public upgrade could finish migration and erase its recovery record before
recording the requested MCP setup. Bootstrap now journals the setup-pending
marker before migration for emitting hosts when `SETUP_MCP=1`; after an
interruption, the current-install retry path validates ownership and digest and
completes setup. The editable public-bootstrap regression exits immediately
after successful migration and retries the same request, then launches the
installed descriptor and calls `rig_instructions` over MCP.

The working technical design and clean-install interface documentation were
also corrected. Current 6.0.0 delivery stages zero optional third-party trees,
projects nine mandatory native entry skills, and carries pinned upstream
metadata for approved onboarding fetches. Default `--sha` evidence downloads
the GitHub archive and compares its extracted tree with the source commit;
explicit `--artifact` remains local evidence and `--tag` remains a later
post-publication smoke test. An editable docs test prevents the retired shelf
and local-archive claims from returning as live policy.

Focused regressions and the signed oracle check have passed so far. The complete
migration suite, real-download interrupted-upgrade variant, exact-candidate
E2E, generated wiki checks, and full `npm test` remain in flight. No push,
approval, binding review receipt, or merge action is part of this work.
