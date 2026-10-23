# testing.maintenance.readability-dry — maximal

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Policy grade, maximal: Set hiding assertions in helpers to false. An assertion buried in a helper makes failures hard to interpret, so keep it in the test. Cumulative with minimal and mid. Binding checks: readability-dry-source-code-boundary, readability-dry-maintenance-context, readability-dry-evidence-receipt.

Acceptance target: policy:testing.maintenance.readability-dry:maximal:readability-dry-source-code-boundary+readability-dry-maintenance-context+readability-dry-evidence-receipt.
Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array); readability-dry-maintenance-context: `shared_helpers` is nonempty (a string or array); readability-dry-evidence-receipt: `hide_assertions_in_helpers` equals false.
