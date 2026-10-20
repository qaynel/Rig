# testing.maintenance.dead-test-pruning — minimal

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dead test pruning. The minimal boundary for dead test pruning checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract. Binding checks: dead-test-pruning-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe maintenance.dead-test-pruning; bind it to the input named in `rig-services/testing.maintenance.dead-test-pruning.json` and preserve the check's failure status. When adopting this in an existing repository, connect dead test pruning to the command that inspects obsolete_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside maintenance.dead-test-pruning as a failure.

Acceptance target: policy:testing.maintenance.dead-test-pruning:minimal:dead-test-pruning-source-code-boundary.

Declared predicates: dead-test-pruning-source-code-boundary: `obsolete_cases` is nonempty (a string or array).
