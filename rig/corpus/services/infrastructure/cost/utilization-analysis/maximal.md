# infrastructure.cost.utilization-analysis — maximal

Maximal adds a replayable evidence receipt for utilization analysis. The evidence must preserve the observed_resources, observation_window_days, decide_from_single_peak inputs that determined the result.

Trace the verdict to a second run against unchanged utilization analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:evidence-replay. Given the cost.utilization-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
