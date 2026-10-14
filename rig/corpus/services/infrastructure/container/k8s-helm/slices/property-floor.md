# infrastructure.container.k8s-helm — property-floor slice

Policy grade slice. This slice bounds k8s helm to container.k8s-helm. It uses `k8s-helm-slice-property-floor` and checks resource_limits (nonempty): resource limits must name the concrete repository contract..

For k8s helm, choose a repository example that satisfies resource_limits at the property-floor floor, plus a failure where resource limits must name the concrete repository contract. is false. For k8s helm, wire `property-floor` to `rig-services/infrastructure.container.k8s-helm.json` and keep its verdict on resource_limits; missing evidence is a named gap, with ceiling k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Choose a repository-owned check that observes k8s helm from rig-services/infrastructure.container.k8s-helm.json..

Service-specific evidence cues:
Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.
minimal: resource limits — ["cpu","memory"].
mid: readiness probe — "/health".
maximal: latest image tag — false.
