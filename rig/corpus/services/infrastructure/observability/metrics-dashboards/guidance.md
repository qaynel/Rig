# metrics-dashboards

Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`. Input: `rig-services/infrastructure.observability.metrics-dashboards.json`.

Coverage ceiling: Configuration validation only, so it confirms service metrics, a dashboard owner and the omitted-error-metric flag are declared; it does not read any dashboard.

minimal: service metrics — ["latency","errors","saturation"]. List the user-facing metrics exposed, such as latency, failures and saturation. Throughput alone cannot show failure, so name them.

mid: dashboard owner — "operations". Name the dashboard owner. An unowned dashboard rots, so assign a person or team.

maximal: omit error metrics — false. Set omitting error metrics to false. A dashboard without errors cannot reveal that users are failing, so include failure rate.
