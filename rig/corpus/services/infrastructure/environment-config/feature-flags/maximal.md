# infrastructure.environment-config.feature-flags — maximal

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: feature-flags-source-code-boundary, feature-flags-environment-config-context, feature-flags-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.environment-config.feature-flags:maximal:feature-flags-source-code-boundary+feature-flags-environment-config-context+feature-flags-evidence-receipt.

Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array); feature-flags-environment-config-context: `rollback_owner` is nonempty (a string or array); feature-flags-evidence-receipt: `permanent_unowned_flags` equals false.
