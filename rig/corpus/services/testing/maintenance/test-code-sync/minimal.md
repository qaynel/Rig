# testing.maintenance.test-code-sync — minimal

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Policy grade, minimal: List the behaviors that changed. Tests cannot follow a change nobody named, so state each one. Binding checks: test-code-sync-source-code-boundary.

Acceptance target: policy:testing.maintenance.test-code-sync:minimal:test-code-sync-source-code-boundary.
Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array).
