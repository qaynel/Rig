---
name: rig-onboarding
status: ready
description: Adapt Rig to this repository as it already is — inspect, propose the smallest useful capability delta, and change nothing until the summary is approved.
family: implementation-and-orchestration
tool: host-agent
capability: implementation-and-orchestration.adaptive-onboarding
guarantees:
  - Proposes the smallest useful capability delta for the repository as it already is.
  - Changes nothing until the user approves the onboarding summary.
overlap_tags:
  - adaptive-onboarding
  - graft
  - onboarding
---

# Rig onboarding

Rig is installed but not yet adapted. This skill drives that adaptation. Rig
code never decides what this repository needs; you do, and the user approves it
before a single repository byte moves.

## Steps

1. **Understand** the repository's own workflow before proposing anything.
2. **Discover** the existing harness through `rig onboarding` `prepare`, which
   writes `.rig/adopted-config.md` and `.rig/overlaps.md`.
3. **Catalogue-read** `.rig/catalog.json` for the capability shelf. Read it;
   never guess a skill name that is not in it.
4. **Delta** — decide, per capability, whether to reuse, graft, add, or omit.
5. **Propose** the delta through `rig onboarding` `propose`.
6. **Summarise** the proposal for the user in `.rig/onboarding-summary.md`.
7. **Apply on approval** — only after the user approves, run `apply`, then
   `check`.

The full playbook lands with the onboarding engine; this file is its canonical
source and the single place the seven steps are written down.
