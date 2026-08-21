---
date: 2026-08-21
source: intent owner
topics: the-two-gates, what-rig-is
decisions:
---

# One-gate streamlining — product spirit and intent

Intent-owner direction, captured verbatim on the `implement-advanced-a-la-carte-catalogue-v4`
branch, whose purpose is to streamline the development cycle. Not yet a frozen
decision; this trace records the spirit so the next design pass is anchored to it.

## The threat model, restated

What Rig guards against **in the product** is *an agent moving the goalpost
nearer to hit a target* — weakening the requirement, or writing tests that bless
its own code. That is the whole concern. It is **not** Rig's concern to police
everything the developer does with their own intent.

> "We are protecting the human from the agent, but not the human from the human."

Rig is a harness that lets anyone be their own product manager with a team of
interns and junior developers. At the end, **the developer owns the code.** That
ownership is the reason one gate is enough.

## What the one gate is

One key. One freeze. The gate **locks the intent and the testing
infrastructure**, and the yet-to-be-written code must adapt to that shell — the
intent locks the boundaries of the code, then the code is written to fit inside
them so it "does not destroy a lot of things."

The gate **checks that all of the following are in place** before it will freeze:

1. business intent,
2. technical specification,
3. acceptance criteria,
4. testing infrastructure that deterministically checks the acceptance criteria.

Note the asymmetry: intent and the tests are what the signature *locks*; the
technical spec is *checked for presence* but the code is free to adapt.

## Optimize for least developer work

The overlap between these four artifacts is real and should be exploited so the
user does the least work possible. Wherever an artifact can be derived from
documentation that already exists, Rig derives it:

- Rig produces the **boilerplate** for all four artifacts.
- It **checks existing knowledge first** — the wiki, or if there is no wiki, a
  README, earlier reasoning traces, `CLAUDE.md`, or whatever markdown the agent
  has — *before* coming to the developer with a question.
- Where it **assumes or infers** something from that documentation, it **declares
  it outright**: a disclaimer to the user of the form *"I saw this is how you
  usually test / this is your acceptance criteria, so I added this here — feel
  free to say no or remove it."* The user then iterates on that draft.

The cost being optimized is **how much of the developer's time is spent answering
queries.** Check the record first; only spend the developer's attention where the
record cannot answer.

## The self-demonstrating instruction

The user pointed out that this message itself is a lot of product spirit, and that
Rig should **instinctively note it in the wiki** and then tell the user it did so
— "I noted this down because I found it useful; say the word and I'll remove it."
This trace is that behavior. The instinct to capture spirit into the wiki, and to
report the capture back rather than doing it silently, is part of the streamlined
cycle being designed on this branch.
