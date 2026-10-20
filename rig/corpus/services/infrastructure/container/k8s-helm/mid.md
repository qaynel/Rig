# infrastructure.container.k8s-helm — mid

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: k8s-helm-source-code-boundary, k8s-helm-container-context.

Inspect the existing repository's k8s helm convention, then name the source path or command that establishes it. For k8s helm, inspect the repository's actual spec, source, test, or configuration for readiness_probe; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring container services outside the k8s helm decision for container.k8s-helm.

Acceptance target: policy:infrastructure.container.k8s-helm:mid:k8s-helm-source-code-boundary+k8s-helm-container-context.

Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array); k8s-helm-container-context: `readiness_probe` is nonempty (a string or array).
