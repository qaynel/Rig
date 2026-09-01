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

Use the canonical onboarding playbook at `.rig/skills/onboarding/SKILL.md`.
