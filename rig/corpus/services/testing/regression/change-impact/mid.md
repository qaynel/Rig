# testing.regression.change-impact — mid

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: change-impact-source-code-boundary, change-impact-regression-context.

Start from the existing repository's change impact convention, then name the source path or command that establishes it. For change impact, inspect the repository's actual spec, source, test, or configuration for affected_suites; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the change impact decision for regression.change-impact.

Acceptance target: policy:testing.regression.change-impact:mid:change-impact-source-code-boundary+change-impact-regression-context.

Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array); change-impact-regression-context: `affected_suites` is nonempty (a string or array).
