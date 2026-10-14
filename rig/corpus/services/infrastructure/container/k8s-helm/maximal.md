# infrastructure.container.k8s-helm — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for k8s helm. The evidence must preserve the resource_limits, readiness_probe, latest_image_tag inputs that determined the result. Binding checks: k8s-helm-evidence-receipt.

Tie acceptance to a second run against unchanged k8s helm inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.k8s-helm:evidence-replay. Given the container.k8s-helm binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`.

Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource limits — ["cpu","memory"].

mid: readiness probe — "/health".

maximal: latest image tag — false.
