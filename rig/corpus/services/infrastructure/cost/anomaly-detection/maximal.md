# infrastructure.cost.anomaly-detection — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for anomaly detection. The evidence must preserve the cost_baseline, deviation_threshold_percent, ignore_missing_billing_data inputs that determined the result. Binding checks: anomaly-detection-evidence-receipt.

Use a second run against unchanged anomaly detection inputs. Record the cost_baseline, deviation_threshold_percent, ignore_missing_billing_data inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this anomaly detection result is stale. The ceiling remains: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Choose a repository-owned check that observes anomaly detection from rig-services/infrastructure.cost.anomaly-detection.json.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:evidence-replay. Given the cost.anomaly-detection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.
minimal: cost baseline — "weekly service spend".
mid: deviation threshold percent — 25.
maximal: ignore missing billing data — false.
