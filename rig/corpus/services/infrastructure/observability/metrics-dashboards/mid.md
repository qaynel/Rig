# infrastructure.observability.metrics-dashboards — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for metrics dashboards; it does not widen ownership beyond observability.metrics-dashboards. For metrics dashboards, inspect these context signals: dashboard_owner. Binding checks: metrics-dashboards-observability-context.

Ground the decision in the existing repository's metrics dashboards convention, then name the source path or command that establishes it. For metrics dashboards, inspect the repository's actual spec, source, test, or configuration for dashboard_owner; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the metrics dashboards decision for observability.metrics-dashboards.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:repository-context. Given observability.metrics-dashboards has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.
minimal: service metrics — ["latency","errors","saturation"].
mid: dashboard owner — "operations".
maximal: omit error metrics — false.
