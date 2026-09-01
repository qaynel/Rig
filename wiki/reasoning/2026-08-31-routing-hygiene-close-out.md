---
date: 2026-08-31
source: agent
topics: onboarding-flow, testing-strategy
decisions:
status: historical
supersedes: 2026-08-31-routing-hygiene-implementation
tags:
summary: RIG-151/RIG-152/RIG-124.2 closed — the frozen four-site reframe landed in routing.md and the three tdd/SKILL.md copies; tests/installed-router-hygiene.test.js is 3/3 green and the full npm test gate passed.
---

# Close-out: routing.md / tdd hygiene reframe (RIG-151 / RIG-152 / RIG-124.2)

Bundles the three POLISH install-trap tickets filed during the Path A bug
investigation. Design and oracle traces:
[[reasoning/2026-08-31-routing-hygiene-design]],
[[reasoning/2026-08-31-routing-hygiene-oracle]],
[[reasoning/2026-08-31-routing-md-adaptation-not-transform]].
Implementation trace:
[[reasoning/2026-08-31-routing-hygiene-implementation]].

## What shipped

- `rig/tier-1/routing.md` — four paragraphs reframed per the frozen wording:
  "In this source checkout" conditionals → "(Working in the Rig source repo…)"
  asides; the rigid `wiki/status.md` cadence → "keep a running reasoning trace"
  plus an Onboarding note that maps onto the target repo's convention or drops
  it; `(RIG-124)` citation removed from the full-cadence paragraph.
- `rig/tier-1/skills/tdd/SKILL.md` plus `.claude/skills/rig-tdd/SKILL.md` and
  `.agents/skills/rig-tdd/SKILL.md` — identical deletion of the trailing
  `(RIG-124)` suffix; the "right before push" sentence retained.

No installer-code transform; source == installed (option B).

## Verification

- `tests/installed-router-hygiene.test.js` — 3/3 green (RIG-151, RIG-152,
  RIG-124.2).
- Full `npm test` gate green (secrets 13/13, node suite 553/553, pi-extension
  15/15, rig-mcp 6/6).

## Tickets closed

- [[RIG-151]] — phantom `wiki/status.md` cadence reframed for the onboarding
  agent.
- [[RIG-152]] — never-true "source checkout" conditionals scoped to Rig-source
  contributors.
- [[RIG-124.2]] — bare `(RIG-124)` citation removed from installed payload text.
