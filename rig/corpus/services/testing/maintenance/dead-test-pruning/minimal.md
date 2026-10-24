# testing.maintenance.dead-test-pruning — minimal

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Policy grade, minimal: List the tests judged obsolete. Without names nothing is reviewable, so identify each case. Binding checks: dead-test-pruning-source-code-boundary.

Acceptance target: policy:testing.maintenance.dead-test-pruning:minimal:dead-test-pruning-source-code-boundary.
Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array).
