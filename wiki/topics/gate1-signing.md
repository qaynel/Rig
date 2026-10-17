# Gate signing

## Current state

The human-signed oracle covers business intent, acceptance, and manifested
testing infrastructure. The owner re-signed the applied test:e2e package-script
amendment on 2026-10-17; verification now passes for 16 files and 95 cases.
Final tests and review still need evidence on the settled candidate bytes.
[Current readiness](../reasoning/2026-10-17-qa-readiness-inventory.md) ·
[owner runbook](../specs/close-everything/owner-runbook.md)

## What the gate protects

Agents cannot move their own acceptance goalposts. An SSHSIG signature binds
the combined oracle digests to the single owner identity in
`wiki/gate1/gate1.allowed-signers`. The technical design is checked for
presence and remains editable; it has no second freeze.
[The gate](the-two-gates.md) · [frozen acceptance](../gate1/acceptance.md)

Local verification alone is not a barrier against a repository writer.
The trusted base-branch `gate1-pin` workflow checks the signature against a
fingerprint held outside the repository. That check must be required on QA and
production. Current protection must be verified at the release boundary; a
reporting-only check is insufficient.
[CI anchor](../reasoning/2026-09-02-gate1-ci-pin-anchor-implemented.md) ·
[anchor deployment](../reasoning/2026-09-02-gate1-ci-pin-anchor-armed.md)

## Changing the oracle

The requester files an [unfreeze request](../gate1/unfreeze-request.template.md)
with the exact proposed change and evidence. Only the human key holder applies
and signs frozen changes. Agents may prepare candidates and never run or
simulate the signing helper.

The owner runs `node scripts/approve-gate1.js`. On a re-sign, its first refusal
prints the proposed combined oracle digest and a command with
`--confirm-digest-delta`. The owner reviews the delta and runs that printed
command, then verifies with `node scripts/check-advanced-spec.js`. A single
file hash is not the confirmation digest. This is a batched re-sign, not a
new product grilling session.

Key configuration stays local and outside installed repositories. The key
holder is responsible for the required live-human act; SSH signature
verification proves identity and does not by itself prove hardware presence.
There is no signer recovery bypass. See the
[platform signing instructions](../gate1/signing-instructions.md).

## History

The [August gate archive](../archive/2026-08/gate-model-and-the-one-lock.md)
preserves the collapse to one gate and the rejected trust models. The
[September oracle review](../reasoning/2026-09-03-onboarding-hardening-oracle-review.md)
and [subsequent re-sign](../reasoning/2026-09-03-code-review-and-trace-fixes.md)
record earlier corrections. Those historical signature states are superseded
by the current verifier. The
[package-script incident](../reasoning/2026-09-04-gate1-package-scripts-break-and-revert.md)
explains why even test-command edits belong to the signed surface.
