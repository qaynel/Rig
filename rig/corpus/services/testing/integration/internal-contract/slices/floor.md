# testing.integration.internal-contract — floor and mutation-floor slice

Policy grade slice. This slice bounds internal contract to integration.internal-contract. It uses `internal-contract-slice-floor` and checks producer_schema (nonempty): producer schema must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.integration.internal-contract.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Owned scope: `integration.internal-contract`.

Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Input: `rig-services/testing.integration.internal-contract.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Select an approved repository-owned command to verify that behavior.

minimal: producer schema — "schemas/order.json".

mid: consumer versions — ["v1","v2"].

maximal: allow breaking change — false.
