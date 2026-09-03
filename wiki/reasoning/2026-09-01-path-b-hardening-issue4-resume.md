---
date: 2026-09-01
source: agent
topics: graft-mechanics, install-manifest-removal, onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
tags: trap
summary: A crash between the disk write and the journal record that says so leaves the desired bytes live with nothing recording them, and every preflight read that as a third-party edit and refused forever. Preflight now accepts live bytes that match what the journal was writing — but only while the transaction is still open, so a cleanly finished install can never excuse a proposal built on a stale view; a resumed run promotes the pending record instead of leaving it pending, and closes the transaction it inherited.
---

# Path B hardening, Issue 4 — a landed write with no record is a resume, not a conflict

## What was broken

A journalled write is three steps: append the `pending` record, put the bytes on
disk, append the `applied` record. Between step two and step three the
repository holds the desired bytes and the journal does not yet say so.

Every preflight in `apply` compares the live file against the *proposal's*
preimage:

- `upsertGraftSection` / `removeGraftSection` — `graftFail('has stale file
  digest or preimage')`
- `cleanProjection` — `selected skill projection conflicts with
  repository-owned path`
- `preflightOwnedFiles` — `owned file … has a stale preimage digest`

After an interruption the live bytes are Rig's own, but they are not the
preimage, so all three refused. Retrying did not help: the retry read the same
file and made the same comparison. The install was wedged in `proposed` with no
path forward that did not involve hand-editing the repository — the exact
failure the journal exists to prevent.

## Why "the bytes match what the journal wanted" is not enough on its own

The obvious fix — accept live bytes equal to the latest record's
`desired_digest` — is too generous. That condition is also true a week after a
clean install. It would let an agent propose against a stale view of a file
(preimage from before the previous apply), have the preimage check waved
through, and write over the difference. The preimage check exists precisely to
force the proposal to be rebuilt against reality.

The distinguishing signal is already in the journal and was being thrown away.
`journalWriter` brackets its work with `{kind:'install_state', complete:false}`
and closes it with `complete:true` in `finish()`. An install that died mid-write
never wrote the closing record. So:

> Live bytes may be read as this installer's own unfinished work **only while
> the journal's last `install_state` is still open.**

`journalWriter` now tracks that at load (`write.interrupted()`), and
`journalResumeDigest(writer, rel)` returns the journal's desired bytes for a
path only under that condition. A pending *delete* is excluded — its desired end
state is absence, not bytes, and `resolvePendingDelete` already owns it.

All four preflights consult that one function. `preflightGrafts` used a bare
`() => {}` dry writer, which had no journal at all; it now gets a dry writer that
forwards `latest` and `interrupted` to the real one, so the dry run sees exactly
what the real write will see and still cannot mutate anything.

## Two consequences that only show up on the second run

**The pending record has to be promoted.** When the landed bytes already contain
the desired graft, `upsertGraftSection` returns `noop` without calling the
writer — so the interrupted `pending` record would have stayed pending forever,
with the journal claiming an unfinished write that had in fact landed. Uninstall
and the check paths read that field. `resumeLandedWrite` re-issues the write for
exactly that case; `journalWriter.write()` recognises a pending record whose
desired bytes are already live and appends the missing `applied` record without
touching disk.

**The inherited transaction has to be closed.** A resume can find every desired
byte already in place and write nothing at all — the crash-after-`applied` case
does. `finish()` only appended `complete:true` if *this* writer had started a
transaction, so the journal stayed open, and every later run would have kept the
resume licence it should have surrendered. `finish()` now also closes a
transaction it merely inherited.

## Cases

Six, in `tests/path-b-hardening.test.js` — each interruption point aimed twice,
once at a skill projection (owned-file preflight) and once at `AGENTS.md` (graft
preflight): crash after the `pending` record, after the disk write, and after
the `applied` record. Each asserts that the identical retry reaches `applied`,
that `check` reconciles with no hard failures, that no journalled path is left
`pending`, and that the transaction is closed.

`tests/helpers/path-b-crash.js` injects the crash by letting the real `fs`
operation complete and then throwing, so the on-disk evidence is what a `kill
-9` at that instant would have left. It lives beside `tests/helpers/path-b.js`
rather than inside it because that helper is in the signed Gate 1 manifest —
the same reason `path-b-approval.js` is a separate file.

One trap worth recording: Node implements `appendFileSync` on top of the
*exported* `writeFileSync`, so a test that patches both sees every journal
append as a payload disk write. The helper guards with a re-entrancy flag.
