# development.code-creation.codegen-scaffolding — identity

Policy grade: codegen-scaffolding owns code-creation.codegen-scaffolding. Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Input: `rig-services/development.code-creation.codegen-scaffolding.json`. Configuration validation only, so it confirms the generator revision, generated paths and the no-overwrite setting are declared; it does not show that generation preserved hand-written files.

Disposition: executable.
Acceptance target: policy:development.code-creation.codegen-scaffolding:minimal:codegen-scaffolding-source-code-boundary.
Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array).
