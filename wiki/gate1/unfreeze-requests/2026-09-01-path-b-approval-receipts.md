# Frozen-test unfreeze request

## Test to change

- **File:** `tests/helpers/path-b.js` and `tests/path-b-onboarding.test.js`
- **Test name or acceptance case:** the shared `applyAndCheck` positive path
  used by every AT-PB apply/check case, and
  `AT-PB-5 identical approved apply is idempotent and resumes the same proposal`

## Proposed change and why

Path B hardening Issue 1 removes `approval.verified === true` as evidence of
user presence. `rig/lib/onboarding.js` now re-verifies an SSH signature over
the proposal digest against a repository-owned allowed-signers file, so a
receipt that only *claims* approval is refused.

Both frozen files encode the old contract by construction, not by assertion.
`tests/helpers/path-b.js` builds every positive-path approval from
`approval(planDigest)`, which fabricates `{ method: 'external-sshsig',
verified: true }`. That receipt is exactly the forgery the hardening exists to
reject, so every positive apply/check case in the frozen suite would fail for
the intended reason. The change is the smallest one that restores them: the
helper signs a real ephemeral ed25519 receipt through the new, unfrozen
`tests/helpers/path-b-approval.js`, and returns it as `approvalReceipt` so the
idempotent-re-apply case can replay the *same* receipt instead of minting a
second key (which would add a second allowed-signers line and break that case's
byte-identical-tree assertion).

The fabricated `approval()` factory itself is kept, unchanged in behaviour, so
the negative cases still have a structurally plausible fake to hand `apply`.
No assertion in either file is relaxed; the frozen expectations still hold.

Full diff is 6 changed lines across the two files:

```
tests/helpers/path-b.js
+ const { signApproval } = require('./path-b-approval');
+ (comment above `approval`, marking it as the unsigned negative-case factory)
+ const approvalReceipt = signApproval(target, proposed.proposal_digest);
-   approval: approval(proposed.proposal_digest),
+   approval: approvalReceipt,
- return { prepared, proposed, applied, checked };
+ return { prepared, proposed, approvalReceipt, applied, checked };

tests/path-b-onboarding.test.js
- const { proposed } = h.applyAndCheck(target);
+ const { proposed, approvalReceipt } = h.applyAndCheck(target);
-   approval: h.approval(proposed.proposal_digest),
+   approval: approvalReceipt,
```

## Evidence

- [x] **The encoded specification changed.** `docs/superpowers/plans/2026-09-01-path-b-remediation.md`
  Issue 1: "`apply` accepts a caller-controlled `verified: true` Boolean as
  approval evidence. It never verifies a host attestation or SSH signature, so
  a fabricated receipt applies the operation." The hardening plan
  (`docs/superpowers/plans/2026-09-01-path-b-hardening.md`, Task 1) resolves it
  by requiring a verified SSHSIG receipt. `docs/advanced/operator.md:53` already
  states the equivalent rule for policy activation: "A JSON `verified: true`
  assertion is not accepted." Path B onboarding is being brought to the same
  standard.
- [x] **The test asserted a non-issue.** The frozen bytes do not assert that an
  unsigned receipt is acceptable; they merely *construct* one because no signed
  path existed. The fixture, not the contract, is what changes.

Verification with the change applied: `node --test tests/*.test.js` →
654 tests, 653 pass, 1 fail — and the single failure is the oracle-verification
case itself, which is exactly what this request unblocks.

## Human authorization

- **Key holder / signing-key fingerprint:** gate1-owner /
  `SHA256:0Ok+jnRuyWIZdLUPt3ZtN4StHaDIsVtVM24A12zajRY`
- **Date:**
- **I authorize this oracle change:**

## Re-sign record

- **Command:** `node scripts/approve-gate1.js --confirm-digest-delta f1a83080a04347510c5f0658015fdb30363b686492d7041011b36634ad13a4c6`

  Expected manifest delta:

  ```
  - 035ce2df6e4d7877e0db794bee8b3fd42a674071be4024463d9ca3ec302c94ef  tests/helpers/path-b.js
  + 59ad8efb19a9fb8b7ea203e2cfb290eb8045fd8e88c1cdd5a2e8757f4a51f5cf  tests/helpers/path-b.js
  - 8a52552b48eb156f07d915bc7ae309079d5e0462f06085ccd0fc704db3ecce0f  tests/path-b-onboarding.test.js
  + 2d62362b5ce2d0d99b4477e731f1573050918a27173eaedec913b256fdc0bffe  tests/path-b-onboarding.test.js
  ```

  The digest above is only valid for the exact working-tree bytes described in
  this request; if either file is touched again, rerun the ceremony without
  `--confirm-digest-delta` and use the digest it prints.

- **Resulting signature or commit reference:**
