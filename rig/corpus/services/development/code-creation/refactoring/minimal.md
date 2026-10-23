# development.code-creation.refactoring — minimal

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Policy grade, minimal: List the behaviors the refactor must preserve. Without them nothing distinguishes restructuring from a behavior change, so name the observable contract. Binding checks: refactoring-source-code-boundary.

Acceptance target: policy:development.code-creation.refactoring:minimal:refactoring-source-code-boundary.
Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array).
