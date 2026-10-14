# testing.regression.change-impact — property-floor slice

Policy grade slice. This slice bounds change impact to regression.change-impact. It uses `change-impact-slice-property-floor` and checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.change-impact.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Owned scope: `regression.change-impact`.

Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Input: `rig-services/testing.regression.change-impact.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed interfaces — ["order serializer"].

mid: affected suites — ["order contract"].

maximal: select by filename only — false.
