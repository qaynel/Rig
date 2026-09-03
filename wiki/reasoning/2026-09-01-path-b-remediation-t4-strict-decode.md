# Task 4 — Strict state decoder (2026-09-01)

## What was done

Added `strictDecodeState` to `rig/lib/onboarding-state.js` and wired it into
`readState`. All four onboarding actions (prepare, propose, apply, check) go
through `readState`, so the strict decoder is applied universally at every
state read.

Five failing tests were written first in `tests/path-b-hardening.test.js`
(Task 4 describe block), then the production fix was applied. Commit:
`b5a8981a`.

## Problem

`readState` verified schema_version, revision, and the presence of the
required 10 keys, but allowed extra keys through and did not validate:
- Phase enum (any string was accepted)
- Proposal presence vs phase (proposal non-null in prepared phase)
- Cross-field invariants (applied.proposal_digest in initial state)
- Digest format (uppercase hex or wrong-length strings)

An injected field survived into the next transition undetected.

## Implementation decisions

### Exact key set enforcement
Used `ALLOWED_STATE_KEYS` (same 10 keys already in the required array) to
reject any unknown key. Combined with the existing "all required keys present"
check, this enforces exact key membership.

### Phase enum
`VALID_PHASES` covers the eight phases referenced in the response() routing
logic in onboarding.js: applied, approved, applying, checked, failed,
needs-decision, prepared, proposed.

### Proposal-in-prepared invariant
The prepare action always writes `proposal: null`. A non-null proposal while
phase is 'prepared' is therefore impossible in an unmodified state file.

### Applied.proposal_digest cross-field invariant
The initial prepare state (revision=1) writes `applied.proposal_digest: null`.
A non-null value at revision=1 in prepared phase is unambiguously tampered.
Re-prepare flows (revision > 1) carry over prior applied state, so only the
revision=1 case is flagged — avoiding false positives on legitimate
post-apply re-prepare cycles.

### Digest format
`DIGEST_RE = /^[0-9a-f]{64}$/` validates lowercase hex SHA-256 for any
non-null digest field. Test 5 uses uppercase hex ('A'.repeat(64)) to
demonstrate the rejection path.

## Approaches rejected

**Reject applied.proposal_digest non-null in ALL non-applied phases**: Would
break the legitimate prepare-after-apply flow where phase='prepared' carries
over applied.proposal_digest from the prior cycle. Rejected as a false
positive.

**Validate nested structures (approval, checks, release) exhaustively**:
Out of scope for this task, which addresses the five specific invariants in
the brief. The decoder is intentionally limited to what the tests specify.

## Test summary

19 tests pass (path-b-state.test.js + path-b-hardening.test.js combined).
Full CI gate exits 0: 630 tests in tests/*.test.js, 83 acceptance oracle
cases, all green.

## Status

DONE. No concerns.
