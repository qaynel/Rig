---
date: 2026-09-01
source: agent
topics: onboarding-flow, user-presence-approvals, trust-and-failure-boundaries
decisions:
status: historical
supersedes:
tags: trap
summary: An approval only named the skills it approved, never their bytes — apply re-read the staged shelf and projected whatever was there by then; the proposal now freezes a per-skill tree digest and projected-bytes digest inside the digested body, apply refuses when either moved, and check re-derives the projected tree from disk instead of trusting the ledger's own echo.
---

# Path B hardening, Issue 2 — approval has to cover bytes, not names

## The bug

`state.proposal.selected_skills` is a list of names: `["qa"]`. The approver
signs `sha256(canonical(proposal))`, so what they signed was the *name* `qa`.
Every byte that name eventually resolved to was read later, at apply time,
from the staged shelf under `.rig/runtime/rig/catalog/skills/…`.

Two windows follow from that:

1. **Between propose and apply.** Anyone who can write the staged shelf can
   append to `qa/SKILL.md` after the signature exists. `apply` re-reads the
   file, projects the new bytes, records their digest in `state.applied`, and
   `check` passes — the ledger agrees with disk because the ledger was written
   from the same tampered read. Nothing in the chain remembers what the human
   looked at when they signed.
2. **Between apply and check.** `reconcileApplied` compared each projection
   row's `sha256` to the file on disk. That row is the ledger's *echo* of what
   apply wrote, and it covers exactly one file per skill per host — the
   `SKILL.md`. A skill projecting a whole tree could have every sibling file
   rewritten, or a new file added beside them, and check stayed green.

The catalogue was bound (`catalog_digest`), the summary was bound
(`summary_digest`), the graft content was bound (`content_digest`). The skill
payload — the largest thing an onboarding actually installs — was not.

## The fix

Two digests, both frozen into the proposal body before it is digested, so the
signature covers them:

- `tree_digest` — a per-skill digest of the whole source directory (path, mode,
  content of every file, walked in a fixed order), computed when the catalogue
  is built and carried on each catalogue row.
- `projected_digest` — a digest over the exact bytes the selection will
  project: one entry per file inside the projected skill directory, keyed by
  its path within that directory, deduplicated across host scopes because
  every scope receives identical bytes.

`propose` computes both and stores them as `proposal.skill_bindings`. `apply`
re-derives the projection and refuses with a stale-proposal error when a
projected digest moved, when a catalogue row's tree digest moved, or when the
projection reaches a skill the bindings do not name. `check` walks each
recorded projection root on disk, rebuilds the same digest, and compares it to
the approved one.

## Three decisions worth recording

**The bindings are engine-computed, not caller-supplied.** The brief put
`tree_digest` and `projected_digest` on each `selected_skills[i]`, which would
have made them fields a caller fills in. A caller who can assert the digest of
the bytes they are approving is back to `verified: true` — the same defect
Issue 1 removed. `selected_skills` stays a sorted list of names (which is also
what the frozen technical spec §6.3 and `AT-PB-4` describe), and the engine
derives `skill_bindings` from that selection inside `canonicalProposal`, where
it lands in the digested body. The key is accepted as *input* and ignored, only
so a stored proposal can be resubmitted verbatim — `AT-PB-5` round-trips one.

**`tree_digest` is not part of `skills_digest`.** `AT-PB-3` is frozen and pins
the published catalogue digest to an exact twelve-key projection of a
catalogue row. Adding a thirteenth key to that formula would have moved a
signed value and required a Gate 1 re-sign, which belongs to Task 6, not here.
`tree_digest` is instead covered by the catalogue *file* digest that every
proposal already binds and `apply` already re-checks, so tampering with a
`tree_digest` in `.rig/catalog.json` invalidates the proposal anyway. While
fixing this, `buildSkillCatalog` was changed to compute `release.skills_digest`
through `skillsDigest()` rather than re-deriving it from the full rows: the two
formulas had been identical only by accident, and the accident ended the moment
a row grew a key.

**`check` re-derives from disk rather than trusting the row.** Comparing the
projected tree against the approved digest — not against the ledger row —
is what makes a smuggled sibling file (`.agents/skills/rig-qa/SMUGGLED.md`)
a hard failure rather than an inventory-drift warning. It costs a directory
walk per projected skill at check time.

## What this does not do

It does not verify the staged shelf against the catalogue's `tree_digest` at
install time. The catalogue digest is computed from the repository tree, while
the shelf is a filtered copy (`.tmpl` files and `TODOS-format.md` are dropped
by the projection reader), so the two are not comparable without a second
filter definition that would have to stay in sync. The projected-bytes binding
already detects the case that matters — a staged source edited after approval —
because the projection reads that source. A direct staged-tree check remains
available if a later slice wants defence in depth at install time.
