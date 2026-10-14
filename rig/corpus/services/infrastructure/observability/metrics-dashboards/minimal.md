# infrastructure.observability.metrics-dashboards — minimal

Minimal establishes a non-vacuous policy boundary for metrics dashboards. It checks service_metrics (nonempty): service metrics must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe observability.metrics-dashboards; bind it to the input named in `rig-services/infrastructure.observability.metrics-dashboards.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside observability.metrics-dashboards is a failure.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. A passing policy check does not establish runtime behavior.
