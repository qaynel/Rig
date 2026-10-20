# testing.regression.change-impact — maximal

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade, maximal: Set selecting by filename only to false. Filename similarity misses downstream effects, so select by the dependency trace. Cumulative with minimal and mid. Binding checks: change-impact-source-code-boundary, change-impact-regression-context, change-impact-evidence-receipt.

Acceptance target: policy:testing.regression.change-impact:maximal:change-impact-source-code-boundary+change-impact-regression-context+change-impact-evidence-receipt.
Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array); change-impact-regression-context: `affected_suites` is nonempty (a string or array); change-impact-evidence-receipt: `select_by_filename_only` equals false.
