# testing.integration.cross-module — floor and mutation-floor slice

Policy grade slice. This slice bounds cross module to integration.cross-module. It uses `cross-module-slice-floor` and checks participating_modules (nonempty): participating modules must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.integration.cross-module.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
