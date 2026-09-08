---
date: 2026-09-01
source: agent
topics: onboarding-flow, what-rig-is, services-and-reports
decisions:
status: historical
supersedes:
tags: interdependency
summary: Path B now has a shared approved onboarding vertical slice with selective projections, managed grafts, canonical playbook routing, CLI parity, and MCP parity.
---

# Path B slice 5 — onboarding vertical slice

The shared onboarding handler now completes the prepared → proposed → applied
→ checked flow. Apply accepts only a verified plan-approval receipt whose digest
matches the current proposal, rejects unresolved critical decisions and stale
catalogue or revision state, and uses the existing journal and graft primitive
for bounded mutations. The happy path is idempotent: it projects only the
approved `qa` skill as `rig-qa`, writes only the approved versioned graft, and
records the applied proposal and checks under `.rig`.

The installed active-delivery path now has one canonical onboarding playbook at
`.rig/skills/onboarding/SKILL.md`, in the required Understand → Discover →
Catalogue-read → Delta → Propose → Summarise → Apply on approval order. Native
onboarding skills are pointers to that playbook. The legacy markdown-only path
keeps its byte-stable native-source parity while active delivery replaces its
neutral fallback with the canonical playbook.

The CLI and both MCP surfaces are thin adapters over `handleOnboarding`. MCP
publishes the four-action schema, structured responses, `next_action` text, and
the conservative destructive/idempotent annotations. The frozen Task 5
onboarding, MCP, and state suites are green, as are the affected bootstrap and
merge compatibility checks. Later operator-install and weight-closure slices
remain separate work.
