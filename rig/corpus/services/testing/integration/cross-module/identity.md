# testing.integration.cross-module — identity

Policy grade: cross module owns integration.cross-module. Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Keep neighboring integration services outside the cross module decision for integration.cross-module. Inspect the configured input at `rig-services/testing.integration.cross-module.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: cross module configuration validation only; declared policy does not prove running cross module behavior. Choose a repository-owned check that observes cross module from rig-services/testing.integration.cross-module.json.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.

Service-specific evidence cues:
Offer: Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.
minimal: participating modules — ["orders","inventory"].
mid: interaction cases — ["order reserves stock"].
maximal: stub internal contracts — false.
