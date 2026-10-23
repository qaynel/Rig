# development.code-quality.typecheck — minimal

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Policy grade, minimal: Bind the type checker to the repository's typecheck command. A missing command means types are unchecked, so name the real task. Binding checks: typecheck-source-code-boundary.

Acceptance target: policy:development.code-quality.typecheck:minimal:typecheck-source-code-boundary.
Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array).
