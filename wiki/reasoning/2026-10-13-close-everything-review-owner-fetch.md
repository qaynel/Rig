---
date: 2026-10-13
source: intent owner
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, decision, third-party-skills
summary: Owner chose fetching third-party skills during onboarding for this release; pinned vendored copies are not the selected delivery approach.
---

# Close-everything review — third-party delivery decision

## Owner message, verbatim

Rig includes pinned third-party skills. Keep those copies for this release so installation works offline, or fetch them during onboarding, which needs network access and supply-chain checks? I recommend keeping the pinned copies and considering fetching during the redesign.
Fetch during onboarding

## Consequence for the proposed plan amendment

Record upstream locations, pinned revisions and integrity expectations in the
central corpus. Fetch selected third-party resources during onboarding, retaining
licences and provenance. Fail clearly on unavailable or invalid downloads;
do not execute fetched bytes before proposal approval. Specify how locally
required browse-runtime fixes are applied to the pinned upstream content.
This is a delivery change, not permission to drop required functionality.

The remaining five owner questions are unresolved. The next question asks
whether the central corpus uses one new root or existing source folders.
