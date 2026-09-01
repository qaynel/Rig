---
name: wiki-maintenance
description: Run after a major release (or on a schedule) to keep wiki/ synced with the branch and its context cost bounded — lifecycle sweep, hub sync, reindex, archive, and the one-time context-management infrastructure. Authoring-time only; not part of the installed Tier 1 payload.
---

# Wiki maintenance (post-release routine)

Keeps the project wiki synced with the branch and its read cost bounded.
Steps 1–3 recur every release; steps 0 and 4–7 are one-time infrastructure
that self-skip once in place.

Source of the routine: `.context/wiki-sync-and-context-debloat-research-brief.md`
and its execution plan.

## When to run

- After every major release / merge to `prod`.
- Any time `node scripts/wiki-maintenance.js status` reports outstanding steps.

## How to run

1. `node scripts/wiki-maintenance.js status` — prints each step as
   `DONE` / `PENDING` / `RECURRING` with the specifics you need.
2. Work only the steps it marks `PENDING` or `RECURRING`, in number order.
3. One step per commit/PR. `npm test` green before every push.
4. Stop and flag any judgment call the ground rules below do not resolve —
   a note in the step's trace or the PR description. Never guess silently.

## Ground rules (apply to every step)

1. Never edit the body of `wiki/reasoning/*` or `wiki/sources/*`. You may
   `git mv` a file or change its frontmatter fields (`status:`, `topics:`);
   you may never rewrite its content.
2. Never hand-edit `wiki/status.md` or `wiki/index/reasoning.md`. They change
   only by editing trace frontmatter and rerunning
   `node scripts/build-wiki-index.js`.
3. `wiki/gate1/` and `wiki/gate2/` are off-limits — no edits, trims, or
   restructuring, even if a file looks bloated.
4. New automation is authoring-time only, under `scripts/`. Nothing in
   `rig/tier-1/` may depend on it — Tier 1 stays markdown-only in the
   installed payload.
5. `CLAUDE.md`, `rig/tier-1/routing.md`, and `wiki/reasoning/README.md`
   describe one read/write cadence. A step that changes that cadence updates
   all three in the same commit.
6. Every step that changes what's true in the wiki is a full-cadence change:
   file a dated `wiki/reasoning/` trace for the step, update every hub/index
   it touches, rerun `node scripts/build-wiki-index.js`, confirm `npm test`
   is green, then push.
7. On any ambiguous judgment call not covered above, stop and flag it rather
   than picking a side.

## Step 0 — Baseline + drift guard

**Skip if:** `status` reports "generated indexes in sync" AND "CI drift guard
present".

**Do:** run `node scripts/build-wiki-index.js`, then `git diff --stat`.
Expect no diff. If there is one, stop — the wiki changed since the last run
and steps 1+ must be re-scoped against the new state first. If `status`
reports the CI drift guard missing, add a check that runs the generator and
fails on any diff (today `tests/wiki-index.test.js` is that guard).

**Done when:** the generator produces no diff and a test fails on drift.

## Step 1 — Lifecycle sweep (recurring)

**Skip if:** `status` lists no `status: current` trace carrying a
`[shipped-signal]` flag.

**Do:** for each trace `status` lists under Step 1, open it. Flip
`status: current` → `status: historical` in its frontmatter if and only if
the filename contains "close-out", OR the body states the related
ticket/feature has shipped, landed, or merged. Leave it `current` if it
describes work still open. If you cannot tell from the body alone, leave it
`current` and add `<!-- needs-human-review: status -->` beside the
frontmatter instead of guessing. Then run
`node scripts/build-wiki-index.js` and check `wiki/status.md`.

**Done when:** `status.md`'s bullet count has dropped and every remaining
bullet is a trace with no close-out signal in its body.

## Step 2 — Sync topic hubs to newest traces (recurring)

**Skip if:** `status` lists no stale hubs.

**Do:** for each hub `status` flags stale (its last commit predates its
newest cited trace), find the traces listing it in `topics:` sorted newest
first, and confirm the hub's synthesis reflects the newest trace's
decisions. If it does not, update the hub's prose — cite the trace by
date/filename, do not quote it verbatim (this is synthesis). If any decision
ID changed as a result, update `wiki/index/decisions.md` in the same commit.

**Done when:** every hub's most recent edit is at least as new as the newest
trace that lists it in `topics:`, or `status` confirms each flagged hub was
already current.

## Step 3 — Disposition for untagged traces

**Skip if:** `status` reports no untagged trace referenced by a live hub or
open ticket, AND that `reasoning/README.md` records the disposition.

**Do:** do not run a blanket migration. For each untagged trace `status`
marks as referenced by a hub or ticket, backfill its `status:` and `topics:`
frontmatter from its actual content. For everything else, leave it alone and
add one paragraph to `wiki/reasoning/README.md` stating that untagged
pre-contract traces are intentionally left to the generator's historical
fallback and are discoverable by date/filename only.

**Done when:** no live hub or open ticket points at a trace with missing
frontmatter, and `reasoning/README.md` states the disposition for the rest.

## Step 4 — Archive dead weight

**Skip if:** `wiki/archive/` exists.

**Do:** create `wiki/archive/` and note the addition in `wiki/Home.md` (it is
a sixth location, outside the five-page-kind model). Move, using `git mv`
(relocation, never rewrite):
`wiki/sources/superseded/deprecated-tier-taxonomy/` → `wiki/archive/`, and
`wiki/reasoning/2026-08-30-status-before-generated-summary.md` →
`wiki/archive/`. Keep `wiki/archive/` out of `wiki/Home.md` primary
navigation and out of the `CLAUDE.md` "read the wiki before you grep"
mandate. File one dated trace recording the move and its reason (the
taxonomy is dead; the status snapshot is fully superseded by the generator).

**Done when:** both paths are relocated, `Home.md` does not link
`wiki/archive/` from primary navigation, and the move trace exists.

## Step 5 — Single primer page (higher risk; human review)

**Skip if:** `wiki/agent-primer.md` exists and `CLAUDE.md` cites it.

**Only start after steps 1–4 are merged and `npm test` is green on each.**
This step changes the agent's core read contract.

**Do:** design `wiki/agent-primer.md` — one short generated page linking
`Home.md`, `status.md`, and the hubs/indexes relevant to routing decisions —
as a single mandated read that replaces the current "read Home.md +
status.md + hubs before grepping" instruction. Point `CLAUDE.md`'s
read-before-grep mandate at `wiki/agent-primer.md`. Update
`rig/tier-1/routing.md` and `wiki/reasoning/README.md` to describe the same
cadence — all three must agree. Do not remove the task-weight carve-out in
`routing.md`. Flag the PR for explicit human review before merge even if
`npm test` passes.

**Done when:** `CLAUDE.md`, `routing.md`, and `reasoning/README.md` all
describe the primer-based cadence consistently, and a human has reviewed the
change.

## Step 6 — Lints so this does not recur

**Skip if:** `status` reports the lints wired into `npm test`.

**Do:** wire `node scripts/wiki-maintenance.js lint` into the `test:code`
chain in `package.json`. It runs two checks and exits non-zero on failure:
a hub-freshness check (a hub older than its newest cited trace fails), and a
frontmatter-completeness check for new traces. Set the `FRONTMATTER_FLOOR`
constant in `scripts/wiki-maintenance.js` to the date this step lands — the
completeness check applies only to traces dated on/after it, never
retroactively.

**Done when:** `node scripts/wiki-maintenance.js lint` runs as part of
`npm test` and passes on `prod`.

## Step 7 — Instrument the token load (optional)

**Skip if:** a baseline line/token measurement of the pre-grep wiki read
exists under `wiki/specs/`.

**Do:** following `wiki/specs/adaptation-measurement-rubric.md`, add a
lightweight measurement of how much wiki content a task pulls before its
first code edit. Capture one baseline before Step 5 merges and one after, so
Step 5 has a before/after number instead of a felt sense of "lighter".

**Done when:** a baseline measurement from before Step 5 and a second
measurement from after both exist.

## Scheduling

This routine is safe to defer or repeat — every step self-skips once
satisfied, and the `status` probe is read-only.

- **Run later, once:** `/schedule` a one-time run that invokes this skill.
- **Recurring:** `/schedule` a cron tied to your release cadence, or `/loop`
  on an interval, pointed at this skill. A recurring run will normally find
  only steps 1–3 outstanding; steps 0 and 4–7 stay `DONE`.
- Whoever runs it still follows the ground rules: one step per PR, `npm test`
  green before push, stop and flag judgment calls.

## Commit / PR hygiene

- One step, one PR.
- Every PR that touches wiki content includes the dated trace for that step,
  any hub/index updates it required, and a clean rerun of
  `node scripts/build-wiki-index.js`.
- `npm test` green before any push.
