# infrastructure.container.k8s-helm — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for k8s helm. The evidence must preserve the resource_limits, readiness_probe, latest_image_tag inputs that determined the result. Binding checks: k8s-helm-evidence-receipt.

Tie acceptance to a second run against unchanged k8s helm inputs. Record the resource_limits, readiness_probe, latest_image_tag inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this k8s helm result is stale. The ceiling remains: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Choose a repository-owned check that observes k8s helm from rig-services/infrastructure.container.k8s-helm.json.

Acceptance target: fixture:infrastructure.container.k8s-helm:evidence-replay. Given the container.k8s-helm binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.
minimal: resource limits — ["cpu","memory"].
mid: readiness probe — "/health".
maximal: latest image tag — false.
