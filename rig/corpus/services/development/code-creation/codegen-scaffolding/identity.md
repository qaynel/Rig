# development.code-creation.codegen-scaffolding — identity

Policy grade: codegen scaffolding owns code-creation.codegen-scaffolding. Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Keep neighboring code-creation services outside the codegen scaffolding decision for code-creation.codegen-scaffolding. Read the configured input at `rig-services/development.code-creation.codegen-scaffolding.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Choose a repository-owned check that observes codegen scaffolding from rig-services/development.code-creation.codegen-scaffolding.json.

Acceptance target: fixture:development.code-creation.codegen-scaffolding:policy-boundary. Given source-code is present and code-creation.codegen-scaffolding is selected, pass only when the repository binding evaluates code-creation.codegen-scaffolding and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.

Service-specific evidence cues:
Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.
minimal: generator revision — "a1b2c3d".
mid: generated paths — ["generated/client.js"].
maximal: overwrite user files — false.
