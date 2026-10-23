# Gate 1 and Gate 2

Gate 1 owns the acceptance oracle: criteria and the tests that check them are
frozen together under the owner's signature. Preserve those artifacts unless
the owner explicitly routes a correction back through grilling. Gate 2 is the
working technical design; it is checked for presence and remains editable as
implementation teaches us more. The code must satisfy the frozen oracle.
[Gate 1](../gate1/business-spec.md) · [Gate 2](../gate2/technical-spec.md) ·
[Rig router](../../rig/corpus/routing.md)

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
[One-lock decision](../archive/2026-08/gate-model-and-the-one-lock.md) ·
[signature-UX design](../reasoning/2026-09-04-structural-workflow-fix-design.md) ·
[decision index](../index/decisions.md)
