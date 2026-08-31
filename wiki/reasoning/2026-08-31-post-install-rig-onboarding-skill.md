---
date: 2026-08-31
source: intent owner
topics: onboarding-flow
decisions:
status: historical
supersedes:
tags:
summary:
---

# Post-install `/rig onboarding` skill idea

Captured verbatim from a product conversation (2026-08-31) for discussion in a
future office hours. Not a decision; no acceptance cases defined yet.

## The idea

After Rig is installed into a target repository, the user would invoke a
dedicated onboarding skill or hook — something like `/rig onboarding` — directly
inside their agent. That command would:

1. Read the repository as it actually exists (hosts, existing configs, rules,
   conventions).
2. Onboard everything that fits — wiring Rig to the repo's real context.
3. Remove or skip whatever does not fit — avoiding the "empty repo" treatment
   that the 2026-08-30 adaptation eval exposed.

This is distinct from the current `inspect → recommend → plan → apply → check`
staged flow, which the agent currently has to drive manually step by step.
A `/rig onboarding` skill would make the entire adaptation sequence a single
agent-level slash command: idiomatic, repeatable, and host-native.

## Connection to prior work

The 2026-08-30 adaptation eval on `claude-task-master-main` scored +12/100
precisely because onboarding treated a rich multi-host repo as if it were
empty. The eval's highest-value fix was "parse the pre-existing config and
reconcile with it." A dedicated onboarding skill is a natural vehicle for that
adaptive reconciliation logic, once the grilling and design work are done.

The idea does not conflict with D24 (mechanical-only host detection at install
time) — it lives post-install, where the agent has already landed and full
host-native capabilities are available.

## Open questions (for office hours)

- Is this a rig-authored skill installed into `.rig/skills/` (i.e., a Rig
  deliverable), or a pattern document that tells the host agent how to run
  the staged flow? The distinction matters for markdown-only installs.
- What is the consent model for "delete whatever doesn't fit"? The current
  onboarding flow only adds; a pruning step crosses a new consent boundary.
- Should this be a one-shot onboarding command or a re-runnable reconcile
  (i.e., can you run it again after installing new host tools)?
- How does it interact with the `rig.json` selection from a prior `recommend`
  step — does it consume an existing selection or re-derive it?
