# infrastructure.cost.anomaly-detection — maximal

Maximal adds a replayable evidence receipt for anomaly detection. The evidence must preserve the cost_baseline, deviation_threshold_percent, ignore_missing_billing_data inputs that determined the result.

Use a second run against unchanged anomaly detection inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: anomaly detection configuration validation only; declared policy does not prove running anomaly detection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:evidence-replay. Given the cost.anomaly-detection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
