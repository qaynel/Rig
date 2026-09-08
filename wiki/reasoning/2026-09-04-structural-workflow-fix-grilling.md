---
date: 2026-09-04
source: intent owner
topics: agent-working-conventions, what-rig-is, gate1-signing
decisions:
status: current
supersedes:
tags: interdependency, grilling
summary: Intent owner's completed grilling answers (A–G) for the structural workflow fix, plus the grilling agent's seven notes — including that CLAUDE.md's markdown-only Tier 1 text is dead doctrine.
---

# Grilling results — Rig structural workflow fix

Filed verbatim as intake. Produced by a parallel grilling session against the
office-hours context brief on PR #143. The design written against these answers
is [[2026-09-04-structural-workflow-fix-design]].

(COMPLETE — all sections closed. Ready for handoff to /spec.)

## A. Intent

A1: Protecting against an agent, in a deep context-rot or hallucination
state, editing the acceptance criteria itself so its own (wrong) code
passes review. Direct inspiration: news of AI agents breaking sandbox /
gaming benchmarks (e.g. hacking scoring infra to fake results). Oracle
signing exists to stop the agent from marking its own homework.

A2: Not a deliberate design choice — the oracle-in-docs coupling was "a
natural consequence" of acceptance criteria being markdown and the test
infra being derived from that markdown + intent. If redone, the user would
still keep the signature tied to the document (wants that kept), but wants
the *signing process* simplified: right now approving the gate and
approving the resulting delta are two separate human actions. Wanted
change: the agent triggers the Gate 1 approval and packages the full
lock/delta together, then the human does one physical-auth step (Touch ID
on Mac; on Linux, ideally the agent runs the script and the human just
supplies the password/fingerprint once) rather than approving twice.

A3: Intent was for the wiki to be an active, consulted knowledge base, not
just an archive — motivated by watching agents repeat the same failed
attempts and burn tokens re-deriving things, and by having to re-explain
product context per-issue. Wanted: a constant project/engineering-decision
source the agent consults *during* work, records reasoning traces in
(learn from past failures instead of repeating them), and uses to resume
interrupted sessions.

A4: (Fact, verified from `wiki/reasoning/2026-08-31-path-b-adapt-scope.md`
and `2026-08-30-office-hours-path-a-path-b-scoping.md`, not asked as
recall.) PR #143's original scope was Path B from the Path A/Path B split
decided in office hours 2026-08-30: Path A = concrete install-bug fixes +
a frozen measurement rubric; Path B = adaptive/dynamic onboarding, gated
by a grilling step because of D24 (detection stays mechanical-only, no
judgment/inference by Rig's own code). User's account of *why it grew*
(the decision-level part, correctly asked as an opinion): a review → fix →
new-issue → review loop that ran too long, because the user chose to fix
issues at the source rather than let them reach qa-prod.

## B. Constraints

B1: Three non-negotiables, ranked, with reasons:
  1. Dynamic onboarding — "entire selling point" of the product.
  2. Human-signing feature — safety of the human's codebase against the
     agent; prevents the agent from cheating/self-certifying its own work.
  3. Spec-driven development — lets the human own architecture decisions
     while the agent handles syntax/documentation.

B2: **No** — markdown-only-Tier-1 is dead policy, not a live constraint.
CONTRADICTS current CLAUDE.md, which still states "Tier 1 must remain
markdown-only in installed repositories: no installed runtime, secrets,
sync engine, or generated `.env` files." User's answer: Tier 1 needs a
full overhaul — it's meant to be dynamic scripts + markdown + MCP now,
shaped by how the user's onboarding agent guides them through install.
The à la carte overhaul was supposed to replace the old Tier system the
moment it landed; CLAUDE.md's markdown-only text is a leftover that
didn't get cleaned up. The only secret Rig actually needs is the physical
key for human-signing; a sync engine is wanted, specifically to prevent
context rot and support continuous agentic harness engineering.
**This directly contradicts CLAUDE.md's current text** — needs correction
in the origin session.

B3: Trust-boundary strength stays; the re-sign multiplier itself is kept,
but the user wants it made cheaper for the human to exercise in bulk —
i.e., a resign UI/flow with options to sign only one, some, or all
invalidated items at once, rather than a strict weaker-signing tradeoff.

B4: Yes, host portability stays, and the user believes it's cheap to keep:
if the user's local onboarding agent is given enough context, it can
generate the host-specific files/dirs (e.g. `.claude/`) from one general
`.rig/` source directory, rather than portability being hand-maintained
per host.

## C. End-state

C1: **Next PR = workflow-fix only.** Fix the review → fix → review cycle
using the wiki as an active source. Max 4 commits over 4 hours. Two
follow-on PRs come after, in order: (i) re-architect the product around
dynamic `.rig` onboarding, (ii) implement **AHE (Agentic Harness
Engineering)** in practice or in spirit — whichever is cheapest on infra.
Feature:hardening = 1:2 is a **global coding principle**, not scoped to
one PR: hardening is done inline at the point of writing, not deferred
to a separate review phase. Applies always.

C2: Same daily rhythm as today — office-hours → grilling → acceptance
criteria + testing infra → lock → sub-agent implementation via
superpowers → review → grill again → test — but **the loop closes in at
most one more pass**, then clears to QA-prod, then another office-hours
sets the next roadmap. The delta from today is not a new morning ritual;
it's the loop-count dropping from many to one-or-two.

C3: Primary signal is user-elicited via a periodic grilling-style
questionnaire: the user reports "the agent just gets me — I shipped
things this week I couldn't have before." Observable proxies: shorter
commit histories per PR, and pass@1 on acceptance criteria (loop closes
in one pass, not many).

C4: 6 months out: ≥15 daily-active users. Value = clone-to-first-shipped-
feature in 5–6 hours. Mechanism: the installed user's agent isn't
exploring the codebase, it's *running with it* — knows to write an
architecture.md, set up a wiki when the project is long-term, follows
the SDLC, guides the user through each next step so the user never has
to know the cycle exists. Metaphor: "ready-to-use exoskeleton."
North star: "the agent, through the power of language, translates human
thoughts into shippable, hardened code."

## D. Trade acceptance

D1: Yes — willing to sit with no feature-ship for **up to 1 week** while
hardening a real blocker. Ceiling: 1 week unless there are huge flaws
(user doesn't think that's the case). Rule: every second of not shipping
features must justify itself with a concrete reason and deadline.
Features must be hardened at the core (1:2 principle from C1) so little
manual maintenance is needed after; autonomous agentic maintenance can
run at night.

D2: Yes — willing to overhaul the wiki structure as long as performance
doesn't degrade. **Design invariant surfaced**: the wiki is for agents,
not humans; no human is expected to read it end-to-end. That reframes
"obligatory consultation" — it's an agent-side gate, not a human-side
reading discipline.

D3: **No hard limit.** Soft trigger at 5 commits: when a PR crosses 5
commits, an investigation must fire — is there a deeper problem (context
rot, agent looping, scope creep)? Surface the "why" early rather than
block the merge. It's a diagnostic gate, not a rejection gate.

D4: Two weeks is the outer bound, only with an exceptionally strong
reason. Working ceiling stays at ~1 week (matches D1). Hard constraint:
during the pause, no infinite loops / dead ends — every day of the pause
must "earn its place" (time is money). If the agent has full context
from the user, the fix shouldn't need two weeks in the first place.

## E. Symptom priority

E1: **Ranking (most-hurts-first): context burn > regression loop >
re-sign multiplier > wiki bloat.** Caveat from the user: these are all
symptoms of a common disease — the ranking is useful for prioritization
but the real ask is an architectural root-cause analysis, not
per-symptom treatment.

E2: **Regression loop.** Would be noticed first: reviews clear cleanly,
PRs merge, and token budget is still intact by day's end — a satisfying
double-signal. **Hard anti-solution constraint**: do NOT solve the
regression loop by softening review. That would be treating the symptom
by removing the check. Review quality is not negotiable in exchange for
loop reduction.

E3: **Regression loop.** Will bite the next PR regardless of what else
changes.

## F. Loop-not-shipping

F1: **No systemic non-shipping mechanism.** The 2026-09-02 closed-loop
tranches were deliberately deferred so Path B (PR #143) could ship
first — serial priority ordering, not a stuck queue. Now that Path B is
merged, the loop-work is unblocked and is the next thing. Also
partially pre-answered by A4 follow-up: within PR #143 itself, the
mechanism for its bloat was a review → fix → new-issue → review loop
chosen deliberately (fix at source, don't let defects reach qa-prod).

F2: Trace: notice friction → user writes an initial "First Report"
(note / reasoning trace) → handle in a separate PR. Serial,
user-driven catch, deferred to its own PR rather than folded inline.

F3: Office hours provides overall orientation on what needs fixing;
the actual fix is always **user-triggered** in response. No external
gate on weekly cadence — the trigger is entirely the user's own
decision. Weekly shipping is bounded only by the user choosing to act,
not by any prompting or approval bottleneck. Office hours is the
escalation layer (workflow-fix → product-level question), not the
trigger layer.

## G. Test criteria

G1: **Explicitly declined a target number.** Reason: Goodhart's Law —
the moment a metric becomes a target, the harness will optimize for
the metric rather than the underlying quality. The success signal
stays qualitative ("semantic feel and ease of development"), with
directional observables from C3 (shorter git traces, pass@1 on
acceptance criteria) tracked but not pinned to specific target values.

G2: A future PR would show, recognizable in the git log without any
metric attached: **concrete scope stated up front**, **explicit
next-step statement** (what happens after this PR), **small line-change
footprint**, **small commit count including review commits**, and
**close-to-1:1 deletion-to-addition ratio** — not PR #143's 31k added
/ 10 removed pathology.

---

## Grilling agent notes

1. **B2/CLAUDE.md contradiction (real, unresolved policy drift).**
   CLAUDE.md still asserts markdown-only Tier 1 with no
   runtime/secrets/sync-engine in installed repos. The user's B2/B3
   answers say this is dead doctrine left over from before the à la
   carte overhaul, which was meant to fully replace the old Tier
   system. This needs a direct CLAUDE.md correction in the origin
   session — it's actively misleading any agent that reads it as
   current truth (including this one, until challenged).

2. **A4 process failure (self-caught, worth carrying forward).** On
   A4, the resuming/prior agent initially asked the user a question
   whose answer was a documented fact in
   `wiki/reasoning/2026-08-31-path-b-adapt-scope.md` and
   `2026-08-30-office-hours-path-a-path-b-scoping.md`, instead of
   looking it up. The user called this out explicitly: *"you shouldn't
   have asked me about rig, the pull request 143 — just from the name,
   you should have gone to the wiki... this is exactly the sort of
   thing... this is the exact reason why wiki had to be there."* This
   is a live instance of context-brief symptom (a)/(c) — reads being
   advisory instead of mandatory — reproducing itself inside the very
   session meant to diagnose it. Flag this for the structural design:
   any fix needs to make "consult the wiki before asking" load-bearing
   for agents, not just documented as an aspiration.

3. **AHE resolved.** AHE = **Agentic Harness Engineering** (confirmed
   by the user; cross-consistent with B2's "sync engine to prevent
   context rot and continuous agentic harness engineering"). Not yet
   defined in the wiki itself — the term should be added to the
   glossary / decision index in the origin session.

4. **E1 slip.** User initially named five items where only four were
   offered ("regression burn" wasn't on the list). Resolved as a
   verbal slip for "context burn"; final ranking recorded above.

5. **F1/F3 premise correction.** The context brief's framing ("six
   signals in a week, zero shipped") implied a stuck queue; the user
   pushed back — it's deliberate serial prioritization, not a broken
   pipeline. F3's "without office-hours prompting" premise similarly
   corrected: office-hours is orientation/escalation, not a trigger.
   The structural fix should not assume a stuck-queue mechanism where
   none exists.

6. **E2 anti-solution guardrail.** User pre-empted a possible design
   response: do NOT solve the regression loop by softening review.
   This is a hard constraint on any structural fix. The design must
   reduce loop count while preserving (or strengthening) review
   quality.

7. **G1 refused, on principle.** No pinned target number. Design must
   avoid metric-target framings that invite Goodhart-style gaming;
   observables from C3/G2 are directional, not numeric goals.

Bring this back to the origin session for structural design against it.
