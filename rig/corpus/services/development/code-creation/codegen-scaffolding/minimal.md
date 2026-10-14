# development.code-creation.codegen-scaffolding — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for codegen scaffolding. The minimal boundary for codegen scaffolding checks generator_revision (nonempty): generator revision must name the concrete repository contract.. Binding checks: codegen-scaffolding-source-code-boundary.

Use a repository-owned command or existing native check that can observe code-creation.codegen-scaffolding; bind it to the input named in `rig-services/development.code-creation.codegen-scaffolding.json` and preserve the check's failure status. When adopting this in an existing repository, connect codegen scaffolding to the command that inspects generator_revision and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.codegen-scaffolding as a failure.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:policy-boundary. Given source-code is present and code-creation.codegen-scaffolding is selected, pass only when the repository binding evaluates code-creation.codegen-scaffolding and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. The ceiling is codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Choose a repository-owned check that observes codegen scaffolding from rig-services/development.code-creation.codegen-scaffolding.json..

Service-specific evidence cues:
Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.
minimal: generator revision — "a1b2c3d".
mid: generated paths — ["generated/client.js"].
maximal: overwrite user files — false.
