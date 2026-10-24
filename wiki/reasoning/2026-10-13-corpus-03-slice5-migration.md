---
date: 2026-10-13
source: agent
topics: onboarding-flow, install-manifest-removal
decisions:
status: historical
supersedes:
tags: corpus, migration, trap
summary: Subplan 03 slice 5 — v5 to corpus-layout migration (rig/lib/migrate.js): strict journal validation, in-memory staging, ownership-by-digest planning, persisted resumable plan, journaled writes, marker-last completion, onboarding state migration that preserves selections and invalidates changed approvals; proven against the real v5 installer and an uninstall inventory round trip.
---

# 03 central corpus — slice 5: v5 -> corpus migration

## Design as built

- Entry points: `sh rig/bootstrap.sh` on a v5 repo (automatic), `node
  rig/materialize.js migrate --target DIR [--hosts a,b] [--dry-run]`.
  `detectInstall` returns none / v5 / resume / current; the layout marker is the
  journaled `.rig/onboarding/README.md`, written last.
- Validate first: strict journal read (corrupt line, unsafe path, bad record =
  `journal-corrupt`; an interrupted install = `journal-open`, unless the open
  transaction is this migration's own), onboarding state must parse
  (`state-invalid`), corpus projected in memory.
- Plan by ownership + bytes: replace/create only when the journal owns the path
  and live bytes equal the journaled digest. Edited owned file the new layout
  changes, a symlink, or an unowned file on a new path = `conflicts`, nothing
  written. Edited owned file the layout does not change = kept. Edited orphan =
  retained and reported. Orphans are retired only inside the v5 installer zones
  and never if the onboarding state records them as the user's selection.
- Persist the plan (`.rig/migration.json`, self-digested) before the first
  write; reruns resume from it and re-check each path (`old`/`new` only, else
  conflict). Old bytes of replaced/retired files are copied to
  `.rig/migration-backup/` until completion. All writes/removes use the install
  journal writer, so uninstall reverses both versions.
- State: `migrateState` keeps selections (`state.migration.preserved_selection`);
  if the catalogue digest or any approved skill binding changed it resets to
  `prepared`, clearing proposal/approval/checks, and keeps the applied ledger;
  unchanged state stays `checked`. The old apply early return cannot fire.

## Evidence

`tests/migrate-v5.test.js` (15): the real v5 installer (commit b7f72117 via git
archive) default and `--with-runtime` migrates to a tree identical to a fresh
install and then uninstalls back to the full pre-install inventory (ignored
files, user skill, reports); interruption at every one of the plan's steps
resumes to the same tree; corrupt/tampered plan, corrupt journal, open
journal, edited/symlinked/unowned conflicts, edited orphan and kept-edited,
state kept vs invalidated, old receipt replay refused, CLI dry run, bootstrap
conflict exit. Mutation (always overwrite edited files) turns two tests red.

## Rulings

1. Migration does not call `uninstall`: it retires only attributable files
   itself, so an uninstall best-effort result cannot arise mid-migration; any
   path it cannot prove is reported, never forced.
2. After uninstall, `.rig/network-policy.json` (user-owned seed) remains in an
   active-delivery repo: existing v5 behaviour, kept; asserted explicitly.
3. Recreating a v5-owned file the user deleted counts as restoring, not as a
   conflict; services, receipts (`.rig/basic-receipt.json`), reports and
   grafts are outside the zones and untouched (byte-preserved by the tests).
4. The target tag defaults to `RIG_RELEASE_TAG`, else `v<package.json>`; the
   6.0.0 bump itself belongs to the release subplan.
5. Gap: `selected_skills` removed from a future catalogue are reported in
   `invalidated` but not renamed; service-ID migration is subplan 04's.
