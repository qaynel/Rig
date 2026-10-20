# infrastructure.environment-config.feature-flags — minimal

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade, minimal: List the feature flags in use. Unlisted flags accumulate untested branches, so name each one. Binding checks: feature-flags-source-code-boundary.

Acceptance target: policy:infrastructure.environment-config.feature-flags:minimal:feature-flags-source-code-boundary.
Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array).
