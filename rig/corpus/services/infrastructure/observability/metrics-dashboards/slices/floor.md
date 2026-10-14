# infrastructure.observability.metrics-dashboards — floor and mutation-floor slice

Policy grade slice. This slice bounds metrics dashboards to observability.metrics-dashboards. It uses `metrics-dashboards-slice-floor` and checks service_metrics (nonempty): service metrics must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.observability.metrics-dashboards.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`.

Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

minimal: service metrics — ["latency","errors","saturation"].

mid: dashboard owner — "operations".

maximal: omit error metrics — false.
