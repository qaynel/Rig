---
date: 2026-08-31
source: agent
topics: onboarding-flow, testing-strategy
decisions:
status: historical
supersedes:
tags:
summary: Grilling oracle for RIG-151/RIG-152/RIG-124.2 — acceptance as observable cases plus tests/installed-router-hygiene.test.js (3 tests, currently red). Also the first instance of the mechanical breakage-count lint RIG-153 specifies. Remaining gate input: the reframed wording for the three routing.md sites (rig-product-design).
---

# Oracle for the routing.md hygiene fix (RIG-151 / RIG-152 / RIG-124.2)

Follows [[reasoning/2026-08-31-routing-md-adaptation-not-transform]] (option B
chosen). This trace records the acceptance and the check that freezes at the
gate.

## Problem and outcome

`rig/tier-1/routing.md` installs byte-identical into every target repo. Three
passages are Rig-internal dev doctrine that reads as false or dangling in a
stranger repo: a `wiki/status.md` 3-minute cadence "per `CLAUDE.md`" (RIG-151),
"In this source checkout, use `rig/tier-1/...` instead" conditionals that can
never be true where they are read (RIG-152), and a bare `(RIG-124)` citation
with no `wiki/Tickets.md` to resolve against — also in `tdd/SKILL.md` (RIG-124.2).

Outcome: the installed router addresses the onboarding host agent explicitly —
adapt Rig's dev cadence to this repo's own convention or skip it; contributor
paths are scoped as such — and carries no dangling internal identifier. Rig's
own dev use of the file is unweakened.

## In scope / out of scope

In: prose in `rig/tier-1/routing.md` and the `(RIG-124)` suffix in
`rig/tier-1/skills/tdd/SKILL.md` (+ its two native mirrors). Out: any
`payload.js` transform or two-file split (rejected, option B); the `(RIG-124)`
test-title convention in `tests/release-blockers.test.js` (dev-only, never
installed); the D24 mechanical-detection question (untouched).

## Acceptance — observable cases

1. Install Rig into a fresh repo. Read `.rig/routing.md`. It does not instruct
   the reader to regenerate `wiki/status.md` or file a trace "every three
   minutes … per `CLAUDE.md`" as an unconditional step. Any reasoning-trace
   guidance is conditioned on the target repo's own convention or addressed to
   the onboarding agent.
2. Same file: no sentence of the form "In this source checkout, use X instead".
   Rig-source paths (`rig/tier-1/...`), if mentioned, are explicitly scoped for
   contributors working in the Rig repo.
3. Same file, and `.rig/skills/tdd/SKILL.md` / `.claude/skills/rig-tdd/SKILL.md`
   / `.agents/skills/rig-tdd/SKILL.md`: no `(RIG-NNN)`-shaped citation. The
   surrounding sentences ("… right before push.") are intact.
4. `tests/routing-sop.test.js` and `tests/rig-bootstrap.test.js` stay green —
   the SOP structure and the multi-host install are unchanged.

## Testing infrastructure

`tests/installed-router-hygiene.test.js` — three tests, one per ticket. Asserts
on the source files directly, which equal the installed copies (no transform;
byte-identity proven by `rig-bootstrap.test.js`). Negative assertions on the
defect shapes plus a positive pincer (cadence guidance and `rig/tier-1/` paths
must still be present, just reframed) so bare deletion does not pass. Currently
**red**: 3/3 fail against the unmodified router. Auto-included in `npm test`
via `tests/*.test.js`.

This is also the seed of the mechanical breakage-count lint
[[RIG-153]] calls for — a grep-level check for the RIG-149…152 defect classes
with no model call.

## Open decision blocking the freeze

The exact reframed wording for the three sites is `rig-product-design`'s to
draft — it must satisfy cases 1–3 and the positive pincer in the test. Once
that draft exists and the three tests pass, the oracle (these acceptance cases
+ the test file) freezes under one signature with the tickets.
