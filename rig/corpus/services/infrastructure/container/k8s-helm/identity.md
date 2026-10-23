# infrastructure.container.k8s-helm — identity

Policy grade: k8s-helm owns container.k8s-helm. Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Configuration validation only, so it confirms resource limits, a readiness probe and the latest-tag flag are declared; it does not show the workload schedules or becomes ready.

Disposition: executable.
Acceptance target: policy:infrastructure.container.k8s-helm:minimal:k8s-helm-source-code-boundary.
Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array).
