# testing.strategy.pyramid-balance — identity

Policy grade: pyramid balance owns strategy.pyramid-balance. Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Keep neighboring strategy services outside the pyramid balance decision for strategy.pyramid-balance. Anchor the review on the configured input at `rig-services/testing.strategy.pyramid-balance.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Choose a repository-owned check that observes pyramid balance from rig-services/testing.strategy.pyramid-balance.json.

Acceptance target: policy:testing.strategy.pyramid-balance:minimal:pyramid-balance-source-code-boundary.

Declared predicates: pyramid-balance-source-code-boundary: `unit_suites` is nonempty (a string or array).
