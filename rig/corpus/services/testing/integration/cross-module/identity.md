# testing.integration.cross-module — identity

cross module owns integration.cross-module. Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Keep sibling services in integration under their own verdicts. Inspect the configured input at `rig-services/testing.integration.cross-module.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: cross module configuration validation only; declared policy does not prove running cross module behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.
