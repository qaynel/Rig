# infrastructure.environment-config.config-drift — minimal

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for config drift. The minimal boundary for config drift checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract. Binding checks: config-drift-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe environment-config.config-drift; bind it to the input named in `rig-services/infrastructure.environment-config.config-drift.json` and preserve the check's failure status. When adopting this in an existing repository, connect config drift to the command that inspects authoritative_sources and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.config-drift as a failure.

Acceptance target: policy:infrastructure.environment-config.config-drift:minimal:config-drift-source-code-boundary.

Declared predicates: config-drift-source-code-boundary: `authoritative_sources` is nonempty (a string or array).
