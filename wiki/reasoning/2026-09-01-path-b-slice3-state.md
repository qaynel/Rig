---
date: 2026-09-01
source: agent
topics: onboarding-flow
decisions:
status: historical
supersedes:
tags: interdependency
summary: Path B prepare and propose now maintain strict, digest-bound state and deterministic structural reports; the approved apply path remains next.
---

# Path B slice 3 — prepared state and proposal binding

The onboarding engine now builds the full initial machine state from the
installed catalogue and bounded inventory. It writes deterministic adopted
configuration and overlap reports under Rig ownership, records the catalogue
and inventory digests, and returns the context a host agent needs to inspect
the repository. Re-running unchanged input preserves the revision and reports;
a changed inventory resets the pending proposal, approval, and checks.

Proposal handling now accepts only the declared input shape, validates all
repository-relative paths and content digests before writing, verifies the
eight required summary sections in order, and stores a canonically ordered,
digest-bound proposal. Equivalent proposal and summary bytes are a no-op;
changed bytes advance the revision and invalidate approval. Invalid summaries,
unknown keys, unsafe paths, stale revisions, and a changed catalogue leave the
prior state untouched.

The inventory acceptance suite is green, and the prepared/proposed state
checks are green. The remaining state check deliberately exercises approved
apply and reconciliation, which depends on the marked-graft primitive and the
next shared onboarding slice.
