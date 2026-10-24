# testing.strategy.pyramid-balance — minimal

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade, minimal: List the fast local unit suites. Without them diagnosis is slow, so name each suite. Binding checks: pyramid-balance-source-code-boundary.

Acceptance target: policy:testing.strategy.pyramid-balance:minimal:pyramid-balance-source-code-boundary.
Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array).
