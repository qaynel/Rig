# testing.maintenance.dead-test-pruning — maximal

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Policy grade, maximal: Set deleting live regressions to false. Removing a test that still guards behavior reopens a defect, so keep it. Cumulative with minimal and mid. Binding checks: dead-test-pruning-source-code-boundary, dead-test-pruning-maintenance-context, dead-test-pruning-evidence-receipt.

Acceptance target: policy:testing.maintenance.dead-test-pruning:maximal:dead-test-pruning-source-code-boundary+dead-test-pruning-maintenance-context+dead-test-pruning-evidence-receipt.
Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array); dead-test-pruning-maintenance-context: `replacement_evidence` is nonempty (a string or array); dead-test-pruning-evidence-receipt: `delete_live_regressions` equals false.
