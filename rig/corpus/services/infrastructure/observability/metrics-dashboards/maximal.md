# infrastructure.observability.metrics-dashboards — maximal

Maximal adds a replayable evidence receipt for metrics dashboards. The evidence must preserve the service_metrics, dashboard_owner, omit_error_metrics inputs that determined the result.

Use a second run against unchanged metrics dashboards inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: metrics dashboards configuration validation only; declared policy does not prove running metrics dashboards behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:evidence-replay. Given the observability.metrics-dashboards binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
