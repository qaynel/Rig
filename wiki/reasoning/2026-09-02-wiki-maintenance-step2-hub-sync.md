---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary: Wiki maintenance Step 2 (hub sync) — extended graft-mechanics with the issue4 resume-vs-conflict insight and marked agent-working-conventions and gate1-signing as reviewed with no new current-trace decisions.
---

# Wiki maintenance Step 2 — sync topic hubs to newest traces

## Scope

Step 1's status flip re-committed 14 historical traces, which pushed several
of their cited hubs' commit times behind the freshness check. Step 2's job is
to confirm each flagged hub's synthesis still reflects the newest citing
trace and update the hub if it does not.

## graft-mechanics — real content add

Newest current citing trace: `2026-09-01-path-b-hardening-issue4-resume.md`
(2026-09-01T23:14:06+05:30), 20 minutes newer than the hub's previous last
commit. The trace introduces a new preflight rule — accept live bytes whose
digest matches an open transaction's pending write — that the hub did not
cover. Added a synthesised paragraph pointing at the resume trace by
date/filename (no verbatim quote).

## Other flagged hubs — synthesis already current

The remaining flagged hubs (`agent-working-conventions`, `gate1-signing`,
`install-manifest-removal`, `onboarding-flow`, `testing-strategy`,
`the-catalogue`, `what-rig-is`, `specification-gate`) were reviewed against
their newest current citing trace and found already in sync — either no new
current trace was added since the hub was last edited, or the hub already
reflects the decision. For example, `specification-gate`'s newest current
citation is the docfix consistency trace, which describes a wiki-file
correction rather than a new decision; the hub's synthesis (owner has signed
the amended bytes; verifier confirms signature and digests) already covers
it. Each was marked with a `Reviewed 2026-09-02` HTML comment so the
freshness check clears without inventing synthesis prose. The extra flags
originate in Step 1's flip commit, which re-committed 14 historical traces
and pushed their cited hubs' `max(cited-trace commit time)` beyond the hub's
own last commit.

## Decisions index

`wiki/index/decisions.md` untouched — no decision IDs shifted; the resume
insight lives under the existing D-line coverage of graft mechanics.

## Follow-up

- Rerun `node scripts/build-wiki-index.js` (Step 1 already handled the flip;
  rerun again after this commit for completeness).
- Steps 3–7 remain outstanding.
