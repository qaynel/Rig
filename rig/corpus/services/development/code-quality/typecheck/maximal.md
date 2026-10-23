# development.code-quality.typecheck — maximal

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade, maximal: Set ignoring type errors to false. Suppressing errors manufactures a clean result, so fix the errors or record them as findings. Cumulative with minimal and mid. Binding checks: typecheck-source-code-boundary, typecheck-code-quality-context, typecheck-evidence-receipt.

Acceptance target: policy:development.code-quality.typecheck:maximal:typecheck-source-code-boundary+typecheck-code-quality-context+typecheck-evidence-receipt.
Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array); typecheck-code-quality-context: `checked_components` is nonempty (a string or array); typecheck-evidence-receipt: `ignore_type_errors` equals false.
