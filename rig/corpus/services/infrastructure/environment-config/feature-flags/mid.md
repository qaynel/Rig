# infrastructure.environment-config.feature-flags — mid

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: feature-flags-source-code-boundary, feature-flags-environment-config-context.

Inspect the existing repository's feature flags convention, then name the source path or command that establishes it. For feature flags, inspect the repository's actual spec, source, test, or configuration for rollback_owner; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the feature flags decision for environment-config.feature-flags.

Acceptance target: policy:infrastructure.environment-config.feature-flags:mid:feature-flags-source-code-boundary+feature-flags-environment-config-context.

Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array); feature-flags-environment-config-context: `rollback_owner` is nonempty (a string or array).
