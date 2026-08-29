---
date: 2026-08-23
source: intent owner
topics: what-rig-is
decisions:
---

# DSH envy and the audience fork

Office-hours session opened because a DeepSeek Harness (`dsh`) zip landed in the
repo. The intent owner likes its modular design and its UI — cleaner than what
Rig has ever looked like — and is considering forking it and integrating it with
Rig. Also admits: models keep going down rabbit holes, the work feels
over-engineered, and there is only a vague idea of what is actually being built.

## What the two things actually are

**Rig**, per its own wiki, is a doctrine layer installed *into* someone else's
repo. It reads the repo, sets up curated skills/policy, and deliberately ships no
runtime and no model key — the host agent does the work. That was not an
accident; it is decision `B1` (`GA-2`), reached through grilling and locked.

**DSH** is the opposite category: a full agent runtime you run —
`npx dsh web` boots its own UI, and its ~57 packages are `llm`, `sandbox`, `e2b`,
`session`, `subagent`, `terminal`, `shell`, `workflow`. It is not installed into a
repo; it *is* the host. It competes with Claude Code, not layers on top of it.

So "fork dsh and integrate it with Rig" is not an integration — it is a category
switch. That ambiguity is a plausible source of the rabbit-holing: Gate 1
signing, gate ceremony, SSHSIG attestation, policy leaves are a lot of ceremony
for a pre-user project, and `dsh` looks clean because it is concrete, shippable,
and visible.

## D1 — goal

Reply, restated: **a mix.** Long-run this could become a startup, but right now
it is open source, looking for real users' eyes and feedback. It is also a
first project and a learning vehicle, with the further ambition of eventually
building tools that make agents more streamlined.

## D2/D3 — who runs the loop

Pushed to describe one person doing one thing. The answer clarified the real
axis: **who runs the agent loop** — not who ships a model key, since both `dsh`
and Rig require a bring-your-own API key.

- With `dsh`, you run `dsh`: its own agent loop, session manager, tool executor,
  sandbox, UI. It replaces Claude Code / Cursor.
- With Rig, you run Claude Code (or another host): Rig writes config/markdown so
  the host you already run behaves better. Rig has no loop, no session, no UI.

Three options were named for a forward-deployed harness along this axis:

- **A — host does it, Rig stays config-only.** ~80% built already (380 tests);
  ships this quarter; no flashy UI of Rig's own.
- **B — Rig forks dsh and owns a host.** Full control and a ready UI, at the cost
  of maintaining a 57-package monorepo solo, as a first project, while competing
  head-on with Claude Code, Cursor, and `dsh` itself.
- **C — host runs the loop, Rig steals dsh's shape and surface.** Keep A's
  architecture; borrow `dsh`'s module decomposition and UI patterns for an
  install → analyze-repo → propose-changes → approve flow, without forking its
  runtime.

## The redescription

Asked to describe the vision without reference to either product, the intent
owner produced, essentially unprompted, a restatement of Rig's own charter: a
forward-deployed harness that lands on a repository, looks at what is already
there, auto-configures against it, crafts on top of whatever AI development
cycle already exists, and can suggest changes safely. Recognized as
near-verbatim the wiki's own description of Rig as "a packaged forward-deployed
harness: it lands in the repository, evaluates what is already there, and
complements that setup rather than becoming a parallel infrastructure stack."

The read: this is not idea-confusion. It is surface-envy — `dsh` has *built
machinery* and a visible UI; Rig is 380 tests of markdown ceremony that does not
yet *feel* like a product.

## The "can we not have both" turn

The intent owner then proposed: craft on top of whatever agentic loop an
organization already has; if none exists, or the user explicitly wants it, bring
in `dsh`'s loop. Flagged as the expensive trap — by definition, the users a
forward-deployed harness targets already have a loop, so the "bring dsh's loop"
branch fires for the fewest users while costing the most engineering (~90%: fork
57 packages, keep them synced forever, build the runtime, the UI, and the
mode-switching logic). Recommendation at this point in the conversation: ship
config-only as v1, own-loop as an explicit, deferred later door.

## Standing instruction

> "Make it a point to save like reasoning, traces, and like updating the
> philosophy, and all of these things in the wiki — I want this to be like a
> reference source. If you're developing software, it's more about what was
> the intent behind [it] rather than what is the code — because the code might
> be faulty, or architecture might be faulty, but then if the intent was right,
> it could always be rebuilt with the correct architecture. The correct
> architecture can always be built if the intent — the spirit — was clearly
> defined."

This is the operating instruction behind every trace filed in this session: the
intent is the durable artifact; the code and architecture are rebuildable from
it if the intent survives.

This trace opens the audience-fork question rather than closing it; see
[`2026-08-23-dsh-routes-to-models-not-hosts.md`](2026-08-23-dsh-routes-to-models-not-hosts.md)
and
[`2026-08-23-dsh-delivery-medium-not-moat.md`](2026-08-23-dsh-delivery-medium-not-moat.md)
for the investigation and resolution that follow it in the same session.
