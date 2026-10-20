# testing.maintenance.dead-test-pruning — identity

Policy grade: dead test pruning owns maintenance.dead-test-pruning. Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Keep neighboring maintenance services outside the dead test pruning decision for maintenance.dead-test-pruning. Start from the configured input at `rig-services/testing.maintenance.dead-test-pruning.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Choose a repository-owned check that observes dead test pruning from rig-services/testing.maintenance.dead-test-pruning.json.

Acceptance target: policy:testing.maintenance.dead-test-pruning:minimal:dead-test-pruning-source-code-boundary.

Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array).
