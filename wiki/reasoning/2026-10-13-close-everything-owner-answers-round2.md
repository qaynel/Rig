---
date: 2026-10-13
source: owner
topics: the-overhaul, agent-working-conventions, testing-strategy
decisions:
status: current
supersedes:
tags: grilling, scope, production-level
summary: Owner's round-2 answers — heavy production upkeep with AI-SDLC standards generalized into Rig itself; depth = fix+test per item, real-download clean-install E2E folded into the test suite, user docs, security and code-review pass, plus a cross-codebase coherence sweep; owner-gated items get specs for one batched sign-off; half-built/buggy/open items are cleared now, never-started items wait for the redesign.
---

# Close-everything branch — owner answers, round 2

## Verbatim

> I think C should be because I think it would have gains in the long run. Say
> if we have clear standards for AI SDLC, we can generalize that to the rig and
> ship that with the rig also. I think that seems like a good way forward. I
> think it would give returns in the long run
>
> - Item has a fix and a test that proves it.
> - Fresh install, run end-to-end, real downloads, all of that needs to be
>   tested. That can be rolled into the test.
> - Fresh install and end-to-end testing can be rolled into the test.
> - User-facing docs, clean security, and code review pass.
> - On top of that there needs to be a coherence check so that, say, one part
>   of the codebase is not out of sync with the other. That could be a
>   horizontal sweep so coherence check and all need to occur.
>
> Yeah just provide. If the specs already don't exist, we can write up the
> specs and then I can sign everything off in one go. Do that and then they owe
> the same amount of production-level quality that needs to occur, right?
>
> Anything that is not work has not been started. Right now I'll deal with
> them later. Right now what is half-built, what is buggy, and whatever open
> issues we have, I want to clear all of them so that I can then just start off
> with a clean slate when I start, in terms of, say, planning. I also want to
> have a clear idea of the vision.
>
> What I want is to close out everything and have a coherent product in this
> to ship to QA and then prod, so that there's something usable that the user
> actually uses (something tangible, like a toy or something like that). Later
> on I can iterate on that.

## What this locks

1. **Upkeep level: heavy.** Scheduled health sweeps, release discipline,
   dependency-drift checks — and the AI-SDLC standards become something Rig
   ships, not only something this repo follows.
2. **Depth acceptance (every item):** fix + proving test; real-download
   clean-install E2E as part of the suite; user-facing docs match the product;
   security pass; code-review pass; **coherence sweep** (no part of the
   codebase/docs/trackers out of sync with another).
3. **Owner-gated items:** agent writes missing specs + tests; owner supplies
   approvals in one batched sign-off; same production bar as everything else.
4. **Scope rule:** half-built, buggy, or open-and-started → cleared on this
   branch. Never started → deferred to the owner's redesign.
5. **Goal:** a coherent, tangible, usable product shipped to QA then prod; a
   clear statement of the vision as shipped.

## Classification under rule 4 (agent, from the reality audit)

- **Clear now:** RIG-127.11, 127.12, 145, 146, 147, 155, 135.1/.2/.3 (bugs);
  RIG-125, 132 (partly landed); RIG-112 (mechanical gate built, freeze
  pending); RIG-113 (designed, approval pending); RIG-110 (host proofs — overlaps
  the clean-install E2E).
- **Never started → redesign:** RIG-116, 122, 130, 133, 156.
