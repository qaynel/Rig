# infrastructure.observability.alerting — behavior-oracle slice

Policy grade slice. This slice bounds alerting to observability.alerting. It uses `alerting-slice-behavior-oracle` and checks alert_conditions (nonempty): alert conditions must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.observability.alerting.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Owned scope: `observability.alerting`.

Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Input: `rig-services/infrastructure.observability.alerting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

minimal: alert conditions — ["error budget burn"].

mid: runbook path — "docs/runbook.md".

maximal: alert without owner — false.
