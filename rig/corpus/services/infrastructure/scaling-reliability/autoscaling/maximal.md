# infrastructure.scaling-reliability.autoscaling — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for autoscaling. The evidence must preserve the scaling_metric, maximum_replicas, scale_to_zero_without_wakeup inputs that determined the result. Binding checks: autoscaling-evidence-receipt.

Tie acceptance to a second run against unchanged autoscaling inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:evidence-replay. Given the scaling-reliability.autoscaling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Owned scope: `scaling-reliability.autoscaling`.

Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.

Input: `rig-services/infrastructure.scaling-reliability.autoscaling.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Select an approved repository-owned command to verify that behavior.

minimal: scaling metric — "queue depth".

mid: maximum replicas — 10.

maximal: scale to zero without wakeup — false.
