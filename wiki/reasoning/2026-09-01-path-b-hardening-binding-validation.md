---
date: 2026-09-01
source: agent
topics: onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: trap
summary: Independent review found that approved skill binding verification accepted duplicate rows for one skill; the verifier now requires one valid, unique binding for every selected skill and rejects unselected or malformed rows before apply.
---

# Path B hardening review correction — binding rows must be unique

## Finding

The approved-byte binding change checked that projected skill IDs had matching
rows and that each row's digests matched. It did not check row uniqueness. A
persisted proposal could therefore repeat a valid binding row and still pass
verification, weakening the required fail-closed handling for duplicate
bindings.

The smallest reproduction prepared and proposed a normal fixture, appended a
copy of its first `skill_bindings` row to `.rig/state.json`, and applied with a
valid signature over the unchanged proposal digest. Before the correction the
result was `APPLY_ACCEPTED applied`.

## Correction

The shared verifier now requires an array of structurally valid binding rows,
rejects duplicate skill IDs and IDs outside the selected set, and requires the
row count to equal the number of selected skills. The correction is at the
apply trust boundary, so malformed persisted state cannot become a successful
installation through a weaker caller-specific check.

## Evidence

- Red: the new duplicate-binding regression failed because no exception was
  raised.
- Green: `node --test --test-name-pattern='duplicate approved binding rows'
  tests/path-b-hardening.test.js` passed.
- Green: `node --test tests/path-b-hardening.test.js` passed with 61 tests.
- Green: `npm run test:rig` passed with 12 tests.
