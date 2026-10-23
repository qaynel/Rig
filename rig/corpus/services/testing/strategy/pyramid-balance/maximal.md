# testing.strategy.pyramid-balance — maximal

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Policy grade, maximal: Set e2e-only strategy to false. Relying only on end-to-end tests makes failures slow to diagnose, so keep lower layers. Cumulative with minimal and mid. Binding checks: pyramid-balance-source-code-boundary, pyramid-balance-strategy-context, pyramid-balance-evidence-receipt.

Acceptance target: policy:testing.strategy.pyramid-balance:maximal:pyramid-balance-source-code-boundary+pyramid-balance-strategy-context+pyramid-balance-evidence-receipt.
Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array); pyramid-balance-strategy-context: `integration_suites` is nonempty (a string or array); pyramid-balance-evidence-receipt: `e2e_only_strategy` equals false.
