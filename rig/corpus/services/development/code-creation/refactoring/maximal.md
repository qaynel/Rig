# development.code-creation.refactoring — maximal

A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: refactoring-source-code-boundary, refactoring-code-creation-context, refactoring-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.code-creation.refactoring:maximal:refactoring-source-code-boundary+refactoring-code-creation-context+refactoring-evidence-receipt.

Declared predicates: refactoring-source-code-boundary: `preserved_behaviors` is nonempty (a string or array); refactoring-code-creation-context: `public_api_changes` equals 0; refactoring-evidence-receipt: `rollback_strategy` is nonempty (a string or array).
