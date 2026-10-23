# testing.regression.change-impact — mid

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade, mid: List the suites affected by tracing callers and contracts. An incomplete list skips downstream behavior, so map each interface to suites. Cumulative with minimal. Binding checks: change-impact-source-code-boundary, change-impact-regression-context.

Acceptance target: policy:testing.regression.change-impact:mid:change-impact-source-code-boundary+change-impact-regression-context.
Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array); change-impact-regression-context: `affected_suites` is nonempty (a string or array).
