# Frozen-test unfreeze request

## Test to change

- **Files:**
  - `tests/onboarding-hardening.test.js` (AT-HD-1, AT-HD-2, AT-HD-3, AT-HD-4,
    AT-HD-5, AT-HD-6, AT-HD-8 test bodies)
  - `tests/onboarding-invariants.test.js` (I-A-1, I-A-3, I-B-1, I-B-2, I-C-2
    test bodies)
  - `tests/helpers/path-b.js` (`installRuntime`'s `releaseTag`)
  - `tests/advanced-oracle.test.js` (AT-DIST-1's version assertion)
- **Acceptance cases:** AT-HD-1, AT-HD-2, AT-HD-3, AT-HD-4, AT-HD-5, AT-HD-6,
  AT-HD-8, AT-HD-9, AT-HD-10, AT-HD-11 (unchanged 95-ID set — see Evidence).

## Proposed change and why

The 2026-09-03 report-only review
([`2026-09-03-onboarding-hardening-oracle-review.md`](../../reasoning/2026-09-03-onboarding-hardening-oracle-review.md))
found that the currently-signed 95-case oracle bytes were signed *after* the
review had already identified defects in them — three cases (AT-HD-3, AT-HD-4,
AT-HD-6) cannot pass under their own spec regardless of implementation, one
case (AT-HD-6) had a spec-vs-test contradiction over throw-vs-return, and two
frozen files (`tests/helpers/path-b.js`, `tests/advanced-oracle.test.js`)
carry version-authority defects that the hardening findings themselves are
meant to close. The intent owner's corrected work order (message to this
session, 2026-09-03, itemized items 1-8) specifies the exact fix for each.
Filed changes, one per item:

1. **AT-HD-3** — swapped the injected file from `injected-post-approval.md`
   (a repository-root path `inventoryHarness` cannot observe — it is a bounded
   harness scan, not a whole-repo walk) to `CLAUDE.md` (a real `HARNESS_NAME`).
   Added a before/after byte-identity check on the approved graft target to
   prove refusal precedes mutation.
2. **AT-HD-4** — corrected the expected projected paths to match the router
   contract (native `rig-<name>`, instruction-only `<name>`, per
   `rig/tier-1/routing.md`): `.agents/skills/rig-qa/SKILL.md` +
   `.rig/skills/qa/SKILL.md` for the optional skill, `.agents/skills/rig-debugging/SKILL.md`
   + `.rig/skills/debugging/SKILL.md` for the mandatory core skill (selected
   as `rig-debugging`, its real catalogue id). Added an `applied.projections`
   host-scope assertion read from `.rig/state.json`.
3. **AT-HD-6** — the matcher now requires the literal harness error
   (`"inventory: target must exist"`), not `ENOENT`, matching
   `rig/lib/inspect.js`'s actual `realpathOrNull`-based failure. The
   accompanying working spec's Rejected note is narrowed to state that only
   exception propagation satisfies the oracle; returning a hard failure no
   longer reads as an accepted alternative.
4. **AT-HD-8** — replaced both `doesNotMatch` negative-phrasing regexes with
   positive requirements: both documents must state body-immutability,
   frontmatter-mutability, and cross-cite each other by path. The prior
   negative regex tripped on prose that stated the *correct* rule.
5. **AT-HD-5 / I-C-2** — AT-HD-5 now checks `README.md`, `README.es.md`, and
   `README.ko.md`, not only the English edition. I-C-2's `rig/lib` scan now
   rejects *any* quoted `vX.Y.Z`-shaped literal instead of one built from the
   currently-installed `package.json` version, which went blind the instant
   the version drifted past a stale literal. `tests/helpers/path-b.js`'s
   `installRuntime` now derives `releaseTag` from `package.json` instead of a
   hardcoded `'v5.0.0'`. `tests/advanced-oracle.test.js`'s AT-DIST-1 now
   asserts `package.json`'s version is a well-formed semver shape rather than
   pinning the literal `'5.0.0'` — `scripts/check-versions.js` remains the
   cross-manifest version/tag consistency authority; this assertion no longer
   duplicates it.
6. **AT-HD-2** — now requires the specific actionable EEXIST message (naming
   the stale `.tmp` path and the remedy) rather than accepting any exception
   `propose` happens to throw, and proves a retry succeeds once the stale
   `.tmp` path is removed. AT-HD-1 now imports `signApproval` directly (the
   dead `h.signApproval` fallback branch is gone) and requires the specific
   `"tampered post-signing...digest mismatch"` message instead of a loose
   `/digest|tamper|integrity|proposal/i` that unrelated failures could satisfy.
7. **I-A-1, I-A-3, I-B-1, I-B-2** — replaced source-shape/identifier-name
   parsing (an exact `proposalBodyDigest(` token position, an exact
   `journalWriter(` token position, an exact 2-parameter `installedSkillScopes`
   signature with a required `for...of` loop, and a brace-counting-blind catch
   scanner that mis-parses nested blocks) with adversarial behavioral proofs
   of the same safety properties: no journal/file mutation when a tampered
   proposal or a post-approval inventory drift is detected, per-host scope
   correctness under a different native/instruction-only host pair than
   AT-HD-4 uses, and an end-to-end `check()` propagation proof through a
   symlinked scan-root file that only `inventoryHarness`'s own
   `isSymbolicLink()` handling (not the shared `walkFiles` used elsewhere in
   the module) can observe.
8. **Documentation** — `Home.md`, `topics/the-two-gates.md`,
   `topics/what-rig-is.md` corrected from stale 83-case/14-file counts to
   95-case/16-file; `index/acceptance-cases.md`'s grep claim corrected from
   "99 distinct strings" to the actual "100 distinct strings", with the five
   mentioned-only IDs named explicitly
   (`AT-CLAIM-2`, `AT-CLAIM-3`, `AT-HOST-3`, `AT-HOST-4`, `AT-P7`). Both
   `wiki/gate2/onboarding-hardening-spec.md` and `-invariants.md` (working
   docs, not frozen — checked for presence only) updated to describe the
   corrected F3 harness-scope boundary, F4 per-scope naming rule, F6
   throw-only shape, F2 recovery story, and the behavior-focused invariant
   replacements.

## Evidence

- [x] **The test asserted a non-issue / could not pass under its own spec.**
  The 2026-09-03 review's B1-B3 findings demonstrate AT-HD-3, AT-HD-4, and
  AT-HD-6 were specified against inputs the harness cannot observe or against
  the wrong expected error, so no implementation could make them pass without
  changing the test body — the spec's own §7 return-to-grilling trigger.
- [x] **The encoded specification changed.** `wiki/gate2/onboarding-hardening-spec.md`
  and `-invariants.md` (both working, checked-for-presence documents, not
  frozen) are amended in this same change to describe the corrected approach
  each rewritten test now encodes.
- [x] **Human rationale.** The intent owner (gate1 owner, git identity
  Vaibhav Kodiyan) supplied the itemized correction list directly, citing the
  review trace, in the message that opened this session.

**ID-set invariant preserved.** `scripts/check-advanced-spec.js`'s
`testTitleIds()` extracts only the leading `AT-[A-Z]+-\d+` token from each
`test(...)` title and deduplicates by that token; sibling tests under one ID
(e.g. `AT-HD-9 I-A-2 ...` and `AT-HD-9 I-A-3 ...`) already collapsed to one ID
before this change. None of the eight edits above add, remove, or rename an ID
prefix — the active set stays exactly `AT-HD-1` through `AT-HD-12` (95 total
with the pre-existing Path B and foundational cases). Verified locally:
`node scripts/check-advanced-spec.js` (run against the corrected, unsigned
bytes) reports "changed oracle file" for each touched manifest entry — proof
the digests moved — and the coverage/ID-set assertions inside `verifyCoverage`
are unaffected by the body rewrites.

## Human authorization

- **Key holder / signing-key fingerprint:**
- **Date:**
- **I authorize this oracle change:**

## Re-sign record

- **Command:** `node scripts/approve-gate1.js` (refuses on first run and
  prints the required `--confirm-digest-delta <digest>`; re-run with that
  flag to confirm and sign — `refreshManifest` recomputes all four changed
  files' digests automatically, no manual manifest edit needed).
- **Resulting signature or commit reference:**

**Note for the ceremony:** this sandbox has no SSH signing identity available
(`ssh-add -l` → "The agent has no identities"; no Secretive agent socket) and
cannot run `approve-gate1.js` to completion. The owner must run the ceremony
on a machine with the gate1 signing key.
