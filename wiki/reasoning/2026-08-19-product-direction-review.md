---
date: 2026-08-19
source: intent owner
topics: what-rig-is, the-catalogue, delivery-plan
decisions:
---

A product-point-of-view review of the whole repository, opened by the intent
owner because the current direction felt over-engineered. Filed so the session
can be restarted from any point. The delivery question it raises is left open at
the end; nothing here changes a gate.

## What the intent owner wants the product to be

Verbatim: a framework for standardising the AI software development cycle. The
things they had to build by hand on their own journey and want the framework to
own: context maintenance, multiple-document management, general change
management, spec-driven development, and making the agent process
deterministic. And they want it to serve as many agent hosts as possible. Their
own words include: "I think I have over engineered the current implementation,
but then I want this thing to like serve as many host that is possible."

## The review, as delivered

The repository holds two things that read at first like competing products:

- **Tier 1** — the markdown bootstrap. ~373 lines: one router (`routing.md`)
  plus focused skills (grilling, product-design, implementation, execution,
  tdd, debugging, code-review) and one always-on implementation rule. Installs
  across ~13 hosts, no runtime, no keys, no dependencies. It works today, and it
  already is the "standardised agentic dev cycle across many hosts" the intent
  owner described.
- **Tier 2** — the à-la-carte catalogue plus the two-gate governance apparatus.
  805 taxonomy leaf files, a ~2,467-LOC materialization engine, ~14,157 lines of
  governance wiki. Of 115 services, 0 are semantically authored; 432 files still
  carry `TODO(Slice 10)`. The 19 `advanced-*.test.js` files are green and, per
  `status.md`, worthless (calibrated to placeholder content). Blocked behind
  Gate 2, which is a failed round-3 candidate.

First diagnosis offered: the over-engineering the intent owner senses is real
and concentrated in the governance shell (signed intent gates, digest-bound
receipts, one-use approvals, policy-signer recovery, freeze-before-code) wrapped
around a solo project. Evidence it is not paying for itself: zero shipped
leaves, worthless tests, a spec that will not freeze.

## The intent owner's correction — B is not a competitor

The intent owner rejected the "two competing products" framing. Verbatim
sense: Product B is meant to be a **refined, targeted version of Product A**.
Tier 1 materialises a fixed workflow with no context of the repository it is
installed into; Tier 2 is meant to onboard **only the context and skills
relevant to the specific project**. "A full application needs a lot of API
related expertise and custom knowledge; a specific standalone application needs
something else." One product at two levels of intelligence, not two products.

This reframes the whole review. The intent behind the catalogue is sound: a
blind install is worse than a targeted one. The question moves from "which
product is the product" to "what is the right mechanism to deliver targeting."

## The catalogue leaves are real work, and why they stalled

The intent owner is explicit that the `TODO` leaves are genuine product
development, not scaffolding to delete: "all of those are needed... but then all
of them are targeted." The end state is an install that onboards only the
relevant subset.

The reason they were not delivered, in the intent owner's own diagnosis:
**context rot.** "I got sidetracked a lot because I think it's due to context
rot that I was not able to deliver on all of this." This is the sharpest signal
in the session: the product exists to defeat context rot across the agentic dev
cycle, and context rot is what defeated its own construction. The 0/115 and the
432 placeholders are the symptom.

## The open fork: horizontal freeze-then-burn vs vertical slice-first

Two shapes for authoring the 115 leaves.

- **Horizontal (intent owner's stated preference).** Nail down the decisions,
  which the intent owner believes are few, and freeze the specs from the human
  side now. Then the agent authors all 115 on its own time; implementation is
  just tokens. Verbatim: "once I nailed down the decisions which I thought were
  like very few that I could ship out all the 115 entities together... just
  nailed down all the specs right now, freeze them from my side, and then the
  agent can go around on its own time... once the intent is clear from my side
  code is just cheap." The intent owner wants the agent to think this way too.

- **Vertical (agent's recommendation).** Pick one leaf the intent owner would
  install into their next real project. Author it end to end — skill content,
  check, install wiring, real test — and ship it so it installs and works, on
  its own, before freezing the spec or touching the other 114. Each leaf is a
  small context opened, finished, and closed, so the rot that killed delivery
  never accumulates. Let the first shipped leaf teach the spec what to say.

The agent's case against pure horizontal, on repository evidence: Gate 2 is a
failed round-3 candidate with a live rollback-vs-resume contradiction
(`AT-INSTALL-1`), which is what "nail the specs from my side" work looks like
when the decision set is not actually small; and the delivery-plan hub already
records that bulk/parallel authoring is what produced the 432 placeholders, with
sequential authorship chosen in Gate 2 §14 specifically to avoid repeating it.
So "freeze then burn all 115 together" is close to the approach the repo already
tried and rejected.

The intent owner's case for horizontal is principled and not yet answered:
intent is the scarce resource, code is cheap once intent is clear, and the
decisions may genuinely be few and shared across all 115.

Unresolved. The reconciliation on the table is that a vertical slice is the
fastest way to *earn* the freeze the intent owner wants: ship one real leaf, let
it force the framework contradictions (like `AT-INSTALL-1`) into the open,
resolve them against evidence, then freeze and let the agent burn tokens across
the rest.
