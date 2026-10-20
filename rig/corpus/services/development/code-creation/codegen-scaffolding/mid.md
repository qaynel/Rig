# development.code-creation.codegen-scaffolding — mid

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: codegen-scaffolding-source-code-boundary, codegen-scaffolding-code-creation-context.

Start from the existing repository's codegen scaffolding convention, then name the source path or command that establishes it. For codegen scaffolding, inspect the repository's actual spec, source, test, or configuration for generated_paths; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the codegen scaffolding decision for code-creation.codegen-scaffolding.

Acceptance target: policy:development.code-creation.codegen-scaffolding:mid:codegen-scaffolding-source-code-boundary+codegen-scaffolding-code-creation-context.

Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array); codegen-scaffolding-code-creation-context: `generated_paths` is nonempty (a string or array).
