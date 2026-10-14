# infrastructure.environment-config.config-drift — behavior-oracle slice

Policy grade slice. This slice bounds config drift to environment-config.config-drift. It uses `config-drift-slice-behavior-oracle` and checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.config-drift.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Owned scope: `environment-config.config-drift`.

Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Input: `rig-services/infrastructure.environment-config.config-drift.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior.

minimal: authoritative sources — ["config/production.json"].

mid: comparison schedule — "daily".

maximal: silent drift acceptance — false.
