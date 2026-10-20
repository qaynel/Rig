# testing.regression.change-impact — maximal

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: change-impact-source-code-boundary, change-impact-regression-context, change-impact-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.regression.change-impact:maximal:change-impact-source-code-boundary+change-impact-regression-context+change-impact-evidence-receipt.

Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array); change-impact-regression-context: `affected_suites` is nonempty (a string or array); change-impact-evidence-receipt: `select_by_filename_only` equals false.
