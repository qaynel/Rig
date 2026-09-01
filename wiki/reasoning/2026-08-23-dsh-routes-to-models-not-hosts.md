---
date: 2026-08-23
source: agent
topics: what-rig-is
decisions:
status: historical
---

# DSH routes to models, not hosts

Direct continuation of
[`2026-08-23-dsh-envy-and-the-audience-fork.md`](2026-08-23-dsh-envy-and-the-audience-fork.md).
The intent owner's "widest spectrum" reframing rested on a checkable claim:
that a `dsh` fork could sit between the user's existing Claude Code / Cursor
setup and DSH's UI, so "whichever host they already run gets routed through the
DSH shell, and Rig's config amplifies all of it." Checked directly against
`dsh`'s own packages before answering, rather than reasoning from the README
alone.

## What was found

Reading `deepseek-harness-master/packages/{llm,host,acp,subagent,client}`:

- **`llm`** is provider adapters — `llm-deepseek`, `llm-pi-ai` — that route to
  **model APIs**, not to agent hosts.
- **`host`/`client`** are DSH's own web GUI packages.
- **`acp`** "exposes harness agents to programmatic clients over the Agent
  Client Protocol" — meaning external editors can drive **DSH as the agent**,
  the reverse direction from "DSH drives Claude Code."

There is no seam for "wire Claude Code in as a backend." Claude Code and Cursor
are not model endpoints DSH can call — they are loops, exactly like DSH is a
loop. One loop cannot be nested inside another loop's UI.

## Why this matters

"DSH serves as a UI over Claude Code" is not a thing DSH does. Forking DSH and
pointing it at the Anthropic API does **not** get you Claude Code's
planning/exploration/tools — those live inside Claude Code's own loop, which
would be bypassed entirely. It gets you DSH's loop calling the Claude model.
Which collapses the "middle of the spectrum" idea into exactly the outcome the
intent owner said they wanted to avoid: **a coding agent competing with Cursor
and Claude Code**, with a corpus preloaded and a UI to maintain forever.

A custom adapter that shells DSH out to the `claude` CLI or drives Cursor
headlessly is possible in principle, but it is a bridge Rig would have to build
and maintain itself — not something forking DSH hands over — and neither Claude
Code nor Cursor is designed to be driven as a clean headless backend.

## The reframe

The intent owner's own best insight, read correctly, argues the opposite of the
conclusion it was offered in support of: **the corpus is the invariant.** The
CLAUDE.md files, `.cursor/rules`, the skills, the context — that is the same
durable asset no matter what reads it. Claude Code reads CLAUDE.md, Cursor reads
`.cursor/rules`, and Rig can write both from one source. That already spans
almost the entire spectrum: anyone running any host. **Config-only IS the
spectrum play**, because the corpus is host-agnostic by nature. DSH does not
extend that reach — it adds exactly one thing: a front end of its own, for
people with **no host at all**. And that slice is the one where "I adapt to
what you already have" is worth nothing, because there is nothing to adapt to.

## Recommendation at this point

Config-only is not the small option settled for — it *is* the spectrum play.
The DSH fork is a separable, optional, later door onto the one segment least
worth fighting for (the most crowded arena in the market), not the thing that
unlocks the spectrum. Keep it in the wiki as a v2 possibility; do not let it be
v1.

**The assignment given:** on one real repo, write one source-of-truth corpus —
a skill plus project context — and have Rig emit both `CLAUDE.md` and
`.cursor/rules` from it. Run the same task through Claude Code and through
Cursor and observe whether the shared corpus measurably sharpens both. That
tests the real product in a day, with zero `dsh` involved. A "yes" finds the
wedge; a "meh" is a three-month monorepo-fork avoided cheaply.

This did not close the audience-fork question — the intent owner continued
pressing the case for `dsh` as a wider-reach delivery medium, which
[`2026-08-23-dsh-delivery-medium-not-moat.md`](2026-08-23-dsh-delivery-medium-not-moat.md)
resolves.
