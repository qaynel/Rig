# infrastructure.environment-config.config-drift — mid

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: config-drift-source-code-boundary, config-drift-environment-config-context.

Inspect the existing repository's config drift convention, then name the source path or command that establishes it. For config drift, inspect the repository's actual spec, source, test, or configuration for comparison_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the config drift decision for environment-config.config-drift.

Acceptance target: policy:infrastructure.environment-config.config-drift:mid:config-drift-source-code-boundary+config-drift-environment-config-context.

Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array); config-drift-environment-config-context: `comparison_schedule` is nonempty (a string or array).
