# infrastructure.observability.metrics-dashboards — identity

Policy grade: metrics dashboards owns observability.metrics-dashboards. Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Keep sibling services in observability under their own verdicts. Inspect the configured input at `rig-services/infrastructure.observability.metrics-dashboards.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.

Service-specific evidence cues:
Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`.

Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

minimal: service metrics — ["latency","errors","saturation"].

mid: dashboard owner — "operations".

maximal: omit error metrics — false.
