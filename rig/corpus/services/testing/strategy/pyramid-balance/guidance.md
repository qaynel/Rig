# pyramid balance

Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Owned scope: `strategy.pyramid-balance`.

Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.

Input: `rig-services/testing.strategy.pyramid-balance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Select an approved repository-owned command to verify that behavior.

minimal: unit suites — ["parser"].

mid: integration suites — ["api database"].

maximal: e2e only strategy — false.
