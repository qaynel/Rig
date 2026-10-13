---
date: 2026-10-13
source: agent
topics: onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: corpus, sandbox, trap
summary: Follow-up to the 03 slice 3 trace — the reserved-path guard for projection-script outputs was case-sensitive (.GIT, .Rig, .ENV, Node_Modules, NTFS trailing dot/space bypassed it); now case-insensitive, rejects dot/space-suffixed components, and apply re-checks each output's real parent against the real .rig/.git.
---

# 03 slice 3 follow-up: reserved-path guard bypass

Coordinator security finding on `rig/lib/projection-script.js`. Red first
(`tests/projection-script.test.js`: `.GIT/config`, `.Rig/x`, `.ENV`,
`Node_Modules/x`, `.git./config`, `.git /config`, symlinked parents). Fix:
`RESERVED` is matched case-insensitively; any component ending in a dot or
space is rejected; `assertOutputOutsideProtected` resolves the nearest existing
ancestor with `realpath.native` (case aliases and symlinks) and refuses when it
lands in the real `.rig` or `.git` or outside the repository; it runs in both
apply preflights (before and after the script runs). The slice 3 trace body is
immutable, so this note stands in for the requested edit to it.
