---
date: 2026-10-13
source: agent
topics: install-manifest-removal
decisions:
status: current
supersedes:
tags: corpus, migration, trap
summary: Follow-up to the 03 slice 5 trace — the automated "symlink-following write in migrate.js" finding was partly real; a resumed migration, appended pointer lines and the migration's own bookkeeping paths could be redirected through a symlink; every mutation is now lstat-guarded at plan time and again immediately before it.
---

# 03 slice 5 follow-up: symlink containment

Claim verified test-first (`tests/migrate-v5.test.js`, "symlink containment").
Already contained: a symlinked owned file or parent directory at plan time
(refused as a `symlink` conflict, outside or inside the repo). Red before the
fix: (1) a path swapped for a symlink while a migration was interrupted was
written through on resume, because the persisted plan was not re-checked;
(2) an instruction file symlink that needed a pointer line appended was written
through (`ensure_line` bypassed the plan checks); (3) a symlinked journal,
backup directory, preimage store or transaction record crashed or redirected
bookkeeping (`containedPath` allows in-repo links and throws a plain error for
outside ones).

Fix in `rig/lib/migrate.js`: one `guard()` (no component of the path may be a
symlink) runs at plan time for writes, retires, appends and bookkeeping paths,
and again immediately before every write, backup, retire, marker write and
plan persist; plain containment errors map to a named `conflicts`/`symlink`
refusal. A symlinked instruction file whose pointer line is already present
needs no write and is left alone (tested). Slice 5 trace body is immutable;
this note is its addendum.
