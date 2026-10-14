# infrastructure.cost.anomaly-detection — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for anomaly detection. The evidence must preserve the cost_baseline, deviation_threshold_percent, ignore_missing_billing_data inputs that determined the result. Binding checks: anomaly-detection-evidence-receipt.

Use a second run against unchanged anomaly detection inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:evidence-replay. Given the cost.anomaly-detection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Owned scope: `cost.anomaly-detection`.

Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Input: `rig-services/infrastructure.cost.anomaly-detection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

minimal: cost baseline — "weekly service spend".

mid: deviation threshold percent — 25.

maximal: ignore missing billing data — false.
