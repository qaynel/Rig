# testing.strategy.pyramid-balance — mid

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: pyramid-balance-source-code-boundary, pyramid-balance-strategy-context.

Read the existing repository's pyramid balance convention, then name the source path or command that establishes it. For pyramid balance, inspect the repository's actual spec, source, test, or configuration for integration_suites; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring strategy services outside the pyramid balance decision for strategy.pyramid-balance.

Acceptance target: policy:testing.strategy.pyramid-balance:mid:pyramid-balance-source-code-boundary+pyramid-balance-strategy-context.

Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array); pyramid-balance-strategy-context: `integration_suites` is nonempty (a string or array).
