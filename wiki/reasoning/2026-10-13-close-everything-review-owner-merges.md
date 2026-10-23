---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, catalogue-compatibility
summary: Owner permits proven duplicate services to merge with written reasons and compatibility for existing selections, reducing the count below 115 while preserving capabilities.
---

# Close-everything review — duplicate services

## Owner message, verbatim

If two catalogue services prove to cover the same practice, may they merge with a written reason and compatibility for existing selections, reducing the count below 115? I recommend allowing proven duplicates to merge; keeping every identity avoids migration but leaves duplicate offerings.
Allow documented merges with compatibility (recommended)

## Consequence for the proposed plan amendment

Only proven duplicates may merge, with a written reason and compatibility for
existing selections. The published count may fall below 115; preserve the
original capabilities, resolve old IDs and migrate dependency/receipt state.
Tests cover old selections, mixed old/new references, grade ceilings and
dependency slices. No merge is implied merely by similar wording.

The remaining question is the QA-to-production promotion bar. The original
review report's earlier open-tool and open-merge questions are now resolved by
this and the preceding owner-tools trace; its body remains immutable.
