# testing.maintenance.test-code-sync — identity

Policy grade: test code sync owns maintenance.test-code-sync. Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Keep neighboring maintenance services outside the test code sync decision for maintenance.test-code-sync. Use the configured input at `rig-services/testing.maintenance.test-code-sync.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Choose a repository-owned check that observes test code sync from rig-services/testing.maintenance.test-code-sync.json.

Acceptance target: policy:testing.maintenance.test-code-sync:minimal:test-code-sync-source-code-boundary.

Declared predicates: test-code-sync-source-code-boundary: `changed_behaviors` is nonempty (a string or array).
