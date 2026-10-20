# infrastructure.container.k8s-helm — identity

Policy grade: k8s helm owns container.k8s-helm. Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Keep neighboring container services outside the k8s helm decision for container.k8s-helm. Start from the configured input at `rig-services/infrastructure.container.k8s-helm.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Choose a repository-owned check that observes k8s helm from rig-services/infrastructure.container.k8s-helm.json.

Acceptance target: policy:infrastructure.container.k8s-helm:minimal:k8s-helm-source-code-boundary.

Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array).
