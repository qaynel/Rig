---
date: 2026-10-18
source: agent
topics: distribution-and-release, review-receipts, testing-strategy
decisions:
status: superseded
supersedes: 2026-10-18-review-received-recovery-boundaries.md
tags: review, migration, recovery, tests
summary: Parent-symlink refusal now explicitly allows only the pinned transaction temp retained for safe recovery; its regression passes.
---

The first full `npm test` run reached the migration suite and found an outdated
expectation in the pre-publication parent-symlink regression. The migration
correctly refused and made no payload changes, but retained the temp file that
had been created under the pinned root descriptor. Deleting it after pathname
verification would reintroduce the replacement-file cleanup race, so retaining
it is the safe and recoverable behavior. The regression now compares the full
repository inventory after excluding only `.rig-migration.json.tmp`, verifies
that temp is mode 0600, and confirms the external directory is unchanged. The
focused regression passes. The first full gate is not green because of this
assertion; it must be rerun after the test update.
