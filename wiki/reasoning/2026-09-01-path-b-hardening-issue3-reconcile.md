---
date: 2026-09-01
source: agent
topics: onboarding-flow, graft-mechanics, install-manifest-removal
decisions:
status: historical
supersedes:
tags: trap
summary: Onboarding apply was additive only — a second approved proposal that dropped a skill or a graft left the first one's artifacts on disk forever; apply now reconciles the previously applied set against the newly approved one, deletes what it can prove it wrote, refuses to delete installer-owned core skills or anything a human has edited since, and reports the refusals as warnings recorded in state.
---

# Path B hardening, Issue 3 — reapplication has to subtract, not only add

## The bug

`apply()` wrote the approved proposal and nothing else. Every projection write,
every graft upsert, every owned-file write was an addition. Nothing anywhere in
the function read the *previous* `state.applied` set. So the only way an
artifact left the repository was uninstall.

The consequence is that a re-onboarding cycle cannot narrow. A repository that
onboarded with `qa-only` projected and one graft in `AGENTS.md`, then re-ran
prepare → propose → apply with a proposal selecting neither, ended with:

- `.rig/state.json` saying `applied.projections: []` — truthfully, for the new
  proposal;
- `.agents/skills/rig-qa-only/SKILL.md` still on disk;
- the `testing.web-quality-assurance` graft block still in `AGENTS.md`.

State and disk disagreed, and state was the one telling the truth about what was
approved. Worse, `check` could not see the discrepancy: `reconcileApplied`
iterates `state.applied.projections`, and the stale file is by definition no
longer in that list. The repository kept an unapproved Rig artifact that no
later check would ever name.

This is the same class of defect as Issue 6 (a graft removal that left a
zero-byte husk) one level up: the model of ownership was correct, but nothing
ever ran the subtraction.

## The shape of the fix

Reapplication is a three-set problem, and it is worth naming all three because
two of them are commonly conflated:

1. **Previously applied** — `state.applied.projections` (falling back to the
   legacy `applied.skills`) and `state.applied.grafts`. This is what a prior
   apply claims it put there.
2. **Newly approved** — the projection plan and `state.proposal.grafts` of the
   proposal being applied now.
3. **Live on disk** — what is actually at those paths right now.

Set 1 minus set 2 is the obsolete set. Set 3 is what decides whether an obsolete
artifact may be *deleted*, and it is not the same question. An artifact can be
obsolete and still not Rig's to remove.

`planRemovals()` computes all three before the write transaction opens;
`applyRemovals()` executes inside it, after the graft upserts, so a section
being removed is cut from the digest the upsert just produced rather than from a
stale preimage.

## Three things apply must refuse to delete

The interesting part of this fix is not the deletion. It is the three cases
where the right answer is to leave the file alone.

**A hand-edited artifact.** If the live digest at an obsolete path is not the
digest the ledger recorded, a human changed it after apply. Deleting it destroys
work Rig did not author, to enforce a decision (deselecting a skill) that has
nothing to do with the edit. The path is skipped and filed as `unreconciled`. A
stale file is a smaller harm than a silent data loss, and unlike the data loss
it is reportable.

**An installer-owned core skill.** `planSkillProjections` treats core catalogue
skills asymmetrically: it *records* a row for them but never writes their file —
the file was staged by `bootstrap.sh`, and apply only points at it. The
symmetric rule has to hold on the way out, or deselecting a core skill from a
proposal would delete an installed part of the harness. `isApplyOwnedSkill`
enforces it: apply removes only what apply projected. This one is a live hazard
rather than a theoretical one, because the journal *would* have allowed the
delete — the installer created those files, so their origin record has a null
preimage and `writer.remove` would have said yes.

**A path the journal cannot prove Rig created.** `writer.remove` (Task 5) makes
this call itself and returns `{ removed: false, reason: 'preexisting' }`. That
answer is also filed as `unreconciled` rather than swallowed, because a
projection path Rig cannot prove it created is a fact worth surfacing.

## Two details that only show up on real repositories

**The ledger under-records.** `applied.projections` holds one row per
(skill, host) — the `SKILL.md` — but a projection writes every file in the
skill's source directory. `qa` ships `references/issue-taxonomy.md` and
`templates/qa-report-template.md`; deleting only the recorded row would leave
those orphaned under a skill directory that no longer belongs to any selected
skill. Removal therefore sweeps the live skill directory as well as the recorded
path, using the journal's own `latest(rel).digest` as the expected-bytes proof
for the siblings the ledger never named. A sibling with no journal record, or
one whose bytes have moved, is `unreconciled` like any other.

**Absence is not the same as an empty directory.** Unlinking
`.agents/skills/rig-qa-only/SKILL.md` leaves `.agents/skills/rig-qa-only/`
behind, and a host scanning for skills sees a directory that looks like an
uninstalled skill. `pruneEmptyDirs` walks up removing empty directories but
stops at the projected skill root, so a scope root such as `.agents/skills` is
never pruned away even if it momentarily empties.

## Where the refusals go

`removals.unreconciled` is returned on the `apply` response as
`warnings: [{ code: 'unreconciled', path, detail }]` **and** persisted at
`state.applied.unreconciled`. The persistence is the load-bearing half. A
warning on one response is read once by whoever ran that apply; the recorded
list is re-emitted by every later `check`, so the stale artifact keeps being
named until someone deals with it. Without it the fix would trade a silent
stale file for a warning nobody sees twice.

Phase still advances to `applied` in both cases. An unreconciled artifact is not
a failed apply — the approved proposal landed in full. It is an accurate
statement that one obsolete thing was deliberately not touched.

## Tests

Four cases in `tests/path-b-hardening.test.js` under
`Task 3 (Issue 3) — reapplication removes obsolete artifacts`, driven through
the real prepare → propose → apply cycle with signed approvals:

| case | red before? |
| --- | --- |
| obsolete skill projection is removed (state *and* disk, all three scope roots) | yes |
| user-edited Rig-owned artifact is preserved and reported | yes |
| obsolete graft section is removed from the host file, repository prose intact | yes |
| a core skill projection is never deleted by apply | no — guard |

The core-skill case was written as a guard and was green throughout; it is the
one that would have failed had the fix trusted `writer.remove`'s ownership
answer alone.
