# testing.maintenance.readability-dry — minimal

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Policy grade, minimal: Name scenarios by the behavior they establish. Names like test1 explain nothing on failure, so describe the behavior. Binding checks: readability-dry-source-code-boundary.

Acceptance target: policy:testing.maintenance.readability-dry:minimal:readability-dry-source-code-boundary.
Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array).
