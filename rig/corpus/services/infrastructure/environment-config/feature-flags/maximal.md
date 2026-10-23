# infrastructure.environment-config.feature-flags — maximal

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade, maximal: Set permanent unowned flags to false. Flags that outlive their purpose are dead branches, so remove them or assign an owner. Cumulative with minimal and mid. Binding checks: feature-flags-source-code-boundary, feature-flags-environment-config-context, feature-flags-evidence-receipt.

Acceptance target: policy:infrastructure.environment-config.feature-flags:maximal:feature-flags-source-code-boundary+feature-flags-environment-config-context+feature-flags-evidence-receipt.
Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array); feature-flags-environment-config-context: `rollback_owner` is nonempty (a string or array); feature-flags-evidence-receipt: `permanent_unowned_flags` equals false.
