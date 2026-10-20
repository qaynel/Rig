# testing.maintenance.test-code-sync — maximal

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: test-code-sync-source-code-boundary, test-code-sync-maintenance-context, test-code-sync-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.maintenance.test-code-sync:maximal:test-code-sync-source-code-boundary+test-code-sync-maintenance-context+test-code-sync-evidence-receipt.

Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array); test-code-sync-maintenance-context: `updated_cases` is nonempty (a string or array); test-code-sync-evidence-receipt: `tests_follow_output_blindly` equals false.
