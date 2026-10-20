# development.code-creation.codegen-scaffolding — mid

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade, mid: List the exact paths the generator owns. Without them hand-written code can be mistaken for generated code, so declare the generated directories or files. Cumulative with minimal. Binding checks: codegen-scaffolding-source-code-boundary, codegen-scaffolding-code-creation-context.

Acceptance target: policy:development.code-creation.codegen-scaffolding:mid:codegen-scaffolding-source-code-boundary+codegen-scaffolding-code-creation-context.
Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array); codegen-scaffolding-code-creation-context: `generated_paths` is nonempty (a string or array).
