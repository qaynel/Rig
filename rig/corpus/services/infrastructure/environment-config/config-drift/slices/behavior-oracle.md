# infrastructure.environment-config.config-drift — behavior-oracle slice

Policy grade slice. This slice bounds config drift to environment-config.config-drift. It uses `config-drift-slice-behavior-oracle` and checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract..

For config drift, choose a repository example that satisfies authoritative_sources at the behavior-oracle floor, plus a failure where authoritative sources must name the concrete repository contract. is false. For config drift, wire `behavior-oracle` to `rig-services/infrastructure.environment-config.config-drift.json` and keep its verdict on authoritative_sources; missing evidence is a named gap, with ceiling config drift configuration validation only; declared policy does not prove running config drift behavior. Choose a repository-owned check that observes config drift from rig-services/infrastructure.environment-config.config-drift.json..

Service-specific evidence cues:
Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.
minimal: authoritative sources — ["config/production.json"].
mid: comparison schedule — "daily".
maximal: silent drift acceptance — false.
