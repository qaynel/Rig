# infrastructure.container.k8s-helm — maximal

Maximal adds a replayable evidence receipt for k8s helm. The evidence must preserve the resource_limits, readiness_probe, latest_image_tag inputs that determined the result.

Tie acceptance to a second run against unchanged k8s helm inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.k8s-helm:evidence-replay. Given the container.k8s-helm binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
