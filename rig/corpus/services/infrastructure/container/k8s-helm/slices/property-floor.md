# infrastructure.container.k8s-helm — property-floor slice

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade slice `k8s-helm-slice-property-floor`: Declare CPU and memory limits for the workload. Unbounded pods can starve the node, so set resource limits.
