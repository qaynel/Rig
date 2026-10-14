# infrastructure.environment-config.feature-flags — floor and mutation-floor slice

Policy grade slice. This slice bounds feature flags to environment-config.feature-flags. It uses `feature-flags-slice-floor` and checks flag_names (nonempty): flag names must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.feature-flags.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than feature flags configuration validation only; declared policy does not prove running feature flags behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Owned scope: `environment-config.feature-flags`.

Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Input: `rig-services/infrastructure.environment-config.feature-flags.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Select an approved repository-owned command to verify that behavior.

minimal: flag names — ["new_checkout"].

mid: rollback owner — "checkout team".

maximal: permanent unowned flags — false.
