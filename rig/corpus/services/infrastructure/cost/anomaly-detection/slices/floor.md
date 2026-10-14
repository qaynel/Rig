# infrastructure.cost.anomaly-detection — floor and mutation-floor slice

Policy grade slice. This slice bounds anomaly detection to cost.anomaly-detection. It uses `anomaly-detection-slice-floor` and checks cost_baseline (nonempty): cost baseline must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cost.anomaly-detection.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Owned scope: `cost.anomaly-detection`.

Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Input: `rig-services/infrastructure.cost.anomaly-detection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

minimal: cost baseline — "weekly service spend".

mid: deviation threshold percent — 25.

maximal: ignore missing billing data — false.
