# testing.maintenance.readability-dry — minimal

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for readability dry. The minimal boundary for readability dry checks scenario_names (nonempty): scenario names must name the concrete repository contract. Binding checks: readability-dry-source-code-boundary.

Acceptance target: policy:testing.maintenance.readability-dry:minimal:readability-dry-source-code-boundary.

Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array).
