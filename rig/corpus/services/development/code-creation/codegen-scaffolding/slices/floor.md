# development.code-creation.codegen-scaffolding — floor and mutation-floor slice

Policy grade slice. This slice bounds codegen scaffolding to code-creation.codegen-scaffolding. It uses `codegen-scaffolding-slice-floor` and checks generator_revision (nonempty): generator revision must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-creation.codegen-scaffolding.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Owned scope: `code-creation.codegen-scaffolding`.

Offer: Pin the generator revision and identify exactly which paths are generated. Generated output must never overwrite hand-written files without a separate decision.

Input: `rig-services/development.code-creation.codegen-scaffolding.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: codegen scaffolding configuration validation only; declared policy does not prove running codegen scaffolding behavior. Select an approved repository-owned command to verify that behavior.

minimal: generator revision — "a1b2c3d".

mid: generated paths — ["generated/client.js"].

maximal: overwrite user files — false.
