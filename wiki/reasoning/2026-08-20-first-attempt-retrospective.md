---
date: 2026-08-20
source: intent owner
topics: delivery-plan, the-catalogue, what-rig-is
decisions:
---

A retrospective on the first attempt to build the catalogue, in my own voice.
The point is to name the mistakes plainly so I do not repeat them and so any
agent picking this up can see the shape of the hole I dug. None of this changes
a gate. It is the journey, and the list of what not to do.

The irony sits on top of everything below: I am building a framework to defeat
context rot across the agentic development cycle, and context rot is what
defeated the framework's own construction. Every mistake here is a version of
that same failure.

## 1. I authored the whole catalogue at once

I tried to bring all 115 services into being in one sweep instead of finishing
one and moving to the next. The result is the state the repo is in now: 432
files carrying `TODO(Slice 10)`, and 0 of 115 services actually authored. Gate 2
§14 later named bulk/parallel authoring as the direct cause and switched to
sequential authorship for exactly this reason.

What not to do: do not generate the whole shelf in one pass. One leaf finished,
installed, and working beats a hundred and fifteen stubbed. Cheap-looking bulk
output is the most expensive thing here, because it looks like progress and is
not.

## 2. I let context rot carry me off course

I held the entire design in one working context and kept getting sidetracked. In
my own words: "I got sidetracked a lot because I think it's due to context rot
that I was not able to deliver on all of this." The more I loaded in at once, the
less I finished.

What not to do: do not keep the whole thing open at once. Open a small context,
finish it, close it. The rot accumulates in exactly the gap between "I have
decided everything" and "I have shipped anything," and that gap is where the
first attempt died.

## 3. I built the whole mechanism before proving one leaf

The materialization engine is roughly 2,467 lines. The two-gate governance
apparatus is built. The taxonomy has 805 leaf files. And not one service
actually works end to end. I scaled the machine before I had a single working
part to scale it from.

What not to do: do not build the factory before you have made one good unit by
hand. Prove one vertical slice — author it, install it, run its check, watch it
fail when it should — and let that working leaf teach the mechanism what it
actually needs. Everything built ahead of that proof is a guess.

## 4. I over-engineered the governance shell for a solo project

Signed intent gates, digest-bound receipts, one-use approvals, policy-signer
recovery, freeze-before-any-code. Each is defensible on its own. Together, around
a solo project with nothing shipped, they became ceremony that has not paid for
itself: zero shipped leaves, a test suite that means nothing, and a spec that
will not freeze. The governance grew faster than the thing it was meant to
govern.

What not to do: do not add a control until the threat it defeats is real and
present. Match the ceremony to the threat and to the size of the team, which is
one. A mechanism that does not actually defeat a live threat is cost with no
return.

## 5. I wrote tests calibrated to placeholders

Nineteen `advanced-*.test.js` files pass. They assert inventory and
non-emptiness, and a file containing the literal word `TODO` is non-empty. So the
suite is green against 432 placeholder files. A green suite that cannot fail told
me things were fine while nothing was.

What not to do: do not write a test that cannot fail. A test calibrated to pass
against placeholder content is worse than no test, because it manufactures false
confidence. Make the meaningful test fail first, then make it pass.

## The instinct to watch

My stated preference now — freeze all the specs from my side, then have the agent
burn all 115 leaves at once because "once the intent is clear from my side code
is just cheap" — is the same shape as mistake 1. It may be right this time
because the decisions really are few and shared. But it is the exact instinct
that produced the 432 placeholders, so it has to earn its way back in. The agreed
test is to ship one real leaf first (`development.code-quality.lint-format`) and
let it prove the intent is as clear, and the code as cheap, as I believe.
