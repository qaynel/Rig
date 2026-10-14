# infrastructure.environment-config.config-drift — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for config drift. The minimal boundary for config drift checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract.. Binding checks: config-drift-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe environment-config.config-drift; bind it to the input named in `rig-services/infrastructure.environment-config.config-drift.json` and preserve the check's failure status. When adopting this in an existing repository, connect config drift to the command that inspects authoritative_sources and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.config-drift as a failure.

Acceptance target: fixture:infrastructure.environment-config.config-drift:policy-boundary. Given source-code is present and environment-config.config-drift is selected, pass only when the repository binding evaluates environment-config.config-drift and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. The ceiling is config drift configuration validation only; declared policy does not prove running config drift behavior. Choose a repository-owned check that observes config drift from rig-services/infrastructure.environment-config.config-drift.json..

Service-specific evidence cues:
Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.
minimal: authoritative sources — ["config/production.json"].
mid: comparison schedule — "daily".
maximal: silent drift acceptance — false.
