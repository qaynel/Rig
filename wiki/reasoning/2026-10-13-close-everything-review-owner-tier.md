---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, compatibility
summary: Owner chose to remove tier wording now while retaining the existing install flag's validation and behavior for one release.
---

# Close-everything review — tier wording decision

## Owner message, verbatim

The installer still uses the old “tier” wording. Remove that wording now and keep the existing flag working for one release, or leave both until the redesign? I recommend removing the wording now while keeping the flag’s validation and behavior compatible.
Remove wording; keep compatible flag (recommended)

## Consequence for the proposed plan amendment

Remove tier terminology from active user-facing prose. Retain `--tier 1` as a
compatibility alias for one release, preserving rejection of unsupported values
and existing runtime/approval behavior. Do not interpret arbitrary tier values
as permission to install additional capabilities.
