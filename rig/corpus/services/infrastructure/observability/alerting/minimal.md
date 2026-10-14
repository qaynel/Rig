# infrastructure.observability.alerting — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for alerting. It checks alert_conditions (nonempty): alert conditions must name the concrete repository contract.. Binding checks: alerting-source-code-boundary.

Read a repository-owned command or existing native check that can observe observability.alerting; bind it to the input named in `rig-services/infrastructure.observability.alerting.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside observability.alerting is a failure.

Acceptance target: fixture:infrastructure.observability.alerting:policy-boundary. Given source-code is present and observability.alerting is selected, pass only when the repository binding evaluates observability.alerting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Owned scope: `observability.alerting`.

Offer: Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Input: `rig-services/infrastructure.observability.alerting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

minimal: alert conditions — ["error budget burn"].

mid: runbook path — "docs/runbook.md".

maximal: alert without owner — false.
