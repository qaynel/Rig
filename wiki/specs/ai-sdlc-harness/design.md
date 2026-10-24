---
status: superseded
checked: 2026-10-23
owner: rig-product-design
---

# Historical first draft: the AI SDLC harness that remembers

Superseded as the current design by the [product-first planning package](README.md) and the [owner directive](../../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md). Retained as the original reasoning record; its memory-only scope and open-decision claims are not current.

Builder-mode design doc, 2026-10-23. Produced by `/office-hours` from the owner
vision trace, the owner frustration profile, and a verified code diagnosis.
Nothing here is implemented. No scope is committed. The 6.0.0 closeout is
untouched.

Sources:
[vision](../../reasoning/2026-10-23-ai-sdlc-harness-expansion-owner-vision.md) ·
[frustration profile](../../reasoning/2026-10-23-owner-frustration-profile.md) ·
[circles diagnosis](../../reasoning/2026-10-23-why-the-cycle-runs-in-circles.md)

## What the owner asked for

All three slices, not one:

1. Close the loop — documentation and logging as owned phases
2. Carry preferences — the harness knows their taste without being told
3. Recursive self-improvement — the harness gets better the more it is used

Plus one directive that shapes everything below:

> Work from my side should be only directional and opinionated. All the heavy
> lifting, all the organization, and all needs to be done from the agent side.

And one definition of the only acceptable blocker:

> The only blocker needs to be intent. If you are not clear on anything, that is
> the only blocker.

## The diagnosis, in one line

Every loop in this project is an amnesia loop: the system writes a record that
nothing is obliged to read.

Verified today, three scopes of the same fault:

| Scope | Written | Read by | Result |
|---|---|---|---|
| Review rounds | seven finding categories, every round | nothing | same classes rediscovered forever |
| Project record | 371 traces, 3.6 MB | advisory only, ~21k tokens to orient | settled decisions re-litigated |
| Across projects | nothing portable | nothing | "kaput, everything's gone" |

The sharpest instance is three lines of code. `scripts/review-receipt.js` keeps
exactly one thing across rounds — `{ authorContext, failures: N }` — and spends
it solely on locking the owner out at `MAX_RE_REVIEWS = 1`. The seven finding
categories it asks the reviewer to produce are printed and discarded.

So the three asks are not three features. They are one fix at three scopes:
preferences are memory across projects, closing the loop is memory of what the
work produced, and self-improvement is memory of what went wrong fed back as a
check. **The recursive self-improvement the owner wants is the repair for the
defect they are already living with.**

## The design: three parts

### Part 1 — The ledger

One small file per repository. Agent-written, owner-never-edited. Four sections:

- **Decided** — settled decisions with their reason. The North star, generalised.
- **Preferences** — directional taste: safety first, least infrastructure,
  minimal diff, delete rather than defer, honest gaps over quiet passes.
- **Recurring** — finding classes that have fired before, with a count.
- **Where we are** — the resume point: phase, artifact, the one next action.

Two properties make it work, and both are load-bearing:

**It is size-capped.** The cap is the feature, not a compromise. The existing
wiki failed because it was complete and therefore unaffordable to read, so
reading stayed advisory. A bounded artifact can be made mandatory. Bounded and
mandatory beats complete and advisory.

**It is mandatory to read.** Every phase transition reads it. This is the inverse
of today's contract, where writing is mandatory and reading is not.

### Part 2 — The pre-flight gate

This is the behaviour the owner described directly:

> It automatically tells me before we proceed any further, "I've noticed that we
> have not done this so can you please get that done before we do that?"

Before advancing any phase, the agent checks the ledger's **recurring** list and
the artifacts the next phase requires, and reports what is missing — before doing
the work, not after it fails. A finding class that has fired twice becomes a
pre-flight question, not a rediscovery three rounds later.

The owner never has to ask for this. That is the point of it.

### Part 3 — The graduation rule

The owner's own rule, applied to findings:

> If I am instructing you on something twice, it's a skill. It's a policy.

A finding class that fires twice must graduate into an automated check. It then
leaves the ledger, because the check now holds it.

This gives the cap a forcing function. When the ledger approaches its size
limit, items must either graduate into checks or be dropped — it cannot grow.
That is recursive self-improvement with a mechanism instead of a hope, and it is
the only part of the design that makes the harness measurably better with use
rather than merely better-documented.

## How this maps to the owner's pipeline

The owner's stated cycle, and where each part lands:

| Owner's phase | What changes |
|---|---|
| specs | unchanged; grilling already covers it |
| acceptance criteria | unchanged |
| **lock** | see note below — the owner locks earlier than Rig does |
| scope of work | new explicit phase; today it is implicit |
| development | unchanged |
| implementation using lower models | ledger makes this viable: a cheap model with a bounded, authoritative context |
| loop until acceptance met | **the fix lands here** — rounds stop being independent draws |
| final cleanup | pre-flight gate drives it |
| closing out | documentation + logging become owned phases |
| push | unchanged |

**Note on lock ordering, worth a decision.** The owner's order is
specs → acceptance → **lock** → scope of work. Rig's current order locks after
the technical specification, which puts the tech spec inside the frozen set.
That is why the record shows every wording edit costing a re-sign ceremony. The
owner's instinct locks earlier and freezes less, which would cut re-sign churn
and still prevent an agent bending acceptance to fit its own solution. This is a
real difference between what is built and what was asked for.

## What stays the owner's job

Directional and opinionated only:

- state intent and taste
- choose between options the agent frames
- hold the signing key

Everything else moves agent-side: organisation, sequencing, artifact production,
handoff briefs, deciding which agent does what, and knowing where the work
stopped.

The interaction the owner described as correct:

> I should only be saying: "this is what I want, this is how I want it, get that
> done for me." You would come back and say: "I get it, these are the processes
> we'd have to follow to get that safely. Let me know if you want to do it in
> this session or another session."

## Safety without the owner knowing the safe answer

> I may not know what is the safest thing but I know that I don't want to get
> hacked. It's your job to give me options which do not let me get hacked.

Consequence for option framing: the agent never offers an unsafe option as a
peer choice. Options differ in cost, scope, and effort — never in whether the
result is exploitable. Where a cheaper path is genuinely less safe, that is
stated as a named gap rather than presented as a trade the owner can casually
take. The safety baseline is not a menu item.

## The transfer profile

The ledger, exported. This answers the owner's "do you have a transfer profile?"
prompt directly: onboarding on a new repository asks for one, and if supplied,
imports **decided** and **preferences** while starting **recurring** and
**where we are** fresh (they are repository-specific).

This is the owner's "key part" and it falls out of Part 1 at no extra design
cost, which is the main argument for building the ledger before anything else.

## Explicitly out of scope

- No numeric success target. The owner declined one on purpose: "the moment a
  metric becomes a target, the harness will optimize for the metric."
- No new model runtime, no model key, no competing with host providers on
  execution. Unchanged from the North star.
- No change to the human-signed oracle as the gate.
- Nothing lands during the 6.0.0 closeout.

## Separable repair, available now

Independent of everything above, and small: `scripts/review-receipt.js` charges
infrastructure failures to the owner's authorization cap. A review killed by a
provider limit or its own timeout increments the same counter as a review that
ran and found real problems. The record shows this firing three times in four
days. Distinguishing "ran and failed" from "never ran" removes a named
frustration and does not need any of the design above.

## The assignment

Export your current preferences by hand, once, into a single page: the ten or so
directional statements you would want a brand-new agent on a brand-new project
to have before it does anything. Not for the product — for you, to find out
whether the ledger's **preferences** section is ten lines or a hundred. The
answer decides whether the cap is credible, and it is the one input no amount of
trace reading can give me.
