# infrastructure.environment-config.config-drift — identity

Policy grade: config-drift owns environment-config.config-drift. Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Input: `rig-services/infrastructure.environment-config.config-drift.json`. Configuration validation only, so it confirms authoritative sources, a comparison schedule and the silent-drift flag are declared; it does not compare live settings.

Disposition: executable.
Acceptance target: policy:infrastructure.environment-config.config-drift:minimal:config-drift-source-code-boundary.
Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array).
