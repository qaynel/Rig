# infrastructure.observability.metrics-dashboards — maximal

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Policy grade, maximal: Set omitting error metrics to false. A dashboard without errors cannot reveal that users are failing, so include failure rate. Cumulative with minimal and mid. Binding checks: metrics-dashboards-source-code-boundary, metrics-dashboards-observability-context, metrics-dashboards-evidence-receipt.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:maximal:metrics-dashboards-source-code-boundary+metrics-dashboards-observability-context+metrics-dashboards-evidence-receipt.
Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array); metrics-dashboards-observability-context: `dashboard_owner` is nonempty (a string or array); metrics-dashboards-evidence-receipt: `omit_error_metrics` equals false.
