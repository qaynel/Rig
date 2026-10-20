# testing.maintenance.dead-test-pruning — mid

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: dead-test-pruning-source-code-boundary, dead-test-pruning-maintenance-context.

Inspect the existing repository's dead test pruning convention, then name the source path or command that establishes it. For dead test pruning, inspect the repository's actual spec, source, test, or configuration for replacement_evidence; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring maintenance services outside the dead test pruning decision for maintenance.dead-test-pruning.

Acceptance target: policy:testing.maintenance.dead-test-pruning:mid:dead-test-pruning-source-code-boundary+dead-test-pruning-maintenance-context.

Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array); dead-test-pruning-maintenance-context: `replacement_evidence` is nonempty (a string or array).
