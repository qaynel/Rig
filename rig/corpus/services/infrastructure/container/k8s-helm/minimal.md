# infrastructure.container.k8s-helm — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for k8s helm. The minimal boundary for k8s helm checks resource_limits (nonempty): resource limits must name the concrete repository contract.. Binding checks: k8s-helm-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe container.k8s-helm; bind it to the input named in `rig-services/infrastructure.container.k8s-helm.json` and preserve the check's failure status. When adopting this in an existing repository, connect k8s helm to the command that inspects resource_limits and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside container.k8s-helm as a failure.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. The ceiling is k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Choose a repository-owned check that observes k8s helm from rig-services/infrastructure.container.k8s-helm.json..

Service-specific evidence cues:
Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.
minimal: resource limits — ["cpu","memory"].
mid: readiness probe — "/health".
maximal: latest image tag — false.
