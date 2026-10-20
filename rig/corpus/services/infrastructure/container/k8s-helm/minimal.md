# infrastructure.container.k8s-helm — minimal

Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for k8s helm. The minimal boundary for k8s helm checks resource_limits (nonempty): resource limits must name the concrete repository contract. Binding checks: k8s-helm-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe container.k8s-helm; bind it to the input named in `rig-services/infrastructure.container.k8s-helm.json` and preserve the check's failure status. When adopting this in an existing repository, connect k8s helm to the command that inspects resource_limits and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.k8s-helm as a failure.

Acceptance target: policy:infrastructure.container.k8s-helm:minimal:k8s-helm-source-code-boundary.

Declared predicates: k8s-helm-source-code-boundary: `resource_limits` is nonempty (a string or array).
