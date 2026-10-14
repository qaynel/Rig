# infrastructure.environment-config.config-drift — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for config drift; it does not widen ownership beyond environment-config.config-drift. The context signals are comparison_schedule. Binding checks: config-drift-environment-config-context.

Inspect the existing repository's config drift convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.config-drift:repository-context. Given environment-config.config-drift has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Owned scope: `environment-config.config-drift`.

Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Input: `rig-services/infrastructure.environment-config.config-drift.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior.

minimal: authoritative sources — ["config/production.json"].

mid: comparison schedule — "daily".

maximal: silent drift acceptance — false.
