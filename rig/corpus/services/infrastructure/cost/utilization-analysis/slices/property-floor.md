# infrastructure.cost.utilization-analysis — property-floor slice

Policy grade slice. This slice bounds utilization analysis to cost.utilization-analysis. It uses `utilization-analysis-slice-property-floor` and checks observed_resources (nonempty): observed resources must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cost.utilization-analysis.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Owned scope: `cost.utilization-analysis`.

Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Input: `rig-services/infrastructure.cost.utilization-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed resources — ["cpu","memory"].

mid: observation window days — 7.

maximal: decide from single peak — false.
