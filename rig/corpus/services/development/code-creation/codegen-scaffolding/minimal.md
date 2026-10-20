# development.code-creation.codegen-scaffolding — minimal

Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for codegen scaffolding. The minimal boundary for codegen scaffolding checks generator_revision (nonempty): generator revision must name the concrete repository contract. Binding checks: codegen-scaffolding-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-creation.codegen-scaffolding; bind it to the input named in `rig-services/development.code-creation.codegen-scaffolding.json` and preserve the check's failure status. When adopting this in an existing repository, connect codegen scaffolding to the command that inspects generator_revision and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.codegen-scaffolding as a failure.

Acceptance target: policy:development.code-creation.codegen-scaffolding:minimal:codegen-scaffolding-source-code-boundary.

Declared predicates: codegen-scaffolding-source-code-boundary: `generator_revision` is nonempty (a string or array).
