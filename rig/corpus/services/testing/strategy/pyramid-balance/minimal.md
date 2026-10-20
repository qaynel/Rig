# testing.strategy.pyramid-balance — minimal

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for pyramid balance. The minimal boundary for pyramid balance checks unit_suites (nonempty): unit suites must name the concrete repository contract. Binding checks: pyramid-balance-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe strategy.pyramid-balance; bind it to the input named in `rig-services/testing.strategy.pyramid-balance.json` and preserve the check's failure status. When adopting this in an existing repository, connect pyramid balance to the command that inspects unit_suites and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside strategy.pyramid-balance as a failure.

Acceptance target: policy:testing.strategy.pyramid-balance:minimal:pyramid-balance-source-code-boundary.

Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array).
