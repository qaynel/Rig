# testing.maintenance.readability-dry — mid

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: readability-dry-source-code-boundary, readability-dry-maintenance-context.

Acceptance target: policy:testing.maintenance.readability-dry:mid:readability-dry-source-code-boundary+readability-dry-maintenance-context.

Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array); readability-dry-maintenance-context: `shared_helpers` is nonempty (a string or array).
