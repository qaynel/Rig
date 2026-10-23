# testing.regression.change-impact — minimal

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade, minimal: List the interfaces that changed. Impact starts from the change, so name each one. Binding checks: change-impact-source-code-boundary.

Acceptance target: policy:testing.regression.change-impact:minimal:change-impact-source-code-boundary.
Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array).
