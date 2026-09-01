# Agent primer

The one page you read before touching this project. Skim it, follow the
handful of links it holds, and you have everything you need to route the
work without re-deriving context from the code.

## Read these first (in this order)

1. **[Home](Home.md)** — what lives where in this wiki, and the rule that
   keeps it honest (topics rewrite freely; sources and reasoning traces are
   immutable).
2. **[Status](status.md)** — what is true on this branch right now. Generated
   from current reasoning traces; do not hand-edit.

## Then, only the hubs the task actually touches

Skip this list if the task is a one-line fix. Otherwise open the hub whose
subject the task moves — the hub tells the whole story of that thing (what
it is, why, what binds it, what was rejected) and cites its sources. Full
menu on [Home § Topics](Home.md#topics). The most-used four:

- **[What Rig is](topics/what-rig-is.md)** — the product frame.
- **[Onboarding flow](topics/onboarding-flow.md)** — how Rig gets into a
  repository.
- **[Graft mechanics](topics/graft-mechanics.md)** — how it changes files.
- **[The two gates](topics/the-two-gates.md)** — how decisions get made and
  held.

## Then, only the indexes the decision needs

- **[Decisions](index/decisions.md)** — every decision ID, one line each.
- **[Acceptance cases](index/acceptance-cases.md)** — every Gate 1 case.
- **[Rejected](index/rejected.md)** — every approach considered and turned
  down, with the reason.
- **[Traps](index/traps.md)** — things that have already cost this project
  time.

## The rule this page enforces

The answers to "what is this, why is it this way, what was already tried and
rejected" are written down here. Read the wiki before grepping the code,
before asking the user for context, before sketching a solution. Grep is for
the code; the wiki is for the reasoning the grep cannot see.

A wiki that has drifted from the branch is a defect. When your change moves
what is true, file the trace and update the hub in the same change —
`reasoning/README.md` has the exact convention.

## Task-weight carve-out

A single-step task — a one-line fix, a factual question, a small edit
confined to one file, with no cross-file coordination and nothing that
changes what's true in the wiki — is on the lightweight path in
`rig/tier-1/routing.md` § Task weight and skips this primer. Everything else
reads this page first.
