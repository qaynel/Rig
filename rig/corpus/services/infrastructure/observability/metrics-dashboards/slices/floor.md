# infrastructure.observability.metrics-dashboards — floor and mutation-floor slice

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Policy grade slice. This slice bounds metrics dashboards to observability.metrics-dashboards. It uses `metrics-dashboards-slice-floor` and checks service_metrics (nonempty): service metrics must name the concrete repository contract.