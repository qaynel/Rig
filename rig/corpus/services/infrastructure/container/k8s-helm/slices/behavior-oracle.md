# infrastructure.container.k8s-helm — behavior-oracle slice

Policy grade slice. This slice bounds k8s helm to container.k8s-helm. It uses `k8s-helm-slice-behavior-oracle` and checks resource_limits (nonempty): resource limits must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.container.k8s-helm.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`.

Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource limits — ["cpu","memory"].

mid: readiness probe — "/health".

maximal: latest image tag — false.
