# development.code-creation.codegen-scaffolding — minimal

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Policy grade, minimal: Pin the generator revision. An unpinned generator changes output between runs, so record the exact version or commit. Binding checks: codegen-scaffolding-source-code-boundary.

Acceptance target: policy:development.code-creation.codegen-scaffolding:minimal:codegen-scaffolding-source-code-boundary.
Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array).
