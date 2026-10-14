# infrastructure.observability.metrics-dashboards — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for metrics dashboards; it does not widen ownership beyond observability.metrics-dashboards. The context signals are dashboard_owner. Binding checks: metrics-dashboards-observability-context.

Ground the decision in the existing repository's metrics dashboards convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in observability under their own verdicts.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:repository-context. Given observability.metrics-dashboards has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`.

Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

minimal: service metrics — ["latency","errors","saturation"].

mid: dashboard owner — "operations".

maximal: omit error metrics — false.
