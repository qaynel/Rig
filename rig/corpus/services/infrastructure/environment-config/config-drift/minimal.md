# infrastructure.environment-config.config-drift — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for config drift. It checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract.. Binding checks: config-drift-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe environment-config.config-drift; bind it to the input named in `rig-services/infrastructure.environment-config.config-drift.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside environment-config.config-drift is a failure.

Acceptance target: fixture:infrastructure.environment-config.config-drift:policy-boundary. Given source-code is present and environment-config.config-drift is selected, pass only when the repository binding evaluates environment-config.config-drift and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Owned scope: `environment-config.config-drift`.

Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Input: `rig-services/infrastructure.environment-config.config-drift.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior.

minimal: authoritative sources — ["config/production.json"].

mid: comparison schedule — "daily".

maximal: silent drift acceptance — false.
