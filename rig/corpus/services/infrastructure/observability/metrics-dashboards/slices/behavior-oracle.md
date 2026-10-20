# infrastructure.observability.metrics-dashboards — behavior-oracle slice

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Policy grade slice `metrics-dashboards-slice-behavior-oracle`: List the user-facing metrics exposed, such as latency, failures and saturation. Throughput alone cannot show failure, so name them. Despite its name this slice is not a behavior oracle: it confirms service metrics, a dashboard owner and the omitted-error-metric flag are declared; it does not read any dashboard.
