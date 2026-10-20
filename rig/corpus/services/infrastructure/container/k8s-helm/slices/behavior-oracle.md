# infrastructure.container.k8s-helm — behavior-oracle slice

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade slice `k8s-helm-slice-behavior-oracle`: Declare CPU and memory limits for the workload. Unbounded pods can starve the node, so set resource limits. Despite its name this slice is not a behavior oracle: it confirms resource limits, a readiness probe and the latest-tag flag are declared; it does not show the workload schedules or becomes ready.
