# Reasoning traces

Where new thinking lands. This is the intake for everything the project reasons
out from here on: grilling answers, design arguments, review responses, decisions
made in chat, notes written on the way to a decision.

Before you file one, you have already read `wiki/agent-primer.md` — that page
is the single mandated read that points at `Home.md`, `status.md`, and the
hubs and indexes the task's routing decision needs, in the order to read
them.

## The rule

**A trace's body is written once and never edited — it is immutable.** It
records what was thought at a moment in time. If the thinking later turns out
wrong, that is what the topic hub is for — the hub gets rewritten, the trace
stays as it was. Only frontmatter fields (`status:`, `topics:`) may change
after filing; the body never does. The `.claude/skills/wiki-maintenance/SKILL.md`
ground rules enforce this same body-immutable, frontmatter-mutable split.

This split is the whole point. A wiki whose pages are freely rewritten loses its
history; a wiki that never rewrites accumulates contradictions. Keeping the
record immutable and the synthesis mutable gets both.

## Filing a trace

One file per trace, at `reasoning/YYYY-MM-DD-<slug>.md`. Two traces on the same
day get different slugs. The header includes these fields:

```markdown
---
date: 2026-08-19
source: intent owner | agent | review
topics: gate1-signing, policy-model
decisions: D20, GA-14a
status: current | superseded | historical
supersedes: trace or decision id
tags: rejected, trap, interdependency
summary: one-line current-state summary
---
```

- **`source`** — who produced the thinking. `intent owner` for the human whose
  rulings are Gate 1 authority; `agent` for a design or implementation context;
  `review` for a report-only reviewer.
- **`topics`** — the hub slugs this touches, so the trace is reachable from the
  subject rather than only from its date.
- **`decisions`** — any decision IDs it creates, changes, or argues about. Leave
  empty if it creates none; a trace does not have to decide anything.
- **`status`** — `current` when this trace belongs on the generated current-state
  page; `superseded` when a later trace replaces it; otherwise `historical`.
- **`supersedes`** — the replaced trace or decision, if any. Leave empty when
  this trace does not replace anything.
- **`tags`** — comma-separated cross-cutting labels such as `rejected`, `trap`,
  or `interdependency`.
- **`summary`** — a one-line description for current traces. It is rendered on
  the generated current-state page; leave it empty for historical records.

Then the trace itself, verbatim. Do not summarise it on the way in. Summarising
is what the hub does, and doing it twice means the second version is the only one
anybody reads.

## After filing

Two follow-ups, both in the same change as the trace:

1. **Update every hub named in `topics:`** so it reflects the new thinking and
   cites the trace by filename.
2. **Update [`../index/decisions.md`](../index/decisions.md)** if the trace
   created or changed a decision ID.

A trace filed without those follow-ups is invisible to anyone who arrives by
subject, which is how most people arrive.

Then run `node scripts/build-wiki-index.js`. It deterministically rebuilds
`wiki/status.md` and `wiki/index/reasoning.md`; do not edit either generated
file by hand. `npm test` rejects a stale generated summary.

## What does not go here

- **Gate 1 or Gate 2 edits.** Those are gate documents with their own revision
  process. A trace may argue for a change; it cannot be the change.
- **Anything the repository already records.** Commit history, code structure,
  test output. If it can be recovered by reading the repo, it does not need a
  trace.
- **Hand-written status.** Current state is generated from current traces. A
  trace is dated and permanent; the generated summary is neither hand-written
  nor independently authoritative.

## Pre-contract traces

The frontmatter contract above was introduced after roughly a quarter of the
existing reasoning traces had already been filed. Every pre-contract trace
that is referenced by a live topic hub or ticket has been backfilled to the
contract. The rest are intentionally left as they were — no synthesised
`topics:` or `status:` is inserted retroactively. They remain discoverable by
date and filename through `wiki/index/reasoning.md`, and the generator's
historical fallback keeps them off the current-state page. Do not sweep them
in bulk; leave the disposition where it is.
