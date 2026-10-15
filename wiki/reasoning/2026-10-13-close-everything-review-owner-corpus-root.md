---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, corpus
summary: Owner chose one new root for the canonical Rig corpus; the proposed plan uses rig/corpus/.
---

# Close-everything review — corpus location decision

## Owner message, verbatim

For the single corpus, put all canonical resources under one new root, which makes the source clear but moves files, or designate today’s source folders as the corpus, which reduces moves but spreads it across locations? I recommend one new root.
One new root (recommended)

## Consequence for the proposed plan amendment

Use `rig/corpus/` as the new canonical root already sketched by the plan.
Generated projections read this authority; migration and frozen-path changes
remain explicitly enumerated. The corpus holds third-party fetch metadata,
following the owner's preceding fetch-during-onboarding decision.
