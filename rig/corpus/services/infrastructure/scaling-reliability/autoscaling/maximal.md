# infrastructure.scaling-reliability.autoscaling — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for autoscaling. The evidence must preserve the scaling_metric, maximum_replicas, scale_to_zero_without_wakeup inputs that determined the result. Binding checks: autoscaling-evidence-receipt.

Tie acceptance to a second run against unchanged autoscaling inputs. Record the scaling_metric, maximum_replicas, scale_to_zero_without_wakeup inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this autoscaling result is stale. The ceiling remains: autoscaling configuration validation only; declared policy does not prove running autoscaling behavior. Choose a repository-owned check that observes autoscaling from rig-services/infrastructure.scaling-reliability.autoscaling.json.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:evidence-replay. Given the scaling-reliability.autoscaling binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Choose a scaling signal and bound the replica count. Scaling to zero requires a working wakeup route; declaring a metric alone does not establish live scaling behavior.
minimal: scaling metric — "queue depth".
mid: maximum replicas — 10.
maximal: scale to zero without wakeup — false.
