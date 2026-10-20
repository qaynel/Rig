# Binding-review oracle amendment — owner review required

Prepared 2026-10-18. This is an unsigned candidate and does not change any
frozen byte. It consolidates the contradictions exposed by the failed binding
review of `f8140b7214d004fd925b1009201ac52979dcd227`. The owner applies
only the final reviewed delta and re-signs it in one session. The current
author-context attempt counter remains at two failures; this request neither
resets nor authorizes another binding run.

## Tests and specifications to change

- `wiki/gate1/business-spec.md`: D24 release, catalogue, and Path B paragraphs.
- `wiki/gate1/acceptance.md`: AT-SHAPE-6, AT-DIST-1, AT-PB-3, AT-PB-6,
  AT-HOST-1 and, if needed to make the runtime evidence requirement explicit,
  AT-LF-7/8/9, AT-LF-13, and AT-LF-20.
- `tests/advanced-oracle.test.js`: the corresponding manifested cases plus
  AT-P1, AT-P4, AT-B6, AT-PRESENCE-1/2, AT-UNINSTALL-2, AT-LF-22, and AT-GATE-2
  where the current assertions exercise only half of the signed claim.
- `tests/path-b-catalog.test.js`: refresh AT-PB-1's active-corpus byte digest
  *after* final catalogue authorship changes; strengthen AT-PB-3/6 against the
  final delivery contract.
- `scripts/check-advanced-spec.js`: require the expected SSHSIG namespace,
  with a manifested regression. This script is itself in the signed testing
  infrastructure manifest; an agent cannot change it independently.
- `wiki/gate1/testing-infrastructure.manifest` and the Gate 1 signature: refresh
  only after the owner has reviewed all final frozen bytes.

## Proposed change and why

1. **D24 authored catalogue:** retain 115 current leaves and Policy-grade
   assurance ceiling. Replace the requirement that each fragment repeat the
   phrase “generic baseline practice, not repository-tailored” with a requirement
   that each service states its actual coverage and evidence limit in specific
   language. Preserve the ban on repeated filler and fabricated Context or
   Evidence claims. Change AT-SHAPE-6's manifested check to enforce that same
   rule and inspect all service fragments. Its current test bans wording its
   signed prose requires.
2. **Release and optional skills:** state version `6.0.0`, keep the 55-skill
   upstream inventory and attribution metadata, and say the optional bytes are
   fetched from the pinned source during approved onboarding. A fresh install
   projects the nine mandatory workflow/onboarding skills and compact catalogue;
   it does not stage the optional source shelf or expose optional skills before
   approval. Retain named-tag download-before-execute and real-download
   clean-install evidence. This implements locked owner decisions 6 and 7 and
   aligns the acceptance prose with the already signed AT-PB-3 executable case.
3. **Host contract:** distinguish `emitted` (Rig writes a real host-consumed
   artifact at the declared path, proved by byte inspection), `unsupported`
   (the vendor lacks that surface), and `not_integrated` (vendor surface exists
   but Rig has no adapter yet). A `.rig/host-contracts` JSON record alone is
   evidence of the declaration, not evidence that a host hook was emitted.
   AT-HOST-1 should test the actual artifact and report every unintegrated axis
   as a named coverage gap. Existing meaningful instruction/MCP integrations
   remain in scope; unsupported must not be used to hide an unwritten adapter.
4. **Behavioral oracle:** make AT-LF-7/8/9 reject a pass synthesized from a
   supplied `result` field or requested grade. Amend the fixtures to supply
   `target`, `grade`, `changed`, and command `argv` to
   `runGrade({ target, grade, changed, commands, context })`; command objects
   describe commands to execute and must not carry asserted `result` data.
   AT-LF-7 must use a disposable target file and an executable command whose
   real exit status and output digest determine the Policy verdict; assert a
   fabricated `result`-only command cannot pass. AT-LF-8 must create the exact
   request with `createGradeReviewRequest({ target, changed, commands })`,
   supply that request-bound Context review with a non-empty summary and
   structured findings (including an explicit empty-findings review), and
   assert Context contains Policy's completed steps plus
   `context_understanding`. Missing, stale, or mismatched review must leave
   Context incomplete. AT-LF-9 must independently replay Policy commands,
   compare observed exit status and output digest with the recorded receipt,
   bind evidence to the input digest, and reject a changed command or file;
   absent CI remains a named gap and does not fabricate Evidence. Require
   `completed_grades` to be cumulative at each grade. Exact final field names
   and the installed `rig check` dispatch should match the implementation
   candidate's runnable tests before the owner signs.
   Make AT-LF-13 use the shared CI proposal path, with separate approval.
   Strengthen the named thin cases above with the missing failure/rollback,
   repeat, grant and clean-removal halves already described in acceptance prose.
   These changes tighten the executable oracle; they do not relax the product
   obligation.
5. **Fresh one-use approval:** bind a unique approval nonce or receipt ID into
   the signed challenge and verified receipt for each consent. AT-LF-20 must
   prove that replay of the same verified receipt is denied while a newly
   signed receipt for the unchanged plan can run. A deterministic signature
   over the current plan-only challenge can be byte-identical on reapproval,
   so hashing signature bytes cannot distinguish fresh consent from replay.
   The execution path must consume only a verified receipt, not an arbitrary
   caller-supplied approval object.
6. **Verifier:** reject signatures bearing an unexpected SSHSIG namespace and
   exercise that rejection with a real signature using the wrong namespace.
   Keep the existing signer identity and allowed-signers pin.
   The focused [candidate](AT-GATE-2.allowed-signers-namespace.md) includes
   a runnable proof of the current acceptance gap.

## Evidence

- [x] **The test asserted a non-issue:** AT-SHAPE-6's signed prose requires a
  phrase that its manifested test explicitly rejects at
  `tests/advanced-oracle.test.js:135`; the failed review records this conflict
  in `.context/qa-readiness-final-review-run.log`.
- [x] **The encoded specification changed:** the owner-locked North star in
  `CLAUDE.md` selects v6, one corpus, and fetch-during-onboarding; the signed
  AT-PB-3 test already asserts zero staged optional skills and nine mandatory
  skills. Frozen prose still names v5, staged shelf, and eight mandatory skills.
- [x] **The test omitted required behavior:** the binding review's full
  findings in `.context/qa-readiness-final-review-run.log` identify the precise
  fabricated grade, host emission, signature namespace, rollback, and grant
  gaps. The remediation must carry an independent red/green probe for each
  changed executable case before signing.

## Human authorization

- **Key holder / signing-key fingerprint:** pending owner entry
- **Date:** pending owner entry
- **I authorize this oracle change:** pending owner entry

## Re-sign record

- **Command:** `node scripts/approve-gate1.js --confirm-digest-delta <digest printed by the refused first run>`
- **Resulting signature or commit reference:** pending owner entry

After signing, run `node scripts/check-advanced-spec.js` and `npm test` on the
final bytes. A separate explicit owner authorization is required before any
further binding-review attempt under the current two-failure cap.

## Consolidated owner patch

[`binding-review-owner.patch`](binding-review-owner.patch) is the apply-ready
batch for the frozen business specification, acceptance text, manifested
oracle tests, signer verifier, and regenerated manifest hashes. It includes
the nonce-bound LF-20 call sites and the AT-LF-7/8/9 executable cases described
above. From the repository root, check the exact batch without changing frozen
bytes:

```sh
git apply --check wiki/specs/close-everything/candidate-amendments/binding-review-owner.patch
```

After approving the delta, the owner applies it and runs the proposed cases
before re-signing:

```sh
git apply wiki/specs/close-everything/candidate-amendments/binding-review-owner.patch
node --test --test-name-pattern='AT-P1|AT-P4|AT-B6|AT-HOST-1|AT-DIST-1|AT-LF-5|AT-LF-7|AT-LF-8|AT-LF-9|AT-LF-13|AT-LF-14|AT-LF-20|AT-LF-22|AT-LF-24|AT-PRESENCE-1|AT-PRESENCE-2|AT-UNINSTALL-2' tests/advanced-oracle.test.js
node --test tests/advanced-spec-gate.test.js tests/path-b-install.test.js tests/path-b-catalog.test.js
```

Manifest digests were generated from the complete proposed bytes for each
modified manifested file. In an isolated disposable copy, the selected
AT-P1, AT-P4, AT-B6, AT-HOST-1, AT-PRESENCE-1/2, AT-DIST-1, AT-UNINSTALL-2,
AT-LF-7/8/9/13/14/20/22/24 assertions passed in the isolated candidate run; 17/17 focused oracle assertions passed, with all 95 trace titles covered by the 16-entry manifest. Gate 1 verifier tests
passed (4/4); and Path B catalogue/install tests passed (17/17). All 16
manifest entries matched the proposed bytes. AT-PB-1 pins the frozen final
corpus at 1,042 files with SHA-256
`759b7cc73baa241fb47a79cbd270244bc9d4229272ccb4973261d324bf2456f5`.
After signing, the verifier and full-gate commands require the owner's new
signature and matching bytes. These candidate checks are not signed-oracle or
release evidence.
