# infrastructure.container.k8s-helm — minimal

Minimal establishes a non-vacuous policy boundary for k8s helm. It checks resource_limits (nonempty): resource limits must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe container.k8s-helm; bind it to the input named in `rig-services/infrastructure.container.k8s-helm.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside container.k8s-helm is a failure.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern. A passing policy check does not establish runtime behavior.
