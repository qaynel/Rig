---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, release
summary: Owner chose automated checks only for QA-to-production promotion; checks and clean-install evidence must describe the exact QA commit, without a manual outside-repository install prerequisite.
---

# Close-everything review — production promotion

## Owner message, verbatim

Before promoting QA to production, require a green health run on the exact QA commit plus one real install in an outside repository, or use the automated health and clean-install checks alone? I recommend adding the outside-repository install; it takes a manual run but checks real onboarding beyond our fixtures.
Automated checks only

## Consequence for the proposed plan amendment

Production promotion uses successful automated health and real-download
clean-install checks for the exact QA commit. A manual install in an outside
repository is not a prerequisite. Explicit-ref validation covers QA rather
than relying on an older default-branch scheduled run. Preserve existing full
gate, signature, coherence and fresh review evidence; promote the checked
commit rather than a newer unverified head.

All six owner decisions in the reviewer handoff are now answered.
