# infrastructure.environment-config.config-drift — maximal

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade, maximal: Set accepting drift silently to false. Drift must become a visible finding rather than redefine the desired state, so report it. Cumulative with minimal and mid. Binding checks: config-drift-source-code-boundary, config-drift-environment-config-context, config-drift-evidence-receipt.

Acceptance target: policy:infrastructure.environment-config.config-drift:maximal:config-drift-source-code-boundary+config-drift-environment-config-context+config-drift-evidence-receipt.
Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array); config-drift-environment-config-context: `comparison_schedule` is nonempty (a string or array); config-drift-evidence-receipt: `silent_drift_acceptance` equals false.
