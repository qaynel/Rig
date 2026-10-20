# infrastructure.observability.metrics-dashboards — mid

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: metrics-dashboards-source-code-boundary, metrics-dashboards-observability-context.

Ground the decision in the existing repository's metrics dashboards convention, then name the source path or command that establishes it. For metrics dashboards, inspect the repository's actual spec, source, test, or configuration for dashboard_owner; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the metrics dashboards decision for observability.metrics-dashboards.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:mid:metrics-dashboards-source-code-boundary+metrics-dashboards-observability-context.

Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array); metrics-dashboards-observability-context: `dashboard_owner` is nonempty (a string or array).
