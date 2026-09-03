---
date: 2026-09-03
source: agent
topics: gate1-signing, testing-strategy, onboarding-flow, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: review, verification, qa-prod, code-review
summary: Four-axis code review of path-b-adaptive-onboarding-oracle against qa-prod; four stale AT-HD trace titles fixed (CI blockers after re-sign); three human-only blockers remain before CI can be green.
---

# Code review + trace title fixes — 2026-09-03

## Scope

Four-axis code review (spec/scope, correctness, architectural smells, test gaps)
of `path-b-adaptive-onboarding-oracle` in preparation for qa-prod deployment.
605 files changed, +23443/-376 ahead of qa-prod.

## CI failure root cause

`npm test` fails at `scripts/check-advanced-spec.js → verifyManifest`. Four
manifested files changed since the last oracle signing:

| File | Status |
|---|---|
| `tests/advanced-oracle.test.js` | Changed (version assertion → semver shape) |
| `tests/helpers/path-b.js` | Changed (umask-independent tree_digest) |
| `tests/onboarding-hardening.test.js` | Changed (Phase 0 AT-HD corrections) |
| `tests/onboarding-invariants.test.js` | Changed (Phase 0 AT-HD corrections) |

`verifyManifest` short-circuits on the first mismatch (`tests/advanced-oracle.test.js`),
hiding the other three. This is the expected Phase 0 end state — corrected bytes
are real and unsigned, awaiting owner re-sign.

## What was fixed (agent-fixable)

Four trace rows in `wiki/gate2/technical-spec.md` had stale titles that would
fail `verifyCoverage`'s exact-regex check after the oracle re-sign:

- **AT-HD-2**: added "and recovers once the operator clears it" (Phase 0 correction
  added the recovery proof; trace table retained the pre-correction title)
- **AT-HD-4**: corrected from "instruction-only scope when a non-native host is
  installed alongside a native host" to "both native and instruction-only scopes
  with scope-correct names" (title substantially changed in Phase 0)
- **AT-HD-5**: added "in every language edition" (Phase 0 expanded the README check
  to all language editions; trace table retained the shorter pre-correction title)
- **AT-HD-10**: corrected from "installedSkillScopes uses no aggregate-empty-union
  fallback" (internal function name) to "a native host does not suppress another
  installed host's own discovery scope" (behavioral description matching the actual test)

All 12 AT-HD trace targets verified `✓` against actual test titles after fixes.

`.context/` added to `.gitignore`; `.context/rig-oracle-freeze-v2.txt` removed from
git tracking (`git rm --cached`). It is a convenience echo that `approve-gate1.js`
regenerates before signing; it is not a trust input (`check-advanced-spec.js`
recomputes the oracle message from gate1 files directly). Tracking it caused churn
and contradicted the design comment in `approve-gate1.js:54`.

`rig/lib/skill-catalog.js` comment corrected: the "tracked content only" claim was
inaccurate because the walk reads from the filesystem (untracked files in skill
directories are included). Updated to accurately describe the umask-independence
guarantee.

## Human-only blockers before CI can be green

**1. Fill in three unfreeze request authorization fields:**

- `wiki/gate1/unfreeze-requests/2026-09-03-onboarding-hardening-oracle-corrections.md`
  (ALL fields blank — this is the critical one covering Phase 0 corrections)
- `wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md`
  (ALL fields blank — decide if still pending or superseded)
- `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md`
  (Key holder partially filled; Date and "I authorize" blank)

**2. Run the oracle re-sign ceremony:**

On the Mac with the Secretive-backed signing key:
```
node scripts/approve-gate1.js
```
The script will print `--confirm-digest-delta <digest>` on first run; re-run
with that flag to confirm and sign. The ceremony updates `testing-infrastructure.manifest`
with the four new file hashes and produces a new `gate1.sig`.

**3. Commit the re-signed oracle files:**

- `wiki/gate1/testing-infrastructure.manifest` (4 updated hashes)
- `wiki/gate1/gate1.sig` (new signature)
- `wiki/gate1/unfreeze-requests/2026-09-03-onboarding-hardening-oracle-corrections.md`
  (filled authorization fields)

After that, `npm test` should pass on the oracle check. The Phase 1 implementation
tests (AT-HD-1..8, I-A/B/C/D) will remain red by design until Phase 1 is implemented.

## Medium findings (not blocking CI, not requiring immediate action)

- **`verify-gate1-pin.sh:36-41`** — bash counts lines while JS counts
  comma-separated principals. A multi-principal-on-one-line crafted file passes
  the bash count but would fail the JS count. Fingerprint check closes the gap
  for realistic attack vectors.

- **`skill-catalog.js`** — walk reads from filesystem, not git; untracked files
  in skill directories contaminate the digest and can diverge across OS
  environments (e.g., `.DS_Store` on macOS).

## Previous blockers — resolved

| Finding | Resolution |
|---|---|
| Blocker 2: umask-dependent tree_digest | Fixed by `a180e191` |
| Medium: wiki-maintenance missing in `.agents/skills` | Fixed by `36e6a8fd` |
| Low: `.superpowers/` committed artifact | Fixed by `85a02781` + git rm |
| Blocker 1: uncommitted acceptance.md edit | Fixed by `5af75820` + re-sign |
