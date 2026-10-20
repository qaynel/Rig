# infrastructure.observability.metrics-dashboards — identity

Policy grade: metrics dashboards owns observability.metrics-dashboards. Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Keep neighboring observability services outside the metrics dashboards decision for observability.metrics-dashboards. Inspect the configured input at `rig-services/infrastructure.observability.metrics-dashboards.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Choose a repository-owned check that observes metrics dashboards from rig-services/infrastructure.observability.metrics-dashboards.json.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:minimal:metrics-dashboards-source-code-boundary.

Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array).
