# infrastructure.observability.alerting — mid

Every actionable alert needs an owned response and a runbook. Signals without an operator or response path create noise rather than protection.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: alerting-source-code-boundary, alerting-observability-context.

Ground the decision in the existing repository's alerting convention, then name the source path or command that establishes it. For alerting, inspect the repository's actual spec, source, test, or configuration for runbook_path; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring observability services outside the alerting decision for observability.alerting.

Acceptance target: policy:infrastructure.observability.alerting:mid:alerting-source-code-boundary+alerting-observability-context.

Declared predicates: alerting-source-code-boundary: `alert_conditions` is nonempty (a string or array); alerting-observability-context: `runbook_path` is nonempty (a string or array).
