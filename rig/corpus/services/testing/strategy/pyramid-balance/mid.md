# testing.strategy.pyramid-balance — mid

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade, mid: List the focused integration suites above them. A pyramid needs a middle, so name the integration layer. Cumulative with minimal. Binding checks: pyramid-balance-source-code-boundary, pyramid-balance-strategy-context.

Acceptance target: policy:testing.strategy.pyramid-balance:mid:pyramid-balance-source-code-boundary+pyramid-balance-strategy-context.
Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array); pyramid-balance-strategy-context: `integration_suites` is nonempty (a string or array).
