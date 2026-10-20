# cross module

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
