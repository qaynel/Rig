# infrastructure.container.k8s-helm — mid

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Policy grade, mid: Declare a readiness probe. Process existence is not readiness, so define the endpoint or command that proves the service can take traffic. Cumulative with minimal. Binding checks: k8s-helm-source-code-boundary, k8s-helm-container-context.

Acceptance target: policy:infrastructure.container.k8s-helm:mid:k8s-helm-source-code-boundary+k8s-helm-container-context.
Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array); k8s-helm-container-context: `readiness_probe` is nonempty (a string or array).
