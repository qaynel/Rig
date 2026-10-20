# infrastructure.environment-config.config-drift — identity

Policy grade: config drift owns environment-config.config-drift. Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Keep neighboring environment-config services outside the config drift decision for environment-config.config-drift. Start from the configured input at `rig-services/infrastructure.environment-config.config-drift.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: config drift configuration validation only; declared policy does not prove running config drift behavior. Choose a repository-owned check that observes config drift from rig-services/infrastructure.environment-config.config-drift.json.

Acceptance target: policy:infrastructure.environment-config.config-drift:minimal:config-drift-source-code-boundary.

Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array).
