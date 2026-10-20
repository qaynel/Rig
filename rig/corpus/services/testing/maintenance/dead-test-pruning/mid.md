# testing.maintenance.dead-test-pruning — mid

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Policy grade, mid: Record the evidence that equivalent protection remains. Age alone does not make a regression dead, so cite the replacement. Cumulative with minimal. Binding checks: dead-test-pruning-source-code-boundary, dead-test-pruning-maintenance-context.

Acceptance target: policy:testing.maintenance.dead-test-pruning:mid:dead-test-pruning-source-code-boundary+dead-test-pruning-maintenance-context.
Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array); dead-test-pruning-maintenance-context: `replacement_evidence` is nonempty (a string or array).
