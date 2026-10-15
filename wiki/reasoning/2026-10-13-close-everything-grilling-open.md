---
date: 2026-10-13
source: agent
topics: the-overhaul, agent-working-conventions
decisions:
status: current
supersedes:
tags: grilling, in-flight
summary: Grilling opened for the owner's "close every open issue" branch — two axes (horizontal: every item spec'd and closed; depth: end-product finish), inventory taken, first question round sent; no code or tracker state changed yet.
---

# Close-everything branch — grilling opened

## The ask (owner, 2026-10-13, paraphrased faithfully)

This branch should close every existing issue, ticket, and GitHub item. Two
axes are maintained separately: a **horizontal** pass that touches everything,
then a **depth** pass that brings everything to final end-product finish.
Process: the agent asks questions on the overall idea and recurring themes,
then asks the owner what level of production maintenance they want. Everything
is spec'd with clear acceptance criteria first, documented and standardized,
then shipped verifiably to QA (`qa-prod`).

## Inventory at start (HEAD 051a819c)

- **GitHub open issues: 17.** RIG-154 (#138), RIG-153 (#130), RIG-150 (#127),
  RIG-147 (#110), RIG-146 (#109), RIG-145 (#108), RIG-127.12 (#70),
  RIG-127.11 (#69), RIG-110 (#67), RIG-112 (#66), RIG-113 (#65), RIG-116 (#63),
  RIG-122 (#62), RIG-125 (#44), RIG-130 (#43), RIG-133 (#42), RIG-132 (#41).
- **Open PRs: 0.**
- **Board-only open items** (no open GitHub issue): RIG-155, RIG-156.
- **Tracker drift found:**
  - RIG-148 / RIG-149 are OPEN on the board but CLOSED on GitHub (#125, #126).
  - RIG-154 / RIG-153 / RIG-150 sit in the board's Done lane but are OPEN on GitHub.
  - Done-lane cards are unchecked `- [ ]`.
  - RIG-122 appears twice on the board.
- **Overhaul workstream:** design filed 2026-09-04, nothing implemented; five
  open owner decisions (first non-owner user, has anyone else run Rig, the
  onboarding-vs-signing priority swap, deletion-pass veto, markdown-only
  doctrine correction) gate everything past slice 1.
- **Path B hardening:** memory snapshot from 2026-09-01 shows a 6-task plan
  half done; oracle re-sign was the blocker. Needs verification against the
  branch before it is counted as open or closed.

## In flight

First grilling round sent to the owner: scope of "everything", what "close"
may mean (fix vs. closed-with-reason), how re-signing frozen tests is batched,
and how the work ships to QA. Production-maintenance level is asked next, per
the owner's ordering.

## Next

Record answers verbatim in a follow-up trace; then build the per-item spec
table (item → horizontal acceptance → depth acceptance) and route through
product design.
