# development.code-creation.codegen-scaffolding — identity

codegen scaffolding owns code-creation.codegen-scaffolding. Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Keep sibling services in code-creation under their own verdicts. Read the configured input at `rig-services/development.code-creation.codegen-scaffolding.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:policy-boundary. Given source-code is present and code-creation.codegen-scaffolding is selected, pass only when the repository binding evaluates code-creation.codegen-scaffolding and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.
