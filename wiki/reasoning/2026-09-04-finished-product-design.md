---
date: 2026-09-04
source: agent
topics: what-rig-is, distribution-and-release, the-catalogue, onboarding-flow, gate1-signing
decisions:
status: current
supersedes:
tags: interdependency, design, office-hours
summary: Office-hours design against the C4 finished-product expectation — the 2026 verification literature and the SDD competitive map say Rig's wedge is the human-signed oracle (owner's B1 #2), not adaptive onboarding (B1 #1); three approaches costed, one recommended, plus four architecture findings worth ~165k lines.
---

# Finished-product design — office hours against C4

Run while the intent owner was away, on their instruction to research deeply
and have suggestions and solutions ready on return. Office-hours register:
positions taken, not options surveyed.

Because the owner was out, the six forcing questions were answered from the
record rather than asked — per `rig-grilling` process step 1, which requires
deriving from the existing record before spending the owner's time, and
declaring every inference outright. Every inference is declared in Part 6, and
the four questions the record genuinely cannot answer are listed there too.

Inputs: [[2026-09-04-structural-workflow-fix-grilling]] (owner answers A–G),
[[2026-09-04-landscape-research-in-flight]] (measurements + sources),
[[2026-09-04-structural-workflow-fix-design]] (the workflow fix already
designed), [[2026-08-30-rig-product-vision-and-tiered-adaptive-install]].

---

## Part 1 — The target, restated

From C4 and the north star, the finished product is:

- ≥15 daily active users at six months.
- Clone to first shipped feature in 5–6 hours.
- The installed user's agent is not exploring the codebase, it is running
  with it: it knows to write an `architecture.md`, to stand up a wiki on a
  long-lived project, to follow the SDLC, and to guide the user through each
  next step so the user never has to know the cycle exists.
- Metaphor: ready-to-use exoskeleton. North star: the agent, through the
  power of language, translates human thoughts into shippable, hardened code.

**The most important number here is 15.** Not 15,000. That single fact
changes the whole strategy and most of this document follows from it: this is
not a market-share fight against a 166k-star incumbent, it is a
find-fifteen-people problem. The winning move for fifteen people is the
sharpest possible "this is for you," not the broadest possible feature set.

---

## Part 2 — Premise challenge

Five premises. Each is stated as something to agree or disagree with, with
the evidence behind it and what would change my mind.

**P1. Adaptive onboarding is not a differentiator. It is the most contested
square on the board.**

B1 ranks dynamic onboarding first and calls it "the entire selling point."
The landscape says otherwise. OpenSpec has ~52k stars, is described as the
most actively maintained open-source SDD framework, and its explicit core
positioning is brownfield: minimalist, token-efficient, diff-based,
specifying changes rather than whole systems. That is Rig's claimed wedge,
already shipped, already adopted, already maintained by more people.
Superpowers is at ~166k stars. Superspec already fuses the two. Fifteen-plus
SDD frameworks now carry side-by-side comparison posts.

*What would change my mind:* a specific repository shape where OpenSpec and
Superpowers both visibly fail to adapt and Rig visibly succeeds, demonstrated
on someone else's repo, not this one.

**P2. The human-signed oracle is unserved, and it maps to a named, growing,
externally-validated problem.**

The Verification Horizon (Qwen, June 2026) states the inversion directly:
generating solutions is no longer the hard part, reliably verifying them is.
It frames verification along scalability, faithfulness, and robustness, and
argues no existing approach achieves all three — unit tests are scalable and
robust but "cover only a thin layer of intent"; LLM judges are scalable and
faithful but "vulnerable to exploitation." It names **the user as verifier**
as the most faithful class, limited by sparsity and extraction cost.

SpecBench quantifies the failure: across 30 systems-level tasks **every model
saturates the visible test suite on every task**, and the validation-to-holdout
gap grows 28 percentage points per tenfold increase in code size.

Rig's Gate 1 is user-as-verifier made durable and tamper-evident, with one
physical signature amortized across many agent iterations. That is a direct
claim on the empty square of the triangle.

And nothing in the surveyed literature recommends it. The Verification
Horizon's own tamper-resistance answer is behavioral monitoring — detecting
when an agent retrieves original PRs or "modif[ies] tests or the verifier" —
which is after-the-fact detection, not prevention.

*What would change my mind:* finding a shipped tool that cryptographically
freezes the acceptance criteria under a human key. I looked and did not find
one.

**P3. Novel and unvalidated are the same fact, and this is the real risk.**

P2's strength is also its weakness. Nobody recommending it may mean nobody
has needed it badly enough to build it. The one person known to feel the pain
is the owner, and A2/B3 show they already feel the *cost* of the ceremony —
the re-sign multiplier is a documented contributor to PR #143 reaching 74
commits. A wedge is only a wedge if someone else feels the pain too, and that
evidence does not exist yet.

*What would change my mind:* one other developer, unprompted, describing an
agent that edited its own acceptance criteria.

**P4. Vendoring the catalogue is a net liability.**

`rig/catalog/` is 1,214 files and 162,599 lines — 88% of everything under
`rig/`. It is largely other people's skills (gstack, Superpowers) checked
into this repository. Vendoring inherits their maintenance burden and their
upgrade cadence while adding nothing a user could not install directly from
projects with more stars and faster releases.

*What would change my mind:* evidence that the pinning and grading layer over
the vendored set produces a result users prefer to installing upstream.

**P5. 805 of those files are generated filler that disclaims its own value.**

`rig/catalog/services/` is exactly 115 service directories × 7 fixed
filenames = 805 files, 4,520 lines, mean 5.6 lines each, machine-authored by
`scripts/author-policy-catalogue.js`. The content says, in its own words:
"Policy grade. This is generic baseline practice, not a claim of
repository-tailored Context or Evidence coverage."

805 files carrying a disclaimer that they are not tailored to the installing
repository is surface area, not product.

*What would change my mind:* a user-visible behavior that breaks if they are
deleted.

---

## Part 3 — The one thing the research changed

**The owner's B1 #1 and #2 should swap.**

B1 ranks: (1) dynamic onboarding, "entire selling point"; (2) human signing,
codebase safety against the agent; (3) spec-driven development.

The evidence says: (1) human signing is the only pillar with no incumbent and
a live research literature naming the problem; (2) spec-driven development is
table stakes that fifteen frameworks already provide; (3) dynamic onboarding
is a commodity in a fight Rig cannot win on distribution.

This is not a small correction. It changes what the product leads with, what
the README says, what gets built next, and what gets deleted. It also does
not require abandoning anything — dynamic onboarding stays as the install
experience, it just stops being the claim.

Reframed positioning, one line:

> **Your coding agent cannot edit the test that grades it, and your CI proves
> it.**

That is legible in a sentence, it is true of Rig today, it is false of every
competitor named above, and it targets a fear that the 2026 literature has
made respectable rather than paranoid.

---

## Part 4 — Three approaches

### Approach A — Signed Oracle (lead with the gate)

Reposition around human-signed verification. The product is the grilling →
acceptance criteria → freeze → CI-anchored verify loop, installable in
minutes on any repo with any harness. Adaptive onboarding stays as the
install path, demoted from headline to plumbing. The catalogue is dropped or
referenced rather than vendored.

- **Effort:** M (human: ~3 weeks / CC: ~4–5 sessions)
- **Risk:** Medium — demand for the category is unproven (P3)
- **Reuses:** Gate 1 signing, the armed CI pin anchor, `rig/tier-1` skills,
  `approve-gate1.js`. Most of it already exists and works.
- **Pros:** only unserved position available; externally citable problem
  statement; smallest surface to maintain; matches B1 #2 and #3 exactly.
- **Cons:** contradicts the owner's stated #1; the signing ceremony must get
  much cheaper first (A2/B3) or the wedge is unusable in practice.

### Approach B — Exoskeleton (the stated plan, followed literally)

Execute C1 in order: workflow fix, then re-architect around dynamic `.rig`
onboarding, then AHE. Build the full adaptive install that grafts onto any
repo and guides the user through the whole SDLC.

- **Effort:** XL (human: ~3–4 months / CC: many sessions)
- **Risk:** High
- **Reuses:** `onboarding.js` and the Path B work already merged.
- **Pros:** it is the coherent product vision; "clone to shipped in 5–6
  hours" is a legible promise; it is what the owner actually wants to build.
- **Cons:** head-on into OpenSpec and Superpowers with no distribution
  advantage; the catalogue is a repackaging of free things; the largest
  build for the least defensible ground. D1's one-week pause ceiling cannot
  accommodate it, so it necessarily runs as many small PRs, which is the
  exact regime that produced PR #143.

### Approach C — Verification layer under someone else's harness (lateral)

Stop competing with Superpowers and OpenSpec. Become the thing all of them
lack. They generate the spec; Rig freezes it under a human key and enforces
at the merge boundary. Ship as a composable plugin alongside them rather
than as a replacement.

- **Effort:** S–M (human: ~2 weeks / CC: ~3 sessions)
- **Risk:** Low–Medium
- **Reuses:** everything Approach A reuses, minus the install-experience work.
- **Pros:** distribution comes free by riding installed bases; Superspec
  proves users already compose these frameworks; smallest possible surface;
  fastest path to a non-owner user.
- **Cons:** gives up owning the pipeline; makes B1 #1 irrelevant rather than
  demoted; ties Rig's fate to upstream projects' conventions.

---

## Part 5 — Recommendation

**Approach A, distributed the way Approach C describes.**

Build the signed oracle as the product and lead with it. Ship it so it
composes with Superpowers and OpenSpec instead of replacing them. Keep the
Rig pipeline for people who want the whole thing — it is 733 lines of
markdown and costs almost nothing to keep — but stop leading with it.

Why this and not B: because of the number 15. Fifteen daily active users do
not come from having more features than a 166k-star project. They come from
one sentence that is true of you and false of everyone else. Rig has exactly
one of those, and it is not adaptive onboarding.

Why A rather than pure C: pure C caps Rig at being a component. A keeps the
whole pipeline available for the users who want the exoskeleton, which is the
owner's actual vision, while making the gate the thing that gets someone to
install it in the first place.

**Sequencing, which respects C1's ordering rather than replacing it:**

1. The workflow fix already designed. Unchanged. Four commits, four hours.
2. **Signing UX** — A2 and B3, not the onboarding re-architecture. The agent
   packages the lock and delta together, the human does one physical auth,
   and bulk re-sign lets them clear one, some, or all invalidated items at
   once. This is the blocking dependency for A: the wedge is unusable while
   the ceremony costs two approvals per change.
3. **Deletion pass** — P4 and P5. Costed in Part 7. Do it before the
   re-architecture, not after, so the re-architecture has less to carry.
4. **Repositioning** — README, plugin manifest, and the one-line claim.
   Cheap, and it is what actually recruits the fifteen.
5. Dynamic `.rig` onboarding re-architecture — still worth doing, now as
   install experience rather than as the selling point.
6. AHE.

Steps 2 and 3 swap into the slots C1 assigned to the onboarding
re-architecture. Everything else keeps its order.

---

## Part 6 — Inferences declared, and what I could not answer

Per `rig-grilling` step 1, inferences drawn from the record rather than
asked. Remove any that are wrong.

- **Q1 demand reality** — inferred *weak*. The record shows one user (the
  owner), no external installs, and C3's primary success signal is the owner's
  own self-report. Nothing in the wiki records another person using Rig.
- **Q2 status quo** — inferred as raw Claude Code plus hand-written
  `CLAUDE.md`, plus whichever of gstack/Superpowers/OpenSpec the developer
  installed. Rig's own repo demonstrates this stack.
- **Q4 narrowest wedge** — inferred as the signed oracle per Part 3, against
  the owner's stated answer of the full 5–6 hour clone-to-shipped flow.
- **Q6 future-fit** — inferred *strong*, and this is the best news in the
  document. Every trend line in the 2026 literature makes verification harder
  and more valuable: longer horizons, larger diffs, more capable models,
  measured 28pp-per-10× degradation. Rig gets more essential as the world
  moves, and that argument is citable rather than asserted.

**Four questions the record cannot answer. These need the owner.**

1. **Q3, desperate specificity.** "≥15 daily active users" is a target, not a
   person. Who is the first one? Name someone real, with a role and a reason.
   Everything in Part 5 is unfalsifiable until this is answered.
2. **Q5, observation.** Has anyone other than the owner ever run Rig on their
   own repository? If not, that is assignment #1 and it outranks all six
   build steps.
3. **Does P1 land?** Demoting dynamic onboarding from "entire selling point"
   contradicts a ranked non-negotiable. That is the owner's call, not mine,
   and I have stated the evidence rather than assumed the answer.
4. **Does the deletion pass have a veto?** P4 and P5 propose removing ~165k
   lines. I have not touched anything.

---

## Part 7 — Architecture findings

Analyzed with the deep-module vocabulary: depth is leverage at the interface,
a seam is where an interface lives, and the deletion test asks whether
complexity vanishes or reappears across callers.

Measured interface width across `rig/lib` (lines per export — higher is
deeper):

| Module | Lines | Exports | Lines/export |
|---|---|---|---|
| `onboarding.js` | 930 | 5 | **186** |
| `lint-format.js` | 920 | 21 | 44 |
| `payload.js` | 695 | 18 | 39 |
| `policy.js` | 605 | 17 | 36 |
| `catalog.js` | 292 | 15 | 19 |
| `config.js` | 82 | 8 | 10 |

`onboarding.js` is the best-shaped module in the codebase: a lot of behavior
behind five entry points. `catalog.js` and `config.js` are the shallowest —
nearly as much interface as implementation.

The file-level caller graph is now healthy; every `rig/lib` module has at
least one production caller, so the trap recorded in `index/traps.md` about
modules with no shipped callers is closed at file granularity.

### Finding 1 — the skill payload is triplicated, and a CI check exists to police it

Every Tier 1 skill exists as **three byte-identical copies**:
`rig/tier-1/skills/<name>/SKILL.md`, `.claude/skills/rig-<name>/SKILL.md`,
and `.agents/skills/rig-<name>/SKILL.md`. Verified byte-identical for all
eight. The rule body is duplicated a further six times across host adapters,
and `scripts/check-rule-copies.js` exists solely to keep those equal.
`rig/manifest.json` carries 72 rows, 56 of them `copy`, largely enumerating
these copies per host.

The seam is in the wrong place. It currently sits at "per-host directory,"
replicated at authoring time. It should be a canonical skill set plus a
`projectForHost(host)` function — a deep module with a small interface
(`project(skills, host) → files`) and a large implementation holding every
host quirk. `payload.js` already does half of this at install time; it is
simply not used at authoring time.

Deletion test: delete the `.claude/` and `.agents/` trees and the complexity
collapses into one function rather than reappearing across callers. Delete
`check-rule-copies.js` and nothing is lost, because the duplication it
polices no longer exists.

Payoff: 16 fewer files, 56 manifest rows down to roughly 8, one fewer CI
check, and adding a host becomes one projection entry instead of eight new
files. This is B4's own answer, and B4 is right that it is cheap.

### Finding 2 — two parallel install mechanisms

`payload.js` (static manifest install) and `onboarding.js` (adaptive graft)
are two independent ways to put Rig into a repository. C1's follow-on already
says collapse to dynamic. The depth numbers say which direction to collapse:
`onboarding.js` at 186 lines per export is the deep one; `payload.js` at 39
is a much wider interface for less behavior. Make the manifest an *input to*
onboarding rather than a second path through the system.

### Finding 3 — the services matrix fails the deletion test

805 files, 4,520 lines, 115 services × 7 formulaic filenames, self-declared
as not tailored to the installing repository. Delete it and what complexity
reappears across callers? The grading vocabulary — minimal, mid, maximal —
which fits in a 30-line table. Recommend deleting or collapsing to one
generated table.

### Finding 4 — the catalogue is 88% of `rig/` and is mostly other people's work

162,599 of 185,335 lines. Reference it, do not vendor it: the catalogue
becomes a pinned manifest of upstream sources rather than 1,214 checked-in
files. This also removes the upgrade-cadence coupling to gstack and
Superpowers releases.

**Combined, findings 1, 3, and 4 remove roughly 165k of the 185k lines under
`rig/` without removing product.** That is the single largest lever available
for C2's loop-count goal and E1's context burn, and it is mostly deletion
rather than construction.

---

## Part 8 — What not to do

- Do not soften review to reduce the loop (E2 anti-solution guardrail).
- Do not pin a target metric (G1, Goodhart).
- Do not start the onboarding re-architecture before the signing UX. The
  re-architecture makes the ceremony more frequent, not less, so doing it
  first compounds the exact cost A2 and B3 asked to reduce.
- Do not begin any of this before answering Q3 and Q5 in Part 6. A wedge
  aimed at nobody in particular is a hobby, and the record currently shows
  zero non-owner users.

---

## Part 9 — The assignment

One concrete action, not a strategy.

**Find one person who is not you, get them to install Rig on their own
repository, and watch without helping.**

Not a demo. Not a walkthrough. Watch, and write down the first thing they do
that surprises you. Per C2's own loop and Q5's standard, that single
observation outranks every build step in Part 5, and it is the only thing
that can turn P3 from a risk into either a validated wedge or a saved
quarter.

---

## Part 10 — Session log

**2026-09-04 (this session, agent):** Filed while the owner was away. Nothing
implemented; the repository is unchanged apart from this trace, its two
companion traces, and the generated index. No deletions performed — Part 7's
findings are proposals awaiting the Part 6 Q4 veto.
