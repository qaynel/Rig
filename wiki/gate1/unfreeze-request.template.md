# Frozen-test unfreeze request

Copy this file to a dated request before changing any frozen oracle byte. Fill
every field, then have the human key holder make the edit and re-sign the oracle.
The request is the evidence record; the refreshed SSH signature is the human
authorization. Never put a private key or secret in this file.

## Test to change

- **File:**
- **Test name or acceptance case:**

## Proposed change and why

<!-- One paragraph: state the exact assertion or expectation that will change,
and why the frozen contract no longer represents the intended behavior. -->


## Evidence

<!-- Complete at least one path. Link or quote the evidence directly. -->

- [ ] **The test asserted a non-issue.** Triage log or wrong assertion, and why:
- [ ] **The encoded specification changed.** New specification link or quote:
- [ ] **Human rationale (no agent available).** Plain written reason:

## Human authorization

- **Key holder / signing-key fingerprint:**
- **Date:**
- **I authorize this oracle change:**

## Re-sign record

- **Command:** `node scripts/approve-gate1.js --confirm-digest-delta <digest printed by the refused first run>`
- **Resulting signature or commit reference:**
