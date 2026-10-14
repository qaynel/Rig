# testing.strategy.pyramid-balance — identity

Policy grade: pyramid balance owns strategy.pyramid-balance. Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Keep sibling services in strategy under their own verdicts. Anchor the review on the configured input at `rig-services/testing.strategy.pyramid-balance.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.pyramid-balance:policy-boundary. Given source-code is present and strategy.pyramid-balance is selected, pass only when the repository binding evaluates strategy.pyramid-balance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern.

Service-specific evidence cues:
Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Owned scope: `strategy.pyramid-balance`.

Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Input: `rig-services/testing.strategy.pyramid-balance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Select an approved repository-owned command to verify that behavior.

minimal: unit suites — ["parser"].

mid: integration suites — ["api database"].

maximal: e2e only strategy — false.
