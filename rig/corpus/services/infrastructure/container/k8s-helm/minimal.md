# infrastructure.container.k8s-helm — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for k8s helm. It checks resource_limits (nonempty): resource limits must name the concrete repository contract.. Binding checks: k8s-helm-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe container.k8s-helm; bind it to the input named in `rig-services/infrastructure.container.k8s-helm.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside container.k8s-helm is a failure.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`.

Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource limits — ["cpu","memory"].

mid: readiness probe — "/health".

maximal: latest image tag — false.
