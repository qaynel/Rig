# development.code-creation.codegen-scaffolding — identity

Policy grade: codegen scaffolding owns code-creation.codegen-scaffolding. Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Keep neighboring code-creation services outside the codegen scaffolding decision for code-creation.codegen-scaffolding. Read the configured input at `rig-services/development.code-creation.codegen-scaffolding.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Choose a repository-owned check that observes codegen scaffolding from rig-services/development.code-creation.codegen-scaffolding.json.

Acceptance target: policy:development.code-creation.codegen-scaffolding:minimal:codegen-scaffolding-source-code-boundary.

Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array).
