# testing.maintenance.dead-test-pruning — identity

Policy grade: dead-test-pruning owns maintenance.dead-test-pruning. Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Input: `rig-services/testing.maintenance.dead-test-pruning.json`. Configuration validation only, so it confirms obsolete cases, replacement evidence and the delete-live-regression flag are declared; it does not run the suite.

Disposition: executable.
Acceptance target: policy:testing.maintenance.dead-test-pruning:minimal:dead-test-pruning-source-code-boundary.
Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array).
