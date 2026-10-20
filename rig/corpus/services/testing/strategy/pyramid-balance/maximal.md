# testing.strategy.pyramid-balance — maximal

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: pyramid-balance-source-code-boundary, pyramid-balance-strategy-context, pyramid-balance-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.strategy.pyramid-balance:maximal:pyramid-balance-source-code-boundary+pyramid-balance-strategy-context+pyramid-balance-evidence-receipt.

Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array); pyramid-balance-strategy-context: `integration_suites` is nonempty (a string or array); pyramid-balance-evidence-receipt: `e2e_only_strategy` equals false.
