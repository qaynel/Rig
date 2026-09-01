# Frozen-test unfreeze request

## Test to change

- **File:** `tests/path-b-catalog.test.js`
- **Test name or acceptance case:** `AT-PB-1 duplicate declared names fail catalogue generation` — the current branch did not contain the tie-break assertion described by the handoff, so the frozen catalogue test gains the missing explicit duplicate-source case.

## Proposed change and why

Add the missing explicit assertion that catalogue generation throws a duplicate
skill-name error naming both source locations. On this branch the handoff's
named tie-break case is absent; this is an added executable assertion, not a
line-for-line replacement. The fallback changes a skill's declared identity
silently, so the frozen contract must test the fail-closed catalogue behavior.

## Evidence

- [ ] **The test asserted a non-issue.** Not applicable: the relevant frozen
  assertion was missing rather than incorrect.
- [x] **The encoded specification changed.** The frozen oracle now makes the
  existing fail-closed duplicate-name decision observable with an explicit
  two-source fixture; its prior absence left that decision untested.
- [ ] **Human rationale (no agent available).** Not used; the documented
  product decision and reproduced failure provide the rationale.

## Human authorization

- **Key holder / signing-key fingerprint:** gate1-owner /
  `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`
- **Date:** 2026-09-02
- **I authorize this oracle change:** Authorized by the completed SSH-signature
  ceremony; the current signature verifies against the revised manifest.

## Re-sign record

- **Command:** The human key holder ran `node scripts/approve-gate1.js lock`
  with the confirmation digest shown by its refusal preflight. The exact
  one-time confirmation value was not retained in the agent handoff.
- **Resulting signature or commit reference:** `wiki/gate1/gate1.sig`, verified
  as `gate1-owner` over the current 14-file manifest (83 acceptance cases).
