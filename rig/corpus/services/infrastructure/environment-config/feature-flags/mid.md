# infrastructure.environment-config.feature-flags — mid

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade, mid: Name who can roll each flag back. A flag without an owner cannot be turned off in an incident, so assign one. Cumulative with minimal. Binding checks: feature-flags-source-code-boundary, feature-flags-environment-config-context.

Acceptance target: policy:infrastructure.environment-config.feature-flags:mid:feature-flags-source-code-boundary+feature-flags-environment-config-context.
Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array); feature-flags-environment-config-context: `rollback_owner` is nonempty (a string or array).
