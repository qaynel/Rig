# infrastructure.observability.alerting — identity

alerting owns observability.alerting. Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Keep sibling services in observability under their own verdicts. Inspect the configured input at `rig-services/infrastructure.observability.alerting.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: alerting configuration validation only; declared policy does not prove running alerting behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.observability.alerting:policy-boundary. Given source-code is present and observability.alerting is selected, pass only when the repository binding evaluates observability.alerting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.
