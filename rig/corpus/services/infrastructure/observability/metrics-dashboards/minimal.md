# infrastructure.observability.metrics-dashboards — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for metrics dashboards. The minimal boundary for metrics dashboards checks service_metrics (nonempty): service metrics must name the concrete repository contract.. Binding checks: metrics-dashboards-source-code-boundary.

Read a repository-owned command or existing native check that can observe observability.metrics-dashboards; bind it to the input named in `rig-services/infrastructure.observability.metrics-dashboards.json` and preserve the check's failure status. When adopting this in an existing repository, connect metrics dashboards to the command that inspects service_metrics and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside observability.metrics-dashboards as a failure.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:policy-boundary. Given source-code is present and observability.metrics-dashboards is selected, pass only when the repository binding evaluates observability.metrics-dashboards and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. The ceiling is metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Choose a repository-owned check that observes metrics dashboards from rig-services/infrastructure.observability.metrics-dashboards.json..

Service-specific evidence cues:
Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.
minimal: service metrics — ["latency","errors","saturation"].
mid: dashboard owner — "operations".
maximal: omit error metrics — false.
