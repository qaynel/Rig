# internal contract

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Owned scope: `integration.internal-contract`.

Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Input: `rig-services/testing.integration.internal-contract.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

minimal: producer schema — "schemas/order.json".

mid: consumer versions — ["v1","v2"].

maximal: allow breaking change — false.

