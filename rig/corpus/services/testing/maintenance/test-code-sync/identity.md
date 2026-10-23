# testing.maintenance.test-code-sync — identity

Policy grade: test-code-sync owns maintenance.test-code-sync. Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Configuration validation only, so it confirms changed behaviors, updated cases and the follow-output flag are declared; it does not compare tests with code.

Disposition: executable.
Acceptance target: policy:testing.maintenance.test-code-sync:minimal:test-code-sync-source-code-boundary.
Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array).
