# infrastructure.container.k8s-helm — identity

Policy grade: k8s helm owns container.k8s-helm. Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Keep neighboring container services outside the k8s helm decision for container.k8s-helm. Start from the configured input at `rig-services/infrastructure.container.k8s-helm.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Choose a repository-owned check that observes k8s helm from rig-services/infrastructure.container.k8s-helm.json.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.

Service-specific evidence cues:
Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.
minimal: resource limits — ["cpu","memory"].
mid: readiness probe — "/health".
maximal: latest image tag — false.
