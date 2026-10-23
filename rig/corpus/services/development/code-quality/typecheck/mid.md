# development.code-quality.typecheck — mid

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade, mid: List the components the type checker covers. A silently excluded package hides type errors, so enumerate every covered component. Cumulative with minimal. Binding checks: typecheck-source-code-boundary, typecheck-code-quality-context.

Acceptance target: policy:development.code-quality.typecheck:mid:typecheck-source-code-boundary+typecheck-code-quality-context.
Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array); typecheck-code-quality-context: `checked_components` is nonempty (a string or array).
