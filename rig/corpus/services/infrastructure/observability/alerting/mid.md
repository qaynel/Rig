# infrastructure.observability.alerting — mid

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade, mid: Point each alert to a runbook. An alert without a response path is a page nobody can act on, so give the path. Cumulative with minimal. Binding checks: alerting-source-code-boundary, alerting-observability-context.

Acceptance target: policy:infrastructure.observability.alerting:mid:alerting-source-code-boundary+alerting-observability-context.
Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array); alerting-observability-context: `runbook_path` is nonempty (a string or array).
