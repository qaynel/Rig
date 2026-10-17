---
date: 2026-10-17
source: agent
topics: the-overhaul
decisions:
status: superseded
summary: Current verification finds a stale signed package-script digest and active documentation drift; three Luna workers audit history, readiness and adaptive onboarding.
---

Done: recovered the central-corpus, adaptive onboarding, fetch-at-onboarding,
post-tag tracker closure and exact-QA-commit promotion decisions. Preserved the
existing staged August compaction. Current `node scripts/check-advanced-spec.js`
exits 1: `wiki/gate1/package-scripts.json` has digest d8d481d59a1915eb034a41033123e2efcd6cfebe219801028eb4bbf1b0b2c77c,
while the signed manifest expects 2e2afa3cabaac7f0db2c64f3c1274a3136992ee2f3dd3d7a70f2286fb88d151a.
The already-applied test:e2e amendment needs the human key holder; no agent signs.

In flight: three Luna agents read both supplied histories and independently
audit release checks, onboarding and staged documentation compaction. Active
entry docs contain obsolete source paths, optional-shelf instructions and
signature status. The deployment gate treats a receipt pathname as evidence of
a full test run and derives expected review coverage from the receipt itself.

Next: fix the editable release gate with regression checks, correct current
documentation, verify the compaction and live tracker dispositions, then run
the available checks. A prior green run is not evidence for this tree. Final
review, the full signed gate, push, promotion and closure retain their ordered
dependencies; existing authorization does not permit an agent signature.
