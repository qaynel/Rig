# infrastructure.scaling-reliability.autoscaling — maximal

Maximal adds a replayable evidence receipt for autoscaling. The evidence must preserve the scaling_metric, maximum_replicas, scale_to_zero_without_wakeup inputs that determined the result.

Tie acceptance to a second run against unchanged autoscaling inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:evidence-replay. Given the scaling-reliability.autoscaling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
