---
date: 2026-08-31
source: intent owner
topics: testing-strategy, onboarding-flow, what-rig-is
decisions:
status: current
supersedes:
tags: interdependency
summary: RIG-153 closed — the adaptation-measurement instrument (option A) is delivered and frozen; the re-baseline run (option B) is carved out as RIG-156, deferred and low-priority until Path A and Path B are fully decided.
---

# RIG-153 close-out — instrument done, re-baseline deferred as RIG-156

*Owner ruling in chat, 2026-08-31, after a grilling-gate context check on the
RIG-153 option-B handoff.*

## Context check that prompted the ruling

The option-B handoff ("run the frozen rubric, produce a post-fix adaptation
score against the +12/100 baseline") was pressure-tested for readiness. It is
not ready, for five distinct reasons:

1. **The target repo is not in this workspace.** `inspo/claude-task-master-main/`
   does not exist here and was never git-tracked — it was an untracked working
   directory in a different workspace. The handoff's first command
   (`git -C inspo/claude-task-master-main log`) errors out. The only usable git
   copy is `~/projects/claude-task-master-main` at commit `986de06` (the exact
   commit the original +12 eval used), but it is polluted with Rig install
   state from run 1 (`M CLAUDE.md`, untracked `.rig/`, `.claude/skills/`,
   `.cursor/rules/rig.mdc`, `.kiro/steering/rig.md`), so it fails the rubric's
   "fresh copy, no prior Rig state" precondition. The two `~/Downloads` copies
   are not git repos and cannot anchor a commit SHA.

2. **The handoff's blocker-check is conceptually wrong.** "Verify the target's
   git log reflects the RIG-148..152 fixes" — it never will. claude-task-master
   is a third-party repo pinned at one commit; RIG-148..152 are fixes to Rig's
   own payload, which live on this repo's branch. "Post-fix state" is a property
   of the Rig SHA, not the target. The target only needs to be a clean `986de06`
   checkout.

3. **Which Rig SHA is the re-baseline subject is unpinned.** The instrument
   froze at `38493a9b` (qa-prod-v5). Current HEAD is `a15d4267` (qa-prod-v6),
   which includes RIG-154 — landed *after* the instrument froze. None of the
   Path A fixes are on `prod` (still `6ee6be2d`). Baselining at the frozen
   anchor, at current HEAD, or after the qa-prod-v6→prod merge each produces a
   different number; only one is the figure the ticket header should carry.

4. **The judge is human-operated by rubric design.** The rubric is explicit:
   "No API-key-wired script exists; the judge is human-operated" (copy-paste
   into a model interface). An autonomous agent cannot run a pinned dated
   snapshot ≥3× on its own. Who operates the judge, and in what interface, is
   undecided.

5. **The model pin string has no source.** The handoff says "get the exact
   version string from `claude --version`" — that returns the CLI version
   (`2.1.236`), not a model snapshot like `claude-sonnet-5-20251022`. No pinned
   snapshot is recorded anywhere.

## The ruling

RIG-153 was scoped as "specs the instrument, not a re-score" (ticket text).
Option A — the six hygiene tests plus the frozen rubric at
`wiki/specs/adaptation-measurement-rubric.md` — is delivered and merged
(`592f4eed`, "Freeze adaptation measurement instrument for RIG-153 (option A)").
That is the whole of what the ticket was scoped to. **Close RIG-153 as done.**

The re-baseline *run* is measurement work against a frozen instrument, not
instrument work. It is comparable whenever it is eventually run, because the
instrument is frozen. It is also low-value right now: the six hygiene tests
already mechanically prove the RIG-148..152 defect shapes are fixed and run in
CI, so a re-baseline today would mostly flip the G2 gate UNMET→MET and move
A1/A2/A3 barely at all. The *interesting* re-baseline is after adaptive
integration (reconcile with existing config, prune to stack, personalize
content — the "single highest-value change to Rig" from the +12 eval) is
actually built, which is a Path B question.

**Carve the re-baseline out as RIG-156, deferred and low-priority, blocked
until Path A and Path B are fully decided and cleared.** RIG-156 carries the
five blockers above as its preconditions. No procedural change to the rubric's
§Clean-Checkout Procedure is needed — it is already turnkey once the target
copy and the four open decisions are settled.

## Follow-ups filed in this change

- RIG-153 ticket → DONE, option-B section replaced with a pointer to RIG-156.
- RIG-156 ticket created in Backlog, marked "(Low priority / deferred)",
  blocked on Path A + Path B completion.
- `wiki/Tickets.md`: RIG-153 card moved Backlog → Done; RIG-156 card added.
- `testing-strategy` hub updated to note the instrument is frozen and the
  re-baseline is RIG-156.
- Decision index: product-integration ruling row added.
