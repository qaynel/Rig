# Prepared owner amendment — not applied or signed

The implementation must follow the owner's settled authentication rule while
preserving the existing signed tests. This request is the concrete review item;
it does not authorise any protected edit. No owner identity, key, signature or
secret belongs in this document.

## Test to change

- **File / case:** `tests/ai-sdlc/hardware-signing.test.js`, PT-017;
  `tests/ai-sdlc/release.test.js`, PT-046;
  `tests/ai-sdlc/public-release.test.js`, PT-072;
  `tests/ai-sdlc/learning.test.js`, PT-060;
  `tests/ai-sdlc/workers.test.js`, PT-030.
- **Related protected specification:** requirements/criteria R017 and release
  authorization wording in `15-gate1-contract.md`; matching test-manifest and
  lifecycle wording in `16-test-manifest.md` and `17-customer-lifecycle.md`.
- **Optional old-oracle amendment:** add the separate AI-SDLC npm alias to
  `package.json` and `wiki/gate1/package-scripts.json` together. The complete
  scripts snapshot is signed; the equivalent standalone runner already works.

## Proposed change and why

PT-017 currently requires a literal FIDO key algorithm. Accept instead the
owner's settled property: the agent cannot read the signing key and each release
of a signature requires a real human action. Secure Enclave/Touch ID and suitable
administrator-gated signing qualify alongside FIDO. A passphrase-protected key
file alone does not prove this property. Keep unavailable-human-authentication
reported as a named gap; never simulate a touch or report an unrun proof green.

PT-046 and PT-072 currently require successful publication with only
`authorization: { signed_by: 'gate1-owner' }`. Replace those positive fixtures
with actual expiring, action/candidate-bound signatures verified against the
single enrolled owner key, and passing required evidence. Keep negative checks
for a typed name, wrong key/principal/namespace, modified candidate, expiration,
replay and missing evidence. The production code now rejects name-only approval
and never serializes authorization payloads into published artifacts.

PT-060 contains no executable candidate, before/after mechanism or input fixture.
It supplies only historical expected booleans yet demands actual caught values.
Supply executable positive/negative cases and a candidate check, then assert
observed outcomes. Also require a confounded result and refused promotion when
execution evidence is absent. Historical labels alone cannot certify improvement.

PT-030 requires reclaiming ownership using only caller-supplied
`owner_exited:true` and `no_pending_writes:true`, while the reserving process is
still alive. Replace this fixture with a real exited worker process and verified
unchanged owned files/no pending effects. Keep negative cases for a live or
unknown owner, changed files, unresolved effects and self-asserted exit flags.
An expired time limit does not prove the writer stopped.

## Evidence

- [x] **The encoded specification changed.** The owner explicitly rejected
  FIDO-only authentication and required complete real release authentication:
  [human-authentication ruling](../../reasoning/2026-10-24-human-authentication-owner-decision.md),
  [release authorization ruling](../../reasoning/2026-10-24-ship-the-kit-agent-decides-owner-decision.md).
- [x] **The test asserted a non-issue / manufactured proof.** PT-046's final
  assertion and PT-072's setup assert successful name-only publication. PT-060
  expects `caught` to equal `fails_before` with no executable check. Independent
  findings are recorded in `.context/ai-sdlc-review.md` and the
  [remediation checkpoint](../../reasoning/2026-10-24-ai-sdlc-readiness-security-checkpoint.md).
- **Runnable new proof:** `node --test tests/ai-sdlc-release-security.test.js
  tests/ai-sdlc-phase-safety.test.js tests/ai-sdlc-orchestration-safety.test.js`.
  Ephemeral software keys in regression tests prove verifier mechanics only;
  they never prove a real human-presence ceremony.

## Signed-document housekeeping to batch with the amendment

Correct the three protected documents' stale pre-signing claims. The programme
is signed; implementation exists locally. The lifecycle's named E2E obligations
must receive real execution evidence, not merely be declared covered by the
isolated proving tests. Technical design remains outside the signed oracle.

## Human authorization

- **Key holder / signing-key fingerprint:** pending; use the existing trust root.
- **Date:** pending.
- **I authorize this oracle change:** pending owner action.

## Re-sign record

- **Command:** owner runs the existing signer for `--programme ai-sdlc` and
  confirms the exact delta printed by its refused first run. The separate old
  package-scripts amendment, if desired, uses the existing default programme.
- **Resulting signature or commit reference:** pending. No protected edit or
  signing action was performed by the implementation agents.
