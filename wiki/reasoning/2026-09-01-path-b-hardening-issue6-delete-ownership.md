---
date: 2026-09-01
source: agent
topics: graft-mechanics, install-manifest-removal, trust-and-failure-boundaries
decisions:
status: current
supersedes: 2026-09-01-path-b-hardening-issue6-delete
tags: trap
summary: Ownership of a path is read from the record that first wrote it, not the newest one — the latest record always carries a preimage after the second graft, so the first implementation of the journalled delete silently refused to delete in exactly the case uninstall produces; an interrupted delete is now recovered rather than wedging the path, and neither uninstall nor check treats a recorded absence as a licence.
---

# Path B hardening, Issue 6, fix round — ownership belongs to the first record, not the last

The journalled delete landed in
[the first trace](2026-09-01-path-b-hardening-issue6-delete.md) with the right
shape and the wrong evidence. This is what review found and what changed.

## The bug: `preimage_digest` on the latest record answers a different question

The first implementation decided "may Rig delete this?" by reading
`latestByPath.get(rel).preimage_digest === null`. The reasoning was sound in
isolation — `null` means nothing was there when Rig first touched the path — but
it was reading the field off the wrong record.

`preimage_digest` is written on *every* record, not once. The first write to a
path Rig creates records `null`. The second write records the digest of what the
first write left. So after two grafts on the same file, the newest record always
carries a non-null preimage, and the ownership test always says "pre-existing" —
for a file Rig created itself, three operations ago.

That is not an exotic shape. It is the shape uninstall produces. Uninstall
strips capabilities one at a time from a file that may hold several, so the last
removal — the one that empties the file and reaches the delete — is by
construction never the first record for that path. The delete refused exactly
where it was written to fire. `upsert demo.a → upsert demo.b → remove demo.a →
remove demo.b` left the file on disk at `sha256('')`, journalled as a maintained
empty file. Every case in the first round used a single graft, so nothing caught
it.

The fix is to keep a separate origin map: the first record for a path is the one
that answers ownership, and `write()` only sets it when the path has no origin
yet. An applied `delete_owned` clears the entry, because absence ends the
lineage — if the repository later writes its own file at the freed path and asks
Rig to graft into it, the record that created *that* file is a replace with a
real preimage, and Rig correctly refuses to delete it. Ownership is not a
property Rig holds forever once it has held it once.

## An interrupted delete was a wedge, not a recovery

The first trace claimed the two-phase journalling made an interrupted delete
"recoverable exactly like a write". Nothing implemented that claim, and the
truth was worse than merely unimplemented: a pending `delete_owned` record
poisoned the path in both directions. `write()` saw a pending record whose
`desired_digest` was `null`, could not match it against the bytes it wanted to
write, and threw `changed pending payload write`. `remove()` saw the same
pending record, read its non-null `preimage_digest`, and refused as
pre-existing. A crash between the pending record and the unlink left the path
permanently unwritable and permanently undeletable.

`resolvePendingDelete` now runs at the head of both `write()` and `remove()`.
The recovery needs no guessing, because the pending record already states both
ends: the file is absent, so the unlink landed and only the applied record was
lost — append it; or the file holds exactly `preimage_digest`, so the unlink
never ran — unlink and append. Any other bytes are the one genuine conflict, and
that throws rather than deleting someone else's work. The delete's
`preimage_digest` is now the live digest read immediately before the unlink
rather than the journal's last `desired_digest`, so this comparison is against
what was actually on disk.

## A recorded absence is not a licence

Two consumers read the journal as a list of things Rig is responsible for, and
both were about to read a delete record as an assertion that a file should be
there.

`uninstall` classifies each path through `isRigInstallPath`, and a path that
fails classification is filed as best-effort. A `delete_owned` record for
`CLAUDE.md` fails it — `isManagedAddition` looks for a managed line or block,
and a delete has neither — so a perfectly clean install whose graft had already
been dropped would report `best_effort`, keep its journal, and report
`best_effort` again on every subsequent run. Uninstall now skips records whose
desired end state is absence, before classification: there is nothing to
reclaim, so there is nothing to attribute.

Review asked for this as a change to `isRigInstallPath` itself. That would not
have worked at the only call site, where a `false` return *is* the best-effort
filing — the predicate answers "did Rig install this path", and both answers
route a delete record somewhere wrong. The skip has to come before the question
is asked. Same defect, same outcome, one call frame earlier.

`onboarding-check` builds its set of allowed projections from applied journal
records. An applied record licenses the file it asked for; a delete asked for
absence, so it licenses nothing. Leaving deletes in that set would mean a
projection standing where Rig recorded a deletion reads as approved — which is
precisely the unapproved write the check exists to catch, and it would have
blocked Task 3's projection deletion from ever being detectable.

## Where the test lives, and why it is not next to its subject

Review asked for the production-caller coverage in `tests/path-b-graft.test.js`,
which is where the uninstall-through-grafts case already lives. That file is
listed in `wiki/gate1/testing-infrastructure.manifest` and frozen under the
Gate 1 signature; adding a case to it changes its digest and fails
`scripts/check-advanced-spec.js`, which no agent can re-sign. The two uninstall
cases are in `tests/path-b-hardening.test.js` alongside the rest of Task 5, with
a comment saying why. Coverage is what was asked for; the file was not available
to hold it.

## State at the time of writing

Nine cases in `tests/path-b-hardening.test.js` for the journalled delete: the
three from the first round, plus stacked-graft ownership, repository reclamation
of a freed path, both interrupted-delete recoveries, and the two production
uninstall paths (a file Rig created under stacked grafts is unlinked; a
journalled delete leaves an uninstall nothing to reclaim and its journal is
dropped). Five were red before this change; the reclamation case was written as
a guard and was green throughout. `npm test` is green — 663 tests, 662 passing,
one platform-gated skip (`PR_SET_PDEATHSIG`, Linux-only), exit 0.
