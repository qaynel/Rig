# infrastructure.environment-config.config-drift — mid

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade, mid: Declare how often observed settings are compared. Unscheduled comparison finds drift late, so set a cadence. Cumulative with minimal. Binding checks: config-drift-source-code-boundary, config-drift-environment-config-context.

Acceptance target: policy:infrastructure.environment-config.config-drift:mid:config-drift-source-code-boundary+config-drift-environment-config-context.
Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array); config-drift-environment-config-context: `comparison_schedule` is nonempty (a string or array).
