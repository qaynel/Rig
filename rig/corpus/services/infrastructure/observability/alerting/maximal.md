# infrastructure.observability.alerting — maximal

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: alerting-source-code-boundary, alerting-observability-context, alerting-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.observability.alerting:maximal:alerting-source-code-boundary+alerting-observability-context+alerting-evidence-receipt.

Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array); alerting-observability-context: `runbook_path` is nonempty (a string or array); alerting-evidence-receipt: `alert_without_owner` equals false.
