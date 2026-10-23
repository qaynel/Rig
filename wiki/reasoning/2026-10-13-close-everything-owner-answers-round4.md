---
date: 2026-10-13
source: owner
topics: the-overhaul, what-rig-is, onboarding-flow, the-catalogue
decisions:
status: current
supersedes:
tags: grilling, scope, corpus, catalogue
summary: Owner's round-4 answers — config kept via the existing undo record; freeze the built catalogue contract AND bring every service to finished-product quality; the owner pointed back to the centralized .rig corpus design (2026-09-08, never merged), which the agent then found and brought onto this branch.
---

# Close-everything branch — owner answers, round 4

## Verbatim

> I think A looks good. Freeze what's built and make sure all the services are
> finished products, not half-ass nonsense. Don't you remember? I don't know
> why I have to say this again and again but there was a .rig. Just go
> through. I don't know if it's on this branch or some other branch but there
> was a .rig. There's a huge discussion about this .rig.
>
> Instead of bothering ourselves with 19 hosts we could have a centralized
> rig: this collection of resources where the agents can dynamically onboard
> rig components onto the projects, given what the circumstances were. Do you
> remember all of this? Just go check on GitHub or somewhere, anywhere, I think
> on the multiple branches, and I'll just look that up. That was the original
> plan. I don't know what you're talking about.

## What this locks

1. **Lint-format replacement:** the user's old config is recoverable through
   Rig's existing undo record; no `.rig-backup` files. The drafted ranked
   tool lists and end-of-life signals are approved as written.
2. **Catalogue:** freeze the built contract, and every service must be a
   finished product — the "deeper per-service meaning" work is **in scope**,
   not deferred (supersedes the agent's round-3 recommendation).
3. **The centralized `.rig` design** the owner means is the 2026-09-08
   dynamic offboarding architecture: one canonical corpus; the onboarding
   agent renders host-native files (mechanical projector for known hosts,
   agent-written script for unknown ones). It lived only on the unmerged
   `explore-dynamic-offboarding-architecture` branch, which is why this
   branch's wiki did not show it. Its three traces and evidence are now
   brought onto this branch verbatim.

## Agent note

Per the 2026-09-08 brainstorm, building Phase 1 (corpus extraction +
`project(corpus, host)`) genuinely resolves RIG-125, RIG-132, and RIG-110
rather than closing them as replaced. Whether Phase 1 lands on this branch is
asked next.
