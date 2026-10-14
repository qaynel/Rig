# anomaly detection

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Owned scope: `cost.anomaly-detection`.

Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Input: `rig-services/infrastructure.cost.anomaly-detection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

minimal: cost baseline — "weekly service spend".

mid: deviation threshold percent — 25.

maximal: ignore missing billing data — false.

