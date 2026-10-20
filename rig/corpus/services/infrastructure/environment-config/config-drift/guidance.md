# config-drift

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Owned scope: `environment-config.config-drift`. Input: `rig-services/infrastructure.environment-config.config-drift.json`.

Coverage ceiling: Configuration validation only, so it confirms authoritative sources, a comparison schedule and the silent-drift flag are declared; it does not compare live settings.

minimal: authoritative sources — ["config/production.json"]. Name the configuration authority each setting is compared to. Without one, drift has no reference, so list the source of truth.

mid: comparison schedule — "daily". Declare how often observed settings are compared. Unscheduled comparison finds drift late, so set a cadence.

maximal: silent drift acceptance — false. Set accepting drift silently to false. Drift must become a visible finding rather than redefine the desired state, so report it.
