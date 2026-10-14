# testing.integration.cross-module — identity

Policy grade: cross module owns integration.cross-module. Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Keep sibling services in integration under their own verdicts. Inspect the configured input at `rig-services/testing.integration.cross-module.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.

Service-specific evidence cues:
Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`.

Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Input: `rig-services/testing.integration.cross-module.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

minimal: participating modules — ["orders","inventory"].

mid: interaction cases — ["order reserves stock"].

maximal: stub internal contracts — false.
