# infrastructure.environment-config.config-drift — maximal

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: config-drift-source-code-boundary, config-drift-environment-config-context, config-drift-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.environment-config.config-drift:maximal:config-drift-source-code-boundary+config-drift-environment-config-context+config-drift-evidence-receipt.

Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array); config-drift-environment-config-context: `comparison_schedule` is nonempty (a string or array); config-drift-evidence-receipt: `silent_drift_acceptance` equals false.
