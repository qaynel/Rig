# infrastructure.observability.metrics-dashboards — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for metrics dashboards. It checks service_metrics (nonempty): service metrics must name the concrete repository contract.. Binding checks: metrics-dashboards-source-code-boundary.

Read a repository-owned command or existing native check that can observe observability.metrics-dashboards; bind it to the input named in `rig-services/infrastructure.observability.metrics-dashboards.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside observability.metrics-dashboards is a failure.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`.

Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

minimal: service metrics — ["latency","errors","saturation"].

mid: dashboard owner — "operations".

maximal: omit error metrics — false.
