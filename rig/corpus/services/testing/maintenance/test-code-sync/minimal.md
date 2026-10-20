# testing.maintenance.test-code-sync — minimal

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test code sync. The minimal boundary for test code sync checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract. Binding checks: test-code-sync-source-code-boundary.

Acceptance target: policy:testing.maintenance.test-code-sync:minimal:test-code-sync-source-code-boundary.

Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array).
