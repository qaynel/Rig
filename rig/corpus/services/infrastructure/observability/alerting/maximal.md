# infrastructure.observability.alerting — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for alerting. The evidence must preserve the alert_conditions, runbook_path, alert_without_owner inputs that determined the result. Binding checks: alerting-evidence-receipt.

Use a second run against unchanged alerting inputs. Record the alert_conditions, runbook_path, alert_without_owner inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this alerting result is stale. The ceiling remains: alerting configuration validation only; declared policy does not prove running alerting behavior. Choose a repository-owned check that observes alerting from rig-services/infrastructure.observability.alerting.json.

Acceptance target: fixture:infrastructure.observability.alerting:evidence-replay. Given the observability.alerting binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.
minimal: alert conditions — ["error budget burn"].
mid: runbook path — "docs/runbook.md".
maximal: alert without owner — false.
