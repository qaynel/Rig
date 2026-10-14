# infrastructure.observability.metrics-dashboards — identity

Policy grade: metrics dashboards owns observability.metrics-dashboards. Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Keep neighboring observability services outside the metrics dashboards decision for observability.metrics-dashboards. Inspect the configured input at `rig-services/infrastructure.observability.metrics-dashboards.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Choose a repository-owned check that observes metrics dashboards from rig-services/infrastructure.observability.metrics-dashboards.json.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.

Service-specific evidence cues:
Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.
minimal: service metrics — ["latency","errors","saturation"].
mid: dashboard owner — "operations".
maximal: omit error metrics — false.
