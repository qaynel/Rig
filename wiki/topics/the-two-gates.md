# Gate 1 and Gate 2

Gate 1 owns the acceptance oracle: criteria and the tests that check them are
frozen together under the owner's signature. Preserve those artifacts unless
the owner explicitly routes a correction back through grilling. Gate 2 is the
working technical design; it is checked for presence and remains editable as
implementation teaches us more. The code must satisfy the frozen oracle.
[Gate 1](../gate1/business-spec.md) · [Gate 2](../gate2/technical-spec.md) ·
[Rig router](../../rig/corpus/routing.md)

## Owner-directed order for the proposed AI-SDLC expansion

The owner settled the future sequence: business requirements, acceptance criteria and manifested tests are reviewed and signed together **before** technical design. The existing Gate 1 signature already excludes technical-design bytes; the router's present order still needs later implementation alignment. Hardware-backed `sk-ssh-ed25519@openssh.com` must be verified through the same key path. Safe memory and local prevention checks can evolve automatically after replay; signed oracle, policy, trust, security and evaluator rules remain protected. These are design requirements, not changes to the currently frozen oracle. [Verbatim directive](../reasoning/2026-10-23-ai-sdlc-product-first-owner-directive.md) · [decision register](../specs/ai-sdlc-harness/09-decision-register.md)

[Acceptance reconciliation checkpoint](../reasoning/2026-10-24-product-first-acceptance-reconciliation-checkpoint.md) records the current planning state and remaining checks.

The [final-definition directive](../reasoning/2026-10-24-final-product-definition-owner-directive.md)
adds a permanent graph invariant: each atomic requirement has one primary
acceptance criterion and proving test, and every journey/package maps back to
the signed contract. The [contract checkpoint](../reasoning/2026-10-24-final-product-contract-checkpoint.md)
records the first proposed graph. The existing signer remains bound to the
current 6.0.0 oracle; the new programme needs real test files and a reviewed
manifest extension under the **same key** before owner signature.
The [validation checkpoint](../reasoning/2026-10-24-final-product-traceability-validation.md)
records the draft graph audit; it is not an owner signature or runnable test pass.
The [planning handoff](../reasoning/2026-10-24-final-product-planning-handoff.md)
keeps the new-programme approval and executable test preparation separate from
the existing signed release oracle.
The [coverage refinement](../reasoning/2026-10-24-final-product-coverage-refinement.md)
records the earlier 76-row draft and the remaining signature prerequisites.
The [offline-search owner ruling](../reasoning/2026-10-24-offline-semantic-search-owner-decision.md)
is reflected in the current 84-row proposed contract and proving tests. The
owner has settled the behavior but has not signed the new programme oracle.
The [signing-readiness record](../reasoning/2026-10-24-ai-sdlc-signing-ready.md)
records the complete protected set, expected preimplementation-red baseline and
green repository gate. The owner has not yet signed the new programme oracle.

## Current release state

The owner re-signed the `test:e2e` package-script amendment on 2026-10-17,
and the checker verifies all 16 files and 95 cases. Agents prepare checks and
report changes; only the owner signs frozen changes. Gate 2
remains a working design record. See the [QA/prod checkpoint](the-overhaul.md)
for the ordered release steps.

## How work enters

Route through [`rig/corpus/routing.md`](../../rig/corpus/routing.md). For a new
feature, establish intent and acceptance before implementation. For a bug,
reproduce it, trace the shared root cause, and make the corrected behavior
testable. Read existing code and documentation before adding design. Preserve
Gate 1 unless the owner explicitly reopens it; keep Gate 2 aligned with the
implementation.

## Why the gates are separate

The signed oracle prevents an implementation from moving its own goalposts.
The technical design guides the implementation without imposing a second
freeze on details that can be learned from the code. The historical transition
from the former two-freeze model, its owner decisions, and the signature-UX
follow-up remain in their source records.
[AI-SDLC planning correction](../reasoning/2026-10-23-ai-sdlc-signature-scope-audit.md)
records a later draft that confused router order with signature scope; the
technical design is already outside the signed oracle.
A second contract can now be signed under the same key. `approve-gate1.js
--programme ai-sdlc` signs its own manifest and message prefix and writes only
`wiki/gate1/ai-sdlc/`; it refuses a signing key that is not the enrolled one,
refuses an incomplete requirement-to-test graph before producing any signature,
and cannot be replayed against the 6.0.0 message. The
[preparation record](../reasoning/2026-10-24-gate1-preparation-complete.md) and
[signing instructions](../gate1/ai-sdlc/signing-instructions.md) hold the exact
protected set, digests and ceremony.

[One-lock decision](../archive/2026-08/gate-model-and-the-one-lock.md) ·
[signature-UX design](../reasoning/2026-09-04-structural-workflow-fix-design.md) ·
[decision index](../index/decisions.md)

The [readiness remediation](../reasoning/2026-10-24-ai-sdlc-readiness-remediation-start.md) starts independent review and fresh verification; signatures remain intact. Owner amendment is needed for hardware-only signing and name-only release assertions. No deployment readiness is claimed.

The [security checkpoint](../reasoning/2026-10-24-ai-sdlc-readiness-security-checkpoint.md) records eighteen independently found defects, active repairs, and the additional protected replay/publication contradictions.

The [current owner directive](../reasoning/2026-10-24-ai-sdlc-readiness-owner-directive.md) authorises implementation, independent subagents, verification and cleanup before deployment, while preserving acceptance tests.

The [baseline and relocation checkpoint](../reasoning/2026-10-24-ai-sdlc-readiness-baseline-and-relocation.md) records the completed quiet-machine baseline and preserved handoff. The [live tracker](../specs/ai-sdlc-harness/23-deployment-tracker.md) owns current readiness; the [amendment request](../specs/ai-sdlc-harness/22-oracle-amendment-request.md) remains unapplied.

The [integration checkpoint](../reasoning/2026-10-24-ai-sdlc-readiness-integration-checkpoint.md) records complete kit staging, genuine inference/source adaptations, memory preservation and independent rereview. Four protected assertions remain red; no final readiness claim is made.

The [rereview checkpoint](../reasoning/2026-10-24-ai-sdlc-readiness-rereview-checkpoint.md) records the further evidence-lineage repairs and the stale-lease fixture conflict.
