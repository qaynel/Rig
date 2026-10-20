# infrastructure.observability.metrics-dashboards — minimal

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Policy grade, minimal: List the user-facing metrics exposed, such as latency, failures and saturation. Throughput alone cannot show failure, so name them. Binding checks: metrics-dashboards-source-code-boundary.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:minimal:metrics-dashboards-source-code-boundary.
Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array).
