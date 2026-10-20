# development.code-quality.typecheck — maximal

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: typecheck-source-code-boundary, typecheck-code-quality-context, typecheck-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.code-quality.typecheck:maximal:typecheck-source-code-boundary+typecheck-code-quality-context+typecheck-evidence-receipt.

Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array); typecheck-code-quality-context: `checked_components` is nonempty (a string or array); typecheck-evidence-receipt: `ignore_type_errors` equals false.
