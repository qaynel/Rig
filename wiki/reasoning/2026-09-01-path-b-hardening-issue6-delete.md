---
date: 2026-09-01
source: agent
topics: graft-mechanics, install-manifest-removal, trust-and-failure-boundaries
decisions:
status: superseded
supersedes:
tags: trap
summary: The journal writer gained `remove()`, a journalled delete that restores absence for a file Rig created; `removeGraftSection` calls it when the last managed section leaves, and reports a preserved-but-empty repository file as an empty file rather than as absence.
---

# Path B hardening, Issue 6 — a journalled delete, and honest reporting when it is refused

## The problem

`removeGraftSection` had one way to end: write the remaining bytes back through
the journal writer. When the graft it removed was the *only* content of the
file, "the remaining bytes" was zero bytes, so the file stayed on disk as a
zero-byte husk. For a file that existed only because Rig grafted it, that is the
wrong end state twice over.

It is wrong on disk: Rig promised to leave the repository as it found it, and it
found no file there. A zero-byte `.rig/foo.md` is a residue the user has to
notice and clean up themselves.

It is wrong in the journal, and that is the worse half. The last applied record
for the path said `state: 'applied', digest: <sha256 of empty>`, which is a
truthful statement about a file that should not exist. Every downstream
consumer — uninstall, check, the manifest reconciliation — reads the journal to
learn what Rig is responsible for. None of them had any way to distinguish "Rig
maintains this file and it happens to be empty" from "Rig should have removed
this file and left a stub instead".

## Why `remove` lives on the writer, not in `removeGraftSection`

Deletion is a journal operation, not a graft operation. The graft code knows
*that* the file should go; only the journal knows *whether Rig is allowed to
delete it*. Putting the decision in the writer keeps the ownership rule in the
one place that holds the evidence, and it gives Task 3 the same primitive for
projection deletion without duplicating the rule.

The evidence is `prior.preimage_digest === null`. That field is written once,
when Rig first touched the path, and it records what was there before. `null`
means nothing was: Rig created the file, so Rig may un-create it. Anything else —
including `sha256('')` for a file that existed and was empty — means the path
predates Rig, and unlinking it would destroy repository-owned state. No journal
record at all is the same answer: Rig never touched this path, so it does not get
to delete it. Absence-first, in both directions.

The delete is journalled in two halves, `pending` before the unlink and `applied`
after, for the same reason writes are: a transaction interrupted between the two
is recoverable, because the pending record names the path and states that the
desired end is absence (`desired_digest: null`). `preimage_digest` on the delete
record carries the digest the file had before deletion, so the preimage store
still holds a route back.

## The refusal is a result, not an exception

`remove()` returns `{ removed: false, reason: 'preexisting' }` rather than
throwing. Refusing to delete a repository-owned file is a correct, expected
outcome — the graft did leave, the file is simply still there. Throwing would
force every caller to wrap the normal case in a try/catch.

What changed alongside it is what `removeGraftSection` then *reports*. The old
code returned `file_digest: next.length ? sha256(next) : null`, collapsing "the
file is gone" and "the file is empty" into the same `null`. Those are the two
states this whole change exists to separate, so they no longer share a value:
`null` now means only absence, and a preserved empty file reports
`sha256('')` — the honest digest of the bytes actually on disk.

`remove()` throwing is reserved for the one case that really is an error: the
live bytes match neither the digest the caller expected nor the digest the
journal last applied. Something else changed the file between read and delete,
and deleting it would discard an edit nobody has seen.

## The compatibility question that decided the call site

`removeGraftSection` accepts any writer function, including the plain
`directWrite` used outside the journalled path. The new branch is guarded on
`typeof writeFile.remove === 'function'` and falls through to the existing write
when it is absent, so a non-journalled caller keeps exactly today's behavior. The
only in-tree journalled caller is uninstall (`rig/lib/lifecycle.js`), which reads
`result.changed` and never `file_digest`; the frozen graft suite asserts on
`action`. Nothing depended on the `null`-for-empty conflation.

## State at the time of writing

Three cases in `tests/path-b-hardening.test.js`: a Rig-created file is unlinked
and the delete is journalled pending-then-applied; a pre-existing file with
content survives the removal of its graft; a pre-existing *empty* file survives
too, records no delete, and reports `sha256('')`. The first and third were red
before the change. `npm test` is green — 657 tests, 656 passing, one
platform-gated skip (`PR_SET_PDEATHSIG`, Linux-only), exit 0.
