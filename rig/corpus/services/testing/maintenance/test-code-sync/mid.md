# testing.maintenance.test-code-sync — mid

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade, mid: List the test cases updated for those behaviors. A changed behavior with no updated case leaves stale tests, so map each. Cumulative with minimal. Binding checks: test-code-sync-source-code-boundary, test-code-sync-maintenance-context.

Acceptance target: policy:testing.maintenance.test-code-sync:mid:test-code-sync-source-code-boundary+test-code-sync-maintenance-context.
Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array); test-code-sync-maintenance-context: `updated_cases` is nonempty (a string or array).
