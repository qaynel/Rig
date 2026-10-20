# infrastructure.environment-config.config-drift — minimal

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade, minimal: Name the configuration authority each setting is compared to. Without one, drift has no reference, so list the source of truth. Binding checks: config-drift-source-code-boundary.

Acceptance target: policy:infrastructure.environment-config.config-drift:minimal:config-drift-source-code-boundary.
Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array).
