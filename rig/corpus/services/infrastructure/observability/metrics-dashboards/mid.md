# infrastructure.observability.metrics-dashboards — mid

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Policy grade, mid: Name the dashboard owner. An unowned dashboard rots, so assign a person or team. Cumulative with minimal. Binding checks: metrics-dashboards-source-code-boundary, metrics-dashboards-observability-context.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:mid:metrics-dashboards-source-code-boundary+metrics-dashboards-observability-context.
Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array); metrics-dashboards-observability-context: `dashboard_owner` is nonempty (a string or array).
