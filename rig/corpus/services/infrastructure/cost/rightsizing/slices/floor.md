# infrastructure.cost.rightsizing — floor and mutation-floor slice

Policy grade slice. This slice bounds rightsizing to cost.rightsizing. It uses `rightsizing-slice-floor` and checks candidate_resources (nonempty): candidate resources must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cost.rightsizing.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`.

Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate resources — ["worker pool"].

mid: minimum headroom percent — 20.

maximal: resize without workload evidence — false.
