# snapshot golden

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Owned scope: `regression.snapshot-golden`.

Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Input: `rig-services/testing.regression.snapshot-golden.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

minimal: golden paths — ["fixtures/order.json"].

mid: reviewed diffs — ["field addition"].

maximal: automatic snapshot acceptance — false.

