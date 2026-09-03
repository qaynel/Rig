# Onboarding hardening — prevention invariants

**Status: WORKING.** This companion to the onboarding hardening technical spec
turns the review's four recurring themes into signable, mechanical ratchets. The
eight adversarial behavior cases remain the implementation oracle; the four
theme cases prevent the same defect shapes from reappearing at new call sites.

## Contract

| Theme | Recurring defect | Required invariant | Executable evidence |
|---|---|---|---|
| A — wrong trust object / fail-open escape | Stored witnesses are trusted instead of re-derived bytes; predictable temporary names follow links; verification exceptions become clean results. | Proposal bytes are re-hashed before their first use; predictable state writes use an exclusive open; every catch in onboarding verification rethrows or records a hard failure. | `AT-HD-9` in `tests/onboarding-invariants.test.js` |
| B — stale global snapshots | Approval-time facts are not rechecked at mutation time; an aggregate boolean erases per-host decisions. | Inventory is re-derived and compared before the first mutating writer exists; skill scopes are decided per installed host and never through an empty-union fallback. | `AT-HD-10` in `tests/onboarding-invariants.test.js` |
| C — parallel authorities | Version literals, duplicated handlers, and duplicated policy prose drift independently. | Package version has one machine authority; the two required MCP copies stay byte-identical; duplicated policy documents state the same rule and cross-cite each other. | `AT-HD-11` in `tests/onboarding-invariants.test.js` |
| D — happy-path tests mistaken for an oracle | Tests simulate the buggy code, omit adversarial mutations, or lose their mapping to the design. | MCP assertions drive the real adapter; every numbered finding has a substantive adversarial test title; the finding and test sets remain equal; the adversarial file cannot disappear from the signed manifest. | `AT-HD-12` in `tests/onboarding-invariants.test.js` |

## Enforcement boundary

Two source-level checks remain because the required property is a genuinely
stable forbidden *primitive*, not a call order or an identifier's spelling: a
non-exclusive predictable temp write (`I-A-2`) and a JSON-stringified MCP text
channel (`I-D-1`). Both hold regardless of how the surrounding code is
refactored, so pinning their exact shape does not create a false ratchet.

Everywhere the required property is *ordering* — a post-write inventory read
must not satisfy a pre-write recheck, a mutation must not land before a digest
check fails — the invariant is proven adversarially instead: drive the real
seam through `handleOnboarding`, corrupt the input the property is supposed to
catch, and assert on the observable absence of mutation (no journal entry
appended, no graft target byte changed) or the observable propagation of a
real failure (an exception reaching the public `check`/`apply` entrypoint).
Parsing source text for a literal function name (`proposalBodyDigest(`,
`journalWriter(`) or an exact parameter arity proved brittle in review — a
harmless rename breaks the ratchet without changing behavior, and a naive
catch-body regex (`[^}]*`) mis-parses any catch containing a nested block. The
adversarial form survives refactors and catches the actual defect shape
instead of one specific implementation's spelling of it.

The suite is bounded to the onboarding trust boundary and its two MCP copies.
It is not a repository-wide JavaScript linter. Expand its scope only after a
concrete recurrence proves another path shares the same contract.

## Rejected shortcuts

- **Store or update the digest beside tampered bytes.** Rejected because the
  witness and the bytes share one write boundary; derive from the bytes on read.
- **Unlink a stale predictable temporary file and retry.** Rejected because the
  unlink-to-open interval recreates the race; exclusive creation is the guard.
- **Catch and return an empty, zero, false, or skipped verification result.**
  Rejected because broken verification is not successful verification.
- **Take one host union and add a fallback only when it is empty.** Rejected
  because one native host hides every simultaneously installed fallback host.
- **Keep parallel constants or policies aligned by convention.** Rejected
  because review already demonstrated drift; derive, cross-cite, or assert.
- **Recreate adapter output inside its test.** Rejected because the test can
  faithfully reproduce the defect while never observing the shipped seam.
- **Pin an exact function name, parameter count, or loop shape as the proof of
  correct ordering.** Rejected because a harmless rename or refactor breaks
  the ratchet without changing behavior; prove the ordering adversarially
  instead (assert on the absence of mutation or the presence of propagation).
- **Parse catch bodies with a brace-counting-blind regex (`[^}]*`).**
  Rejected because it mis-parses any catch containing a nested block or object
  literal, silently passing or failing for reasons unrelated to fail-open
  behavior; drive the real failure through the public entrypoint instead.
- **Build a version-drift scan from the *current* package.json version.**
  Rejected because the scan goes blind the instant the version moves past a
  stale literal — the exact drift the check exists to catch. Reject any
  quoted `vX.Y.Z`-shaped literal, unconditionally.

## Pre-signing state

Before implementation, the eight behavior tests are expected to be red. The
pattern suite is also red wherever the current implementation still carries a
forbidden shape; catalogue/parity checks that already hold may be green. The
signing ceremony freezes both files at those bytes. Implementation changes only
production code and documentation until all signed cases pass.
