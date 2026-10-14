# infrastructure.observability.alerting — maximal

Maximal adds a replayable evidence receipt for alerting. The evidence must preserve the alert_conditions, runbook_path, alert_without_owner inputs that determined the result.

Use a second run against unchanged alerting inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.alerting:evidence-replay. Given the observability.alerting binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
