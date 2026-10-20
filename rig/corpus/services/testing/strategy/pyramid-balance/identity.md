# testing.strategy.pyramid-balance — identity

Policy grade: pyramid-balance owns strategy.pyramid-balance. Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Input: `rig-services/testing.strategy.pyramid-balance.json`. Configuration validation only, so it confirms unit suites, integration suites and the e2e-only flag are declared; it does not count tests.

Disposition: executable.
Acceptance target: policy:testing.strategy.pyramid-balance:minimal:pyramid-balance-source-code-boundary.
Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array).
