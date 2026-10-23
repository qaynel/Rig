# testing.maintenance.readability-dry — identity

Policy grade: readability-dry owns maintenance.readability-dry. Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Configuration validation only, so it confirms scenario names, shared helpers and the hidden-assertion flag are declared; it does not read the tests.

Disposition: executable.
Acceptance target: policy:testing.maintenance.readability-dry:minimal:readability-dry-source-code-boundary.
Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array).
