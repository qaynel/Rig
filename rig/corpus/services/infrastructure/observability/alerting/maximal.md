# infrastructure.observability.alerting — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for alerting. The evidence must preserve the alert_conditions, runbook_path, alert_without_owner inputs that determined the result. Binding checks: alerting-evidence-receipt.

Use a second run against unchanged alerting inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.alerting:evidence-replay. Given the observability.alerting binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Owned scope: `observability.alerting`.

Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Input: `rig-services/infrastructure.observability.alerting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

minimal: alert conditions — ["error budget burn"].

mid: runbook path — "docs/runbook.md".

maximal: alert without owner — false.
