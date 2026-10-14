# infrastructure.observability.metrics-dashboards — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for metrics dashboards. The evidence must preserve the service_metrics, dashboard_owner, omit_error_metrics inputs that determined the result. Binding checks: metrics-dashboards-evidence-receipt.

Use a second run against unchanged metrics dashboards inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:evidence-replay. Given the observability.metrics-dashboards binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Owned scope: `observability.metrics-dashboards`.

Offer: Expose user-facing latency, failure and saturation metrics with a responsible dashboard owner. A throughput-only dashboard cannot reveal whether the service is failing its users.

Input: `rig-services/infrastructure.observability.metrics-dashboards.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

minimal: service metrics — ["latency","errors","saturation"].

mid: dashboard owner — "operations".

maximal: omit error metrics — false.
