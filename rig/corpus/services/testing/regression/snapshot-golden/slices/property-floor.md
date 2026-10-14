# testing.regression.snapshot-golden — property-floor slice

Policy grade slice. This slice bounds snapshot golden to regression.snapshot-golden. It uses `snapshot-golden-slice-property-floor` and checks golden_paths (nonempty): golden paths must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.snapshot-golden.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Owned scope: `regression.snapshot-golden`.

Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Input: `rig-services/testing.regression.snapshot-golden.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

minimal: golden paths — ["fixtures/order.json"].

mid: reviewed diffs — ["field addition"].

maximal: automatic snapshot acceptance — false.
