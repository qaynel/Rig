---
date: 2026-10-13
source: owner
topics: the-overhaul, what-rig-is, onboarding-flow, the-catalogue, agent-working-conventions
decisions:
status: current
supersedes:
tags: grilling, corpus, catalogue, harness
summary: Owner's round-5 answers — build the central Rig corpus on this branch; all 115 services come from the corpus; the agent unpacks everything with clear onboarding instructions; the owner asked that settled decisions be kept at the forefront, so a North star block now heads the agent instruction files and memory.
---

# Close-everything branch — owner answers, round 5

## Verbatim

> Build it over here and all of those 115 services should come from the rig
> corpus so that we don't bother ourselves with 19 agents. Why are we having
> this discussion again? Honestly you need to change your internal harness.
> You need to make that a point.
>
> Why? I see myself repeating the same thing again and again and again. I
> forgot it, you forgot it, and then both of us are in deep, deep trouble.
> This is very bad. We should not be doing this. You should keep this at the
> forefront. This is getting frustrating at this point. Get that into shape.
> It is honestly frustrating at this point.
>
> Keep yourself up to date with all of the things. Keep everything centralized
> to the Ric corpus and expand from there. Let the agent unpack everything with
> clear instructions for the agent to onboard everything. We discussed all of
> this. I might be forgetting a bunch of points

## What this locks

1. **Build the central corpus on this branch** (2026-09-08 design). RIG-125,
   RIG-132, RIG-110 become Fix, not Replaced.
2. **All 115 services live in, and are delivered from, the corpus.**
3. **Onboarding:** the user's agent unpacks everything from the corpus,
   following clear onboarding instructions shipped in the corpus.

## Harness change made in response

- A "North star" block of owner-locked decisions now heads `CLAUDE.md` and
  `GEMINI.md`, with a rule to add new owner decisions there in the same
  change. `AGENTS.md` gets a pointer on its routing line only, because its body
  is the canonical rule text copied into six shipped host rule files; the
  agent primer points at the block first.
- The retired markdown-only doctrine was removed from `CLAUDE.md`, `GEMINI.md`,
  and the product hub (owner had retired it 2026-09-04, B2). The same stale
  line in `AGENTS.md` and its six shipped copies is corrected during the
  corpus build (D9), where those copies become generated projections.
- Agent memory carries the same list as its first entry.

## Stranded-decision sweep

Every remote branch, local branch, and sibling worktree was diffed for wiki
files absent from `qa-prod`. Only the 2026-09-08 corpus design (three traces
plus evidence) was stranded; it is now on this branch. The remaining
differences are an intentionally superseded tier-taxonomy archive and one
pre-generator status snapshot. An untracked `inspo/` folder in one worktree
holds third-party reference repositories, not decisions.
