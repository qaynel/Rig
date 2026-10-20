# infrastructure.observability.alerting — identity

Policy grade: alerting owns observability.alerting. Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Input: `rig-services/infrastructure.observability.alerting.json`. Configuration validation only, so it confirms alert conditions, a runbook path and the ownerless-alert flag are declared; it does not show alerts fire or reach anyone.

Disposition: executable.
Acceptance target: policy:infrastructure.observability.alerting:minimal:alerting-source-code-boundary.
Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array).
