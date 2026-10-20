# development.code-creation.refactoring — mid

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: refactoring-source-code-boundary, refactoring-code-creation-context.

Acceptance target: policy:development.code-creation.refactoring:mid:refactoring-source-code-boundary+refactoring-code-creation-context.

Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array); refactoring-code-creation-context: `public_api_changes` equals 0.
