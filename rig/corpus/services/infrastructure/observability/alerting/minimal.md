# infrastructure.observability.alerting — minimal

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade, minimal: List the conditions that alert. An alert with no stated condition is noise, so name each signal and threshold. Binding checks: alerting-source-code-boundary.

Acceptance target: policy:infrastructure.observability.alerting:minimal:alerting-source-code-boundary.
Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array).
