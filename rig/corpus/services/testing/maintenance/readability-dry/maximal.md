# testing.maintenance.readability-dry — maximal

Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: readability-dry-source-code-boundary, readability-dry-maintenance-context, readability-dry-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.maintenance.readability-dry:maximal:readability-dry-source-code-boundary+readability-dry-maintenance-context+readability-dry-evidence-receipt.

Declared predicates: readability-dry-source-code-boundary: `scenario_names` is nonempty (a string or array); readability-dry-maintenance-context: `shared_helpers` is nonempty (a string or array); readability-dry-evidence-receipt: `hide_assertions_in_helpers` equals false.
