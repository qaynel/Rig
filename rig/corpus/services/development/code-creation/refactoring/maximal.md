# development.code-creation.refactoring — maximal

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade, maximal: Record how to revert the restructuring. If the refactor misbehaves there is no way back otherwise, so name the commit, branch or command. Cumulative with minimal and mid. Binding checks: refactoring-source-code-boundary, refactoring-code-creation-context, refactoring-evidence-receipt.

Acceptance target: policy:development.code-creation.refactoring:maximal:refactoring-source-code-boundary+refactoring-code-creation-context+refactoring-evidence-receipt.
Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array); refactoring-code-creation-context: `public_api_changes` equals 0; refactoring-evidence-receipt: `rollback_strategy` is nonempty (a string or array).
