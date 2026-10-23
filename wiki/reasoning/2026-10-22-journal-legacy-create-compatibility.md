---
date: 2026-10-22
source: agent
topics: the-overhaul, install-manifest-removal
decisions:
status: current
supersedes: 2026-10-22-journal-integrity-fix-verification
tags: security, data-loss, journal, compatibility
summary: Strict journal validation now preserves legitimate legacy applied create-owned records without preimage_digest while still requiring preimage evidence for replace and delete operations.
---

Coordinator review identified a valid historical producer shape: an applied
`create_owned` record with matching 64-character `digest` and
`desired_digest`, but no `preimage_digest`. The parser now accepts only that
absence-creation shape when the preimage field is missing. Other operation
types still require a valid `preimage_digest`; malformed ownership, state,
operation, desired/result digests, or operation history still fails before
uninstall mutation. This preserves the ownership requirement that prevents the
original user-file deletion repro.

Added a non-frozen parser regression proving the legacy create record remains
accepted and a replacement record with the same missing field is rejected.
Before test changes, `wiki/gate1/testing-infrastructure.manifest` was checked:
it marks `tests/path-b-inventory.test.js` and `tests/path-b-weight.test.js` as
frozen. Those files are restored by the coordinator; this correction made no
edits to either frozen file.

Verification: the focused journal, global-history, install/uninstall, and
coverage command passed 51/51. Wiki index generation and budget checks passed.
This does not resolve the unrelated staged-blob `missing_context_index` test
failure and makes no branch-readiness claim.
