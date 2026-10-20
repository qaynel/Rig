# infrastructure.container.k8s-helm — minimal

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade, minimal: Declare CPU and memory limits for the workload. Unbounded pods can starve the node, so set resource limits. Binding checks: k8s-helm-source-code-boundary.

Acceptance target: policy:infrastructure.container.k8s-helm:minimal:k8s-helm-source-code-boundary.
Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array).
