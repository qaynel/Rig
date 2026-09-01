---
date: 2026-08-23
source: intent owner
topics: what-rig-is
decisions: GA-36
status: historical
---

# DSH is a delivery medium, not the moat

Resolution of the audience-fork question opened in
[`2026-08-23-dsh-envy-and-the-audience-fork.md`](2026-08-23-dsh-envy-and-the-audience-fork.md)
and investigated in
[`2026-08-23-dsh-routes-to-models-not-hosts.md`](2026-08-23-dsh-routes-to-models-not-hosts.md),
after several more rounds of pressure-testing.

## The corrections along the way

**Wrapping a host is real, DSH still doesn't give it to you.** The intent
owner pointed out that Conductor — the very app this session was running in —
proves "an outer shell over Claude Code" is buildable: Conductor spawns and
drives Claude Code agents under a UI. Fair correction; "impossible" was too
strong. But DSH still does not hand this over: DSH talks to model APIs
(DeepSeek, Claude's API), not to the Claude Code app. Getting Conductor-style
wrapping requires building the Claude-Code-wiring yourself, on the Claude Agent
SDK — the exact piece DSH does not ship. DSH's value in that scenario is its
UI and plugin scaffolding, nothing more.

**The "more than linear" test.** The intent owner set their own bar: progress
that compounds, not just adds up, is worth investing time and tokens in even
if the problem is hard and no users exist yet. Applied honestly: the corpus
(CLAUDE.md, `.cursor/rules`, skills, wiki) compounds — one unit of work pays off
across every host and every tier, and never expires. A DSH fork is a tax:
every hour keeping 57 packages in sync with an upstream that has already
labeled itself an unstable developer preview produces no reusable asset and
decays. By the intent owner's own rule, corpus-first is the only super-linear
choice.

**"Is my instruction set really the moat?"** — the sharpest question in the
session. Honest answer: **no.** Good prompts and skills are not scarce or
defensible; they are everywhere. Conceded fully, along with two inflated costs:
a frozen fork does not force upstream-chasing (the tax was overstated), and
wrapping Claude Code is buildable, not a monster (Conductor is the proof).

**Where the real moat lives.** Not the instruction text — the **adaptation
engine**: reading an arbitrary repo, its existing agent config, its stack, its
workflow, and fitting a harness onto it without stomping what is already there.
Concretely, that means:

1. read what is already there and merge, not overwrite (existing CLAUDE.md,
   `.cursor/rules`, `.github/copilot`, custom skills);
2. read the repo's real shape (stack, tests, CI, conventions) and tailor to it;
3. fit the existing AI-development workflow rather than replace it
   (`GA-17`'s amplify-not-duplicate spirit);
4. emit per host from one adaptive analysis.

Almost every competitor in this space (Cursor, DSH, Copilot) makes the user
adopt *it*. Landing and adapting to the user is the less-taken, more defensible
stance — because it is work and logic, not text anyone can copy-paste.

## The final position

The intent owner's closing case: DSH is a genuinely better delivery medium than
loose `.md` files for the no-host end of the spectrum — a UI, a model picker, a
skills crate, modes is something a person with no agent loop can actually use,
where bare context files are not. Available optionally at every tier (1, 2, or
3), opt-in/opt-out, controlled entirely by the user at install time; DSH's own
skill-generation ideas should be studied and replicated onto whichever host is
present rather than literally inherited.

**Verdict: not delusion — the instinct is right, with one relabel held firmly.**
DSH widens Rig's **reach**, not its **moat**, and the two must never be
confused:

- At the no-host end, DSH *is* the product and Rig is a skin on it; the
  adaptation moat contributes nothing there because there is nothing to adapt
  onto. That is exactly the end where Rig's differentiator is worth least.
- "DSH handles most of that segment" cuts both ways: low build cost, but also
  low ownership — most of that user's value is DeepSeek's, not Rig's. Fine for
  a funnel play; fatal if mistaken for defensibility.
- "I'd use it myself, I'd plug my own Cursor/Claude keys into it" is a
  legitimate reason to fork it as a personal tool and as the tier-1 shell — it
  is *not* evidence it is Rig's differentiator. Those are different claims.

Three guardrails attached to the yes, all accepted by the intent owner as real
and not disagreements:

1. **"Optional everywhere" must stay the cheap version.** One frozen delivery
   shell for the no-host case is cheap. Committing DSH as a first-class,
   always-swappable host at every tier reopens the tax the frozen-fork
   discipline was supposed to close — the adaptation layer would have to
   target DSH-as-a-host too, and track its churn, at every tier. Availability
   everywhere is fine as a someday-maybe; *support* everywhere is not something
   to commit to ahead of demand.
2. **The moat is unproven.** "Adapts onto existing infra" has been treated as a
   settled asset throughout this session; it is a hypothesis. The open
   question that decides whether there is a real product here is whether
   Rig's merge-not-overwrite pass on a real repo produces something genuinely
   better than what the person had, or mush. Nothing about DSH's architecture
   matters until that is answered.
3. **"Inherit DSH's skill-generation" only holds while DSH's own loop is
   running.** In a config-only Rig on Claude Code or Cursor there is no DSH
   loop present, so that capability must be rebuilt in Rig's own corpus layer —
   by studying DSH's approach and prompting the host to replicate it, not by
   literal inheritance. A hardwired loop *runs*; an instruction only has a
   *probability* of running, gated on how well the host agent obeys — that is
   the honest shape of what config can guarantee, and it is opt-in/opt-out for
   the user either way.

**On the tax, refined once more:** targeting a host (Claude Code, Cursor,
Antigravity) means tracking someone else's config surface — bounded, markdown,
read-only. That tax is intrinsic to being an integration layer with no model
of its own, and Rig already pays it (the Antigravity release is the proof).
Owning a fork means tracking your own runtime's internals as they break — a
different, heavier kind of tax. The frozen-opt-in discipline is exactly what
collapses the second kind back into the first: a fork that is never chased is
a one-time cost, not a recurring one. The line drawn in permanent ink: *target
hosts freely; never chase DSH upstream.*

## Decision `GA-36`

**DSH is adopted as an optional, frozen, tier-1-only delivery shell for the
no-host segment — reach, not moat.** It is never chased upstream once forked.
The moat is the adaptation-onto-existing-infra engine (merge-not-overwrite,
repo-shape-aware, workflow-fitting, one analysis emitted per host), whose
*quality* — not its existence — is the actual unproven asset and the next
thing to validate, on real repos, before any further shell work. DSH's
skill-generation is replicated onto whichever host is present through study
and prompting, not inherited as running code. Build order stays
corpus-first: the adaptation engine, then an authoring/preview/approve
surface that borrows DSH's UI ideas, then — last, and only on real demand — a
DSH-derived or Agent-SDK-based shell for the no-host tier.

This closes the audience-fork open question raised in
[`2026-08-23-dsh-envy-and-the-audience-fork.md`](2026-08-23-dsh-envy-and-the-audience-fork.md).
The remaining unknowns are proof, not architecture: is the adaptation actually
good, and will anyone install it.
