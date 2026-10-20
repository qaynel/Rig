# infrastructure.container.k8s-helm — behavior-oracle slice

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade slice. This slice bounds k8s helm to container.k8s-helm. It uses `k8s-helm-slice-behavior-oracle` and checks resource_limits (nonempty): resource limits must name the concrete repository contract.