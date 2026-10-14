# infrastructure.environment-config.config-drift — identity

Policy grade: config drift owns environment-config.config-drift. Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Keep neighboring environment-config services outside the config drift decision for environment-config.config-drift. Start from the configured input at `rig-services/infrastructure.environment-config.config-drift.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: config drift configuration validation only; declared policy does not prove running config drift behavior. Choose a repository-owned check that observes config drift from rig-services/infrastructure.environment-config.config-drift.json.

Acceptance target: fixture:infrastructure.environment-config.config-drift:policy-boundary. Given source-code is present and environment-config.config-drift is selected, pass only when the repository binding evaluates environment-config.config-drift and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.

Service-specific evidence cues:
Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.
minimal: authoritative sources — ["config/production.json"].
mid: comparison schedule — "daily".
maximal: silent drift acceptance — false.
