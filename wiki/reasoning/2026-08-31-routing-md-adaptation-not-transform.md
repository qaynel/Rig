---
date: 2026-08-31
source: intent owner
topics: onboarding-flow, what-rig-is
decisions:
status: historical
supersedes:
tags: interdependency
summary: RIG-151/RIG-152 are fixed by reframing routing.md's dev-doctrine passages as explicit adaptation instructions to the onboarding host agent (markdown-only) — not by a static install-time transform (rejected) and not by bare deletion. RIG-124.2's (RIG-124) tag removal folds into the same change. Consistent with B1/GA-1; does not touch D24's mechanical-only detection.
---

# routing.md's phantom-convention text: reframe for the onboarding agent, don't transform it away

Filed during a `rig-grilling` session on the three POLISH / pure-markdown
tickets from the Path A bug investigation — RIG-151, RIG-152, RIG-124.2.

## The reframe the intent owner reasserted

Rig has always been a **packaged, forward-deployed harness**: it lands a corpus
of context plus a manual in the target repo, and the **host agent the user
already runs** (Claude Code, Cursor, whatever) reads it and grafts Rig onto the
repo as it already exists — referencing the existing `CLAUDE.md` / rules,
keeping what's relevant to the stack, dropping what isn't, complementing
current infra instead of stacking a parallel one. The integration work is the
host agent's job at install time. It is not a static file drop, and it is not
installer-runtime code doing the adaptation.

This is not new. It is the opening of [[what-rig-is]], it is `GA-36`
("adaptation-onto-existing-infra engine, not any instruction set" is the moat),
and it is the "adaptive integration is the unbuilt core" open direction on
[[onboarding-flow]]. It is recorded again here because the grilling session
initially proposed an install-time transform for RIG-152 without routing
through it first.

## Decision: fix approach for RIG-151 / RIG-152

The offending passages in `rig/tier-1/routing.md` — the `wiki/status.md`
3-minute reasoning-trace cadence "per `CLAUDE.md`" (~lines 22-25), and the "In
this source checkout, use `rig/tier-1/...` instead" conditionals (~lines 6-8,
~29-31) — are rewritten as **explicit instructions addressed to the onboarding
host agent**: this is Rig's own development cadence / source-checkout path;
during install, map it onto this repo's actual convention, or drop it if the
repo has none. Pure prose, markdown-only, one source of truth read two ways by
a reader who knows which context it is in.

Alternatives considered and not chosen:

- **Static install-time transform** (a template hook in `payload.js` that
  strips the dev-only lines from the installed copy, plus a regression test):
  rejected for these tickets. It puts the adaptation in Rig's installer code,
  which is the opposite of the forward-deployed model — the host agent should
  be doing this reconciliation, not a copy-op transform. Also pulls a
  "POLISH, pure-markdown" ticket into installer-code + test scope it was not
  scoped for.
- **Bare deletion** of the phantom lines (RIG-151/152 "option A"): correct but
  wasteful. It removes the false imperative without leaving the onboarding
  agent any signal about what Rig's dev cadence is or that a target-repo
  convention could stand in for it. The reframe costs barely more and is a
  down payment on the adapt engine instead of throwaway text.

## RIG-124.2 folds in

The bare `(RIG-124)` citation at `rig/tier-1/routing.md:25` and
`rig/tier-1/skills/tdd/SKILL.md:31` is deleted at both installed sites (the
prose stands without it); the `tdd/SKILL.md` deletion also lands in the two
mirrored host copies (`.claude/skills/rig-tdd/SKILL.md`,
`.agents/skills/rig-tdd/SKILL.md`) so the copy-parity check stays green. The
dev-only test-title convention in `tests/release-blockers.test.js` is
untouched and out of scope. The routing.md:25 site overlaps RIG-151's
sentence rewrite; do both in one pass.

## Why this does not touch D24

D24 freezes Rig's *own detection* as mechanical-only: Rig reads which hosts a
repo uses from known paths and never guesses from repo shape which
capabilities a project wants. This reframe changes none of that. It hands the
judgment ("does this repo have a doc convention the cadence maps onto?") to the
**host agent** via instruction text, which is exactly the frozen B1 / `GA-1`
posture — Rig authors configuration, the host agent performs the work. The
line the office-hours scoping drew inside Path B ("reference existing rules by
path" is safe; "infer which skills the stack needs and prune" needs a D24
amendment) is not crossed here: nothing is pruned, nothing is inferred by
Rig's installer.

## Status

Approach agreed with the intent owner ("B looks good"). Not yet designed or
implemented. Next: acceptance examples + the regression check shape, then the
gate. Ships as one change across the three tickets, one signature.
