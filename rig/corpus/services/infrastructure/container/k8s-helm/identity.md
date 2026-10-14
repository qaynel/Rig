# infrastructure.container.k8s-helm — identity

Policy grade: k8s helm owns container.k8s-helm. Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Keep sibling services in container under their own verdicts. Start from the configured input at `rig-services/infrastructure.container.k8s-helm.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.

Service-specific evidence cues:
Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Owned scope: `container.k8s-helm`.

Offer: Declare Kubernetes resource bounds and readiness independently of process existence. Pin deployed images rather than selecting mutable latest tags.

Input: `rig-services/infrastructure.container.k8s-helm.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: k8s helm configuration validation only; declared policy does not prove running k8s helm behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource limits — ["cpu","memory"].

mid: readiness probe — "/health".

maximal: latest image tag — false.
