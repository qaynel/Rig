---
name: rig-router
status: ready
description: Route Rig requests to the smallest matching Rig skill.
family: implementation-and-orchestration
tool: host-agent
capability: implementation-and-orchestration.workflow-routing
guarantees:
  - Routes a task to a named skill listed in the repository's Rig routing table.
  - Preserves the repository's settled product decisions and task boundaries.
overlap_tags:
  - routing
  - workflow-routing
---

# Rig Router

Use this skill when a request mentions Rig without naming a specific Rig skill.
Read `rig/corpus/routing.md` in a Rig source checkout or `.rig/routing.md` in an
installed repository. Choose the smallest matching skill from its skill table
and follow that skill before acting. If the request names a Rig skill already,
use that skill directly.
