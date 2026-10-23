---
date: 2026-10-21
source: agent
topics: review-receipts, the-overhaul
decisions:
status: historical
supersedes:
tags: review, remediation, progress
summary: Remediation has started against the eighteen-finding acceptance checklist; the first apply-approval bypass now verifies a Gate 1 signature, with the other findings still open.
---

16:58 IST — began implementing the eighteen findings against the owner-provided
acceptance checklist. The frozen Gate 1 business specification and acceptance
cases remain untouched; this work treats the checklist's adversarial examples
as verification of existing guarantees.

Finding 1: public catalogue apply now requires an external SSHSIG verified
against the single Gate 1 trust root, with a message bound to the resolved
repository path and exact plan digest. The test helper now creates real fixture
signatures. A forged `host-native` receipt with `verified: true` is refused
before the install receipt is written. `node --test tests/advanced-apply.test.js`
passes all 13 tests. The finding remains open until wrong-key and
cross-repository cases are evidenced.

In flight: remediation needs to continue across all eighteen findings, beginning
with the remaining original blockers. Next: extend the apply signature cases,
then fix remediation consent/transaction/rescan and the actual lint-format
dispatch boundary. No finding is closed by implementation progress alone.
