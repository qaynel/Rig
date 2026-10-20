# infrastructure.observability.metrics-dashboards — minimal

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for metrics dashboards. The minimal boundary for metrics dashboards checks service_metrics (nonempty): service metrics must name the concrete repository contract. Binding checks: metrics-dashboards-source-code-boundary.

Read a repository-owned command or existing native check that can observe observability.metrics-dashboards; bind it to the input named in `rig-services/infrastructure.observability.metrics-dashboards.json` and preserve the check's failure status. When adopting this in an existing repository, connect metrics dashboards to the command that inspects service_metrics and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside observability.metrics-dashboards as a failure.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:minimal:metrics-dashboards-source-code-boundary.

Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array).
