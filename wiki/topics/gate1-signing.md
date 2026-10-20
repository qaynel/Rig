# Gate signing

## Current state

The human-signed oracle covers business intent, acceptance, and manifested
testing infrastructure. The owner re-signed the applied test:e2e package-script
amendment on 2026-10-17; verification now passes for 16 files and 95 cases.
The [binding review checkpoint](../reasoning/2026-10-18-qa-binding-review-remediation-start.md)
found contradictions inside the signed prose and executable oracle after the
candidate passed local tests. The owner must apply the prepared batch amendment
and re-sign before a corrected candidate can receive a new binding review.
The [unsigned amendment progress](../reasoning/2026-10-18-qa-review-remediation-progress.md)
also records the approval-identity and signer-namespace gaps that require
owner changes to frozen testing infrastructure.
The [host-hook owner ruling](../reasoning/2026-10-18-host-hook-honest-gap-owner-decision.md)
selects an explicit available-but-not-integrated gap; its frozen host cases
must be amended and signed in the same batch.
[Host implementation checkpoint](../reasoning/2026-10-18-qa-host-gap-checkpoint.md)
records the hook correction and remaining frozen-oracle work.
[Grade-receipt boundary](../reasoning/2026-10-18-qa-grade-receipt-boundary.md)
sets the runtime evidence needed before AT-LF-7/8/9 can be amended.
[Current readiness](../reasoning/2026-10-17-qa-readiness-inventory.md) ·
[owner runbook](../specs/close-everything/owner-runbook.md)

## What the gate protects

Agents cannot move their own acceptance goalposts. An SSHSIG signature binds
the combined oracle digests to the single owner identity in
`wiki/gate1/gate1.allowed-signers`. The technical design is checked for
presence and remains editable; it has no second freeze. The same key is Rig's
only signing key at runtime: every approval verifies against the installed copy
([one trust root](../reasoning/2026-10-20-one-trust-root-owner-decision.md)).
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
The [October diagnostic](../reasoning/2026-10-19-qa-closeout-oracle-diagnostic.md)
records the additional lint fixture updates needed in the current owner-only
amendment before the next signature.

The [trust-root review fixes](../reasoning/2026-10-20-trust-root-review-fixes-progress.md) trace prepares a second owner-only amendment (seven oracle case bodies, no title changes) after the failed re-review; it is unapplied until the owner signs.
