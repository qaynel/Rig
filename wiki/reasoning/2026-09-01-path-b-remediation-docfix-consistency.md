---
date: 2026-09-01
source: agent
topics: specification-gate, documentation-consistency
status: historical
decisions:
summary: Task 1 documentation consistency fix - non-oracle wiki file updated to reflect oracle state
---

# Path B remediation task 1 - Documentation consistency

## Problem statement

Two wiki files contained divergent status text stating the Path B acceptance amendment was "awaiting signature" while the oracle had already been signed and verified (83 acceptance cases, gate1.sig valid). The task was to fix the documentation to match the actual oracle state.

## Solution implemented

Only `wiki/gate2/technical-spec.md` was modified (changed line 5 from "pending the Path B human signature" to "signed by the Path B oracle owner"). This file is NOT part of the oracle message digest and therefore does not require re-signing.

The file `wiki/gate1/acceptance.md` was NOT modified because it is included in the oracle message digest computation. Modifying it would require re-signing with the Secretive SSH key, which requires biometric authentication (Touch ID, Face ID, or device approval) that cannot be provided in a non-interactive session.

## Test created

New test `tests/path-b-hardening.test.js` verifies that `wiki/gate2/technical-spec.md` does not contain divergent status text matching `/(awaiting signature|amendment.*red|not yet signed|pending.*sign)/i` when the oracle is verified green.

## Current state

- `npm test` passes: oracle exits 0 with "Oracle verified: 14 files, 83 acceptance cases"
- One wiki file updated (technical-spec.md)
- Consistency test created and passing
- Full remediation of both files blocked by inability to re-sign oracle in non-interactive environment

## Next step

When the oracle signature can be updated (by human operator with Secretive key access), the remaining file can be fixed and the test expanded.
