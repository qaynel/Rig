# development.code-quality.typecheck — mid

Bind the type checker to the repository task and enumerate covered components. Do not make a clean result by suppressing type errors or silently excluding a package.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: typecheck-source-code-boundary, typecheck-code-quality-context.

Start from the existing repository's typecheck convention, then name the source path or command that establishes it. For typecheck, inspect the repository's actual spec, source, test, or configuration for checked_components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-quality services outside the typecheck decision for code-quality.typecheck.

Acceptance target: policy:development.code-quality.typecheck:mid:typecheck-source-code-boundary+typecheck-code-quality-context.

Declared predicates: typecheck-source-code-boundary: `typecheck_command` is nonempty (a string or array); typecheck-code-quality-context: `checked_components` is nonempty (a string or array).
