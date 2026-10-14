# development.code-creation.codegen-scaffolding — behavior-oracle slice

This slice bounds codegen scaffolding to code-creation.codegen-scaffolding. It uses `codegen-scaffolding-slice-behavior-oracle` and checks generator_revision (nonempty): generator revision must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.codegen-scaffolding.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.
