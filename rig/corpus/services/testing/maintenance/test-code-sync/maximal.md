# testing.maintenance.test-code-sync — maximal

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade, maximal: Set tests following output blindly to false. Copying new output into old assertions makes circular evidence, so decide the intended behavior first. Cumulative with minimal and mid. Binding checks: test-code-sync-source-code-boundary, test-code-sync-maintenance-context, test-code-sync-evidence-receipt.

Acceptance target: policy:testing.maintenance.test-code-sync:maximal:test-code-sync-source-code-boundary+test-code-sync-maintenance-context+test-code-sync-evidence-receipt.
Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array); test-code-sync-maintenance-context: `updated_cases` is nonempty (a string or array); test-code-sync-evidence-receipt: `tests_follow_output_blindly` equals false.
