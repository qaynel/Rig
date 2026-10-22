# Frozen-test unfreeze request

## Test to change

- **Files:** `tests/helpers/advanced.js`, `tests/advanced-oracle.test.js`
- **Test name or acceptance case:** shared `writePlanApproval` fixture helper
  used by public apply tests, including AT-SHAPE-1, AT-SHAPE-2, AT-SHAPE-5,
  AT-BASE-2, AT-P4, AT-P5, AT-INSTALL-1, AT-UNINSTALL-1, and AT-PRESENCE-2;
  AT-B6 remediation consent and no-op behavior.

## Proposed change and why

Finding 1 requires every public apply path to verify a real SSHSIG against the
Gate 1 trust root. The helper currently emits
`{ method: 'external-sshsig', verified: true }` without a signature. Those
positive fixtures now fail at the intended trust boundary and cannot exercise
the rest of their install/apply behavior. Replace the helper body with a
delegation to the unfrozen `tests/helpers/advanced-signed.js`, which signs the
exact target and plan digest using a fixture key and the `rig-catalog-apply`
namespace. Existing negative forged-approval cases remain separate and keep
their rejection assertions. No acceptance case or assertion is deleted or
weakened. AT-B6 also used a public digest as remediation consent and expected
the old `applied` status before the required post-write sanitation scan. Update
that fixture to retain the forged-digest rejection, create real signed fixture
approvals for the no-op and positive cases, assert that no-op writes nothing,
and assert the fresh `clean` verdict returned after the successful scan. The
existing unfrozen `tests/advanced-apply.test.js` continues to cover transaction
rollback, stale preimages, and killed-process recovery. Re-sign the unchanged
Gate 1 business specification and acceptance set.

## Evidence

- [x] **The encoded specification changed.** The signed AT-PRESENCE-2
  guarantee and finding 1 require a real Gate 1 SSHSIG; `verified: true` is
  caller-controlled metadata and cannot authorize apply. The report is
  `.context/attachments/t4Hjlk/v6.0.0-2026-10-21-code-mode.failed.review.json`.
- [x] **Human rationale (no agent available).** The existing shared positive
  fixture helper manufactures the exact unsigned assertion that the fix
  rejects. Focused signed apply tests pass, while the full suite reports
  `apply: signed Gate 1 SSHSIG approval required` from callers of this helper.
  The signed replacement exists at `tests/helpers/advanced-signed.js`.

Prepared diff: the `writePlanApproval` implementation delegates to the signed
fixture helper; AT-B6 uses signed remediation fixtures and asserts the current
post-scan result. Updated manifest digests:

- `aabb5e2e5390b6fbbd92801734d3c07e52042078ccf893e36d0bc2d92861f17f` for
  `tests/helpers/advanced.js`
- `1aa8e675153c3fbbe07219b16e59115deb383838da2cad16a3b901666fd7b037` for
  `tests/advanced-oracle.test.js`

## Human authorization

- **Key holder / signing-key fingerprint:** pending key-holder entry
- **Date:** pending key-holder entry
- **I authorize this oracle change:** pending explicit key-holder authorization

## Re-sign record

- **Command:** `node scripts/approve-gate1.js --confirm-digest-delta e086a3200fda6a0923d2f8fd9252c10c79a982433e375e61069f0a56e1af1b8a`
- **Expected oracle digest:** `e086a3200fda6a0923d2f8fd9252c10c79a982433e375e61069f0a56e1af1b8a`
- **Resulting signature or commit reference:** pending
