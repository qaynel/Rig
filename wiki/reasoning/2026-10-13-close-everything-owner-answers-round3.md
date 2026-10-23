---
date: 2026-10-13
source: owner
topics: the-overhaul, what-rig-is, onboarding-flow
decisions:
status: current
supersedes:
tags: grilling, scope, host-portability, trap
summary: Owner's round-3 answers — the agent re-raised per-host live proof across 19 hosts despite the locked one-.rig/-source decision (grilling B4); owner corrected it. Never-started items close on GitHub and move to a redesign backlog page; this branch enforces everything and finishes all half-built work into a shippable product.
---

# Close-everything branch — owner answers, round 3

## Verbatim

> Didn't we agree on a centralized rig repository which any agent can onboard
> onto or something like that? Why are you still obsessed with that, obsessed
> with 19 hosts and all, right? Why? I thought we had a .repo repository which
> had everything. Why are you bringing this up again?
>
> Just leave them with the redesigned tag. Make them just close them on GitHub
> and list them in the redesigned backlog. On this branch just enforce
> everything. We'll finish up everything that is half-built and then have a
> shippable product at the end.

## The agent's error

The round-2 question asked which of 19 hosts must be live-proven. That
contradicts the owner's locked answer B4 (2026-09-04 grilling): host
portability is kept by giving the user's own onboarding agent one general
`.rig/` source and letting it generate host-specific files — not by
hand-maintaining or hand-proving each host. The 19-host registry in the
installer and README is legacy surface, not the product promise.

Trap: never frame scope, tests, or support claims per host. (The traps index is at its row waiver, so this lives here and in agent memory.)

## What this locks

1. **Per-host live proof (RIG-110) is replaced** by B4: one `.rig/` source,
   proven once by the clean-install E2E; host files are the onboarding agent's
   projection. Docs that advertise a 19-host matrix are coherence defects.
2. **Never-started items** (RIG-116, 122, 130, 133, 156): close on GitHub with
   a `redesign` label and list on one redesign-backlog page with the reason.
3. **This branch enforces everything** and finishes all half-built work.
   Agent's reading of "enforce everything" for the AI-SDLC standards: build and
   enforce them on this repo and ship the same proven set inside `.rig/`
   (round-2 "generalize that to the rig and ship that with the rig"). Declared
   for correction at spec review.
