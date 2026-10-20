# infrastructure.observability.alerting — identity

Policy grade: alerting owns observability.alerting. Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Keep neighboring observability services outside the alerting decision for observability.alerting. Inspect the configured input at `rig-services/infrastructure.observability.alerting.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: alerting configuration validation only; declared policy does not prove running alerting behavior. Choose a repository-owned check that observes alerting from rig-services/infrastructure.observability.alerting.json.

Acceptance target: policy:infrastructure.observability.alerting:minimal:alerting-source-code-boundary.

Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array).
