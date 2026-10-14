# k8s helm

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`.

Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource limits — ["cpu","memory"].

mid: readiness probe — "/health".

maximal: latest image tag — false.

