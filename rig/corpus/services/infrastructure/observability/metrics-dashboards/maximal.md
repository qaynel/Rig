# infrastructure.observability.metrics-dashboards — maximal

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: metrics-dashboards-source-code-boundary, metrics-dashboards-observability-context, metrics-dashboards-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.observability.metrics-dashboards:maximal:metrics-dashboards-source-code-boundary+metrics-dashboards-observability-context+metrics-dashboards-evidence-receipt.

Declared predicates: metrics-dashboards-source-code-boundary: `service_metrics` is nonempty (a string or array); metrics-dashboards-observability-context: `dashboard_owner` is nonempty (a string or array); metrics-dashboards-evidence-receipt: `omit_error_metrics` equals false.
