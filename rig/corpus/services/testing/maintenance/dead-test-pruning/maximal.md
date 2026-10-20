# testing.maintenance.dead-test-pruning — maximal

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: dead-test-pruning-source-code-boundary, dead-test-pruning-maintenance-context, dead-test-pruning-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.maintenance.dead-test-pruning:maximal:dead-test-pruning-source-code-boundary+dead-test-pruning-maintenance-context+dead-test-pruning-evidence-receipt.

Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array); dead-test-pruning-maintenance-context: `replacement_evidence` is nonempty (a string or array); dead-test-pruning-evidence-receipt: `delete_live_regressions` equals false.
