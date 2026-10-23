# infrastructure.observability.alerting — maximal

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Policy grade, maximal: Set alert without owner to false. An unowned alert is ignored, so assign an on-call owner. Cumulative with minimal and mid. Binding checks: alerting-source-code-boundary, alerting-observability-context, alerting-evidence-receipt.

Acceptance target: policy:infrastructure.observability.alerting:maximal:alerting-source-code-boundary+alerting-observability-context+alerting-evidence-receipt.
Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array); alerting-observability-context: `runbook_path` is nonempty (a string or array); alerting-evidence-receipt: `alert_without_owner` equals false.
