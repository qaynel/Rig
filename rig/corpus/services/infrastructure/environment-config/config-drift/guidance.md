# config drift

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Owned scope: `environment-config.config-drift`.

Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Input: `rig-services/infrastructure.environment-config.config-drift.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior.

minimal: authoritative sources — ["config/production.json"].

mid: comparison schedule — "daily".

maximal: silent drift acceptance — false.

