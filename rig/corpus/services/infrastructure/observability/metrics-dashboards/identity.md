# infrastructure.observability.metrics-dashboards — identity

Policy grade: metrics-dashboards owns observability.metrics-dashboards. Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Configuration validation only, so it confirms service metrics, a dashboard owner and the omitted-error-metric flag are declared; it does not read any dashboard.

Disposition: executable.
Acceptance target: policy:infrastructure.observability.metrics-dashboards:minimal:metrics-dashboards-source-code-boundary.
Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array).
