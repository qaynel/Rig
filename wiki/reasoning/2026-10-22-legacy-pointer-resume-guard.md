---
date: 2026-10-22
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: current
tags: journal, graft, preimage, security
summary: Legacy-pointer migration now passes the stale-plan guard only when the live pointer normalization exactly matches a graft from its verified preimage.
---

The strict journal schema accepted the actual `append_managed` producer record;
the failure was in `resumablePointerGraft`, which required the current file
digest to equal the old applied managed-block digest before checking the
legacy-pointer case. The fix retains that digest check for the recorded
managed block and adds a narrow path for a live file without a managed block:
normalizing its pointer must exactly equal the canonical graft from the
hash-verified preimage. User edits outside the legacy pointer remain outside
that exact result and are rejected.

The named legacy-pointer migration test passes 1/1. Complete
advanced-graft plus journal/history/install-uninstall suites pass 48/48. No
frozen acceptance file or test changed in this fix.
