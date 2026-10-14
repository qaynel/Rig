# infrastructure.observability.metrics-dashboards — identity

metrics dashboards owns observability.metrics-dashboards. Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Keep sibling services in observability under their own verdicts. Inspect the configured input at `rig-services/infrastructure.observability.metrics-dashboards.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.
