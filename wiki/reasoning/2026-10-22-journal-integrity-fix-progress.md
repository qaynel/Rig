---
date: 2026-10-22
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: superseded
supersedes: 2026-10-22-journal-integrity-fix-start
tags: security, data-loss, journal, tdd
summary: Strict structural journal validation passed the new preservation regressions; the fixture migration and focused suites are now recorded in the later checkpoint.
---

The new `tests/remediation-review-journal.test.js` was run red against the
review reproduction: public uninstall accepted the record with no ownership
and the test saw no exception. The shared `parseJournalRecords` validation
then gained required state, ownership, matching operation, transaction kind,
preimage/desired/result digests, valid pending-to-applied history, and narrow
typed recovery checks. It allows the actual payload preimage-backup record,
which stores its own desired/result digest at `.rig/preimages/<digest>` and
omits a separate `preimage_digest`. The new test passes 2/2, including all
malformed public-uninstall cases preserving every file byte and complete
writer-emitted record variants remaining parseable.

This checkpoint was superseded after the coordinator authorized updating
non-frozen hand-authored fixtures while preserving their original trust-boundary
intent. See the later journal integrity checkpoint for the completed fixture
migration and verification.
