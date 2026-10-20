# testing.maintenance.readability-dry — identity

Policy grade: readability dry owns maintenance.readability-dry. Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Keep neighboring maintenance services outside the readability dry decision for maintenance.readability-dry. Use the configured input at `rig-services/testing.maintenance.readability-dry.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Choose a repository-owned check that observes readability dry from rig-services/testing.maintenance.readability-dry.json.

Acceptance target: policy:testing.maintenance.readability-dry:minimal:readability-dry-source-code-boundary.

Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array).
