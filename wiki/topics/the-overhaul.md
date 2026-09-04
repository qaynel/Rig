# The overhaul

**Start here if you are picking up the 2026-09 workstream.** One page holding
the whole arc: what went wrong, what the diagnosis was, what the evidence says
to build, what was rejected, and what is blocked on a human decision. Every
claim below cites the trace it came from.

Opened 2026-09-04. Nothing in it has been implemented yet.

---

## What this is

A single workstream with three layers that turned out to be the same problem
seen from different distances:

1. **Workflow** — why PR #143 reached 74 commits and ~31k added / 10 removed
   lines when comparable PRs shipped in 1–19.
2. **Product** — whether Rig's stated selling point is the one the market and
   the research actually reward.
3. **Architecture** — why the repository is 185k lines under `rig/` when the
   product is roughly 10k.

They are one workstream because the same fix keeps appearing: the project
produces far more than it consumes, and nothing makes consumption cheap or
mandatory.

---

## How we got here

Office hours on PR #143 moved through several framings before landing:
pipeline-is-broken, then expand-to-sell, then is-this-worth-building-at-all,
then forward-deployed-harness, then dogfooding-counts. The owner rejected
band-aids and asked for a structural pass, then ran a parallel grilling session
and brought back answers A–G.

Origin of the vocabulary this workstream uses:
[product vision](../reasoning/2026-08-30-rig-product-vision-and-tiered-adaptive-install.md) ·
[Path A / Path B scoping](../reasoning/2026-08-30-office-hours-path-a-path-b-scoping.md) ·
[the deferred closed-loop design](../reasoning/2026-09-02-closed-loop-workflow-and-context-realignment.md)
this builds directly on.

---

## The diagnosis

**Rig's knowledge system pairs a mandatory write path with an advisory,
unbounded read path, and has nothing addressable in between.**

Writing is enforced by `CLAUDE.md`: a dated trace every three minutes of active
work, wiki moves in the same change, hubs and indexes updated alongside.
Reading is advisory everywhere: the primer says to follow links "only as far as
the task requires," and the routing table lets a single-step task skip the wiki
entirely. There is no bounded middle — the only two modes are *skip* (cheap,
uninformed) and *follow the links* (informed, unpredictable cost).

All four symptoms the owner named are that one asymmetry:

| Symptom (owner's rank) | The same asymmetry, expressed as |
|---|---|
| Context burn (1) | No bounded read mode exists, so a careful agent pays an unpredictable price and a fast one learns nothing. |
| Regression loop (2) | A fix pass cannot cheaply load the invariants the original code satisfied, so each locally-correct fix is globally regressive and review rediscovers the class. |
| Re-sign multiplier (3) | Same shape one level up: the signature covers a document mixing frozen criteria with unfrozen prose, with no addressable boundary between them. |
| Wiki bloat (4) | Production mandated, consumption optional. Produce exceeds consume by construction. |

**The proof it is live, not theoretical:** the grilling session convened to
diagnose this asked the owner a question already answered in two of the
project's own traces. The owner's reply — *"just from the name, you should have
gone to the wiki... this is the exact reason why wiki had to be there"* — is
the defect reproducing inside the session meant to fix it.

Full argument: [structural workflow fix design](../reasoning/2026-09-04-structural-workflow-fix-design.md).

---

## The fix

**Make the read path bounded and mandatory instead of unbounded and optional.**

One edit, not four, because *bounded* attacks context burn and *mandatory*
closes the regression loop, and consulting at write time is the owner's own
1:2 harden-inline principle turned into a mechanism. It does not touch review
at all, which satisfies the owner's hard constraint that the loop must shrink
without review softening.

Four slices, one commit each, inside the owner's four-hour ceiling:

1. Give `mistakes/` machine-legible routing fields (`enforcement_site`,
   `check`, `paths`) plus a prefilter script that returns a bounded set.
2. Backfill only the classes that have already recurred — capped at ~8, not
   all 30.
3. Add closeouts to the four phase skills that query the ledger and stamp what
   they consulted.
4. Wire a CI check so the obligation cannot rot back into advice.

**The defect condition, stated up front:** if the bounded query gets *added*
to the existing advisory read rather than *replacing* it, this design makes the
owner's worst symptom worse. Replacement is load-bearing.

**The honest limit:** the consultation stamp is self-reported. CI can prove the
ledger is well-formed and the closeout exists; it cannot prove an agent read
the row. The stamp is instrumentation that shows which rows deserve promotion
into real fail-closed CI greps — calling it enforcement would buy the same
blind spot the AHE literature is candid about.

---

## The strategic finding

**The owner's ranked non-negotiables #1 and #2 should swap.**

Stated ranking: (1) dynamic onboarding, "the entire selling point"; (2) human
signing; (3) spec-driven development. The evidence inverts the first two.

- **Dynamic onboarding is the most contested square on the board.** OpenSpec
  has ~52k stars, is the most actively maintained open-source SDD framework,
  and its explicit core positioning *is* brownfield: minimalist, token-
  efficient, diff-based. Superpowers is at ~166k. Superspec already fuses the
  two. Rig entering there has no distribution advantage — and Rig's catalogue
  vendors those same projects.
- **The human-signed oracle has no incumbent and a live research literature.**
  The Verification Horizon (Qwen, June 2026) states the inversion directly:
  generating solutions is no longer hard, reliably verifying them is; "every
  verifier is only a proxy for human intent." It ranks *the user as verifier*
  most faithful, and its own tamper-resistance answer is behavioral
  monitoring — after-the-fact detection, not prevention. SpecBench found
  **every model saturates the visible test suite on every task**, with the
  validation-to-holdout gap growing 28 points per tenfold increase in code
  size. Nothing surveyed cryptographically freezes the acceptance criteria
  under a human key. Rig does, today.

Positioning that follows, in one line:

> **Your coding agent cannot edit the test that grades it, and your CI proves it.**

**The counterweight, which is real:** novel and unvalidated are the same fact.
The only person known to feel this pain is the owner, who already feels its
*cost* — the re-sign multiplier helped blow PR #143 to 74 commits.

Evidence and sources: [landscape research](../reasoning/2026-09-04-landscape-research-in-flight.md) ·
[finished-product design](../reasoning/2026-09-04-finished-product-design.md).

---

## Recommended sequence

Approach A (lead with the gate), distributed the way Approach C describes
(compose with Superpowers and OpenSpec rather than replace them). Rationale:
the target is **15 daily active users**, not 15,000 — that does not come from
out-featuring a 166k-star project, it comes from one sentence true of you and
false of everyone else.

1. The workflow fix above. Unchanged, four commits.
2. **Signing UX** — agent packages lock and delta together, human does one
   physical auth; bulk re-sign clears one, some, or all invalidated items.
   This is the blocking dependency: the wedge is unusable while the ceremony
   costs two approvals per change.
3. **Deletion pass** — the architecture findings below. Before the
   re-architecture, so it has less to carry.
4. **Repositioning** — README and the one-line claim. Cheap, and it is what
   recruits the fifteen.
5. Dynamic `.rig` onboarding re-architecture — still worth doing, now as
   install experience rather than as the selling point.
6. AHE (Agentic Harness Engineering).

Steps 2 and 3 take the slots originally assigned to the onboarding
re-architecture. Everything else keeps the owner's stated order.

---

## Architecture findings

Measured on this branch, using the deep-module vocabulary (depth is leverage at
the interface; the deletion test asks whether complexity vanishes or reappears
across callers).

- **The skill payload is triplicated.** Every Tier 1 skill exists as three
  byte-identical copies, the rule body is duplicated six more times across host
  adapters, `scripts/check-rule-copies.js` exists solely to police them, and
  `rig/manifest.json` spends 56 of its 72 rows enumerating the copies. The seam
  sits at "per-host directory," replicated at authoring time; it should be one
  canonical set plus a `projectForHost()` projection. Deleting the copies
  collapses complexity into one function rather than spreading it.
- **Two parallel install mechanisms.** `payload.js` (static manifest) and
  `onboarding.js` (adaptive graft). The depth numbers say which way to
  collapse: `onboarding.js` is the best-shaped module in the codebase at ~186
  lines per export; `payload.js` is ~39. Make the manifest an input to
  onboarding, not a second path.
- **The services matrix fails the deletion test.** 805 files, 4,520 lines, 115
  services × 7 formulaic filenames, self-declared in its own text as "generic
  baseline practice, not a claim of repository-tailored coverage."
- **The catalogue is 88% of `rig/`** — 162,599 of 185,335 lines, mostly other
  people's skills. Reference it, do not vendor it.

Together these remove roughly **165k of 185k lines under `rig/`** without
removing product. Mostly deletion, not construction. Nothing has been deleted.

---

## Rejected, and why

- **Decoupling the oracle from prose** — was called the single
  highest-leverage edit before grilling. Retired by the owner's own answer:
  they want the signature to stay tied to the document. What they actually
  asked for is bulk re-sign plus single-physical-auth packaging.
- **A scope guard at review closeout** — evidence says PR #143 grew through a
  deliberate fix-at-source review loop, not scope drift.
- **Softening review to shrink the loop** — pre-empted by the owner as a hard
  anti-solution. Treating the symptom by removing the check.
- **A pinned target metric** — declined on Goodhart grounds. Directional
  observables only: shorter commit histories, pass@1 on acceptance criteria,
  close-to-1:1 deletion-to-addition ratio.
- **A full harness-evolution port** (NexAU / harbor / Agent Debugger) — no
  fixed task corpus in Rig; would rebuild multi-week infrastructure before
  learning anything.

---

## Open decisions — work is blocked on these

1. **Who is the first user who is not the owner?** "≥15 daily active users" is
   a target, not a person. Every recommendation above is unfalsifiable until
   this is answered.
2. **Has anyone other than the owner ever run Rig on their own repo?** If not,
   that observation outranks all six build steps.
3. **Does the #1/#2 swap land?** Demoting dynamic onboarding contradicts a
   ranked non-negotiable. Owner's call.
4. **Does the deletion pass have a veto?** ~165k lines proposed for removal;
   nothing touched.
5. **`CLAUDE.md` still asserts markdown-only Tier 1.** The owner retired that
   policy on 2026-09-04 (grilling B2): Tier 1 is meant to be dynamic scripts
   plus markdown plus MCP, and a sync engine is wanted. The correction is not
   yet applied — it is a policy statement about the owner's product, flagged
   rather than changed. **Until it is applied, do not reject an approach on
   markdown-only grounds.**

---

## Everything in one place

| Read | What it holds |
|---|---|
| [Grilling answers A–G](../reasoning/2026-09-04-structural-workflow-fix-grilling.md) | The owner's own words: non-negotiables, trade ceilings, symptom ranking, test criteria, plus seven grilling-agent notes. The authority for every "the owner said" claim on this page. |
| [Structural workflow fix design](../reasoning/2026-09-04-structural-workflow-fix-design.md) | Root cause, the one-line fix, four slices with verification commands, the honest limit, premise corrections. |
| [Landscape research](../reasoning/2026-09-04-landscape-research-in-flight.md) | Repository measurements, the 2026 SDD competitive map, and the verification literature with sources. |
| [Finished-product design](../reasoning/2026-09-04-finished-product-design.md) | Office-hours pass against the six-month target: five premises, three costed approaches, the recommendation, architecture findings, the assignment. |
| [Wiki maintenance sweep](../reasoning/2026-09-04-wiki-maintenance-sweep.md) | What the 2026-09-04 cleanup changed and why, including a generated-page defect and a wrong convention. |
| [Closed-loop design](../reasoning/2026-09-02-closed-loop-workflow-and-context-realignment.md) | The deferred design this workstream builds on: three structural gaps, ten debloat techniques, seven tranches. |
| [Closed-loop conversation record](../reasoning/2026-09-03-closed-loop-conversation-record.md) | Resume-from-cold entrypoint for that design. |
| [Quick reference](../index/quick-reference.md) | Bounded, task-addressable routing with size hints. The navigation half of the fix above. |

**Related hubs:** [what Rig is](what-rig-is.md) ·
[the two gates](the-two-gates.md) · [Gate 1 signing](gate1-signing.md) ·
[onboarding flow](onboarding-flow.md) ·
[agent working conventions](agent-working-conventions.md) ·
[testing strategy](testing-strategy.md)

---

## Status

Design filed, nothing implemented. The repository carries the traces above, a
quick-reference index, a glossary expansion, and the 2026-09-04 wiki sweep —
no product change. Slice 1 of the workflow fix is the next action and is
waiting on the owner's go-ahead; the five open decisions above gate everything
past it.
