# development.code-creation.codegen-scaffolding — minimal

Minimal establishes a non-vacuous policy boundary for codegen scaffolding. It checks generator_revision (nonempty): generator revision must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe code-creation.codegen-scaffolding; bind it to the input named in `rig-services/development.code-creation.codegen-scaffolding.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.codegen-scaffolding is a failure.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:policy-boundary. Given source-code is present and code-creation.codegen-scaffolding is selected, pass only when the repository binding evaluates code-creation.codegen-scaffolding and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.
