---
date: 2026-09-02
source: agent
topics: agent-working-conventions, testing-strategy
decisions:
status: historical
supersedes: 2026-09-02-wiki-maintenance-step6-lints (staleness-filter claim only)
tags: correctness, wiki-maintenance, staleHubs
summary: staleHubs counting only status:current citing traces was itself a CLAUDE.md violation, not a fix — corrected to count all statuses, gated by FRONTMATTER_FLOOR on trace content-date and keyed to each trace's first-add commit so future lifecycle-flip edits can't retrigger false staleness.
---

# Correcting the staleHubs filter (Path B branch closeout, Task 2)

## The conflict

The closeout plan (`docs/superpowers/plans/2026-09-02-path-b-branch-closeout.md`,
Task 2) instructs removing `staleHubs`'s `trace.status === 'current'` filter,
based on two unit tests (`tests/wiki-maintenance.test.js:61-103`) that use
`status: historical` fixtures and expect them counted.

`wiki/reasoning/2026-09-02-wiki-maintenance-step6-lints.md` — filed by the
same prior (failed) session that wrote those tests — argues the opposite:
that the `current`-only filter is the deliberate fix, because a Step-1
lifecycle-flip edit (current → historical) re-commits a trace file and would
otherwise retrigger staleness against a hub that already absorbed it.

Both can't be right, and applying the plan's literal instruction (drop the
filter, nothing else) confirmed the concern empirically: on the real branch,
~20 pre-existing topic hubs across the whole wiki lit up as "stale," none of
them related to this branch's work.

## Diagnosis

1. `current`-only is a self-contradiction, not a design decision: the same
   commit (`ca5b4e7`) that filed the step6-lints trace citing
   `agent-working-conventions` and `testing-strategy` did *not* update either
   hub in that change — a direct violation of CLAUDE.md's "update the topic
   hubs it touches in the same change" rule. `current`-only would launder
   that gap permanently, since a trace never has to earn its way to
   `historical` by having its hub actually catch up.
2. The ~20 false positives were legacy drift that predates the lint's
   existence, not something this branch introduced. `FRONTMATTER_FLOOR`
   already grandfathers exactly this shape of problem for the
   frontmatter-completeness check; `staleHubs` had no equivalent floor.
3. The lifecycle-flip concern is real, but the actual defect is that
   `newestTraceDate` was computed from `dateOf(trace.file)` using the
   trace's *latest* git-touch — which does change on a flip-edit. It is not
   a reason to stop counting historical traces at all.

## Fix

`scripts/wiki-maintenance.js`:

- `staleHubs`'s `citing` filter now counts a trace regardless of `status`,
  but only when `trace.date >= FRONTMATTER_FLOOR` — the same grandfather
  line the frontmatter check already draws, so introducing this rule does
  not retroactively fail the wiki's pre-existing hub drift.
- The trace side of the date comparison now uses `gitDateAdded` (the file's
  first `--diff-filter=A` commit), not `gitDate` (its latest commit). A
  later lifecycle-flip re-commit does not move this date, so it can't
  retrigger staleness — resolving the step6-lints trace's actual concern —
  while same-day violations (a trace filed and a hub left un-synced within
  one working session, which is the common real case) are still caught,
  since the add-commit carries full timestamp precision.
- `hubOrTraceDate(root, rel)` routes `wiki/reasoning/*` paths through
  `gitDateAdded` and everything else (hub paths) through `gitDate`, as the
  default `dateOf` for `staleHubs`. Test-injected `dateOf` mocks are
  unaffected — they supply literal values directly and never call this
  default.

All 7 `tests/wiki-maintenance.test.js` cases pass unchanged (they inject
their own `dateOf`, so this default-routing change is invisible to them).
`tests/wiki-maintenance-lint.test.js` (the real-repo integration check) went
from 20 false-positive hub findings to 2 genuine ones — both fixed by
actually syncing `wiki/topics/agent-working-conventions.md` and
`wiki/topics/testing-strategy.md` to the step5-primer and step6-lints
traces they were missing, plus one missing `topics:` frontmatter field on
`wiki/reasoning/2026-09-02-path-b-fix3-interrupt-sibling.md`.

## What this does not change

`wiki/reasoning/2026-09-02-wiki-maintenance-step6-lints.md` is left as
written per the reasoning-trace immutability rule — it accurately records
what that session thought and shipped. This trace supersedes only its
staleness-filter claim; its rationale for the test-file-not-package-json
lint-wiring approach still holds and is unaffected.
